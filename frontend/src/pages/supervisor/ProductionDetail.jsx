import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { server } from '../../constants/api';
import { useAuthStore } from '../../store/useAuthStore';
import SupervisorLayout from '../../layout/SupervisorLayout';
import AdminLayout from '../../layout/AdminLayout';
import toast from 'react-hot-toast';

const ProductionDetail = () => {
  const { prouductionId } = useParams(); // spelling preserved as in your code

  const role = useAuthStore((state) => state.role);
  const Layout = role === 'SUPERVISOR' ? SupervisorLayout : AdminLayout;

  const [showForm, setShowForm] = useState(false);
  const [newStage, setNewStage] = useState({
    name: '',
    inputQty: '',
    outputQty: '',
    lossReason: ''
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['productionDetail', prouductionId],
    queryFn: async () => {
      const res = await axios.get(`${server}/supervisor-admin/get-Production-Detail/${prouductionId}`, {
        withCredentials: true
      });
      return res.data;
    }
  });

  const addStageMutation = useMutation({
    mutationFn: async (stageData) => {
        console.log(prouductionId)
      const res = await axios.post(
        `${server}/supervisor-admin/create-stages/${prouductionId}`,
        stageData,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Stage added successfully');
      setNewStage({ name: '', inputQty: '', outputQty: '', lossReason: '' });
      setShowForm(false);
      refetch();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add stage');
    }
  });

  const markCompleteMutation = useMutation({
  mutationFn: async () => {
    const res = await axios.patch(
      `${server}/supervisor-admin/finishProduction/${prouductionId}`,
      {},
      { withCredentials: true }
    );
    return res.data;
  },
  onSuccess: () => {
    toast.success('Production marked as completed');
    refetch();
  },
  onError: (err) => {
    toast.error(err.response?.data?.message || 'Failed to mark production as completed');
  }
});

  const handleStageInputChange = (e) => {
    const { name, value } = e.target;
    setNewStage((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStage = () => {
    const { name, inputQty, outputQty, lossReason } = newStage;
    if (!name || !inputQty || !outputQty) {
      return toast.error('Please fill all required fields');
    }

    addStageMutation.mutate({
      name,
      inputQty: Number(inputQty),
      outputQty: Number(outputQty),
      lossReason
    });
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError) return <div className="text-center text-red-600 py-10">Failed to load data.</div>;

  const production = data.production;
  const stages = production.stages || [];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Production Detail</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Stage
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-white p-4 shadow rounded mb-6">
          <p><strong>Batch ID:</strong> {production.batchId}</p>
          <p><strong>Product ID:</strong> {production.productId}</p>
          <p><strong>Status:</strong> {production.status}</p>
          <p><strong>Initial Qty:</strong> {production.initialPlannedQty}</p>
          <p><strong>Final Qty:</strong> {production.finalOutputQty ?? '-'}</p>
          <p><strong>Total Loss:</strong> {production.totalLoss ?? '-'}</p>
          <p><strong>Start Condition:</strong> {production.reason}</p>
        </div>

        {production.status !== 'COMPLETED' && (
  <div className="mb-6">
    <button
      onClick={() => markCompleteMutation.mutate()}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      disabled={markCompleteMutation.isLoading}
    >
      {markCompleteMutation.isLoading ? 'Marking...' : 'Mark as Completed'}
    </button>
  </div>
)}

        {/* Stage Table */}
        <div className="bg-white shadow rounded mb-6 overflow-x-auto">
          <h2 className="text-xl font-semibold p-4 border-b">Production Stages</h2>
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Input Qty</th>
                <th className="border p-2">Output Qty</th>
                <th className="border p-2">Loss Qty</th>
                <th className="border p-2">Loss Reason</th>
                <th className="border p-2">Completed At</th>
              </tr>
            </thead>
            <tbody>
              {stages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No stages added yet.
                  </td>
                </tr>
              ) : (
                stages.map((stage) => (
                  <tr key={stage._id} className="text-center">
                    <td className="border p-2">{stage.name}</td>
                    <td className="border p-2">{stage.inputQty}</td>
                    <td className="border p-2">{stage.outputQty}</td>
                    <td className="border p-2">{stage.lossQty ?? stage.inputQty - stage.outputQty}</td>
                    <td className="border p-2">{stage.lossReason}</td>
                    <td className="border p-2">
                      {new Date(stage.completedAt).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Form for New Stage */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-black"
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold mb-4">Add New Stage</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Stage Name"
                  value={newStage.name}
                  onChange={handleStageInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  name="inputQty"
                  placeholder="Input Quantity"
                  value={newStage.inputQty}
                  onChange={handleStageInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  name="outputQty"
                  placeholder="Output Quantity"
                  value={newStage.outputQty}
                  onChange={handleStageInputChange}
                  className="w-full border p-2 rounded"
                />
                <textarea
                  name="lossReason"
                  placeholder="Loss Reason (optional)"
                  value={newStage.lossReason}
                  onChange={handleStageInputChange}
                  className="w-full border p-2 rounded"
                />
                <button
                  onClick={handleAddStage}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={addStageMutation.isLoading}
                >
                  {addStageMutation.isLoading ? 'Adding...' : 'Add Stage'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductionDetail;
