


import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../constants/api";
import EmployeeLayout from "../../layout/EmployeeLayout";

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [progress, setProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${server}/employee/get-detail`, {
        withCredentials: true,
      });
      setData(res.data);
    } catch (err) {
      setError("Failed to fetch details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      setProgressLoading(true);
      const res = await axios.get(`${server}/employee/my-task-Progress`, {
        params: { startDate, endDate },
        withCredentials: true,
      });
      setProgress(res.data);
    } catch (err) {
      console.error("Progress fetch error:", err);
      setProgress(null);
    } finally {
      setProgressLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading)
    return (
      <EmployeeLayout>
        <p className="p-6">Loading...</p>
      </EmployeeLayout>
    );
  if (error)
    return (
      <EmployeeLayout>
        <p className="p-6 text-red-600">{error}</p>
      </EmployeeLayout>
    );

  const { myDetails, myAttendanceStatus } = data;

  return (
    <EmployeeLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded shadow">
        <h1 className="text-xl md:text-2xl font-bold mb-6">
          Welcome, {myDetails.name}
        </h1>

        {/* ✅ Profile Section with Photo on Right */}
        <section className="mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Profile Info */}
          <div className="flex-1 text-sm md:text-base">
            <h2 className="text-lg md:text-xl font-semibold mb-3">
              Profile Details
            </h2>
            <ul className="text-gray-700 space-y-1">
             
              <li>
                <strong>Phone:</strong> {myDetails.phone}
              </li>
              <li>
                <strong>Role:</strong> {myDetails.role}
              </li>
              <li>
                <strong>Status:</strong>{" "}
                {myDetails.isActive ? "Active" : "Inactive"}
              </li>
              <li>
                <strong>Joined:</strong>{" "}
                {new Date(myDetails.createdAt).toLocaleDateString("en-Gb",{
                  day:"2-digit",
                  month:"2-digit",
                  year:"2-digit"
                })}
              </li>
            </ul>
          </div>

          {/* Profile Photo */}
          {myDetails.photoUrl && (
            <div className="w-28 h-28 md:w-40 md:h-40 flex-shrink-0">
              <img
                src={myDetails.photoUrl}
                alt={myDetails.name}
                className="w-full h-full object-cover rounded-full border shadow-md"
              />
            </div>
          )}
        </section>

        {/* ✅ Attendance Section */}
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3">
            Attendance Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            <div className="p-4 bg-green-100 rounded">
              <p className="text-2xl md:text-3xl font-bold">
                {myAttendanceStatus.presentDays}
              </p>
              <p className="text-xs md:text-sm font-medium">Present Days</p>
            </div>
            <div className="p-4 bg-red-100 rounded">
              <p className="text-2xl md:text-3xl font-bold">
                {myAttendanceStatus.absentDays}
              </p>
              <p className="text-xs md:text-sm font-medium">Absent Days</p>
            </div>
            <div className="p-4 bg-yellow-100 rounded">
              <p className="text-2xl md:text-3xl font-bold">
                {myAttendanceStatus.leaveDays}
              </p>
              <p className="text-xs md:text-sm font-medium">Leave Days</p>
            </div>
            <div className="p-4 bg-blue-100 rounded">
              <p className="text-2xl md:text-3xl font-bold">
                {myAttendanceStatus.halfDays}
              </p>
              <p className="text-xs md:text-sm font-medium">Half Days</p>
            </div>
            <div className="p-4 bg-gray-200 rounded">
              <p className="text-2xl md:text-3xl font-bold">
                {myAttendanceStatus.totalDays}
              </p>
              <p className="text-xs md:text-sm font-medium">Total Days</p>
            </div>
          </div>
        </section>

        {/* ✅ Task Progress Section */}
        <section>
          <h2 className="text-lg md:text-xl font-semibold mb-3">
            Task Progress
          </h2>

          {/* Date Pickers */}
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded p-2 text-sm"
              />
            </div>
            <button
              onClick={fetchProgress}
              className="self-end px-4 py-2 bg-blue-600 text-white rounded"
            >
              Load Progress
            </button>
          </div>

          {/* Progress Bar */}
          {progressLoading && <p>Loading progress...</p>}
          {progress && (
            <div>
              <div className="mb-3">
                <p className="font-medium">
                  Overall Progress:{" "}
                  {progress.totals.overallPercent !== null
                    ? `${progress.totals.overallPercent}%`
                    : "N/A"}
                </p>
                <div className="w-full bg-gray-200 rounded h-4">
                  <div
                    className="bg-green-500 h-4 rounded"
                    style={{
                      width: `${progress.totals.overallPercent || 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Task List */}
              <div className="mt-4 space-y-3">
                {progress.tasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-3 border rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">
                        {task.partNo?.partNo || "No Part"} (
                        {task.machineName || "Machine"})
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(task.date).toLocaleDateString("en-Gb",{
                          day:"2-digit",
                          month:"2-digit",
                          year:"2-digit"
                        })} | Target:{" "}
                        {task.target} | Done: {task.completionQuantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {task.percentComplete !== null
                        ? `${task.percentComplete}%`
                        : "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
