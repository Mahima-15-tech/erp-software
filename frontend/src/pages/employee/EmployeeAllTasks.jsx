import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { server } from "../../constants/api";
import { useAuthStore } from "../../store/useAuthStore";
import EmployeeLayout from "../../layout/EmployeeLayout";

const EmployeeAllTasks = () => {
  const role = useAuthStore((state) => state.role);


  const [selectedDate, setSelectedDate] = useState("");

  const fetchTasks = async () => {
    if (!selectedDate) return [];
    const { data } = await axios.post(
      `${server}/employee/all-my-tasks`,
      { date: selectedDate },
      { withCredentials: true }
    );
    return data;
  };

  const { data, refetch, isLoading, isError, error } = useQuery({
    queryKey: ["myTasks", selectedDate],
    queryFn: fetchTasks,
    enabled: !!selectedDate, // only fetch when a date is selected
  });

  return (
    <EmployeeLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Assigned Tasks</h1>

        {/* Date Picker */}
        <div className="mb-6 flex gap-4 items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search Tasks
          </button>
        </div>

        {isLoading && <p>Loading tasks...</p>}
        {isError && <p className="text-red-500">Error: {error.message}</p>}

        {data?.tasks?.length === 0 ? (
          <p>No tasks assigned for this date.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.tasks?.map((task) => (
              <div key={task._id} className="bg-white p-4 rounded shadow">
                <p>
                  <strong>Part No:</strong> {task.partNo?.partNo}
                </p>
                <p>
                  <strong>Description:</strong> {task.description}
                </p>
                <p>
                  <strong>Machine:</strong> {task.machineName}
                </p>
                <p>
                  <strong>Shift:</strong> {task.shift}
                </p>
                <p>
                  <strong>Target:</strong> {task.target}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {task.status === "COMPLETED" ? (
                    <span className="text-green-600 font-semibold">
                      Completed
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      In Progress
                    </span>
                  )}
                </p>
                <p>
                  <strong>Completion Quantity:</strong>{" "}
                  {task.completionQuantity ?? "-"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeAllTasks;
