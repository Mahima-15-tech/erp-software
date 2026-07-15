import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { server } from "../../constants/api";
import { useAuthStore } from "../../store/useAuthStore";
import SupervisorLayout from "../../layout/SupervisorLayout";
import AdminLayout from "../../layout/AdminLayout";

export default function Invoice() {
  const role = useAuthStore((state) => state.role);
  const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;

  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      invoiceNo: "",
      invoiceDate: "",
      vendorCode: "",
      buyerName: "",
      buyerGstin: "",
      billTo: "",
      shipTo: "",
      nameOfGoods: "",
      sgstPercent: 9,
      cgstPercent: 9,
      bankName: "",
      bankAccount: "",
      bankIfsc: "",
      items: [{ sNo: 1, hsn: "", unitPrice: "", qty: "", uom: "", amount: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [invoices, setInvoices] = useState([]);

  // watch items to auto-calc amount on the fly
  const watchedItems = watch("items");

  useEffect(() => {
    if (!watchedItems) return;
    watchedItems.forEach((it, idx) => {
      const unit = parseFloat(it.unitPrice || 0);
      const qty = parseFloat(it.qty || 0);
      const amt = Number.isFinite(unit) && Number.isFinite(qty) ? (unit * qty).toFixed(2) : "";
      if (amt !== (it.amount || "")) {
        setValue(`items.${idx}.amount`, amt);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedItems, setValue]);

  // Fetch all invoices
  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${server}/supervisor-admin/invoice`, {
        withCredentials: true,
      });
      // interpret a few possible shapes safely
      let list = [];
      if (res.data && Array.isArray(res.data.file)) list = res.data.file;
      else if (res.data && Array.isArray(res.data.invoices)) list = res.data.invoices;
      else if (Array.isArray(res.data)) list = res.data;
      setInvoices(list);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // normalize a backend response object into DB record (if present)
  const normalizeBackendResponse = (resData) => {
    if (!resData) return null;

    // direct known shapes
    if (resData.savedInvoice) return resData.savedInvoice;
    if (resData.invoice) return resData.invoice;

    // sometimes backend returns { saved: ..., cloud: ... }
    if (resData.saved && resData.cloud) return resData.saved;

    // nested shape resData.data
    if (resData.data) {
      if (resData.data.savedInvoice) return resData.data.savedInvoice;
      if (resData.data.invoice) return resData.data.invoice;
    }

    // direct db-like object
    if (resData._id && resData.url) return resData;

    return null;
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setResult(null);

      // Build payload safely (avoid mixing || and ?? in a single expression)
      const payload = {
        invoiceNo: formData.invoiceNo ?? "",
        invoiceDate: formData.invoiceDate ?? "",
        vendorCode: formData.vendorCode ?? "",
        nameOfGoods: formData.nameOfGoods ?? "",
        sgstPercent: Number(formData.sgstPercent ?? 9),
        cgstPercent: Number(formData.cgstPercent ?? 9),
        bank: {
          name: formData.bankName ?? "",
          account: formData.bankAccount ?? "",
          ifsc: formData.bankIfsc ?? "",
          accountName: formData.bankAccount ? formData.bankAccount : undefined,
        },
        buyer: {
          name: formData.buyerName ?? (formData.billTo ? formData.billTo.split("\n")[0] : "") ?? "",
          addressLines: formData.billTo ? formData.billTo.split("\n") : [],
          gstin: formData.buyerGstin ?? "",
          customerCode: formData.vendorCode ?? "",
        },
        shipTo: formData.shipTo ? formData.shipTo.split("\n") : [],
        items: (formData.items || []).map((it, idx) => {
          const desc =
            (it && it.description != null && it.description !== "")
              ? it.description
              : (formData.nameOfGoods != null && formData.nameOfGoods !== "")
              ? formData.nameOfGoods
              : `Item ${it && it.sNo ? it.sNo : idx + 1}`;

          return {
            description: desc,
            hsn: it.hsn ?? "",
            unitPrice: Number(it.unitPrice || 0),
            qty: Number(it.qty || 0),
            uom: it.uom ?? "",
            amount: Number((Number(it.unitPrice || 0) * Number(it.qty || 0)).toFixed(2)),
          };
        }),
      };

      const res = await axios.post(
        `${server}/supervisor-admin/invoice/pdf/generate`,
        payload,
        { withCredentials: true }
      );

      // Try to find DB record using normalization, without any mixed operators in single expressions
      let dbRecord = null;
      dbRecord = normalizeBackendResponse(res.data) || normalizeBackendResponse(res);

      // fallback parsing (explicit stepwise, no mixed operators)
      if (!dbRecord) {
        if (res.data) {
          if (res.data.savedInvoice) dbRecord = res.data.savedInvoice;
          else if (res.data.invoice) dbRecord = res.data.invoice;
          else if (res.data.saved) dbRecord = res.data.saved;
          else if (res.data.data) {
            if (res.data.data.savedInvoice) dbRecord = res.data.data.savedInvoice;
            else if (res.data.data.invoice) dbRecord = res.data.data.invoice;
          }
        }
      }

      if (!dbRecord) {
        // last resort: show raw response so you can inspect it
        setResult({ raw: res.data ?? res });
      } else {
        setResult({ dbRecord, raw: res.data });
      }

      await fetchInvoices();
    } catch (err) {
      console.error(err);
      alert("Error generating invoice — see console for details");
    } finally {
      setLoading(false);
    }
  };

  // Helper: pick the latest invoice (by createdAt, fallback to date)
  const getLatestInvoice = () => {
    if (!invoices || invoices.length === 0) return null;
    const list = [...invoices];
    list.sort((a, b) => {
      const ta = new Date(a.createdAt || a.date || 0).getTime();
      const tb = new Date(b.createdAt || b.date || 0).getTime();
      return tb - ta;
    });
    return list[0];
  };

  // Download the latest invoice PDF programmatically
// inside your Invoice component (replace downloadLatestInvoice)
const downloadLatestInvoice = async () => {
  try {
    // 1) ask the server for the latest invoice metadata
    const metaRes = await axios.get(`${server}/supervisor-admin/invoice`, {
      withCredentials: true,
    });

    // expected shape: { invoice: { _id, url, date } }
    const inv = metaRes?.data?.invoice;
    if (!inv || !inv.url) {
      alert("No invoice found on server.");
      return;
    }

    // 2) fetch the PDF as a blob and trigger download
    const pdfRes = await axios.get(inv.url, { responseType: "blob" });
    const blob = pdfRes.data;
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    const filename = `invoice-${inv._id ?? Date.now()}.pdf`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.error("Error downloading latest invoice:", err);

    // If server returned 404, try to show user-friendly message
    if (err.response && err.response.status === 404) {
      alert("No invoice found on server.");
      return;
    }

    // fallback: open the invoice list item if you have it in state
    const latest = getLatestInvoice(); // your existing helper
    if (latest && latest.url) {
      window.open(latest.url, "_blank");
      return;
    }

    alert("Failed to download invoice. See console for details.");
  }
};


  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-2">Invoice Generator</h1>

        {/* Existing Invoices & Download latest */}
        <div className="flex items-center justify-between mb-4 bg-gray-50 p-4 rounded-lg shadow">
          <div>
            <h2 className="font-semibold mb-1">📑 Previous Invoices</h2>
            {invoices.length === 0 ? (
              <p className="text-sm text-gray-500">No invoices yet.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {invoices.map((inv) => (
                  <li key={inv._id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      ID: {inv._id} |{" "}
                      {new Date(inv.createdAt || inv.date || Date.now()).toLocaleString()}
                    </span>
                    <a
                      href={inv.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline ml-4"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <button
              onClick={downloadLatestInvoice}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              ⬇ Download Latest Invoice
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded-xl p-6 w-full max-w-4xl"
        >
          {/* Invoice Header */}
          <div className="grid grid-cols-3 gap-4">
            <input
              {...register("invoiceNo")}
              placeholder="Invoice No"
              className="border p-2 rounded"
            />
            <input type="date" {...register("invoiceDate")} className="border p-2 rounded" />
            <input
              {...register("vendorCode")}
              placeholder="Vendor Code"
              className="border p-2 rounded"
            />
          </div>

          {/* Buyer name & GST */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <input
              {...register("buyerName")}
              placeholder="Buyer Name"
              className="border p-2 rounded"
            />
            <input {...register("buyerGstin")} placeholder="Buyer GSTIN" className="border p-2 rounded" />
            <input {...register("nameOfGoods")} placeholder="Name of Goods" className="border p-2 rounded" />
          </div>

          {/* Bill To / Ship To */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <textarea
              {...register("billTo")}
              placeholder="Bill To (multi-line allowed)"
              className="border p-2 rounded"
            />
            <textarea
              {...register("shipTo")}
              placeholder="Ship To (multi-line allowed)"
              className="border p-2 rounded"
            />
          </div>

          {/* Taxes & Bank */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <input {...register("sgstPercent")} type="number" placeholder="SGST (%)" className="border p-2 rounded" />
            <input {...register("cgstPercent")} type="number" placeholder="CGST (%)" className="border p-2 rounded" />
            <input {...register("bankName")} placeholder="Bank Name" className="border p-2 rounded" />
            <input {...register("bankAccount")} placeholder="Bank Account No." className="border p-2 rounded" />
            <input {...register("bankIfsc")} placeholder="Bank IFSC" className="border p-2 rounded" />
          </div>

          {/* Items Table */}
          <h2 className="font-semibold mt-6 mb-2">Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">S.No</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">HSN</th>
                  <th className="p-2 border">Unit Price</th>
                  <th className="p-2 border">Qty</th>
                  <th className="p-2 border">UOM</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id}>
                    <td className="border p-1">
                      <input
                        {...register(`items.${index}.sNo`)}
                        defaultValue={index + 1}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-1">
                      <input
                        {...register(`items.${index}.description`)}
                        className="w-full p-1 border rounded"
                        placeholder={`Item ${index + 1} description`}
                      />
                    </td>
                    <td className="border p-1">
                      <input {...register(`items.${index}.hsn`)} className="w-full p-1 border rounded" />
                    </td>
                    <td className="border p-1">
                      <input
                        {...register(`items.${index}.unitPrice`)}
                        className="w-full p-1 border rounded"
                        type="number"
                        step="0.01"
                      />
                    </td>
                    <td className="border p-1">
                      <input
                        {...register(`items.${index}.qty`)}
                        className="w-full p-1 border rounded"
                        type="number"
                        step="0.01"
                      />
                    </td>
                    <td className="border p-1">
                      <input {...register(`items.${index}.uom`)} className="w-full p-1 border rounded" />
                    </td>
                    <td className="border p-1">
                      <input
                        {...register(`items.${index}.amount`)}
                        className="w-full p-1 border rounded"
                        readOnly
                      />
                    </td>
                    <td className="border p-1 text-center">
                      <button type="button" onClick={() => remove(index)} className="text-red-500">
                        ✖
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <button
              type="button"
              className="text-blue-600"
              onClick={() => append({ sNo: fields.length + 1, hsn: "", unitPrice: "", qty: "", uom: "", amount: "" })}
            >
              ➕ Add Item
            </button>

            <div className="ml-auto">
              <button
                type="submit"
                disabled={loading}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Generating..." : "Generate Invoice"}
              </button>
            </div>
          </div>
        </form>

        {/* Result Section */}
        {result && (
          <div className="mt-6 bg-green-100 p-4 rounded-lg">
            <h2 className="font-semibold">✅ Invoice Generated!</h2>
            {result.dbRecord && result.dbRecord.url ? (
              <>
                <p>Cloudinary URL:</p>
                <a
                  href={result.dbRecord.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  View / Download PDF
                </a>
                <p className="mt-2 text-gray-600">Saved in MongoDB with ID: {result.dbRecord._id}</p>
              </>
            ) : (
              <pre className="text-xs overflow-auto">{JSON.stringify(result.raw ?? result, null, 2)}</pre>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
