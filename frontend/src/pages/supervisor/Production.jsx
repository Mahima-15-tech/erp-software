import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { server } from '../../constants/api';
import { useAuthStore } from '../../store/useAuthStore';
import SupervisorLayout from '../../layout/SupervisorLayout';
import AdminLayout from '../../layout/AdminLayout';
import toast from 'react-hot-toast';
import CreateProduction from '../../components/CreateProduction';
import { useNavigate } from 'react-router-dom';

const Production = () => {
  const role = useAuthStore((state) => state.role);
  const isUserLoading = useAuthStore((state) => state.isUserLoading);

  const Layout = role === 'SUPERVISOR' ? SupervisorLayout : AdminLayout;

  const navigate = useNavigate()

  const [page, setPage] = useState(1);
  const limit = 10;
  const [showModal, setShowModal] = useState(false);

  const [status, setStatus] = useState('');
  const [inputBatchId, setInputBatchId] = useState('');
  const [batchIdFilter, setBatchIdFilter] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['productions', page, limit, status, batchIdFilter],
    queryFn: async () => {
      const res = await axios.get(`${server}/supervisor-admin/get-Productions`, {
        params: {
          page,
          limit,
          status: status || undefined,
          batchId: batchIdFilter || undefined
        },
        withCredentials: true
      });
      return res.data;
    },
    keepPreviousData: true
  });

  const createProduction = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${server}/supervisor-admin/create-production`, data, {
        withCredentials: true
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Production added successfully');
      setShowModal(false);
      refetch();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create production');
    }
  });

  const handleApplyFilter = () => {
    setBatchIdFilter(inputBatchId);
    setPage(1);
  };

  if (isUserLoading || isLoading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500">Failed to load production data.</div>;
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Production Records</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Production
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="p-2 border rounded"
          >
            <option value="">All Status</option>
            <option value="INPROGRESS">IN PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <input
            type="text"
            placeholder="Search by Batch ID"
            value={inputBatchId}
            onChange={(e) => setInputBatchId(e.target.value)}
            className="p-2 border rounded w-64"
          />

          <button
            onClick={handleApplyFilter}
            className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
          >
            Apply Filter
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Batch ID</th>
                <th className="p-2 border">Product ID</th>
                <th className="p-2 border">Initial Qty</th>
                <th className="p-2 border">Final Qty</th>
                <th className="p-2 border">Loss</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">View Details</th>
              </tr>
            </thead>
            <tbody>
              {data.productions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500">
                    No production records found.
                  </td>
                </tr>
              ) : (
                data.productions.map((prod) => (
                  <tr key={prod._id} className="text-center">
                    <td className="p-2 border">{prod.batchId}</td>
                    <td className="p-2 border">{prod.productId}</td>
                    <td className="p-2 border">{prod.initialPlannedQty}</td>
                    <td className="p-2 border">{prod.finalOutputQty ?? '-'}</td>
                    <td className="p-2 border">{prod.totalLoss ?? '-'}</td>
                    <td className="p-2 border">{prod.status}</td>
      
                      <td className="p-2 border">
                          <button onClick={()=>{navigate(`/superVisor-admin/production-detail/${prod._id}`)}} className="text-blue-500 hover:text-blue-700">View details</button>
                          
                       
                      </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ⬅ Prev
          </button>
          <span>
            Page {data.page} of {data.pages}
          </span>
          <button
            onClick={() => setPage((prev) => (prev < data.pages ? prev + 1 : prev))}
            disabled={page === data.pages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-xl">
            <div className="p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
              >
                &times;
              </button>
              <CreateProduction onClose={() => setShowModal(false)} />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Production;
