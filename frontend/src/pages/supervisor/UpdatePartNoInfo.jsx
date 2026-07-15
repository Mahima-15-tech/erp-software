// // src/pages/supervisor-admin/UpdatePartNoInfo.jsx
// import React, { useEffect, useState } from "react";
// import { useAuthStore } from "../../store/useAuthStore";
// import SupervisorLayout from "../../layout/SupervisorLayout";
// import AdminLayout from "../../layout/AdminLayout";
// import axios from "axios";
// import { server } from "../../constants/api";
// import { useNavigate, useLocation } from "react-router-dom";
// import toast from "react-hot-toast";

// const UpdatePartNoInfo = () => {
//   const role = useAuthStore((state) => state.role);
//   const isUserLoading = useAuthStore((state) => state.isUserLoading);
//   const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ get part data passed from GetPartDetails
//   const part = location.state?.part;

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

//   // ✅ Pre-fill form with part data
//   useEffect(() => {
//     if (part) {
//       const [h = "0", m = "0", s = "0"] = part.cycleTime
//         ? part.cycleTime.split(":")
//         : [];
//       setFormData({
//         partNo: part.partNo,
//         rawMaterialType: part.rawMaterialType,
//         od: part.od || "",
//         id: part.id || "",
//         length: part.length || "",
//         rmRate: part.rmRate || "",
//         cncSetupRequired: part.cncSetupRequired || 0,
//         hours: h,
//         minutes: m,
//         seconds: s,
//       });
//     }
//   }, [part]);

//   if (isUserLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-xl">
//         Loading...
//       </div>
//     );
//   }

//   if (!part) {
//     return (
//       <Layout>
//         <div className="p-6 text-center text-red-500">
//           No part data provided
//         </div>
//       </Layout>
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

//   // 🔹 Submit update
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);
//       const data = new FormData();

//       // ✅ format cycleTime
//       const cycleTime = `${formData.hours || 0}:${formData.minutes || 0}:${formData.seconds || 0}`;

//     //   const payload = {
//     //     rawMaterialType: formData.rawMaterialType,
//     //     od: parseFloat(formData.od) || 0,
//     //     id:
//     //       formData.rawMaterialType === "Pipe"
//     //         ? parseFloat(formData.id) || 0
//     //         : 0,
//     //     length: parseFloat(formData.length) || 0,
//     //     rmRate: parseFloat(formData.rmRate) || 0,
//     //     cncSetupRequired: parseInt(formData.cncSetupRequired) || 0,
//     //     cycleTime,
//     //   };

//     const payload = {
//   partNo: formData.partNo, // ✅ include partNo in update
//   rawMaterialType: formData.rawMaterialType,
//   od: parseFloat(formData.od) || 0,
//   id: formData.rawMaterialType === "Pipe" ? parseFloat(formData.id) || 0 : 0,
//   length: parseFloat(formData.length) || 0,
//   rmRate: parseFloat(formData.rmRate) || 0,
//   cncSetupRequired: parseInt(formData.cncSetupRequired) || 0,
//   cycleTime,
// };

//       // append fields
//       Object.entries(payload).forEach(([key, value]) => {
//         if (value !== "" && value !== undefined) {
//           data.append(key, value);
//         }
//       });

//       // append file if user selected new one
//       if (drawingFile) {
//         data.append("drawingFile", drawingFile);
//       }

//       const res = await axios.patch(
//         `${server}/supervisor-admin/partNoDetail-update/${part._id}`,
//         data,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         }
//       );

//       toast.success(res?.data?.message);
//       navigate(`/supervisor-admin/getPartDetatils/${part._id}`);
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           Update Part Number
//         </h2>
//         {message && (
//           <p className="mb-4 text-center text-red-500 font-medium">{message}</p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Part Number (readonly) */}
//           {/* <div>
//             <label className="block mb-1 font-medium">Part Number</label>
//             <input
//               type="text"
//               name="partNo"
//               value={formData.partNo}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
//             />
//           </div> */}

//           <div>
//   <label className="block mb-1 font-medium">Part Number</label>
//   <input
//     type="text"
//     name="partNo"
//     value={formData.partNo}
//     onChange={handleChange}
//     className="w-full border p-2 rounded"
//     required
//   />
// </div>

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
//               value={formData.od}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//               required
//             />
//           </div>

//           {/* ID */}
//           <div>
//             <label className="block mb-1 font-medium">ID</label>
//             <input
//               type="text"
//               name="id"
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
//               value={formData.length}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>

//           {/* RM Rate */}
//           <div>
//             <label className="block mb-1 font-medium">Raw Material Rate</label>
//             <input
//               type="text"
//               name="rmRate"
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
//               value={formData.cncSetupRequired}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>

//           {/* Cycle Time */}
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
//             <label className="block mb-1 font-medium">Upload New Drawing File</label>
//             <input
//               type="file"
//               name="drawingFile"
//               accept=".jpg,.jpeg,.png,.pdf"
//               onChange={handleFileChange}
//               className="w-full border p-2 rounded"
//             />
//             {part.drawingFileUrl && (
//               <p className="mt-1 text-sm">
//                 Current File:{" "}
//                 <a
//                   href={part.drawingFileUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 underline"
//                 >
//                   View
//                 </a>
//               </p>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
//           >
//             {loading ? "Updating..." : "Update Part"}
//           </button>
//         </form>
//       </div>
//     </Layout>
//   );
// };

// export default UpdatePartNoInfo;

// src/pages/supervisor-admin/UpdatePartNoInfo.jsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import SupervisorLayout from "../../layout/SupervisorLayout";
import AdminLayout from "../../layout/AdminLayout";
import axios from "axios";
import { server } from "../../constants/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const UpdatePartNoInfo = () => {
  const role = useAuthStore((state) => state.role);
  const isUserLoading = useAuthStore((state) => state.isUserLoading);
  const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [drawingFile, setDrawingFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ format seconds → hh:mm:ss
const splitHMS = (timeStr) => {
  if (!timeStr) return ["0", "0", "0"];
  const [h, m, s] = timeStr.split(":");
  return [h || "0", m || "0", s || "0"];
};


  // ✅ Fetch part details from backend
useEffect(() => {
  const fetchPartDetails = async () => {
    try {
      const response = await axios.get(
        `${server}/supervisor-admin/part-detail/${id}`,
        { withCredentials: true }
      );
      console.log(response.data.part);
      const part = response.data.part;

      const [ch, cm, cs] = splitHMS(part.cncCycleTime);
      const [lh, lm, ls] = splitHMS(part.latheCycleTime);

      setFormData({
        partNo: part.partNo,
        rawMaterialType: part.rawMaterialType,
        od: part.od || "",
        id: part.id || "",
        length: part.length || "",
        rmRate: part.rmRate || "",
        cncSetupRequired: part.cncSetupRequired || 0,
        cncHours: ch,
        cncMinutes: cm,
        cncSeconds: cs,
        latheHours: lh,
        latheMinutes: lm,
        latheSeconds: ls,
        drawingFileUrl: part.drawingFileUrl,
      });
    } catch (err) {
      setMessage("Failed to load part details");
    }
  };

  fetchPartDetails();
}, [id]);

  if (isUserLoading || !formData) {
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

  // 🔹 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = new FormData();

      const cncCycleTime = `${formData.cncHours || 0}:${formData.cncMinutes || 0}:${formData.cncSeconds || 0}`;
      const latheCycleTime = `${formData.latheHours || 0}:${formData.latheMinutes || 0}:${formData.latheSeconds || 0}`;

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

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== "" && value !== undefined) {
          data.append(key, value);
        }
      });

      if (drawingFile) {
        data.append("drawingFile", drawingFile);
      }

      const res = await axios.patch(
        `${server}/supervisor-admin/partNoDetail-update/${id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success(res?.data?.message);
      navigate(`/supervisor-admin/getPartDetatils/${id}`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Part Number</h2>
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
              value={formData.length}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* RM Rate */}
          <div>
            <label className="block mb-1 font-medium">Raw Material Rate</label>
            <input
              type="text"
              name="rmRate"
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
            <label className="block mb-1 font-medium">Upload New Drawing File</label>
            <input
              type="file"
              name="drawingFile"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
            />
            {formData.drawingFileUrl && (
              <p className="mt-1 text-sm">
                Current File:{" "}
                <a
                  href={formData.drawingFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Updating..." : "Update Part"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default UpdatePartNoInfo;
