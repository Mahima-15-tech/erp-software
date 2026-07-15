import React, { useState } from "react";
import axios from "axios";
import { server } from "../../constants/api";
import SupervisorLayout from '../../layout/SupervisorLayout';
import AdminLayout from '../../layout/AdminLayout';
import { useAuthStore } from '../../store/useAuthStore';

const ScheduleForm = () => {
  const [scheduleDate, setScheduleDate] = useState("");
  const [parts, setParts] = useState([{ partNo: "", scheduleQuantity: "" }]);

   const role = useAuthStore((state) => state.role);
    const isUserLoading = useAuthStore((state) => state.isUserLoading);
  

  const handlePartChange = (index, field, value) => {
    const updatedParts = [...parts];
    updatedParts[index][field] = value;
    setParts(updatedParts);
  };

  const addPart = () => {
    setParts([...parts, { partNo: "", scheduleQuantity: "" }]);
  };

  const removePart = (index) => {
    const updatedParts = [...parts];
    updatedParts.splice(index, 1);
    setParts(updatedParts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { scheduleDate, parts };
    try {
      const res = await axios.post(
        `${server}/supervisor-admin/create-schedule`,
        payload,
        { withCredentials: true }
      );
      alert(res?.data?.message);
      console.log("Schedule Created:", res.data);
    } catch (err) {
      alert(err?.response?.data?.message);
      console.error(err.response?.data || err.message);
    }
  };

    if (isUserLoading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading user data...</div>;
  }

  const Layout = role === 'SUPERVISOR' ? SupervisorLayout : AdminLayout;

  return (
   <Layout>
     <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create Monthly Schedule
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Schedule Date */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">
  Schedule Month
</label>
<input
  type="month"   // 👈 only month & year picker
  value={scheduleDate}
  onChange={(e) => setScheduleDate(e.target.value)}
  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  required
/>
        </div>

        {/* Parts Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Parts</h3>
          {parts.map((part, index) => (
            <div
              key={index}
              className="flex gap-3 items-center mb-3 p-3 border rounded-lg bg-gray-50"
            >
              <input
                type="text"
                placeholder="Part No (ObjectId)"
                value={part.partNo}
                onChange={(e) =>
                  handlePartChange(index, "partNo", e.target.value)
                }
                className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Schedule Quantity"
                value={part.scheduleQuantity}
                onChange={(e) =>
                  handlePartChange(index, "scheduleQuantity", e.target.value)
                }
                className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              {/* Remove Button */}
              {parts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePart(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addPart}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Part
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 rounded-lg shadow-md"
        >
          Create Schedule
        </button>
      </form>
    </div>
   </Layout>
  );
};

export default ScheduleForm;
