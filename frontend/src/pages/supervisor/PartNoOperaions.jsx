



// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { server } from "../../constants/api";
// import { useAuthStore } from "../../store/useAuthStore";
// import SupervisorLayout from "../../layout/SupervisorLayout";
// import AdminLayout from "../../layout/AdminLayout";
// import { FiSearch } from "react-icons/fi";
// import { useParams } from "react-router-dom";

// const PartNoOperations = () => {
//   const { id } = useParams(); // partNoId
//   const role = useAuthStore((state) => state.role);
//   const isUserLoading = useAuthStore((state) => state.isUserLoading);
//   const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;

//   const [date, setDate] = useState("");
//   const [page, setPage] = useState(1);

//   // 🔹 API call with React Query
//   const { data, isLoading, isError, refetch } = useQuery({
//     queryKey: ["partNoOperations", id, date, page],
//     queryFn: async () => {
//       const { data } = await axios.get(
//         `${server}/supervisor-admin/get-partNo-operation/${id}`,
//         {
//           params: { date, page, limit: 10 },
//           withCredentials: true,
//         }
//       );
//       return data;
//     },
//     keepPreviousData: true,
//   });

//   if (isUserLoading || isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-xl">
//         Loading...
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex justify-center items-center h-screen text-xl text-red-500">
//         Failed to load tasks.
//       </div>
//     );
//   }

//   return (
//     <Layout>
//       <div className="p-6">
//         {/* 🔹 Date Filter */}
//         <div className="flex items-center gap-3 mb-4">
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="border p-2 rounded"
//           />
//           <button
//             onClick={() => refetch()}
//             className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             <FiSearch /> Filter
//           </button>
//         </div>

//         {/* 🔹 Tasks Table (Desktop) */}
//         <div className="hidden md:block overflow-x-auto shadow-md rounded-lg">
//           <table className="w-full border-collapse border">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border p-2">Part No</th>
//                 <th className="border p-2">Machine</th>
//                 <th className="border p-2">Assigned To</th>
//                 <th className="border p-2">Shift</th>
//                 <th className="border p-2">Description</th>
//                 <th className="border p-2">Target</th>
//                 <th className="border p-2">Completion Qty</th>
//                  <th className="border p-2">Status</th>


//               </tr>
//             </thead>
//             <tbody>
//               {data?.tasks?.length > 0 ? (
//                 data.tasks.map((task) => (
//                   <tr key={task._id} className="text-center">
//                     <td className="border p-2">{task.partNo?.partNo}</td>
//                     <td className="border p-2">{task.machineName}</td>
//                     <td className="border p-2">{task.assignedTo?.name}</td>
//                     <td className="border p-2">{task.shift}</td>
//                     <td className="border p-2">{task.description}</td>

//                     <td className="border p-2">{task.target}</td>
//                     <td className="border p-2">{task.completionQuantity}</td>
//                     <td className="border p-2">{task.status}</td>

//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="border p-4 text-center">
//                     No tasks found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* 🔹 Tasks Cards (Mobile) */}
//         <div className="grid gap-4 md:hidden">
//           {data?.tasks?.length > 0 ? (
//             data.tasks.map((task) => (
//               <div
//                 key={task._id}
//                 className="border rounded-lg p-4 shadow-md bg-white"
//               >
//                 <h3 className="font-semibold text-lg mb-2">
//                   Part No: {task.partNo?.partNo}
//                 </h3>
//                 <p>
//                   <span className="font-medium">Machine:</span>{" "}
//                   {task.machineName}
//                 </p>
//                 <p>
//                   <span className="font-medium">Description:</span>{" "}
//                   {task.description}
//                 </p>
//                 <p>
//                   <span className="font-medium">Assigned To:</span>{" "}
//                   {task.assignedTo?.name}
//                 </p>
//                 <p>
//                   <span className="font-medium">Target:</span> {task.target}
//                 </p>
//                 <p>
//                   <span className="font-medium">Completion Qty:</span>{" "}
//                   {task.completionQuantity}
//                 </p>
//                 <p>
//                   <span className="font-medium">Shift:</span> {task.shift}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <div className="text-center text-gray-500">No tasks found</div>
//           )}
//         </div>

//         {/* 🔹 Pagination */}
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//             disabled={page === 1}
//             className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span>
//             Page {data?.page} of {data?.pages}
//           </span>
//           <button
//             onClick={() => setPage((prev) => prev + 1)}
//             disabled={page === data?.pages}
//             className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default PartNoOperations;


import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { server } from "../../constants/api";
import { useAuthStore } from "../../store/useAuthStore";
import SupervisorLayout from "../../layout/SupervisorLayout";
import AdminLayout from "../../layout/AdminLayout";
import { FiSearch } from "react-icons/fi";
import { useParams } from "react-router-dom";

const PartNoOperations = () => {
  const { id } = useParams(); // partNoId
  const role = useAuthStore((state) => state.role);
  const isUserLoading = useAuthStore((state) => state.isUserLoading);
  const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;

  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);

  // Format date like 7 September, 2025
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // 🔹 API call with React Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["partNoOperations", id, date, page],
    queryFn: async () => {
      const { data } = await axios.get(
        `${server}/supervisor-admin/get-partNo-operation/${id}`,
        {
          params: { date, page, limit: 10 },
          withCredentials: true,
        }
      );
      return data;
    },
    keepPreviousData: true,
  });

  if (isUserLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        Failed to load tasks.
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* 🔹 Date Filter */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            <FiSearch /> Filter
          </button>
        </div>

        {/* 🔹 Show Selected Date */}
        {date && (
          <h2 className="text-lg font-semibold mb-4">
            Tasks for <span className="text-blue-600">{formatDate(date)}</span>
          </h2>
        )}

        {/* 🔹 Tasks Table (Desktop) */}
        <div className="hidden md:block overflow-x-auto shadow-md rounded-lg">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Part No</th>
                <th className="border p-2">Machine</th>
                <th className="border p-2">Assigned To</th>
                <th className="border p-2">Shift</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Target</th>
                <th className="border p-2">Completion Qty</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.tasks?.length > 0 ? (
                data.tasks.map((task) => (
                  <tr key={task._id} className="text-center">
                    <td className="border p-2">{task.partNo?.partNo}</td>
                    <td className="border p-2">{task.machineName}</td>
                    <td className="border p-2">{task.assignedTo?.name}</td>
                    <td className="border p-2">{task.shift}</td>
                    <td className="border p-2">{task.description}</td>
                    <td className="border p-2">{task.target}</td>
                    <td className="border p-2">{task.completionQuantity}</td>
                    <td
                      className={`border p-2 font-semibold ${
                        task.status === "COMPLETED"
                          ? "text-green-600"
                          : task.status === "IN_PROGRESS"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {task.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="border p-4 text-center">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔹 Tasks Cards (Mobile) */}
        <div className="grid gap-4 md:hidden">
          {data?.tasks?.length > 0 ? (
            data.tasks.map((task) => (
              <div
                key={task._id}
                className="border rounded-lg p-4 shadow-md bg-white"
              >
                <h3 className="font-semibold text-lg mb-2">
                  Part No: {task.partNo?.partNo}
                </h3>
                <p>
                  <span className="font-medium">Machine:</span>{" "}
                  {task.machineName}
                </p>
                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {task.description}
                </p>
                <p>
                  <span className="font-medium">Assigned To:</span>{" "}
                  {task.assignedTo?.name}
                </p>
                <p>
                  <span className="font-medium">Target:</span> {task.target}
                </p>
                <p>
                  <span className="font-medium">Completion Qty:</span>{" "}
                  {task.completionQuantity}
                </p>
                <p>
                  <span className="font-medium">Shift:</span> {task.shift}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      task.status === "COMPLETED"
                        ? "text-green-600"
                        : task.status === "IN_PROGRESS"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {task.status}
                  </span>
                </p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No tasks found</div>
          )}
        </div>

        {/* 🔹 Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {data?.page} of {data?.pages}
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === data?.pages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PartNoOperations;
