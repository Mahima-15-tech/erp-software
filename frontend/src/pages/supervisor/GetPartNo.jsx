


import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { server } from "../../constants/api";
import { useAuthStore } from "../../store/useAuthStore";
import SupervisorLayout from "../../layout/SupervisorLayout";
import AdminLayout from "../../layout/AdminLayout";
import { FiSearch, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const GetPartNo = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const navigate = useNavigate();

  const role = useAuthStore((state) => state.role);
  const isUserLoading = useAuthStore((state) => state.isUserLoading);
  const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;

  // Debounce typing (so server isn’t called on every keystroke instantly)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filter);
      setPage(1); // reset page on new search
    }, 400);
    return () => clearTimeout(handler);
  }, [filter]);

  // API fetcher
  const fetchParts = async () => {
    if (debouncedFilter) {
      const res = await axios.get(`${server}/supervisor-admin/partNo`, {
        params: { partNo: debouncedFilter },
        withCredentials: true,
      });
      return { partNos: res.data, totalDocuments: res.data.length, totalPages: 1 };
    } else {
      const res = await axios.get(`${server}/supervisor-admin/allPartNo`, {
        params: { page, limit },
        withCredentials: true,
      });
      return res.data;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["parts", page, limit, debouncedFilter],
    queryFn: fetchParts,
    keepPreviousData: true,
  });

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading user data...
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Part Numbers</h1>
          <button
            onClick={() => navigate("/superVisor-admin/AddpartNo")}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <FiPlus className="mr-2" /> Add Part No
          </button>
        </div>

        {/* Search Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search partNo..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">
              Error: {error.message}
            </div>
          ) : (
            <>
              <table className="min-w-full text-sm md:text-base">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Part No</th>
                     <th className="py-3 px-4 text-left">Part Details</th>
                    <th className="py-3 px-4 text-left">Schedule</th>
                    <th className="py-3 px-4 text-left">Inventory</th>
                    <th className="py-3 px-4 text-left">Operation</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.partNos?.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{item.partNo}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            navigate(`/superVisor-admin/getPartDetatils/${item._id}`)
                          }
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            navigate(`/superVisor-admin/partNoSchedule/${item._id}`)
                          }
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            navigate(`/superVisor-admin/partNoInventory/${item._id}`)
                          }
                          className="text-green-500 hover:text-green-700 cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            navigate(`/superVisor-admin/partNo/operation/${item._id}`)
                          }
                          className="text-purple-500 hover:text-purple-700 cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination only when no filter */}
              {!debouncedFilter && (
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-t">
                  <div>
                    Showing {data.partNos.length} of {data.totalDocuments} parts
                  </div>
                  <div className="flex space-x-2 items-center">
                    <button
                      onClick={() => setPage((old) => Math.max(old - 1, 1))}
                      disabled={page === 1}
                      className={`px-3 py-1 rounded ${
                        page === 1
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    >
                      Prev
                    </button>
                    <span className="px-3 py-1 bg-blue-500 text-white rounded">
                      Page {page}
                    </span>
                    <button
                      onClick={() =>
                        setPage((old) =>
                          data.partNos.length < limit ? old : old + 1
                        )
                      }
                      disabled={data.partNos.length < limit}
                      className={`px-3 py-1 rounded ${
                        data.partNos.length < limit
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Items:</span>
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                      className="border rounded px-2 py-1"
                    >
                      {[5, 10, 20, 50].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GetPartNo;
