



import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { server } from '../../constants/api';
import { FiPlus, FiSearch } from 'react-icons/fi';
import SupervisorLayout from '../../layout/SupervisorLayout';
import AdminLayout from '../../layout/AdminLayout';
import { useAuthStore } from '../../store/useAuthStore';
import CreateProduct from '../../components/CreateProduct';
import { useNavigate } from 'react-router-dom';

const Inventory = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [partFilter, setPartFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const role = useAuthStore((state) => state.role);
  const isUserLoading = useAuthStore((state) => state.isUserLoading);
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['inventory', page, limit, partFilter],
    queryFn: async () => {
      const response = await axios.get(`${server}/supervisor-admin/inventoryItem`, {
        params: { page, limit, partNo: partFilter || undefined },
        withCredentials: true
      });
      return response.data;
    },
    keepPreviousData: true
  });

  if (isUserLoading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading user data...</div>;
  }

  const Layout = role === 'SUPERVISOR' ? SupervisorLayout : AdminLayout;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Inventory Management</h1>

        {/* Filter + Add */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
          <form
            onSubmit={(e) => { e.preventDefault(); setPage(1); }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Filter by Part No"
                value={partFilter}
                onChange={(e) => setPartFilter(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Apply
            </button>
          </form>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <FiPlus className="mr-2" /> Add Item
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">Error: {error.message}</div>
          ) : (
            <>
              <table className="min-w-full text-sm md:text-base">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Part No</th>
                    <th className="py-3 px-4 text-left">Cutting</th>
                    <th className="py-3 px-4 text-left">Lathe</th>
                    <th className="py-3 px-4 text-left">CNC</th>
                    <th className="py-3 px-4 text-left">Finished</th>
                    <th className="py-3 px-4 text-left">Total Stock</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => {
                    const qtyMap = item.quantities.reduce((acc, q) => {
                      acc[q.type] = `${q.quantity} ${q.unit}`;
                      return acc;
                    }, {});
                    return (
                      <tr key={item._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{item.partNo?.partNo}</td>
                        <td className="py-3 px-4">{qtyMap.CUTTING || '-'}</td>
                        <td className="py-3 px-4">{qtyMap.LATHE || '-'}</td>
                        <td className="py-3 px-4">{qtyMap.CNC || '-'}</td>
                        <td className="py-3 px-4">{qtyMap.FINISHED || '-'}</td>
                        <td className="py-3 px-4 font-semibold">{item.totalStockInHand}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => navigate(`/superVisor-admin/partNoInventory/${item.partNo?._id}`)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t">
                <div>Showing {data.items.length} of {data.total} items</div>
                <div className="flex space-x-2 items-center">
                  <button
                    onClick={() => setPage((old) => Math.max(old - 1, 1))}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
                  >
                    Prev
                  </button>
                  <span className="px-3 py-1 bg-blue-500 text-white rounded">Page {page}</span>
                  <button
                    onClick={() => setPage((old) => (data.items.length < limit ? old : old + 1))}
                    disabled={data.items.length < limit}
                    className={`px-3 py-1 rounded ${data.items.length < limit ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
                  >
                    Next
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Items:</span>
                  <select
                    value={limit}
                    onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                    className="border rounded px-2 py-1"
                  >
                    {[5, 10, 20, 50].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-xl">
              <div className="p-6 relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
                >
                  &times;
                </button>
                <CreateProduct onClose={() => setShowCreateModal(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Inventory;
