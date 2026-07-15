// import React, { useState } from 'react';
// import axios from 'axios';
// import { server } from '../constants/api';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useMutation } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import { useAuthStore } from '../store/useAuthStore';
// import SupervisorLayout from '../layout/SupervisorLayout';
// import AdminLayout from '../layout/AdminLayout';

// const AssignTask = () => {
//   const navigate = useNavigate();
//   const {workerId} = useParams();
//   const role = useAuthStore((state) => state.role);
//   const isUserLoading = useAuthStore((state) => state.isUserLoading);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     batchId: '',
//     dueDate: '',
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//    const Layout = role === 'SUPERVISOR' ? SupervisorLayout : AdminLayout;

//   const { mutate, isLoading } = useMutation({
//     mutationFn: async () => {
//       const res = await axios.post(
//         `${server}/supervisor-admin/assign-employee-task/${workerId}`,
//         {
//           title: formData.title,
//           description: formData.description,
//           batchId: formData.batchId,
//           dueDate: formData.dueDate,
//         },
//         { withCredentials: true }
//       );
//       return res.data;
//     },
//     onSuccess: () => {
//       toast.success('Task assigned successfully');
//       navigate(`/superVisor-admin/employee-detail/${workerId}`);
//     },
//     onError: (err) => {
//       toast.error(err.response?.data?.message || 'Failed to assign task');
//     },
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if ( !formData.title || !formData.batchId || !formData.dueDate) {
//       toast.error('Please fill all required fields');
//       return;
//     }
//     mutate();
//   };

//     if (isUserLoading || isLoading) {
//     return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
//   }

//   return (
//     <Layout>
//       <div className="p-6 max-w-xl mx-auto">
//         <h2 className="text-2xl font-bold mb-4">Assign Task to Worker</h2>

//         <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded">
          

//           <div>
//             <label className="block font-medium">Title</label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//               required
//             />
//           </div>

//           <div>
//             <label className="block font-medium">Batch ID</label>
//             <input
//               type="text"
//               name="batchId"
//               value={formData.batchId}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//               required
//             />
//           </div>

//           <div>
//             <label className="block font-medium">Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//               rows="3"
//             />
//           </div>

//           <div>
//             <label className="block font-medium">Due Date</label>
//             <input
//               type="date"
//               name="dueDate"
//               value={formData.dueDate}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             disabled={isLoading}
//           >
//             {isLoading ? 'Assigning...' : 'Assign Task'}
//           </button>
//         </form>
//       </div>
//     </Layout>
//   );
// };

// export default AssignTask;


import React, { useState } from 'react';
import axios from 'axios';
import { server } from '../constants/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import SupervisorLayout from '../layout/SupervisorLayout';
import AdminLayout from '../layout/AdminLayout';

const AssignTask = () => {
  const navigate = useNavigate();
  const { workerId } = useParams();
  const role = useAuthStore((state) => state.role);
  const isUserLoading = useAuthStore((state) => state.isUserLoading);

  const [formData, setFormData] = useState({
    partNo: '',
    description: '',
    date: '',
    machineName: '',
    machineNumber: '',
    shift: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const Layout = role === 'SUPERVISOR' ? SupervisorLayout : AdminLayout;

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${server}/supervisor-admin/assign-employee-task/${workerId}`,
        {
          partNo: formData.partNo,
          description: formData.description,
          date: formData.date,
          machineName: formData.machineName,
          machineNumber: formData.machineNumber,
          shift: formData.shift,
        },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Task assigned successfully');
      navigate(`/superVisor-admin/employee-detail/${workerId}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to assign task');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.partNo || !formData.date || !formData.machineName || !formData.shift || !formData.machineNumber) {
      toast.error('Please fill all required fields');
      return;
    }
    mutate();
  };

  if (isUserLoading || isLoading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  return (
    <Layout>
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Assign Task to Worker</h2>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded">
          {/* Part No */}
          <div>
            <label className="block font-medium">Part No</label>
            <input
              type="text"
              name="partNo"
              value={formData.partNo}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {/* Machine Name */}
          <div>
            <label className="block font-medium">Machine Name</label>
            <select
              name="machineName"
              value={formData.machineName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Machine</option>
              <option value="CNC">CNC</option>
              <option value="LATHE">LATHE</option>
              <option value="CUTTING">CUTTING</option>
            </select>
          </div>

          {/* Machine Number */}
          <div>
            <label className="block font-medium">Machine Number</label>
            <input
              type="text"
              name="machineNumber"
              value={formData.machineNumber}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {/* Shift */}
          <div>
            <label className="block font-medium">Shift</label>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Shift</option>
              <option value="Day">Day</option>
              <option value="Night">Night</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Assigning...' : 'Assign Task'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AssignTask;

