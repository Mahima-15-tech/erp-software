// import React from "react";
// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { server } from "../../constants/api";
// import { useAuthStore } from "../../store/useAuthStore";
// import SupervisorLayout from "../../layout/SupervisorLayout";
// import AdminLayout from "../../layout/AdminLayout";

// const fetchPartNoInventory = async (id) => {
//   const { data } = await axios.get(
//     `${server}/supervisor-admin/partNoInventory/${id}`,
//     { withCredentials: true }
//   );
//   return data;
// };

// const GetPartNoInventory = () => {
//   const { id } = useParams();
//   const role = useAuthStore((state) => state.role);
//   const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;

//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["partNoInventory", id],
//     queryFn: () => fetchPartNoInventory(id),
//     enabled: !!id,
//   });

//   if (isLoading) {
//     return (
//       <Layout>
//         <div className="p-6">Loading inventory...</div>
//       </Layout>
//     );
//   }

//   if (isError) {
//     return (
//       <Layout>
//         <div className="p-6 text-red-500">
//           Error fetching inventory: {error.message}
//         </div>
//       </Layout>
//     );
//   }

//   const inventory = data?.partNoInventory;

//   return (
//     <Layout>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Part No Inventory</h1>

//         {/* Part Info */}
//         <div className="mb-6 bg-gray-50 p-4 rounded shadow">
//           <p>
//             <span className="font-semibold">Part No Name:</span>{" "}
//             {inventory?.partNoName}
//           </p>
//           <p>
//             <span className="font-semibold">Total Stock in Hand:</span>{" "}
//             {inventory?.totalStockInHand}
//           </p>
//         </div>

//         {/* Quantities Table */}
//         <h2 className="text-xl font-semibold mb-2">Quantities</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border px-4 py-2">Type</th>
//                 <th className="border px-4 py-2">Quantity</th>
//                 <th className="border px-4 py-2">Unit</th>
//               </tr>
//             </thead>
//             <tbody>
//               {inventory?.quantities?.map((q) => (
//                 <tr key={q._id}>
//                   <td className="border px-4 py-2 capitalize">{q.type}</td>
//                   <td className="border px-4 py-2">{q.quantity}</td>
//                   <td className="border px-4 py-2">{q.unit}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default GetPartNoInventory;


import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { server } from "../../constants/api";
import { useAuthStore } from "../../store/useAuthStore";
import SupervisorLayout from "../../layout/SupervisorLayout";
import AdminLayout from "../../layout/AdminLayout";

const fetchPartNoInventory = async (id) => {
  const { data } = await axios.get(
    `${server}/supervisor-admin/partNoInventory/${id}`,
    { withCredentials: true }
  );
  console.log(data)
  return data;
};

const updatePartNoInventory = async ({ id, quantities }) => {
  const { data } = await axios.put(
    `${server}/supervisor-admin/update-inventory/${id}`,
    { quantities },
    { withCredentials: true }
  );
  return data;
};

const GetPartNoInventory = () => {
  const { id } = useParams();
  const role = useAuthStore((state) => state.role);
  const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["partNoInventory", id],
    queryFn: () => fetchPartNoInventory(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: updatePartNoInventory,
    onSuccess: () => {
      queryClient.invalidateQueries(["partNoInventory", id]);
      alert("Inventory updated successfully!");
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to update inventory");
    },
  });

  const [editMode, setEditMode] = useState(false);
  const [quantities, setQuantities] = useState([]);

  React.useEffect(() => {
    if (data?.partNoInventory?.quantities) {
      setQuantities(data.partNoInventory.quantities);
    }
  }, [data]);

  const handleQuantityChange = (index, field, value) => {
    const newQuantities = [...quantities];
    newQuantities[index][field] =
      field === "quantity" ? Number(value) : value;
    setQuantities(newQuantities);
  };

  const handleSave = () => {
    mutation.mutate({ id, quantities });
    setEditMode(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">Loading inventory...</div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="p-6 text-red-500">
          Error fetching inventory: {error.message}
        </div>
      </Layout>
    );
  }

  const inventory = data?.partNoInventory;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Part No Inventory</h1>

        {/* Part Info */}
        <div className="mb-6 bg-gray-50 p-4 rounded shadow">
          <p>
            <span className="font-semibold">Part No Name:</span>{" "}
            {inventory?.partNoName}
          </p>
          <p>
            <span className="font-semibold">Total Stock in Hand:</span>{" "}
          
          <span className="text-green-800 font-bold">  {inventory?.totalStockInHand}</span>
          </p>
        </div>

        {/* Quantities Table */}
        <h2 className="text-xl font-semibold mb-2">Quantities</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Unit</th>
              </tr>
            </thead>
            <tbody>
              {quantities?.map((q, index) => (
                <tr key={q._id || index}>
                  <td className="border px-4 py-2">{q.type}</td>
                  <td className="border px-4 py-2">
                    {editMode ? (
                      <input
                        type="number"
                        value={q.quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, "quantity", e.target.value)
                        }
                        className="border px-2 py-1 rounded w-20"
                      />
                    ) : (
                      q.quantity
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editMode ? (
                      <select
                        value={q.unit}
                        onChange={(e) =>
                          handleQuantityChange(index, "unit", e.target.value)
                        }
                        className="border px-2 py-1 rounded"
                      >
                        <option value="pcs">pcs</option>
                        <option value="kg">kg</option>
                      </select>
                    ) : (
                      q.unit
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GetPartNoInventory;
