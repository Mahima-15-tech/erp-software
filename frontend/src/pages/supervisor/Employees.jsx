import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { server } from '../../constants/api';
import { useAuthStore } from '../../store/useAuthStore';
import SupervisorLayout from '../../layout/SupervisorLayout';
import AdminLayout from '../../layout/AdminLayout';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Employees = () => {
  const role = useAuthStore((state) => state.role);
  const isUserLoading = useAuthStore((state) => state.isUserLoading);
  const Layout = role === 'SUPERVISOR' ? SupervisorLayout : AdminLayout;

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchEmployees = async () => {
    const res = await axios.get(`${server}/supervisor-admin/employee`, {
      params: { page, name: search },
      withCredentials: true
    });
    return res.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['employees', page, search],
    queryFn: fetchEmployees,
    keepPreviousData: true
  });

  const handleSearch = () => {
    setPage(1); // reset to page 1 when searching
    setSearch(searchInput.trim());
  };

  if (isUserLoading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Employees</h1>

        

        {/* Search */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by name"
            className="border px-3 py-2 rounded w-64"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center text-gray-600 py-10">Loading employees...</div>
        ) : isError ? (
          <div className="text-center text-red-600 py-10">Failed to load employees</div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white shadow rounded">
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Phone</th>
                    <th className="border p-2">Role</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">View Details</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.employees?.map((emp) => (
                    <tr key={emp._id}>
                      <td className="border p-2">{emp.name}</td>
                      <td className="border p-2">{emp.phone}</td>
                      <td className="border p-2">{emp.role}</td>
                      <td className="border p-2">
                        {emp.isActive ? (
                          <span className="text-green-600 font-semibold">Active</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Inactive</span>
                        )}
                      </td>
                      <td className="border p-2">
                          <button onClick={()=>{navigate(`/superVisor-admin/employee-detail/${emp._id}`)}} className="text-blue-500 hover:text-blue-700">View details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm">
                Page {data.page} of {data.totalPages}
              </span>
              <div className="space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Employees;
