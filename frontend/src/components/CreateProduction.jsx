import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { server } from '../constants/api';
import toast from 'react-hot-toast';

const CreateProduction = ({ onClose }) => {
  const [formData, setFormData] = useState({
    productId: '',
    batchId: '',
    initialPlannedQty: '',
    rawMaterialFromInventory: '',
    reason: '',
    status: 'PENDING',
  });

  const createProduction = async (data) => {
    const res = await axios.post(`${server}/supervisor-admin/create-production`, data, {
      withCredentials: true,
    });
    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createProduction,
    onSuccess: () => {
      toast.success('✅ Production created successfully!');
      setFormData({
        productId: '',
        batchId: '',
        initialPlannedQty: '',
        rawMaterialFromInventory: '',
        reason: '',
        status: 'PENDING',
      });
      if (onClose) onClose();
    },
    onError: (err) => {
      console.error(err);
      toast.error(err?.response?.data?.message || '❌ Failed to create production');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      initialPlannedQty: Number(formData.initialPlannedQty),
      rawMaterialFromInventory: Number(formData.rawMaterialFromInventory),
    };

    mutate(payload);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Create Production</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="productId"
          placeholder="Product ID"
          value={formData.productId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="batchId"
          placeholder="Batch ID"
          value={formData.batchId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="initialPlannedQty"
          placeholder="Initial Planned Quantity"
          value={formData.initialPlannedQty}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="rawMaterialFromInventory"
          placeholder="Raw Material from Inventory"
          value={formData.rawMaterialFromInventory}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="PENDING">PENDING</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <textarea
          name="reason"
          placeholder="Reason"
          value={formData.reason}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />

        <div className="flex justify-end gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduction;
