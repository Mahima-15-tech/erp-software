


// import React, { useState } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// import { server } from '../../constants/api';
// import { useAuthStore } from '../../store/useAuthStore';
// import SupervisorLayout from '../../layout/SupervisorLayout';
// import AdminLayout from '../../layout/AdminLayout';
// import { useNavigate, useParams } from 'react-router-dom';
// import toast from 'react-hot-toast';

// const EmployeeDetail = () => {
//   const { workerId } = useParams();
//   const role = useAuthStore((state) => state.role);
//   const isUserLoading = useAuthStore((state) => state.isUserLoading);
//   const navigate = useNavigate();
//   const Layout = role === 'SUPERVISOR' ? SupervisorLayout : AdminLayout;

//   const [selectedDate, setSelectedDate] = useState('');

//   // ✅ Fetch employee details
//   const { data: empData, isLoading: empLoading, isError: empError } = useQuery({
//     queryKey: ['employeeDetail', workerId],
//     queryFn: async () => {
//       const res = await axios.get(`${server}/supervisor-admin/employe-detail/${workerId}`, {
//         withCredentials: true,
//       });
//       return res.data;
//     },
//     enabled: !!workerId,
//   });

//   // ✅ Fetch employee tasks (with optional date filter)
//   const { data: taskData, isLoading: taskLoading, isError: taskError, refetch } = useQuery({
//     queryKey: ['employeeTasks', workerId, selectedDate],
//     queryFn: async () => {
//       let url = `${server}/supervisor-admin/employe-tasks/${workerId}`;
//       if (selectedDate) {
//         url += `?date=${selectedDate}`;
//       }
//       const res = await axios.get(url, { withCredentials: true });
//       return res.data;
//     },
//     enabled: !!workerId,
//   });

//   if (isUserLoading || empLoading || taskLoading) {
//     return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
//   }

//   if (empError || taskError) {
//     return <div className="text-center text-red-500 mt-10">Failed to load employee details.</div>;
//   }

//   const worker = empData.worker;
//   const assignedTasks = taskData?.assignedTask || [];

//   // ✅ Format date as dd:mm:yy
//   const formatDate = (dateStr) => {
//     const d = new Date(dateStr);
//     const day = d.getDate().toString().padStart(2, '0');
//     const month = (d.getMonth() + 1).toString().padStart(2, '0');
//     const year = d.getFullYear().toString().slice(-2);
//     return `${day}:${month}:${year}`;
//   };

//   return (
//     <Layout>
//       <div className="p-4 md:p-6 max-w-5xl mx-auto">
//         <h1 className="text-xl md:text-2xl font-bold mb-6">Employee Detail</h1>

//         <div className="mb-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
//           <button
//             onClick={() => navigate(`/superVisor-admin/assign-task/${workerId}`)}
//             className="bg-green-600 text-white px-4 py-2 rounded text-sm md:text-base hover:bg-green-700"
//           >
//             Assign Task to Worker
//           </button>

//           {/* ✅ Date Picker to filter tasks */}
//           <div className="flex gap-2">
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="border px-3 py-2 rounded text-sm md:text-base"
//             />
//             <button
//               onClick={() => refetch()}
//               className="bg-blue-600 text-white px-4 py-2 rounded text-sm md:text-base hover:bg-blue-700"
//             >
//               Search Tasks
//             </button>
//           </div>
//         </div>

//         {/* Worker Info */}
//         <div className="bg-white p-3 md:p-6 rounded shadow mb-8">
//           <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
//             {/* Worker Details */}
//             <div className="flex-1 text-sm md:text-base space-y-1">
//               <p><strong>Name:</strong> {worker.name}</p>
//               <p><strong>Phone:</strong> {worker.phone}</p>
//               <p><strong>Role:</strong> {worker.role}</p>
//               <p><strong>Status:</strong> {worker.isActive ? 'Active' : 'Inactive'}</p>
//               <p><strong>Created At:</strong> {new Date(worker.createdAt).toLocaleString('en-IN')}</p>
//             </div>

//             {/* Worker Photo */}
//             {worker.photoUrl && (
//               <div className="w-24 h-24 md:w-40 md:h-40 flex-shrink-0">
//                 <img
//                   src={worker.photoUrl}
//                   alt={worker.name}
//                   className="w-full h-full object-cover border shadow-md"
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Assigned Tasks */}
//         <div className="bg-white p-3 md:p-6 rounded shadow">
//           <h2 className="text-lg md:text-xl font-semibold mb-4">Assigned Tasks</h2>

//           {assignedTasks.length === 0 ? (
//             <p className="text-gray-500 text-sm md:text-base">No tasks assigned.</p>
//           ) : (
//             <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//               {assignedTasks.map((task) => (
//                 <TaskCard key={task._id} task={task} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default EmployeeDetail;

// // ✅ Task Card Component
// const TaskCard = ({ task }) => {
//   const queryClient = useQueryClient();
//   const [showDialog, setShowDialog] = useState(false);
//   const [completionNote, setCompletionNote] = useState('');
//   const [completionQuantity, setCompletionQuantity] = useState('');

//   const formatDate = (dateStr) => {
//     const d = new Date(dateStr);
//     const day = d.getDate().toString().padStart(2, '0');
//     const month = (d.getMonth() + 1).toString().padStart(2, '0');
//     const year = d.getFullYear().toString().slice(-2);
//     return `${day}:${month}:${year}`;
//   };

//   const handleComplete = async () => {
//     if (!completionNote.trim() || !completionQuantity) {
//       toast.error("Please enter note and quantity");
//       return;
//     }
//     try {
//       await axios.patch(
//         `${server}/supervisor-admin/mark-task-complete/${task._id}`,
//         { completionNote, completionQuantity },
//         { withCredentials: true }
//       );
//       toast.success("Task marked as completed");
//       setShowDialog(false);
//       queryClient.invalidateQueries(['employeeTasks']);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to complete task");
//     }
//   };

//   return (
//     <div className="border rounded-lg p-3 md:p-4 shadow text-sm md:text-base">
//       <h3 className="text-base md:text-lg font-semibold mb-2">
//         {task.partNo?.partNo || 'N/A'}
//       </h3>
//       <p><strong>Machine:</strong> {task.machineName} #{task.machineNumber}</p>
//       <p><strong>Description:</strong> {task.description}</p>
//       <p><strong>Shift:</strong> {task.shift}</p>
//       <p><strong>Target:</strong> {task.target}</p>
//       <p><strong>Date:</strong> {formatDate(task.date)}</p>
//       <p><strong>Status:</strong> {task.status}</p>
//       <p><strong>Completion Qty:</strong> {task.completionQuantity ?? '-'}</p>

//       {task.status === "IN_PROGRESS" && (
//         <button
//           onClick={() => setShowDialog(true)}
//           className="mt-3 bg-blue-600 text-white px-3 py-1.5 md:py-2 text-sm md:text-base rounded hover:bg-blue-700"
//         >
//           Mark Complete
//         </button>
//       )}

//       {/* ✅ Dialog */}
//       {showDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-80 md:w-96">
//             <h2 className="text-lg md:text-xl font-bold mb-4">Mark Task Complete</h2>

//             <label className="block mb-2 text-sm">Completion Note</label>
//             <input
//               type="text"
//               value={completionNote}
//               onChange={(e) => setCompletionNote(e.target.value)}
//               className="w-full border px-3 py-2 rounded mb-4 text-sm md:text-base"
//             />

//             <label className="block mb-2 text-sm">Completion Quantity</label>
//             <input
//               type="number"
//               value={completionQuantity}
//               onChange={(e) => setCompletionQuantity(e.target.value)}
//               className="w-full border px-3 py-2 rounded mb-4 text-sm md:text-base"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowDialog(false)}
//                 className="px-4 py-2 border rounded text-sm md:text-base"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleComplete}
//                 className="px-4 py-2 bg-green-600 text-white rounded text-sm md:text-base hover:bg-green-700"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };



// import React, { useState } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// import { server } from '../../constants/api';
// import { useAuthStore } from '../../store/useAuthStore';
// import SupervisorLayout from '../../layout/SupervisorLayout';
// import AdminLayout from '../../layout/AdminLayout';
// import { useNavigate, useParams } from 'react-router-dom';
// import toast from 'react-hot-toast';

// /**
//  * Simple visual progress bar component.
//  * percent: number (0-100) or null
//  */
// const ProgressBarVisual = ({ percent }) => {
//   return (
//     <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
//       <div
//         style={{ width: percent ? `${Math.min(Math.max(percent, 0), 100)}%` : '0%' }}
//         className="h-full bg-green-500"
//       />
//     </div>
//   );
// };

// const EmployeeDetail = () => {
//   const { workerId } = useParams();
//   const role = useAuthStore((state) => state.role);
//   const isUserLoading = useAuthStore((state) => state.isUserLoading);
//   const navigate = useNavigate();
//   const Layout = role === 'SUPERVISOR' ? SupervisorLayout : AdminLayout;

//   const [selectedDate, setSelectedDate] = useState('');
//   const [attendanceFilter, setAttendanceFilter] = useState('last15days'); // 'last15days' | 'week' | ''
//   const [selectedMonth, setSelectedMonth] = useState(''); // format YYYY-MM from <input type="month" />

//   // -----------------------
//   // Employee detail
//   // -----------------------
//   const { data: empData, isLoading: empLoading, isError: empError } = useQuery({
//     queryKey: ['employeeDetail', workerId],
//     queryFn: async () => {
//       const res = await axios.get(`${server}/supervisor-admin/employe-detail/${workerId}`, {
//         withCredentials: true,
//       });
//       return res.data;
//     },
//     enabled: !!workerId,
//   });

//   // -----------------------
//   // Employee tasks (optional date filter)
//   // -----------------------
//   const { data: taskData, isLoading: taskLoading, isError: taskError, refetch: refetchTasks } = useQuery({
//     queryKey: ['employeeTasks', workerId, selectedDate],
//     queryFn: async () => {
//       let url = `${server}/supervisor-admin/employe-tasks/${workerId}`;
//       if (selectedDate) url += `?date=${selectedDate}`;
//       const res = await axios.get(url, { withCredentials: true });
//       return res.data;
//     },
//     enabled: !!workerId,
//   });

//   // -----------------------
//   // Employee attendance (month or filter)
//   // -----------------------
//   const { data: attendanceData, isLoading: attendanceLoading, isError: attendanceError, refetch: refetchAttendance } = useQuery({
//     queryKey: ['employeeAttendance', workerId, attendanceFilter, selectedMonth],
//     queryFn: async () => {
//       let url = `${server}/supervisor-admin/employee-attendance/${workerId}`;
//       if (selectedMonth) {
//         url += `?month=${selectedMonth}`;
//       } else if (attendanceFilter) {
//         url += `?filter=${attendanceFilter}`;
//       }
//       const res = await axios.get(url, { withCredentials: true });
//       return res.data;
//     },
//     enabled: !!workerId,
//   });

//   // -----------------------
//   // Employee progress (calls your employeeProgressBar controller)
//   // endpoint: /supervisor-admin/employee/get-progrees/:employeeId
//   // accepts ?month=YYYY-MM (optional) - defaults to last15days in controller
//   // -----------------------
//   const { data: progressData, isLoading: progressLoading, isError: progressError, refetch: refetchProgress } = useQuery({
//     queryKey: ['employeeProgress', workerId, selectedMonth, attendanceFilter],
//     queryFn: async () => {
//       // we only send month param; controller will default if not provided
//       let url = `${server}/supervisor-admin/employee/get-progrees/${workerId}`;
//       if (selectedMonth) url += `?month=${selectedMonth}`;
//       const res = await axios.get(url, { withCredentials: true });
//       return res.data;
//     },
//     enabled: !!workerId,
//   });

//   // Loading and error states
//   if (isUserLoading || empLoading || taskLoading || attendanceLoading || progressLoading) {
//     return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
//   }

//   if (empError || taskError || attendanceError || progressError) {
//     return <div className="text-center text-red-500 mt-10">Failed to load employee details.</div>;
//   }

//   const worker = empData.worker;
//   const assignedTasks = taskData?.assignedTask || [];

//   // Format date dd:mm:yy
//   const formatDate = (dateStr) => {
//     const d = new Date(dateStr);
//     const day = d.getDate().toString().padStart(2, '0');
//     const month = (d.getMonth() + 1).toString().padStart(2, '0');
//     const year = d.getFullYear().toString().slice(-2);
//     return `${day}:${month}:${year}`;
//   };

//   // Handler to change attendance/progress filters (keeps both in sync)
//   const applyMonth = (monthVal) => {
//     setSelectedMonth(monthVal);
//     setAttendanceFilter(''); // clear "week/last15days" when month selected
//     // refetch both
//     refetchAttendance();
//     refetchProgress();
//   };

//   const applyFilter = (filterVal) => {
//     setAttendanceFilter(filterVal);
//     setSelectedMonth('');
//     // refetch both
//     refetchAttendance();
//     refetchProgress();
//   };

//   return (
//     <Layout>
//       <div className="p-4 md:p-6 max-w-5xl mx-auto">
//         <h1 className="text-xl md:text-2xl font-bold mb-6">Employee Detail</h1>

//         <div className="mb-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
//           <button
//             onClick={() => navigate(`/superVisor-admin/assign-task/${workerId}`)}
//             className="bg-green-600 text-white px-4 py-2 rounded text-sm md:text-base hover:bg-green-700"
//           >
//             Assign Task to Worker
//           </button>

//           {/* Date picker for tasks only */}
//           <div className="flex gap-2">
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="border px-3 py-2 rounded text-sm md:text-base"
//             />
//             <button
//               onClick={() => refetchTasks()}
//               className="bg-blue-600 text-white px-4 py-2 rounded text-sm md:text-base hover:bg-blue-700"
//             >
//               Search Tasks
//             </button>
//           </div>
//         </div>

//         {/* Worker Info */}
//         <div className="bg-white p-3 md:p-6 rounded shadow mb-8">
//           <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
//             <div className="flex-1 text-sm md:text-base space-y-1">
//               <p><strong>Name:</strong> {worker.name}</p>
//               <p><strong>Phone:</strong> {worker.phone}</p>
//               <p><strong>Role:</strong> {worker.role}</p>
//               <p><strong>Status:</strong> {worker.isActive ? 'Active' : 'Inactive'}</p>
//               <p><strong>Created At:</strong> {new Date(worker.createdAt).toLocaleString('en-IN')}</p>
//             </div>

//             {worker.photoUrl && (
//               <div className="w-24 h-24 md:w-40 md:h-40 flex-shrink-0">
//                 <img
//                   src={worker.photoUrl}
//                   alt={worker.name}
//                   className="w-full h-full object-cover border shadow-md rounded-full"
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Employee Attendance */}
//         <div className="bg-white p-3 md:p-6 rounded shadow mb-6">
//           <h2 className="text-lg md:text-xl font-semibold mb-4">Attendance</h2>

//           {/* Attendance + Progress filter controls (shared) */}
//           <div className="flex flex-col sm:flex-row gap-3 items-center mb-4">
//             <select
//               value={attendanceFilter}
//               onChange={(e) => applyFilter(e.target.value)}
//               className="border px-3 py-2 rounded"
//             >
//               <option value="last15days">Last 15 Days</option>
//               <option value="week">This Week</option>
//             </select>

//             <input
//               type="month"
//               value={selectedMonth}
//               onChange={(e) => applyMonth(e.target.value)}
//               className="border px-3 py-2 rounded"
//             />
//           </div>

//           {attendanceData?.attendance?.length === 0 ? (
//             <p className="text-gray-500 text-sm md:text-base">No attendance records found.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full border border-gray-200 text-sm md:text-base">
//                 <thead>
//                   <tr className="bg-gray-100 text-left">
//                     <th className="px-3 py-2 border">Date</th>
//                     <th className="px-3 py-2 border">Status</th>
//                     <th className="px-3 py-2 border">Check In</th>
//                     <th className="px-3 py-2 border">Check Out</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {attendanceData.attendance.map((att) => (
//                     <tr key={att._id} className="hover:bg-gray-50">
//                       <td className="px-3 py-2 border">{formatDate(att.date)}</td>
//                       <td className="px-3 py-2 border">{att.status}</td>
//                       <td className="px-3 py-2 border">
//                         {att.inTime ? new Date(att.inTime).toLocaleTimeString() : "-"}
//                       </td>
//                       <td className="px-3 py-2 border">
//                         {att.outTime ? new Date(att.outTime).toLocaleTimeString() : "-"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Employee Progress (inserted here) */}
//         <div className="bg-white p-3 md:p-6 rounded shadow mb-8">
//           <h2 className="text-lg md:text-xl font-semibold mb-3">Progress</h2>

//           {(!progressData || progressData.totalTasks === 0) ? (
//             <p className="text-gray-500">No tasks/targets found for selected range.</p>
//           ) : (
//             <>
//               <div className="mb-3">
//                 <div className="flex items-center justify-between gap-4 mb-2">
//                   <div>
//                     <p className="text-sm text-gray-600">Total Assigned</p>
//                     <p className="text-lg font-semibold">{progressData.totals.totalAssigned}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Total Completed</p>
//                     <p className="text-lg font-semibold">{progressData.totals.totalCompleted}</p>
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm text-gray-600">Overall Progress</p>
//                     <div className="mt-1">
//                       {progressData.totals.overallPercent !== null ? (
//                         <>
//                           <div className="flex items-center gap-3">
//                             <ProgressBarVisual percent={progressData.totals.overallPercent} />
//                             <span className="text-sm font-medium">{progressData.totals.overallPercent}%</span>
//                           </div>
//                         </>
//                       ) : (
//                         <p className="text-sm text-gray-500">No targets to compute progress.</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Per-task breakdown */}
//               <div className="space-y-3 mt-4">
//                 {progressData.tasks.map((t) => (
//                   <div key={t._id} className="border rounded p-3">
//                     <div className="flex items-start justify-between gap-4">
//                       <div className="flex-1">
//                         <p className="text-sm md:text-base font-semibold">
//                           {t.partNo?.partNo || 'Part'} {t.partNo?.partName ? `- ${t.partNo.partName}` : ''}
//                         </p>
//                         <p className="text-xs text-gray-600">
//                           {t.machineName ? `${t.machineName} (#${t.machineNumber})` : ''}
//                         </p>
//                         <p className="text-xs mt-1">Target: <strong>{t.target}</strong> — Completed: <strong>{t.completionQuantity}</strong></p>
//                       </div>

//                       <div className="w-48">
//                         {t.percentComplete !== null ? (
//                           <>
//                             <div className="flex items-center gap-2">
//                               <div className="flex-1">
//                                 <ProgressBarVisual percent={t.percentComplete} />
//                               </div>
//                               <div className="w-12 text-right text-sm font-medium">{t.percentComplete}%</div>
//                             </div>
//                           </>
//                         ) : (
//                           <p className="text-sm text-gray-500">No target</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         {/* Assigned Tasks */}
//         <div className="bg-white p-3 md:p-6 rounded shadow">
//           <h2 className="text-lg md:text-xl font-semibold mb-4">Assigned Tasks</h2>

//           {assignedTasks.length === 0 ? (
//             <p className="text-gray-500 text-sm md:text-base">No tasks assigned.</p>
//           ) : (
//             <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//               {assignedTasks.map((task) => (
//                 <TaskCard key={task._id} task={task} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default EmployeeDetail;

// // TaskCard (same as before)
// const TaskCard = ({ task }) => {
//   const queryClient = useQueryClient();
//   const [showDialog, setShowDialog] = useState(false);
//   const [completionNote, setCompletionNote] = useState('');
//   const [completionQuantity, setCompletionQuantity] = useState('');

//   const formatDate = (dateStr) => {
//     const d = new Date(dateStr);
//     const day = d.getDate().toString().padStart(2, '0');
//     const month = (d.getMonth() + 1).toString().padStart(2, '0');
//     const year = d.getFullYear().toString().slice(-2);
//     return `${day}:${month}:${year}`;
//   };

//   const handleComplete = async () => {
//     if (!completionNote.trim() || !completionQuantity) {
//       toast.error("Please enter note and quantity");
//       return;
//     }
//     try {
//       await axios.patch(
//         `${server}/supervisor-admin/mark-task-complete/${task._id}`,
//         { completionNote, completionQuantity },
//         { withCredentials: true }
//       );
//       toast.success("Task marked as completed");
//       setShowDialog(false);
//       queryClient.invalidateQueries(['employeeTasks']);
//       queryClient.invalidateQueries(['employeeProgress']); // refresh progress after completion
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to complete task");
//     }
//   };

//   return (
//     <div className="border rounded-lg p-3 md:p-4 shadow text-sm md:text-base">
//       <h3 className="text-base md:text-lg font-semibold mb-2">
//         {task.partNo?.partNo || 'N/A'}
//       </h3>
//       <p><strong>Machine:</strong> {task.machineName} #{task.machineNumber}</p>
//       <p><strong>Description:</strong> {task.description}</p>
//       <p><strong>Shift:</strong> {task.shift}</p>
//       <p><strong>Target:</strong> {task.target}</p>
//       <p><strong>Date:</strong> {formatDate(task.date)}</p>
//       <p><strong>Status:</strong> {task.status}</p>
//       <p><strong>Completion Qty:</strong> {task.completionQuantity ?? '-'}</p>

//       {task.status === "IN_PROGRESS" && (
//         <button
//           onClick={() => setShowDialog(true)}
//           className="mt-3 bg-blue-600 text-white px-3 py-1.5 md:py-2 text-sm md:text-base rounded hover:bg-blue-700"
//         >
//           Mark Complete
//         </button>
//       )}

//       {showDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-80 md:w-96">
//             <h2 className="text-lg md:text-xl font-bold mb-4">Mark Task Complete</h2>

//             <label className="block mb-2 text-sm">Completion Note</label>
//             <input
//               type="text"
//               value={completionNote}
//               onChange={(e) => setCompletionNote(e.target.value)}
//               className="w-full border px-3 py-2 rounded mb-4 text-sm md:text-base"
//             />

//             <label className="block mb-2 text-sm">Completion Quantity</label>
//             <input
//               type="number"
//               value={completionQuantity}
//               onChange={(e) => setCompletionQuantity(e.target.value)}
//               className="w-full border px-3 py-2 rounded mb-4 text-sm md:text-base"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowDialog(false)}
//                 className="px-4 py-2 border rounded text-sm md:text-base"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleComplete}
//                 className="px-4 py-2 bg-green-600 text-white rounded text-sm md:text-base hover:bg-green-700"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { server } from '../../constants/api';
import { useAuthStore } from '../../store/useAuthStore';
import SupervisorLayout from '../../layout/SupervisorLayout';
import AdminLayout from '../../layout/AdminLayout';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Simple visual progress bar component.
 * percent: number (0-100) or null
 */
const ProgressBarVisual = ({ percent }) => {
  return (
    <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
      <div
        style={{ width: percent ? `${Math.min(Math.max(percent, 0), 100)}%` : '0%' }}
        className="h-full bg-green-500 transition-all duration-300 ease-out"
      />
    </div>
  );
};

const EmployeeDetail = () => {
  const { workerId } = useParams();
  const role = useAuthStore((state) => state.role);
  const isUserLoading = useAuthStore((state) => state.isUserLoading);
  const navigate = useNavigate();
  const Layout = role === 'SUPERVISOR' ? SupervisorLayout : AdminLayout;
  const queryClient = useQueryClient(); // MUST be top-level hook

  // UI state (all hooks must be declared unconditionally at top)
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState('last15days'); // 'last15days' | 'week' | ''
  const [selectedMonth, setSelectedMonth] = useState(''); // format YYYY-MM from <input type="month" />

  // Progress client-side date-range filter states
  const [progressStartDate, setProgressStartDate] = useState('');
  const [progressEndDate, setProgressEndDate] = useState('');
  const [appliedProgressRange, setAppliedProgressRange] = useState(null); // { start: Date, end: Date } or null

  // -----------------------
  // Hooks: queries (all are top-level)
  // -----------------------
  const { data: empData, isLoading: empLoading, isError: empError } = useQuery({
    queryKey: ['employeeDetail', workerId],
    queryFn: async () => {
      const res = await axios.get(`${server}/supervisor-admin/employe-detail/${workerId}`, {
        withCredentials: true,
      });
      return res.data;
    },
    enabled: !!workerId,
  });

  const { data: taskData, isLoading: taskLoading, isError: taskError, refetch: refetchTasks } = useQuery({
    queryKey: ['employeeTasks', workerId, selectedDate],
    queryFn: async () => {
      let url = `${server}/supervisor-admin/employe-tasks/${workerId}`;
      if (selectedDate) url += `?date=${selectedDate}`;
      const res = await axios.get(url, { withCredentials: true });
      return res.data;
    },
    enabled: !!workerId,
  });

  const { data: attendanceData, isLoading: attendanceLoading, isError: attendanceError, refetch: refetchAttendance } = useQuery({
    queryKey: ['employeeAttendance', workerId, attendanceFilter, selectedMonth],
    queryFn: async () => {
      let url = `${server}/supervisor-admin/employee-attendance/${workerId}`;
      if (selectedMonth) {
        url += `?month=${selectedMonth}`;
      } else if (attendanceFilter) {
        url += `?filter=${attendanceFilter}`;
      }
      const res = await axios.get(url, { withCredentials: true });
      return res.data;
    },
    enabled: !!workerId,
  });

  const { data: progressData, isLoading: progressLoading, isError: progressError, refetch: refetchProgress } = useQuery({
    queryKey: ['employeeProgress', workerId, selectedMonth],
    queryFn: async () => {
      let url = `${server}/supervisor-admin/employee/get-progrees/${workerId}`;
      if (selectedMonth) url += `?month=${selectedMonth}`;
      const res = await axios.get(url, { withCredentials: true });
      return res.data;
    },
    enabled: !!workerId,
  });

  // -----------------------
  // Client-side filtered progress tasks and totals (useMemo MUST be top-level)
  // -----------------------
  const serverTasks = progressData?.tasks || [];

  const filteredProgressTasks = useMemo(() => {
    if (!appliedProgressRange) return serverTasks;
    const { start, end } = appliedProgressRange;
    return serverTasks.filter((t) => {
      if (!t.date) return false;
      const d = new Date(t.date);
      return d >= start && d <= end;
    });
  }, [serverTasks, appliedProgressRange]);

  const progressTotals = useMemo(() => {
    let totalAssigned = 0;
    let totalCompleted = 0;
    filteredProgressTasks.forEach((t) => {
      totalAssigned += Number(t.target || 0);
      totalCompleted += Number(t.completionQuantity || 0);
    });
    const overallPercent = totalAssigned > 0 ? Number(((totalCompleted / totalAssigned) * 100).toFixed(2)) : null;
    return { totalAssigned, totalCompleted, overallPercent };
  }, [filteredProgressTasks]);

  // -----------------------
  // Loading / error early return (hooks are already called above)
  // -----------------------
  if (isUserLoading || empLoading || taskLoading || attendanceLoading || progressLoading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  if (empError || taskError || attendanceError || progressError) {
    return <div className="text-center text-red-500 mt-10">Failed to load employee details.</div>;
  }

  // -----------------------
  // Remaining helpers & UI handlers
  // -----------------------
  const worker = empData.worker;
  const assignedTasks = taskData?.assignedTask || [];

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear().toString().slice(-2);
    return `${day}:${month}:${year}`;
  };

  const applyMonth = (monthVal) => {
    setSelectedMonth(monthVal);
    setAttendanceFilter('');
    refetchAttendance();
    refetchProgress();
    setAppliedProgressRange(null);
    setProgressStartDate('');
    setProgressEndDate('');
  };

  const applyFilter = (filterVal) => {
    setAttendanceFilter(filterVal);
    setSelectedMonth('');
    refetchAttendance();
    refetchProgress();
    setAppliedProgressRange(null);
    setProgressStartDate('');
    setProgressEndDate('');
  };

  const handleApplyProgressRange = () => {
    if (!progressStartDate || !progressEndDate) {
      return toast.error('Please select both start and end dates for progress filter');
    }
    const s = new Date(progressStartDate);
    const e = new Date(progressEndDate);
    s.setHours(0, 0, 0, 0);
    e.setHours(23, 59, 59, 999);
    if (s > e) return toast.error('Start date cannot be after end date');
    setAppliedProgressRange({ start: s, end: e });
  };

  const handleClearProgressRange = () => {
    setAppliedProgressRange(null);
    setProgressStartDate('');
    setProgressEndDate('');
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Employee Detail</h1>

        <div className="mb-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate(`/superVisor-admin/assign-task/${workerId}`)}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm md:text-base hover:bg-green-700"
          >
            Assign Task to Worker
          </button>

          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border px-3 py-2 rounded text-sm md:text-base"
            />
            <button
              onClick={() => refetchTasks()}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm md:text-base hover:bg-blue-700"
            >
              Search Tasks
            </button>
          </div>
        </div>

        {/* Worker Info */}
        <div className="bg-white p-3 md:p-6 rounded shadow mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            <div className="flex-1 text-sm md:text-base space-y-1">
              <p><strong>Name:</strong> {worker.name}</p>
              <p><strong>Phone:</strong> {worker.phone}</p>
              <p><strong>Role:</strong> {worker.role}</p>
              <p><strong>Status:</strong> {worker.isActive ? 'Active' : 'Inactive'}</p>
              <p><strong>Created At:</strong> {new Date(worker.createdAt).toLocaleString('en-IN')}</p>
            </div>

            {worker.photoUrl && (
              <div className="w-24 h-24 md:w-40 md:h-40 flex-shrink-0">
                <img
                  src={worker.photoUrl}
                  alt={worker.name}
                  className="w-full h-full object-cover border shadow-md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white p-3 md:p-6 rounded shadow mb-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Attendance</h2>

          <div className="flex flex-col sm:flex-row gap-3 items-center mb-4">
            <select
              value={attendanceFilter}
              onChange={(e) => applyFilter(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="last15days">Last 15 Days</option>
              <option value="week">This Week</option>
            </select>

            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => applyMonth(e.target.value)}
              className="border px-3 py-2 rounded"
            />
          </div>

          {attendanceData?.attendance?.length === 0 ? (
            <p className="text-gray-500 text-sm md:text-base">No attendance records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-3 py-2 border">Date</th>
                    <th className="px-3 py-2 border">Status</th>
                    <th className="px-3 py-2 border">Check In</th>
                    <th className="px-3 py-2 border">Check Out</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.attendance.map((att) => (
                    <tr key={att._id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border">{formatDate(att.date)}</td>
                      <td className="px-3 py-2 border">{att.status}</td>
                      <td className="px-3 py-2 border">
                        {att.inTime ? new Date(att.inTime).toLocaleTimeString() : "-"}
                      </td>
                      <td className="px-3 py-2 border">
                        {att.outTime ? new Date(att.outTime).toLocaleTimeString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="bg-white p-3 md:p-6 rounded shadow mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Progress</h2>

          {/* Client-side Progress Date Range Picker */}
          <div className="flex flex-col sm:flex-row gap-2 items-center mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Progress From:</label>
              <input
                type="date"
                value={progressStartDate}
                onChange={(e) => setProgressStartDate(e.target.value)}
                className="border px-3 py-2 rounded text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">To:</label>
              <input
                type="date"
                value={progressEndDate}
                onChange={(e) => setProgressEndDate(e.target.value)}
                className="border px-3 py-2 rounded text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleApplyProgressRange}
                className="bg-indigo-600 text-white px-3 py-2 rounded text-sm hover:bg-indigo-700"
              >
                Apply
              </button>
              <button
                onClick={handleClearProgressRange}
                className="bg-gray-200 px-3 py-2 rounded text-sm hover:bg-gray-300"
              >
                Clear
              </button>
            </div>

            {appliedProgressRange && (
              <div className="ml-auto text-sm text-gray-600">
                Showing {appliedProgressRange.start.toLocaleDateString()} → {appliedProgressRange.end.toLocaleDateString()}
              </div>
            )}
          </div>

          {(!progressData || (filteredProgressTasks.length === 0)) ? (
            <p className="text-gray-500">No tasks/targets found for selected range.</p>
          ) : (
            <>
              <div className="mb-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Total Assigned</p>
                      <p className="text-lg font-semibold">{progressTotals.totalAssigned}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Completed</p>
                      <p className="text-lg font-semibold">{progressTotals.totalCompleted}</p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Overall Progress</p>
                    <div className="mt-1">
                      {progressTotals.overallPercent !== null ? (
                        <div className="flex items-center gap-3">
                          <ProgressBarVisual percent={progressTotals.overallPercent} />
                          <span className="text-sm font-medium">{progressTotals.overallPercent}%</span>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No targets to compute progress.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                {filteredProgressTasks.map((t) => (
                  <div key={t._id} className="border rounded p-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm md:text-base font-semibold">
                          {t.partNo?.partNo || 'Part'} {t.partNo?.partName ? `- ${t.partNo.partName}` : ''}
                        </p>
                        <p className="text-xs text-gray-600">
                          {t.machineName ? `${t.machineName} (#${t.machineNumber})` : ''}
                        </p>
                        <p className="text-xs mt-1">Target: <strong>{t.target}</strong> — Completed: <strong>{t.completionQuantity}</strong></p>
                      </div>

                      <div className="w-48">
                        {t.percentComplete !== null ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <ProgressBarVisual percent={t.percentComplete} />
                            </div>
                            <div className="w-12 text-right text-sm font-medium">{t.percentComplete}%</div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No target</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Assigned Tasks */}
        <div className="bg-white p-3 md:p-6 rounded shadow">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Assigned Tasks</h2>

          {assignedTasks.length === 0 ? (
            <p className="text-gray-500 text-sm md:text-base">No tasks assigned.</p>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {assignedTasks.map((task) => (
                <TaskCard key={task._id} task={task} queryClient={queryClient} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDetail;

// TaskCard (accepts queryClient as prop to avoid calling hooks conditionally)
const TaskCard = ({ task, queryClient }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [completionNote, setCompletionNote] = useState('');
  const [completionQuantity, setCompletionQuantity] = useState('');

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear().toString().slice(-2);
    return `${day}:${month}:${year}`;
  };

  const handleComplete = async () => {
    if (!completionNote.trim() || !completionQuantity) {
      toast.error("Please enter note and quantity");
      return;
    }
    try {
      await axios.patch(
        `${server}/supervisor-admin/mark-task-complete/${task._id}`,
        { completionNote, completionQuantity },
        { withCredentials: true }
      );
      toast.success("Task marked as completed");
      setShowDialog(false);
      queryClient.invalidateQueries(['employeeTasks']);
      queryClient.invalidateQueries(['employeeProgress']);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete task");
    }
  };

  return (
    <div className="border rounded-lg p-3 md:p-4 shadow text-sm md:text-base">
      <h3 className="text-base md:text-lg font-semibold mb-2">
        {task.partNo?.partNo || 'N/A'}
      </h3>
      <p><strong>Machine:</strong> {task.machineName} #{task.machineNumber}</p>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Shift:</strong> {task.shift}</p>
      <p><strong>Target:</strong> {task.target}</p>
      <p><strong>Date:</strong> {formatDate(task.date)}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Completion Qty:</strong> {task.completionQuantity ?? '-'}</p>

      {task.status === "IN_PROGRESS" && (
        <button
          onClick={() => setShowDialog(true)}
          className="mt-3 bg-blue-600 text-white px-3 py-1.5 md:py-2 text-sm md:text-base rounded hover:bg-blue-700"
        >
          Mark Complete
        </button>
      )}

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-80 md:w-96">
            <h2 className="text-lg md:text-xl font-bold mb-4">Mark Task Complete</h2>

            <label className="block mb-2 text-sm">Completion Note</label>
            <input
              type="text"
              value={completionNote}
              onChange={(e) => setCompletionNote(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4 text-sm md:text-base"
            />

            <label className="block mb-2 text-sm">Completion Quantity</label>
            <input
              type="number"
              value={completionQuantity}
              onChange={(e) => setCompletionQuantity(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4 text-sm md:text-base"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 border rounded text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                className="px-4 py-2 bg-green-600 text-white rounded text-sm md:text-base hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

