



import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import SupervisorLayout from "../../layout/SupervisorLayout";
import AdminLayout from "../../layout/AdminLayout";
import axios from "axios";
import { server } from "../../constants/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// const AddPartNo = () => {
//   const role = useAuthStore((state) => state.role);
//   const isUserLoading = useAuthStore((state) => state.isUserLoading);
//   const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     partNo: "",
//     rawMaterialType: "Pipe",
//     od: "",
//     id: "",
//     length: "",
//     rmRate: "",
//     cncSetupRequired: 0,
//     hours: "",
//     minutes: "",
//     seconds: "",
//   });

//   const [drawingFile, setDrawingFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   if (isUserLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-xl">
//         Loading...
//       </div>
//     );
//   }

//   // 🔹 Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // 🔹 Handle file change
//   const handleFileChange = (e) => {
//     setDrawingFile(e.target.files[0]);
//   };

//   // 🔹 Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!drawingFile) {
//       setMessage("Please upload a drawing file");
//       return;
//     }

//     try {
//       setLoading(true);
//       const data = new FormData();

//       // ✅ format cycleTime as HH:MM:SS
//       const cycleTime = `${formData.hours || 0}:${formData.minutes || 0}:${formData.seconds || 0}`;

//       // ✅ Prepare payload with numeric conversions
//  const payload = {
//   partNo: formData.partNo,
//   rawMaterialType: formData.rawMaterialType,
//   od: parseFloat(formData.od) || 0,
//   id: formData.rawMaterialType === "Pipe" ? parseFloat(formData.id) || 0:0,
//   length: parseFloat(formData.length) || 0,
//   rmRate: parseFloat(formData.rmRate) || 0,
//   cncSetupRequired: parseInt(formData.cncSetupRequired) || 0,
//   cycleTime,
// };

//       // append payload fields
//       Object.entries(payload).forEach(([key, value]) => {
//         if (value !== "" && value !== undefined) {
//           data.append(key, value);
//         }
//       });

//       // append file
//       data.append("drawingFile", drawingFile);

//       const res = await axios.post(
//         `${server}/supervisor-admin/addPartNo`,
//         data,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         }
//       );

//       toast.success(res?.data?.message);
//       navigate("/superVisor-admin/getPartNo");

//       // reset form
//       setFormData({
//         partNo: "",
//         rawMaterialType: "Pipe",
//         od: "",
//         id: "",
//         length: "",
//         rmRate: "",
//         cncSetupRequired: 0,
//         hours: "",
//         minutes: "",
//         seconds: "",
//       });
//       setDrawingFile(null);
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           Add New Part Number
//         </h2>
//         {message && (
//           <p className="mb-4 text-center text-red-500 font-medium">{message}</p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Part Number */}
//           <div>
//             <label className="block mb-1 font-medium">Part Number</label>
//             <input
//               type="text"
//               name="partNo"
//               placeholder="Enter Part Number"
//               value={formData.partNo}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>

//           {/* Raw Material Type */}
//           <div>
//             <label className="block mb-1 font-medium">Raw Material Type</label>
//             <select
//               name="rawMaterialType"
//               value={formData.rawMaterialType}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             >
//               <option value="Pipe">Pipe</option>
//               <option value="Round Bar">Round Bar</option>
//             </select>
//           </div>

//           {/* OD */}
//           <div>
//             <label className="block mb-1 font-medium">OD</label>
//             <input
//               type="text"
//               name="od"
//               placeholder="Outer Diameter"
//               value={formData.od}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>

//           {/* ID (disabled for Round Bar) */}
//           <div>
//             <label className="block mb-1 font-medium">ID</label>
//             <input
//               type="text"
//               name="id"
//               placeholder="Inner Diameter"
//               value={formData.id}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               disabled={formData.rawMaterialType === "Round Bar"}
//               required={formData.rawMaterialType === "Pipe"}
//             />
//           </div>

//           {/* Length */}
//           <div>
//             <label className="block mb-1 font-medium">Length</label>
//             <input
//               type="text"
//               name="length"
//               placeholder="Length"
//               value={formData.length}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>

//           {/* Raw Material Rate */}
//           <div>
//             <label className="block mb-1 font-medium">Raw Material Rate</label>
//             <input
//               type="text"
//               name="rmRate"
//               placeholder="Enter RM Rate"
//               value={formData.rmRate}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>

//           {/* CNC Setup Required */}
//           <div>
//             <label className="block mb-1 font-medium">CNC Setup Required</label>
//             <input
//               type="number"
//               name="cncSetupRequired"
//               placeholder="0 or 1"
//               value={formData.cncSetupRequired}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>

//           {/* Cycle Time Input (HH:MM:SS) */}
//           <div>
//             <label className="block mb-1 font-medium">Cycle Time</label>
//             <div className="flex space-x-2">
//               <input
//                 type="number"
//                 name="hours"
//                 placeholder="HH"
//                 min="0"
//                 value={formData.hours}
//                 onChange={handleChange}
//                 className="w-1/3 border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 name="minutes"
//                 placeholder="MM"
//                 min="0"
//                 max="59"
//                 value={formData.minutes}
//                 onChange={handleChange}
//                 className="w-1/3 border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 name="seconds"
//                 placeholder="SS"
//                 min="0"
//                 max="59"
//                 value={formData.seconds}
//                 onChange={handleChange}
//                 className="w-1/3 border p-2 rounded"
//               />
//             </div>
//           </div>

//           {/* Drawing File */}
//           <div>
//             <label className="block mb-1 font-medium">Upload Drawing File</label>
//             <input
//               type="file"
//               name="drawingFile"
//               accept=".jpg,.jpeg,.png,.pdf"
//               onChange={handleFileChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
//           >
//             {loading ? "Uploading..." : "Add Part"}
//           </button>
//         </form>
//       </div>
//     </Layout>
//   );
// };

// ... imports remain the same

const AddPartNo = () => {
  const role = useAuthStore((state) => state.role);
  const isUserLoading = useAuthStore((state) => state.isUserLoading);
  const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    partNo: "",
    rawMaterialType: "Pipe",
    od: "",
    id: "",
    length: "",
    rmRate: "",
    cncSetupRequired: 0,

    // CNC cycle time
    cncHours: "",
    cncMinutes: "",
    cncSeconds: "",

    // Lathe cycle time
    latheHours: "",
    latheMinutes: "",
    latheSeconds: "",
  });

  const [drawingFile, setDrawingFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle file change
  const handleFileChange = (e) => {
    setDrawingFile(e.target.files[0]);
  };

  // 🔹 Format to HH:MM:SS
  const formatTime = (h, m, s) => {
    const hh = String(h || 0).padStart(2, "0");
    const mm = String(m || 0).padStart(2, "0");
    const ss = String(s || 0).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!drawingFile) {
      setMessage("Please upload a drawing file");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();

      // ✅ format both cycle times
      const cncCycleTime = formatTime(formData.cncHours, formData.cncMinutes, formData.cncSeconds);
      const latheCycleTime = formatTime(formData.latheHours, formData.latheMinutes, formData.latheSeconds);

      // ✅ Prepare payload
      const payload = {
        partNo: formData.partNo,
        rawMaterialType: formData.rawMaterialType,
        od: parseFloat(formData.od) || 0,
        id: formData.rawMaterialType === "Pipe" ? parseFloat(formData.id) || 0 : 0,
        length: parseFloat(formData.length) || 0,
        rmRate: parseFloat(formData.rmRate) || 0,
        cncSetupRequired: parseInt(formData.cncSetupRequired) || 0,
        cncCycleTime,
        latheCycleTime,
      };

      // append payload
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== "" && value !== undefined) {
          data.append(key, value);
        }
      });

      // append file
      data.append("drawingFile", drawingFile);

      const res = await axios.post(
        `${server}/supervisor-admin/addPartNo`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success(res?.data?.message);
      navigate("/superVisor-admin/getPartNo");

      // reset form
      setFormData({
        partNo: "",
        rawMaterialType: "Pipe",
        od: "",
        id: "",
        length: "",
        rmRate: "",
        cncSetupRequired: 0,
        cncHours: "",
        cncMinutes: "",
        cncSeconds: "",
        latheHours: "",
        latheMinutes: "",
        latheSeconds: "",
      });
      setDrawingFile(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Part Number
        </h2>
        {message && (
          <p className="mb-4 text-center text-red-500 font-medium">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Part Number */}
          <div>
            <label className="block mb-1 font-medium">Part Number</label>
            <input
              type="text"
              name="partNo"
              placeholder="Enter Part Number"
              value={formData.partNo}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Raw Material Type */}
          <div>
            <label className="block mb-1 font-medium">Raw Material Type</label>
            <select
              name="rawMaterialType"
              value={formData.rawMaterialType}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="Pipe">Pipe</option>
              <option value="Round Bar">Round Bar</option>
            </select>
          </div>

          {/* OD */}
          <div>
            <label className="block mb-1 font-medium">OD</label>
            <input
              type="text"
              name="od"
              placeholder="Outer Diameter"
              value={formData.od}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* ID */}
          <div>
            <label className="block mb-1 font-medium">ID</label>
            <input
              type="text"
              name="id"
              placeholder="Inner Diameter"
              value={formData.id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              disabled={formData.rawMaterialType === "Round Bar"}
              required={formData.rawMaterialType === "Pipe"}
            />
          </div>

          {/* Length */}
          <div>
            <label className="block mb-1 font-medium">Length</label>
            <input
              type="text"
              name="length"
              placeholder="Length"
              value={formData.length}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Raw Material Rate */}
          <div>
            <label className="block mb-1 font-medium">Raw Material Rate</label>
            <input
              type="text"
              name="rmRate"
              placeholder="Enter RM Rate"
              value={formData.rmRate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* CNC Setup Required */}
          <div>
            <label className="block mb-1 font-medium">CNC Setup Required</label>
            <input
              type="number"
              name="cncSetupRequired"
              placeholder="0 or 1"
              value={formData.cncSetupRequired}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* CNC Cycle Time */}
          <div>
            <label className="block mb-1 font-medium">CNC Cycle Time</label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="cncHours"
                placeholder="HH"
                min="0"
                value={formData.cncHours}
                onChange={handleChange}
                className="w-1/3 border p-2 rounded"
              />
              <input
                type="number"
                name="cncMinutes"
                placeholder="MM"
                min="0"
                max="59"
                value={formData.cncMinutes}
                onChange={handleChange}
                className="w-1/3 border p-2 rounded"
              />
              <input
                type="number"
                name="cncSeconds"
                placeholder="SS"
                min="0"
                max="59"
                value={formData.cncSeconds}
                onChange={handleChange}
                className="w-1/3 border p-2 rounded"
              />
            </div>
          </div>

          {/* Lathe Cycle Time */}
          <div>
            <label className="block mb-1 font-medium">Lathe Cycle Time</label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="latheHours"
                placeholder="HH"
                min="0"
                value={formData.latheHours}
                onChange={handleChange}
                className="w-1/3 border p-2 rounded"
              />
              <input
                type="number"
                name="latheMinutes"
                placeholder="MM"
                min="0"
                max="59"
                value={formData.latheMinutes}
                onChange={handleChange}
                className="w-1/3 border p-2 rounded"
              />
              <input
                type="number"
                name="latheSeconds"
                placeholder="SS"
                min="0"
                max="59"
                value={formData.latheSeconds}
                onChange={handleChange}
                className="w-1/3 border p-2 rounded"
              />
            </div>
          </div>

          {/* Drawing File */}
          <div>
            <label className="block mb-1 font-medium">Upload Drawing File</label>
            <input
              type="file"
              name="drawingFile"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Uploading..." : "Add Part"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddPartNo;




