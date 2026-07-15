import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { server } from '../../constants/api';
import SupervisorLayout from '../../layout/SupervisorLayout';
import toast from 'react-hot-toast';

// API function to fetch data
const fetchDashboardStats = async () => {
  const res = await axios.get(`${server}/supervisor-admin/supervisor-dashboard-Data`, {
    withCredentials: true,
  });
  return res.data;
};

const SupervisorDashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['supervisor-dashboard'],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) {
    return (
      <SupervisorLayout>
        <div className="p-6">Loading dashboard data...</div>
      </SupervisorLayout>
    );
  }

  if (isError) {
    toast.error('Failed to load dashboard data');
    return (
      <SupervisorLayout>
        <div className="p-6 text-red-500">Something went wrong. Please try again later.</div>
      </SupervisorLayout>
    );
  }

  const {
    InventoryCount,
    ProductionCount,
    EmployeeCount,
    presentToday,
    absentToday,
  } = data;

  return (
    <SupervisorLayout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Supervisor Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <DashboardCard title="Inventory Items" value={InventoryCount} />
          <DashboardCard title="Production Orders" value={ProductionCount} />
          <DashboardCard title="Total Employees" value={EmployeeCount} />
          <DashboardCard title="Present Today" value={presentToday} />
          <DashboardCard title="Absent Today" value={absentToday} />
        </div>
      </div>
    </SupervisorLayout>
  );
};

// Small card component
const DashboardCard = ({ title, value }) => (
  <div className="bg-white shadow rounded p-5 text-center border border-gray-200">
    <h2 className="text-lg font-medium text-gray-600">{title}</h2>
    <p className="text-3xl font-bold text-blue-700 mt-2">{value}</p>
  </div>
);

export default SupervisorDashboard;
