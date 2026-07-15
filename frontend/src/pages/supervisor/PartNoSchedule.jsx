import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import SupervisorLayout from "../../layout/SupervisorLayout";
import AdminLayout from "../../layout/AdminLayout";
import axios from "axios";
import { server } from "../../constants/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const PartNoSchedule = () => {
  const { id } = useParams();
  const role = useAuthStore((state) => state.role);
  const isUserLoading = useAuthStore((state) => state.isUserLoading);
  const navigate = useNavigate();

  const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(""); // YYYY-MM input
  const [error, setError] = useState("");

  // Fetch schedules
  const fetchSchedules = async (dateFilter = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${server}/supervisor-admin/partNoSchedule/${id}`,
        {
          params: dateFilter ? { scheduleDate: dateFilter } : {},
          withCredentials: true,
        }
      );

      setSchedules(response.data.schedules);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to load schedules");
      }
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load without scheduleDate
  useEffect(() => {
    fetchSchedules();
  }, [id]);

  // Handle filter
  const handleFilter = () => {
    if (!scheduleDate) {
      toast.error("Please select a month/year");
      return;
    }
    fetchSchedules(scheduleDate);
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Part No Schedules</h1>

        {/* Filter Section */}
        <div className="flex items-center gap-4 mb-6">
          <input
            type="month"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={handleFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Filter
          </button>
        </div>

        {/* Loading */}
        {loading && <p>Loading schedules...</p>}

        {/* Error */}
        {error && (
          <p className="text-red-500 font-medium bg-red-50 p-3 rounded">
            {error}
          </p>
        )}

        {/* Table */}
        {!loading && schedules.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Schedule Date</th>
                  <th className="border px-4 py-2">Part No</th>
                  <th className="border px-4 py-2">Schedule Qty</th>
                   <th className="border px-4 py-2">Dispatch Qty</th>
                  <th className="border px-4 py-2">Material Required</th>
                  <th className="border px-4 py-2">Stock In Hand</th>
                  <th className="border px-4 py-2">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) =>
                  schedule.parts.map((p) => (
                    <tr key={p._id}>
                      <td className="border px-4 py-2">
                        {new Date(schedule.scheduleDate).toLocaleDateString(
                          "en-GB",
                          { year: "numeric", month: "long" }
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {p.partNo?.partNo || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {p.scheduleQuantity}
                      </td>
                       <td className="border px-4 py-2">
                        {p.disPatchQuantity}
                      </td>
                      <td className="border px-4 py-2">{p.materialRequired}</td>
                      <td className="border px-4 py-2">{p.stockInHand}</td>
                      <td className="border px-4 py-2">{p.totalCost}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PartNoSchedule;
