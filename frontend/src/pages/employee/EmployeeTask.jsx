
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import EmployeeLayout from "../../layout/EmployeeLayout";
// import { server } from "../../constants/api";

// // ✅ Utility function for Indian format date (dd:mm:yy)
// const formatDate = (dateString) => {
//   if (!dateString) return "-";
//   const d = new Date(dateString);
//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = String(d.getFullYear()).slice(-2); // last 2 digits
//   return `${day}:${month}:${year}`;
// };

// const EmployeeTask = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${server}/employee/my-task`, {
//         withCredentials: true,
//       });
//       setTasks(res.data.myTask || []);
//     } catch (err) {
//       setError("Failed to fetch tasks");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markComplete = async (taskId) => {
//     try {
//       await axios.post(
//         `${server}/employee/mark-taskComplete/${taskId}`,
//         {},
//         { withCredentials: true }
//       );
//       // Refresh tasks after completion
//       fetchTasks();
//     } catch (err) {
//       console.error("Error marking task complete:", err);
//       alert("Failed to mark task complete");
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   return (
//     <EmployeeLayout>
//       <div className="max-w-6xl mx-auto p-6">
//         <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

//         {loading && <p>Loading tasks...</p>}
//         {error && <p className="text-red-600">{error}</p>}

//         {!loading && !error && (
//           <>
//             {tasks.length === 0 ? (
//               <p>No tasks assigned yet.</p>
//             ) : (
//               <div className="grid gap-6 md:grid-cols-2">
//                 {tasks.map((task) => (
//                   <div
//                     key={task._id}
//                     className="border rounded-lg p-4 shadow hover:shadow-md transition bg-white flex flex-col justify-between"
//                   >
//                     {/* Top Section with Part & Button */}
//                     <div className="flex items-center justify-between mb-3">
//                       <h2 className="font-bold text-lg">
//                         {task.partNo?.partNo || "Unknown Part"}
//                       </h2>
//                       {task.status !== "COMPLETED" && (
//                         <button
//                           onClick={() => markComplete(task._id)}
//                           className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
//                         >
//                           Mark Complete
//                         </button>
//                       )}
//                     </div>

//                     {/* Part Details */}
//                     <div className="text-sm text-gray-600 mb-3">
//                       <p>
//                         <span className="font-medium">OD:</span>{" "}
//                         {task.partNo?.od || "-"} mm
//                       </p>
//                       <p>
//                         <span className="font-medium">ID:</span>{" "}
//                         {task.partNo?.id || "-"} mm
//                       </p>
//                       <p>
//                         <span className="font-medium">Length:</span>{" "}
//                         {task.partNo?.length || "-"} mm
//                       </p>
//                     </div>

//                     {/* Task Info */}
//                     <div className="space-y-1 text-sm">
//                       <p>
//                         <span className="font-medium">Date:</span>{" "}
//                         {formatDate(task.date)}
//                       </p>
//                       <p>
//                         <span className="font-medium">Shift:</span> {task.shift}
//                       </p>
//                       <p>
//                         <span className="font-medium">Machine:</span>{" "}
//                         {task.machineName} #{task.machineNumber}
//                       </p>
//                       <p>
//                         <span className="font-medium">Description:</span>{" "}
//                         {task.description}
//                       </p>
//                       <p>
//                         <span className="font-medium">Target:</span>{" "}
//                         {task.target}
//                       </p>
//                       <p>
//                         <span className="font-medium">Drawing:</span>{" "}
//                         {task.partNo?.drawingFileUrl ? (
//                           <a
//                             href={task.partNo.drawingFileUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 underline"
//                           >
//                             View Drawing
//                           </a>
//                         ) : (
//                           "-"
//                         )}
//                       </p>
//                       <p>
//                         <span className="font-medium">Status:</span>{" "}
//                         <StatusBadge status={task.status} />
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </EmployeeLayout>
//   );
// };

// const StatusBadge = ({ status }) => {
//   const colors = {
//     IN_PROGRESS: "bg-yellow-100 text-yellow-700",
//     COMPLETED: "bg-green-100 text-green-700",
//     PENDING: "bg-gray-100 text-gray-700",
//     OVERDUE: "bg-red-100 text-red-700",
//   };

//   return (
//     <span
//       className={`px-2 py-1 rounded text-xs font-medium ${
//         colors[status] || "bg-gray-100 text-gray-700"
//       }`}
//     >
//       {status.replace("_", " ")}
//     </span>
//   );
// };

// export default EmployeeTask;


import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeeLayout from "../../layout/EmployeeLayout";
import { server } from "../../constants/api";

// ✅ Utility function for Indian format date (dd:mm:yy)
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2); // last 2 digits
  return `${day}:${month}:${year}`;
};

const EmployeeTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For modal
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completionQty, setCompletionQty] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${server}/employee/my-task`, {
        withCredentials: true,
      });
      setTasks(res.data.myTask || []);
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCompleteDialog = (task) => {
    setSelectedTask(task);
    setCompletionQty("");
    setShowModal(true);
  };

  const handleCompleteSubmit = async () => {
    if (!completionQty || isNaN(completionQty)) {
      alert("Please enter a valid completion quantity");
      return;
    }
    try {
    const response =  await axios.post(
        `${server}/employee/mark-taskComplete/${selectedTask._id}`,
        { completionQuantity: Number(completionQty) }, // ✅ send qty to backend
        { withCredentials: true }
      );
      console.log(response)
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      console.error("Error marking task complete:", err);
      alert("Failed to mark task complete");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <EmployeeLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <>
            {tasks.length === 0 ? (
              <p>No tasks assigned yet.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="border rounded-lg p-4 shadow hover:shadow-md transition bg-white flex flex-col justify-between"
                  >
                    {/* Top Section with Part & Button */}
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-bold text-lg">
                        {task.partNo?.partNo || "Unknown Part"}
                      </h2>
                      {task.status !== "COMPLETED" && (
                        <button
                          onClick={() => openCompleteDialog(task)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>

                    {/* Part Details */}
                    <div className="text-sm text-gray-600 mb-3">
                      <p>
                        <span className="font-medium">OD:</span>{" "}
                        {task.partNo?.od || "-"} mm
                      </p>
                      <p>
                        <span className="font-medium">ID:</span>{" "}
                        {task.partNo?.id || "-"} mm
                      </p>
                      <p>
                        <span className="font-medium">Length:</span>{" "}
                        {task.partNo?.length || "-"} mm
                      </p>
                    </div>

                    {/* Task Info */}
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {formatDate(task.date)}
                      </p>
                      <p>
                        <span className="font-medium">Shift:</span> {task.shift}
                      </p>
                      <p>
                        <span className="font-medium">Machine:</span>{" "}
                        {task.machineName} #{task.machineNumber}
                      </p>
                      <p>
                        <span className="font-medium">Description:</span>{" "}
                        {task.description}
                      </p>
                      <p>
                        <span className="font-medium">Target:</span>{" "}
                        {task.target}
                      </p>
                      <p>
                        <span className="font-medium">Drawing:</span>{" "}
                        {task.partNo?.drawingFileUrl ? (
                          <a
                            href={task.partNo.drawingFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Drawing
                          </a>
                        ) : (
                          "-"
                        )}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        <StatusBadge status={task.status} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ✅ Modal for Completion Quantity */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                Complete Task - {selectedTask?.partNo?.partNo}
              </h2>
              <label className="block text-sm font-medium mb-2">
                Enter Completion Quantity
              </label>
              <input
                type="number"
                value={completionQty}
                onChange={(e) => setCompletionQty(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="e.g. 50"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-green-100 text-green-700",
    PENDING: "bg-gray-100 text-gray-700",
    OVERDUE: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default EmployeeTask;
