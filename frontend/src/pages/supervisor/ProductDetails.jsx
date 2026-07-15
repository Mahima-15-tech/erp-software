import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { server } from '../../constants/api';
import { useAuthStore } from '../../store/useAuthStore';
import SupervisorLayout from '../../layout/SupervisorLayout';
import AdminLayout from '../../layout/AdminLayout';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { productId } = useParams();
   const role = useAuthStore((state) => state.role);
    const isUserLoading = useAuthStore((state) => state.isUserLoading);

  const [showModal, setShowModal] = useState(false);
  const [movementData, setMovementData] = useState({ type: 'IN', reason: '', quantity: '' });

  const [page, setPage] = useState(1);
  const limit = 5; // change as needed

  // Fetch product details
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['product', productId, page, limit],
    queryFn: async () => {
      const res = await axios.get(`${server}/supervisor-admin/product-detail/${productId}`, {
        params: { page, limit },
        withCredentials: true
      });
      return res.data;
    },
    keepPreviousData: true
  });

  // Create stock movement
  const mutation = useMutation({
    mutationFn: async (movement) => {
      const res = await axios.patch(
        `${server}/supervisor-admin/update-inventory/${data.product.productId}`,
        movement,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Stock updated successfully!');
      setShowModal(false);
      refetch(); // Refetch after update
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update stock.');
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovementData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStockSubmit = () => {
    mutation.mutate({
      type: movementData.type,
      reason: movementData.reason,
      quantity: Number(movementData.quantity)
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading product.</p>;

    if (isUserLoading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading user data...</div>;
  }

  const Layout = role === 'SUPERVISOR' ? SupervisorLayout : AdminLayout;

  const { product, totalPages } = data;

  return (
   <Layout>
     <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Product: {product.name}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Stock Movement
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p><strong>Product ID:</strong> {product.productId}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Unit:</strong> {product.unit}</p>
        <p><strong>Quantity:</strong> {product.quantity}</p>
        <p><strong>Minimum Stock:</strong> {product.minStock}</p>
        <p><strong>Created At:</strong> {new Date(product.createdAt).toLocaleString('en-IN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
})}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Stock Movements</h2>
      <div className="bg-white rounded shadow">
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Employee</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {product.stockMovements?.map((move) => (
              <tr key={move._id}>
                <td className="p-2 border">{move.type}</td>
                <td className="p-2 border">{move.quantity}</td>
                <td className="p-2 border">{move.reason}</td>
                <td className="p-2 border">{move.user?.name}</td>
                <td className="p-2 border">{new Date(move.date).toLocaleString('en-IN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
})}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal for new stock movement */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Add Stock Movement</h2>

            <div className="space-y-3">
              <select
                name="type"
                value={movementData.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="IN">IN</option>
                <option value="OUT">OUT</option>
              </select>

              <input
                type="number"
                name="quantity"
                value={movementData.quantity}
                onChange={handleInputChange}
                placeholder="Quantity"
                className="w-full p-2 border rounded"
              />

              <textarea
                name="reason"
                value={movementData.reason}
                onChange={handleInputChange}
                placeholder="Reason"
                className="w-full p-2 border rounded"
                rows="3"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStockSubmit}
                  disabled={mutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {mutation.isPending ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
   </Layout>
  );
};

export default ProductDetails;
