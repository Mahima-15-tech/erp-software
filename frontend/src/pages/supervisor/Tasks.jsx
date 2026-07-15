

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { server } from "../../constants/api";
// import { useAuthStore } from "../../store/useAuthStore";
// import SupervisorLayout from "../../layout/SupervisorLayout";
// import AdminLayout from "../../layout/AdminLayout";
// import toast from "react-hot-toast";

// const Tasks = () => {
//   const role = useAuthStore((state) => state.role);

//   const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;

//   const [tasks, setTasks] = useState([]);
//   const [dateFilter, setDateFilter] = useState("");
//   const [partNoFilter, setPartNoFilter] = useState("");
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [loading, setLoading] = useState(true);

//   const fetchTasks = async () => {
//     setLoading(true);
//     try {
//       const query = new URLSearchParams();
//       query.append("page", page);
//       if (dateFilter) query.append("date", dateFilter);
//       if (partNoFilter) query.append("partNo", partNoFilter);

//       const res = await axios.get(
//         `${server}/supervisor-admin/getAllTask?${query.toString()}`,
//         { withCredentials: true }
//       );

//       setTasks(res.data.tasks || []);
//       setPages(res.data.pages || 1);
//     } catch (err) {
//       toast.error("Failed to fetch tasks");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [page, dateFilter, partNoFilter]);

//   return (
//     <Layout>
//       <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow">
//         <h1 className="text-2xl font-bold mb-4">All Tasks</h1>

//         {/* Filters */}
//         <div className="flex flex-wrap items-center gap-4 mb-6">
//           {/* Date filter */}
//           <input
//             type="date"
//             value={dateFilter}
//             onChange={(e) => setDateFilter(e.target.value)}
//             className="border px-3 py-2 rounded"
//           />

//           {/* PartNo filter */}
//           <input
//             type="text"
//             placeholder="Filter by Part No ID"
//             value={partNoFilter}
//             onChange={(e) => setPartNoFilter(e.target.value)}
//             className="border px-3 py-2 rounded"
//           />
//         </div>

//         {/* Table */}
//         {loading ? (
//           <p>Loading tasks...</p>
//         ) : tasks.length === 0 ? (
//           <p>No tasks found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border border-gray-300 text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-3 border-b">Part No</th>
//                   <th className="p-3 border-b">Description</th>
//                   <th className="p-3 border-b">Machine</th>
//                   <th className="p-3 border-b">Assigned To</th>
//                   <th className="p-3 border-b">Date</th>
//                   <th className="p-3 border-b">Shift</th>
//                   <th className="p-3 border-b">Completion Note</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tasks.map((task) => (
//                   <tr key={task._id} className="border-t hover:bg-gray-50">
//                     <td className="p-3">{task.partNo?.partNo || "-"}</td>
//                     <td className="p-3">{task.description}</td>
//                     <td className="p-3">
//                       {task.machineName} ({task.machineNumber})
//                     </td>
//                     <td className="p-3">{task.assignedTo?.name || "-"}</td>
//                     <td className="p-3">
//                       {task.date
//                         ? new Date(task.date).toLocaleDateString()
//                         : "-"}
//                     </td>
//                     <td className="p-3">{task.shift || "-"}</td>
//                     <td className="p-3">{task.completionNote || "-"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         {pages > 1 && (
//           <div className="flex items-center justify-between mt-6">
//             <button
//               onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//               disabled={page === 1}
//               className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span className="text-sm font-medium">
//               Page {page} of {pages}
//             </span>
//             <button
//               onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
//               disabled={page === pages}
//               className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default Tasks;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../constants/api";
import { useAuthStore } from "../../store/useAuthStore";
import SupervisorLayout from "../../layout/SupervisorLayout";
import AdminLayout from "../../layout/AdminLayout";
import toast from "react-hot-toast";

const Tasks = () => {
  const role = useAuthStore((state) => state.role);

  const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;

  const [tasks, setTasks] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [partNoFilter, setPartNoFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // const fetchTasks = async () => {
  //   setLoading(true);
  //   try {
  //     const query = new URLSearchParams();
  //     query.append("page", page);
  //     if (dateFilter) query.append("date", dateFilter);
  //     if (partNoFilter) query.append("partNo", partNoFilter);

  //     const res = await axios.get(
  //       `${server}/supervisor-admin/getAllTask?${query.toString()}`,
  //       { withCredentials: true }
  //     );

  //     setTasks(res.data.tasks || []);
  //     setPages(res.data.pages || 1);
  //   } catch (err) {
  //     toast.error("Failed to fetch tasks");
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const [shiftFilter, setShiftFilter] = useState(""); // ✅ new state

const fetchTasks = async () => {
  setLoading(true);
  try {
    const query = new URLSearchParams();
    query.append("page", page);
    if (dateFilter) query.append("date", dateFilter);
    if (partNoFilter) query.append("partNo", partNoFilter);
    if (shiftFilter) query.append("shift", shiftFilter); // ✅ include shift

    const res = await axios.get(
      `${server}/supervisor-admin/getAllTask?${query.toString()}`,
      { withCredentials: true }
    );

    setTasks(res.data.tasks || []);
    setPages(res.data.pages || 1);
  } catch (err) {
    toast.error("Failed to fetch tasks");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchTasks();
  }, [page, dateFilter, partNoFilter,shiftFilter]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">All Tasks</h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
  {/* Date filter */}
  <input
    type="date"
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
    className="border px-3 py-2 rounded"
  />

  {/* PartNo filter */}
  <input
    type="text"
    placeholder="Filter by Part No ID"
    value={partNoFilter}
    onChange={(e) => setPartNoFilter(e.target.value)}
    className="border px-3 py-2 rounded"
  />

  {/* ✅ Shift filter */}
  <select
    value={shiftFilter}
    onChange={(e) => setShiftFilter(e.target.value)}
    className="border px-3 py-2 rounded"
  >
    <option value="">All Shifts</option>
    <option value="Day">Day</option>
    <option value="Night">Night</option>
  </select>
</div>


        {/* Data */}
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <>
            {/* ✅ Mobile View (Cards) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-4 rounded-lg shadow border"
                >
                  <p>
                    <strong>Part No:</strong> {task.partNo?.partNo || "-"}
                  </p>
                  <p>
                    <strong>Description:</strong> {task.description}
                  </p>
                  <p>
                    <strong>Machine:</strong>{" "}
                    {task.machineName} ({task.machineNumber})
                  </p>
                  <p>
                    <strong>Assigned To:</strong> {task.assignedTo?.name || "-"}
                  </p>
                  <p>
                    <strong>Shift:</strong> {task.shift || "-"}
                  </p>
                  <p>
                    <strong>Target:</strong> {task.target ?? "-"}
                  </p>
                  <p>
                    <strong>Completion Quantity:</strong>{" "}
                    {task.completionQuantity ?? "-"}
                  </p>
                  <p>
                    <strong>Completion Note:</strong> {task.completionNote || "-"}
                  </p>
                </div>
              ))}
            </div>

            {/* ✅ Desktop View (Table) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border-b">Part No</th>
                    <th className="p-3 border-b">Description</th>
                    <th className="p-3 border-b">Machine</th>
                    <th className="p-3 border-b">Assigned To</th>
                    <th className="p-3 border-b">Shift</th>
                    <th className="p-3 border-b">Target</th>
                    <th className="p-3 border-b">Completion Quantity</th>
                    <th className="p-3 border-b">Completion Note</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{task.partNo?.partNo || "-"}</td>
                      <td className="p-3">{task.description}</td>
                      <td className="p-3">
                        {task.machineName} ({task.machineNumber})
                      </td>
                      <td className="p-3">{task.assignedTo?.name || "-"}</td>
                      <td className="p-3">{task.shift || "-"}</td>
                      <td className="p-3">{task.target ?? "-"}</td>
                      <td className="p-3">{task.completionQuantity ?? "-"}</td>
                      <td className="p-3">{task.completionNote || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm font-medium">
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
              disabled={page === pages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;
