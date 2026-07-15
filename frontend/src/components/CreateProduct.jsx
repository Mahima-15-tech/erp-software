



import React, { useState } from "react";
import axios from "axios";
import { server } from "../constants/api";

const CreateProduct = () => {
  const [partNo, setPartNo] = useState("");
  const [quantities, setQuantities] = useState([
    { type: "CUTTING", quantity: "", unit: "pcs" },
  ]);

  // Available dropdown options
  const typeOptions = [ "CUTTING", "LATHE", "CNC", "FINISHED"];
  const unitOptions = ["pcs", "kg"];

  // ✅ Add new row
  const addQuantityRow = () => {
    setQuantities([...quantities, { type: "CUTTING", quantity: 0, unit: "pcs" }]);
  };

  // ✅ Remove row
  const removeQuantityRow = (index) => {
    const newQuantities = [...quantities];
    newQuantities.splice(index, 1);
    setQuantities(newQuantities);
  };

  // ✅ Handle input change
  const handleQuantityChange = (index, field, value) => {
    const newQuantities = [...quantities];
    if (field === "quantity") {
      newQuantities[index][field] = value === "" ? "" : Number(value);
    } else {
      newQuantities[index][field] = value;
    }
    setQuantities(newQuantities);
  };

  // ✅ Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${server}/supervisor-admin/create-inventory`,
        {
          partNo,
          quantities,
        },
        { withCredentials: true }
      );
      alert("Inventory Created Successfully!");
      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert("Error creating inventory");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Inventory</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Part Number */}
        <div>
          <label className="block mb-1 font-medium">Part No (ObjectId)</label>
          <input
            type="text"
            value={partNo}
            onChange={(e) => setPartNo(e.target.value)}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>

        {/* Quantities */}
        <div>
          <label className="block mb-2 font-medium">Quantities</label>
          {quantities.map((q, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              {/* Type dropdown */}
              <select
                value={q.type}
                onChange={(e) =>
                  handleQuantityChange(index, "type", e.target.value)
                }
                className="border px-2 py-1 rounded w-1/3"
              >
                {typeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              {/* Quantity input */}
              <input
                type="number"
                placeholder="Quantity"
                value={q.quantity}
                onChange={(e) =>
                  handleQuantityChange(index, "quantity", e.target.value)
                }
                className="border px-2 py-1 rounded w-1/3"
                required
              />

              {/* Unit dropdown */}
              <select
                value={q.unit}
                onChange={(e) =>
                  handleQuantityChange(index, "unit", e.target.value)
                }
                className="border px-2 py-1 rounded w-1/3"
              >
                {unitOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              {/* Remove Row Button */}
              <button
                type="button"
                onClick={() => removeQuantityRow(index)}
                className="bg-red-500 text-white px-2 rounded"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addQuantityRow}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            + Add Row
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Inventory
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
