

import React, { useState } from "react";
import axios from "axios";
import { server } from "../../constants/api";
import SupervisorLayout from "../../layout/SupervisorLayout";
import AdminLayout from "../../layout/AdminLayout";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Schedules = () => {
  const [schedule, setSchedule] = useState(null);
  const [monthYear, setMonthYear] = useState("");
  const [loading, setLoading] = useState(false);

  const role = useAuthStore((state) => state.role);
  const isUserLoading = useAuthStore((state) => state.isUserLoading);
  const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!monthYear) return alert("Please select month and year");
    try {
      setLoading(true);
      const res = await axios.post(
        `${server}/supervisor-admin/get-schedule`,
        { date: monthYear },
        { withCredentials: true }
      );
      setSchedule(res.data.schedule);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      alert(error.response?.data?.message || "Error fetching schedule");
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading user data...
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Input Controls */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            type="month"
            value={monthYear}
            onChange={(e) => setMonthYear(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Loading..." : "Fetch Schedule"}
          </button>
          <button
            onClick={() => navigate("/superVisor-admin/scheduleForm")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Create New Schedule
          </button>
        </div>

        {schedule && (
          <>
            {/* Heading */}
            <h2 className="text-2xl font-semibold mb-4">
              Schedule for{" "}
              {new Date(schedule.scheduleDate).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>

            {/* Table for parts */}
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse border border-gray-300 w-full text-center">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Part No</th>
                    <th className="border p-2">OD × ID × L</th>
                    <th className="border p-2">Schedule Qty</th>
                    <th className="border p-2">Gross Wt</th>
                    <th className="border p-2">Material Required</th>
                    <th className="border p-2">Stock in Hand</th>
                    <th className="border p-2">Total Material Required</th>
                    <th className="border p-2">Dispatch Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.parts.map((p) => (
                    <tr key={p._id}>
                      <td className="border p-2">{p.partNo.partNo}</td>
                      <td className="border p-2">
                        {p.partNo.od} × {p.partNo.id} × {p.partNo.length}
                      </td>
                      <td className="border p-2">{p.scheduleQuantity}</td>
                      <td className="border p-2">{p.partNo.grossWeight}</td>
                      <td className="border p-2">{p.materialRequired}</td>
                      <td className="border p-2">{p.stockInHand.toFixed(2)}</td>
                      <td className="border p-2">{p.totalMaterialRequired.toFixed(2)}</td>
                      <td className="border p-2">{p.disPatchQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-100 p-4 rounded shadow">
                <p className="text-sm text-gray-600">Pipe in Inventory</p>
                <p className="text-lg font-bold">
                  {schedule.totalPipeWeightinInventory} kg
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded shadow">
                <p className="text-sm text-gray-600">RoundBar in Inventory</p>
                <p className="text-lg font-bold">
                  {schedule.totalRoundBarWeightinInventory} kg
                </p>
              </div>
              <div className="bg-red-100 p-4 rounded shadow">
                <p className="text-sm text-gray-600">Pipe Requirement</p>
                <p className="text-lg font-bold">
                  {schedule.totalPipeWeightRequirement.toFixed(2)} kg
                </p>
              </div>
              <div className="bg-yellow-100 p-4 rounded shadow">
                <p className="text-sm text-gray-600">RoundBar Requirement</p>
                <p className="text-lg font-bold">
                  {schedule.totalRoundBarWeightRequirement.toFixed(2)} kg
                </p>
              </div>

              {/* New Actual Requirement Cards */}
              <div className="bg-purple-100 p-4 rounded shadow">
                <p className="text-sm text-gray-600">Actual Pipe Requirement</p>
                <p className="text-lg font-bold">
                  {schedule.totalPipeWeightRequirement -
                    schedule.totalPipeWeightinInventory.toFixed(2)}{" "}
                  kg
                </p>
              </div>
              <div className="bg-pink-100 p-4 rounded shadow">
                <p className="text-sm text-gray-600">
                  Actual RoundBar Requirement
                </p>
                <p className="text-lg font-bold">
                  {schedule.totalRoundBarWeightRequirement -
                    schedule.totalRoundBarWeightinInventory.toFixed(2)}{" "}
                  kg
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Schedules;

