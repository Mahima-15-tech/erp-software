import React from 'react';
import AdminLayout from '../../layout/AdminLayout';
import axios from 'axios';
import { server } from '../../constants/api';
import { useQuery } from '@tanstack/react-query';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const fetchDashboardData = async () => {
  try {
    const response = await axios.get(`${server}/admin/dashboard-data`, {
      withCredentials: true,
    });
    return response.data; // ✅ Axios keeps data in `response.data`
  } catch (error) {
    throw new Error('Failed to fetch dashboard data');
  }
};

const AdminDashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  if (isLoading) return (
    <AdminLayout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </AdminLayout>
  );

  if (isError) return (
    <AdminLayout>
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong>Error: </strong> {error.message}
      </div>
    </AdminLayout>
  );

  // Monthly Production Chart
  const productionChartData = {
    labels: data.charts.monthlyProduction.map(item => `Month ${item.month}`),
    datasets: [
      {
        label: 'Output',
        data: data.charts.monthlyProduction.map(item => item.output),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Loss',
        data: data.charts.monthlyProduction.map(item => item.loss),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Inventory Distribution Chart
  const inventoryChartData = {
    labels: data.charts.inventoryCategories.map(item => item.category),
    datasets: [
      {
        data: data.charts.inventoryCategories.map(item => item.quantity),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      }
    ]
  };

  // Loss Reasons Chart
  const lossChartData = {
    labels: data.summary.losses.reasons.map(item => item._id),
    datasets: [
      {
        label: 'Loss Quantity',
        data: data.summary.losses.reasons.map(item => item.totalLoss),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Attendance Chart
  const attendanceChartData = {
    labels: data.charts.attendance.map(item => item.status),
    datasets: [
      {
        data: data.charts.attendance.map(item => item.count),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // PRESENT
          'rgba(255, 205, 86, 0.6)',  // HALF DAY
          'rgba(255, 99, 132, 0.6)',  // ABSENT
          'rgba(153, 102, 255, 0.6)', // LEAVE
        ],
        borderWidth: 1,
      }
    ]
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard 
            title="Inventory" 
            value={data.summary.inventory.totalItems}
            subValue={`${data.summary.inventory.lowStockCount} low stock`}
            icon="📦"
          />
          
          <SummaryCard 
            title="Employees" 
            value={data.summary.employees.total}
            subValue={`${data.summary.employees.supervisors} supervisors`}
            icon="👥"
          />
          
          <SummaryCard 
            title="Production" 
            value={data.summary.production.completed}
            subValue={`${data.summary.production.inProgress} in progress`}
            icon="🏭"
          />
          
          <SummaryCard 
            title="Production Loss" 
            value={data.summary.losses.total}
            subValue={`${data.summary.losses.reasons.length} reasons`}
            icon="📉"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Monthly Production">
            <Bar 
              data={productionChartData} 
              options={{
                responsive: true,
                scales: {
                  y: { beginAtZero: true }
                }
              }} 
            />
          </ChartCard>
          
          <ChartCard title="Inventory Distribution">
            <Pie data={inventoryChartData} />
          </ChartCard>
          
          <ChartCard title="Top Loss Reasons">
            <Bar 
              data={lossChartData} 
              options={{
                indexAxis: 'y',
                responsive: true,
                scales: {
                  x: { beginAtZero: true }
                }
              }} 
            />
          </ChartCard>
          
          <ChartCard title="Attendance Status">
            <Pie data={attendanceChartData} />
          </ChartCard>
        </div>

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Low Stock Alerts</h2>
          {data.alerts.lowStock.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ProductID</th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum Required</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deficit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.alerts.lowStock.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.productId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.minStock}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">{item.deficit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No low stock items. Everything looks good!</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// Reusable Summary Card Component
const SummaryCard = ({ title, value, subValue, icon }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center">
    <div className="text-3xl mr-4">{icon}</div>
    <div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subValue}</p>
    </div>
  </div>
);

// Reusable Chart Card Component
const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="h-72">{children}</div>
  </div>
);

export default AdminDashboard;