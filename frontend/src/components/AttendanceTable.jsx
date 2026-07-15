import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { server } from '../constants/api';
import { FiCalendar, FiClock, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAuthStore } from '../store/useAuthStore';

const AttendanceTable = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all'); // 'all', 'week', 'month'
  const limit = 7;
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['attendance', page, filter],
    queryFn: async () => {
      const response = await axios.get(`${server}/employee/my-attendance`, {
        params: { page, limit, filter },
        withCredentials: true
      });
      return response.data;
    },
    keepPreviousData: true
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when filter changes
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-IN', {
       
  // day: '2-digit',
  // month: '2-digit',
  // year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      PRESENT: 'bg-green-100 text-green-800',
      ABSENT: 'bg-red-100 text-red-800',
      LEAVE: 'bg-blue-100 text-blue-800',
      'HALF DAY': 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (isError) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong>Error: </strong> {error.message}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 border-b">
        <SummaryCard 
          title="Total Days" 
          value={data.myAttendanceStatus.totalDays} 
          icon={<FiCalendar className="text-blue-500" />}
        />
        <SummaryCard 
          title="Present" 
          value={data.myAttendanceStatus.presentDays} 
          icon={<FiCalendar className="text-green-500" />}
        />
        <SummaryCard 
          title="Absent" 
          value={data.myAttendanceStatus.absentDays} 
          icon={<FiCalendar className="text-red-500" />}
        />
        <SummaryCard 
          title="Leave/Half" 
          value={data.myAttendanceStatus.leaveDays + data.myAttendanceStatus.halfDays} 
          icon={<FiCalendar className="text-yellow-500" />}
        />
      </div>

      {/* Filter Controls */}
      <div className="p-4 flex flex-wrap items-center justify-between border-b">
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
          <FiFilter className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex space-x-1">
            {['all', 'week', 'month'].map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`px-3 py-1 text-sm rounded-full capitalize ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          Showing {Math.min(limit, data.myAttendance.length)} of {data.totalRecords} records
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                In Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Out Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Working Hours
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.myAttendance.map((record) => (
              <tr key={record._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString([], { weekday: 'short' })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiClock className="mr-1 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {formatTime(record.inTime)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiClock className="mr-1 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {formatTime(record.outTime)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(record.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.totalHours ? `${record.totalHours.toFixed(2)} hrs` : '-'}
                </td>
              </tr>
            ))}
            
            {data.myAttendance.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No attendance records found for this period
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= data.totalPages}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              page >= data.totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
        
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{page}</span> of{' '}
              <span className="font-medium">{data.totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  page === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Previous</span>
                <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              
              {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                let pageNum;
                if (data.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page > data.totalPages - 3) {
                  pageNum = data.totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === pageNum
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  page >= data.totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Next</span>
                <FiChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Summary Card Component
const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 flex items-center border border-gray-100">
    <div className="mr-3 p-2 bg-gray-100 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default AttendanceTable;