
// import React, { useState } from "react";
// import axios from "axios";
// import {
//   useQuery,
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";
// import { server } from "../../constants/api";
// import SupervisorLayout from "../../layout/SupervisorLayout";
// import AdminLayout from "../../layout/AdminLayout";
// import { useAuthStore } from "../../store/useAuthStore";
// import toast from "react-hot-toast";

// const RawMaterial = () => {
//   const role = useAuthStore((state) => state.role);
//   const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;

//   const queryClient = useQueryClient();

//   // Filters
//   const [filters, setFilters] = useState({
//     type: "Pipe",
//     page: 1,
//     limit: 10,
//     startDate: "",
//     endDate: "",
//   });

//   // Dialog State
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     type: "Pipe",
//     quantity: 0,
//     movementType: "IN",
//     reason: "",
//   });

//   // Count Pcs Dialog State
//   const [showCountPcs, setShowCountPcs] = useState(false);
//   const [pcsForm, setPcsForm] = useState({
//     partNo: "",
//     weight: "",
//   });
//   const [pcsResult, setPcsResult] = useState(null);

//   // Fetch data with filters
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["rawMaterialInfo", filters],
//     queryFn: async () => {
//       const res = await axios.get(
//         `${server}/supervisor-admin/raw-material-info`,
//         { params: filters, withCredentials: true }
//       );
//       return res.data;
//     },
//     keepPreviousData: true,
//   });

//   // Mutation for updating inventory
//   const mutation = useMutation({
//     mutationFn: async (payload) => {
//       const res = await axios.patch(
//         `${server}/supervisor-admin/update-rawMaterial-Inventory`,
//         payload,
//         { withCredentials: true }
//       );
//       return res.data;
//     },
//     onSuccess: () => {
//       toast.success("Inventory updated successfully");
//       queryClient.invalidateQueries(["rawMaterialInfo"]);
//       setShowForm(false);
//       setFormData({
//         type: "Pipe",
//         quantity: 0,
//         movementType: "IN",
//         reason: "",
//       });
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Update failed");
//     },
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     mutation.mutate(formData);
//   };

//   // Handle Count Pcs
//   const handleCountPcs = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         `${server}/supervisor-admin/findPcs`,
//         pcsForm,
//         { withCredentials: true }
//       );
//       setPcsResult(res.data?.totalPcs || null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to calculate pcs");
//     }
//   };

//   if (isLoading)
//     return (
//       <Layout>
//         <p className="p-4">Loading...</p>
//       </Layout>
//     );
//   if (isError)
//     return (
//       <Layout>
//         <p className="p-4 text-red-500">Error loading data</p>
//       </Layout>
//     );

//   const filteredData = data?.filtered?.data || [];

//   return (
//     <Layout>
//       <div className="p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Raw Material Inventory</h1>
//           <div className="flex gap-3">
//             <button
//               onClick={() => setShowCountPcs(true)}
//               className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//             >
//               Count Pcs
//             </button>
//             <button
//               onClick={() => setShowForm(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Update Inventory
//             </button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white shadow p-4 rounded mb-6 flex gap-4 flex-wrap">
//           <div>
//             <label className="block text-sm">Type</label>
//             <select
//               value={filters.type}
//               onChange={(e) =>
//                 setFilters({ ...filters, type: e.target.value, page: 1 })
//               }
//               className="p-2 border rounded"
//             >
//               <option value="Pipe">Pipe</option>
//               <option value="Round Bar">Round Bar</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm">Start Date</label>
//             <input
//               type="date"
//               value={filters.startDate}
//               onChange={(e) =>
//                 setFilters({ ...filters, startDate: e.target.value, page: 1 })
//               }
//               className="p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-sm">End Date</label>
//             <input
//               type="date"
//               value={filters.endDate}
//               onChange={(e) =>
//                 setFilters({ ...filters, endDate: e.target.value, page: 1 })
//               }
//               className="p-2 border rounded"
//             />
//           </div>
//         </div>

//         {/* Total Quantities */}
//         <div className="grid grid-cols-2 gap-6 mb-6">
//           <div className="p-4 bg-white shadow rounded">
//             <h2 className="text-lg font-semibold">Pipe</h2>
//             <p className="text-xl">{data?.totalQuantities?.Pipe || 0}</p>
//           </div>
//           <div className="p-4 bg-white shadow rounded">
//             <h2 className="text-lg font-semibold">Round Bar</h2>
//             <p className="text-xl">
//               {data?.totalQuantities?.["Round Bar"] || 0}
//             </p>
//           </div>
//         </div>

//         {/* Movements Table */}
//         <div className="bg-white shadow rounded p-4">
//           <h2 className="font-semibold mb-4">{filters.type} Movements</h2>
//           <table className="w-full border">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="p-2 border">Type</th>
//                 <th className="p-2 border">Date</th>
//                 <th className="p-2 border">Quantity</th>
//                 <th className="p-2 border">Reason</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.length > 0 ? (
//                 filteredData.map((m, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="p-2 border">{m.type}</td>
//                     <td className="p-2 border">
//                       {new Date(m.date).toLocaleDateString("en-GB", {
//                         day: "2-digit",
//                         month: "2-digit",
//                         year: "2-digit",
//                       })}
//                     </td>
//                     <td className="p-2 border">{m.quantity}</td>
//                     <td className="p-2 border">{m.reason}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="p-4 text-center text-gray-500">
//                     No records found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* Pagination */}
//           {data?.filtered?.totalMovements > filters.limit && (
//             <div className="flex justify-end mt-4 gap-2">
//               <button
//                 disabled={filters.page === 1}
//                 onClick={() =>
//                   setFilters({ ...filters, page: filters.page - 1 })
//                 }
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 Prev
//               </button>
//               <span className="px-3 py-1">Page {filters.page}</span>
//               <button
//                 disabled={
//                   filters.page * filters.limit >= data.filtered.totalMovements
//                 }
//                 onClick={() =>
//                   setFilters({ ...filters, page: filters.page + 1 })
//                 }
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Dialog for Update Form */}
//         {showForm && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white rounded p-6 w-96">
//               <h2 className="text-xl font-semibold mb-4">Update Inventory</h2>
//               <form onSubmit={handleSubmit} className="space-y-3">
//                 <div>
//                   <label className="block text-sm">Type</label>
//                   <select
//                     value={formData.type}
//                     onChange={(e) =>
//                       setFormData({ ...formData, type: e.target.value })
//                     }
//                     className="w-full p-2 border rounded"
//                   >
//                     <option value="Pipe">Pipe</option>
//                     <option value="Round Bar">Round Bar</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm">Movement Type</label>
//                   <select
//                     value={formData.movementType}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         movementType: e.target.value,
//                       })
//                     }
//                     className="w-full p-2 border rounded"
//                   >
//                     <option value="IN">IN</option>
//                     <option value="OUT">OUT</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm">Quantity</label>
//                   <input
//                     type="number"
//                     value={formData.quantity}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         quantity: Number(e.target.value),
//                       })
//                     }
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm">Reason</label>
//                   <input
//                     type="text"
//                     value={formData.reason}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         reason: e.target.value,
//                       })
//                     }
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>

//                 <div className="flex justify-end gap-2 mt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowForm(false)}
//                     className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={mutation.isLoading}
//                     className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                   >
//                     {mutation.isLoading ? "Updating..." : "Submit"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Dialog for Count Pcs */}
//         {showCountPcs && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white rounded p-6 w-96">
//               <h2 className="text-xl font-semibold mb-4">Count Pcs</h2>
//               <form onSubmit={handleCountPcs} className="space-y-3">
//                 <div>
//                   <label className="block text-sm">Part No</label>
//                   <input
//                     type="text"
//                     value={pcsForm.partNo}
//                     onChange={(e) =>
//                       setPcsForm({ ...pcsForm, partNo: e.target.value })
//                     }
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm">Weight</label>
//                   <input
//                     type="number"
//                     value={pcsForm.weight}
//                     onChange={(e) =>
//                       setPcsForm({ ...pcsForm, weight: e.target.value })
//                     }
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>

//                 {pcsResult !== null && (
//                   <div className="p-2 bg-gray-100 rounded">
//                     <p>
//                       <strong>Pcs:</strong> {pcsResult}
//                     </p>
//                   </div>
//                 )}

//                 <div className="flex justify-end gap-2 mt-4">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowCountPcs(false);
//                       setPcsResult(null);
//                       setPcsForm({ partNo: "", weight: "" });
//                     }}
//                     className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//                   >
//                     Close
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
//                   >
//                     Calculate
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default RawMaterial;





import React, { useState } from "react";
import axios from "axios";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { server } from "../../constants/api";
import SupervisorLayout from "../../layout/SupervisorLayout";
import AdminLayout from "../../layout/AdminLayout";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

const RawMaterial = () => {
  const role = useAuthStore((state) => state.role);
  const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;

  const queryClient = useQueryClient();

  // Filters
  const [filters, setFilters] = useState({
    type: "Pipe",
    page: 1,
    limit: 10,
    startDate: "",
    endDate: "",
  });

  // Dialog State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "Pipe",
    quantity: 0,
    movementType: "IN",
    reason: "",
  });

  // Count Pcs Dialog State
  const [showCountPcs, setShowCountPcs] = useState(false);
  const [pcsForm, setPcsForm] = useState({
    partNo: "",
    weight: "",
  });
  const [pcsResult, setPcsResult] = useState(null);

  // Fetch data with filters
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["rawMaterialInfo", filters],
    queryFn: async () => {
      const res = await axios.get(
        `${server}/supervisor-admin/raw-material-info`,
        { params: filters, withCredentials: true }
      );
      return res.data;
    },
    keepPreviousData: true,
    retry: false, // Don't retry on error to show the "not found" state immediately
  });

  // Mutation for updating inventory
  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.patch(
        `${server}/supervisor-admin/update-rawMaterial-Inventory`,
        payload,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Inventory updated successfully");
      queryClient.invalidateQueries(["rawMaterialInfo"]);
      setShowForm(false);
      setFormData({
        type: "Pipe",
        quantity: 0,
        movementType: "IN",
        reason: "",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });

  // Mutation for creating raw material inventory
  const createMutation = useMutation({
    mutationFn: async (type) => {
      const res = await axios.post(
        `${server}/supervisor-admin/add-raw-material`,
        { type },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Raw material inventory created successfully");
      queryClient.invalidateQueries(["rawMaterialInfo"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Creation failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  // Handle Count Pcs
  const handleCountPcs = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${server}/supervisor-admin/findPcs`,
        pcsForm,
        { withCredentials: true }
      );
      setPcsResult(res.data?.totalPcs || null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to calculate pcs");
    }
  };

  // Handle create raw material inventory
  const handleCreateInventory = (type) => {
    createMutation.mutate(type);
  };

  if (isLoading)
    return (
      <Layout>
        <p className="p-4">Loading...</p>
      </Layout>
    );
  
  if (isError) {
    // Check if the error is "Raw material not found"
    const isRawMaterialNotFound = error?.response?.data?.message === "Raw material not found";
    
    if (isRawMaterialNotFound) {
      return (
        <Layout>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Raw Material Inventory</h1>
            </div>
            
            <div className="bg-white shadow rounded p-6 text-center">
              <div className="py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Raw Material Found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Raw material inventory has not been set up yet.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={() => handleCreateInventory("Pipe")}
                    disabled={createMutation.isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {createMutation.isLoading ? "Creating..." : "Add Pipe Inventory"}
                  </button>
                  <button
                    onClick={() => handleCreateInventory("Round Bar")}
                    disabled={createMutation.isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {createMutation.isLoading ? "Creating..." : "Add Round Bar Inventory"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      );
    }
    
    // For other errors, show the generic error message
    return (
      <Layout>
        <p className="p-4 text-red-500">Error loading data: {error.response?.data?.message || "Unknown error"}</p>
      </Layout>
    );
  }

  const filteredData = data?.filtered?.data || [];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Raw Material Inventory</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCountPcs(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Count Pcs
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Inventory
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow p-4 rounded mb-6 flex gap-4 flex-wrap">
          <div>
            <label className="block text-sm">Type</label>
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value, page: 1 })
              }
              className="p-2 border rounded"
            >
              <option value="Pipe">Pipe</option>
              <option value="Round Bar">Round Bar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value, page: 1 })
              }
              className="p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value, page: 1 })
              }
              className="p-2 border rounded"
            />
          </div>
        </div>

        {/* Total Quantities */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-white shadow rounded">
            <h2 className="text-lg font-semibold">Pipe</h2>
            <p className="text-xl">{data?.totalQuantities?.Pipe || 0}</p>
          </div>
          <div className="p-4 bg-white shadow rounded">
            <h2 className="text-lg font-semibold">Round Bar</h2>
            <p className="text-xl">
              {data?.totalQuantities?.["Round Bar"] || 0}
            </p>
          </div>
        </div>

        {/* Movements Table */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold mb-4">{filters.type} Movements</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((m, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2 border">{m.type}</td>
                    <td className="p-2 border">
                      {new Date(m.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </td>
                    <td className="p-2 border">{m.quantity}</td>
                    <td className="p-2 border">{m.reason}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {data?.filtered?.totalMovements > filters.limit && (
            <div className="flex justify-end mt-4 gap-2">
              <button
                disabled={filters.page === 1}
                onClick={() =>
                  setFilters({ ...filters, page: filters.page - 1 })
                }
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1">Page {filters.page}</span>
              <button
                disabled={
                  filters.page * filters.limit >= data.filtered.totalMovements
                }
                onClick={() =>
                  setFilters({ ...filters, page: filters.page + 1 })
                }
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Dialog for Update Form */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded p-6 w-96">
              <h2 className="text-xl font-semibold mb-4">Update Inventory</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="Pipe">Pipe</option>
                    <option value="Round Bar">Round Bar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm">Movement Type</label>
                  <select
                    value={formData.movementType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        movementType: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="IN">IN</option>
                    <option value="OUT">OUT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm">Reason</label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reason: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {updateMutation.isLoading ? "Updating..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dialog for Count Pcs */}
        {showCountPcs && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded p-6 w-96">
              <h2 className="text-xl font-semibold mb-4">Count Pcs</h2>
              <form onSubmit={handleCountPcs} className="space-y-3">
                <div>
                  <label className="block text-sm">Part No</label>
                  <input
                    type="text"
                    value={pcsForm.partNo}
                    onChange={(e) =>
                      setPcsForm({ ...pcsForm, partNo: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm">Weight</label>
                  <input
                    type="number"
                    value={pcsForm.weight}
                    onChange={(e) =>
                      setPcsForm({ ...pcsForm, weight: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>

                {pcsResult !== null && (
                  <div className="p-2 bg-gray-100 rounded">
                    <p>
                      <strong>Pcs:</strong> {pcsResult}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCountPcs(false);
                      setPcsResult(null);
                      setPcsForm({ partNo: "", weight: "" });
                    }}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Calculate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RawMaterial;