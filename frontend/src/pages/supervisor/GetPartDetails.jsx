


// // src/pages/supervisor-admin/GetPartDetails.jsx
// import React, { useEffect, useState } from "react";
// import { useAuthStore } from "../../store/useAuthStore";
// import SupervisorLayout from "../../layout/SupervisorLayout";
// import AdminLayout from "../../layout/AdminLayout";
// import axios from "axios";
// import { server } from "../../constants/api";
// import { useNavigate, useParams } from "react-router-dom";
// import toast from "react-hot-toast";

// const GetPartDetails = () => {
//   const { id } = useParams(); // get id from url
//   const role = useAuthStore((state) => state.role);
//   const isUserLoading = useAuthStore((state) => state.isUserLoading);
//   const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;
//   const navigate = useNavigate();

//   const [part, setPart] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `${server}/supervisor-admin/part-detail/${id}`,
//           { withCredentials: true }
//         );
//         setPart(response?.data?.part); // assuming backend sends single part object
//       } catch (error) {
//         toast.error(error.response?.data?.message || "Failed to fetch details");
//         navigate(-1); // go back if error
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id, navigate]);

//   if (loading) {
//     return (
//       <Layout>
//         <div className="p-6 text-center">Loading part details...</div>
//       </Layout>
//     );
//   }

//   if (!part) {
//     return (
//       <Layout>
//         <div className="p-6 text-center text-red-500">Part not found</div>
//       </Layout>
//     );
//   }

//   const handleEdit = () => {
//     navigate(`/supervisor-admin/updatePartNoDetail/${part._id}`, { state: { part } });
//   };

//   return (
//     <Layout>
//       <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">Part Details</h2>
//           <button
//             onClick={handleEdit}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Edit
//           </button>
//         </div>

//         <div className="space-y-3">
//           <p>
//             <strong>Part No:</strong> {part.partNo}
//           </p>
//           <p>
//             <strong>OD:</strong> {part.od}
//           </p>
//           <p>
//             <strong>ID:</strong> {part.id}
//           </p>
//           <p>
//             <strong>Length:</strong> {part.length || "N/A"}
//           </p>
//           <p>
//             <strong>CNC cycle Time:</strong> {part.cncCycleTime || "N/A"}
//           </p>
//            <p>
//             <strong>LATHE cycle Time:</strong> {part.latheCycleTime || "N/A"}
//           </p>
//           <p>
//             <strong>CNC Setup Required:</strong> {part.cncSetupRequired}
//           </p>
//           <p>
//             <strong>Raw Material Type:</strong> {part.rawMaterialType}
//           </p>
//           <p>
//             <strong>RM Rate:</strong> {part.rmRate}
//           </p>

//           {part.drawingFileUrl && (
//             <div>
//               <strong>Drawing File:</strong>{" "}
//               <a
//                 href={part.drawingFileUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 underline"
//               >
//                 View Drawing
//               </a>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default GetPartDetails;


// src/pages/supervisor-admin/GetPartDetails.jsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import SupervisorLayout from "../../layout/SupervisorLayout";
import AdminLayout from "../../layout/AdminLayout";
import axios from "axios";
import { server } from "../../constants/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const GetPartDetails = () => {
  const { id } = useParams(); // get id from url
  const role = useAuthStore((state) => state.role);
  const isUserLoading = useAuthStore((state) => state.isUserLoading);
  const Layout = role === "SUPERVISOR" ? SupervisorLayout : AdminLayout;
  const navigate = useNavigate();

  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${server}/supervisor-admin/part-detail/${id}`,
          { withCredentials: true }
        );
        setPart(response?.data?.part); // assuming backend sends single part object
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch details");
        navigate(-1); // go back if error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-center">Loading part details...</div>
      </Layout>
    );
  }

  if (!part) {
    return (
      <Layout>
        <div className="p-6 text-center text-red-500">Part not found</div>
      </Layout>
    );
  }

  const handleEdit = () => {
    navigate(`/supervisor-admin/updatePartNoDetail/${part._id}`, {
      state: { part },
    });
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete Part No: ${part.partNo}?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${server}/supervisor-admin/partNo-delete/${part._id}`, {
        withCredentials: true,
      });
      toast.success("Part deleted successfully");
      navigate(-1); // go back after delete
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete part");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Part Details</h2>
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p>
            <strong>Part No:</strong> {part.partNo}
          </p>
          <p>
            <strong>OD:</strong> {part.od}
          </p>
          <p>
            <strong>ID:</strong> {part.id}
          </p>
          <p>
            <strong>Length:</strong> {part.length || "N/A"}
          </p>
          <p>
            <strong>CNC cycle Time:</strong> {part.cncCycleTime || "N/A"}
          </p>
          <p>
            <strong>LATHE cycle Time:</strong> {part.latheCycleTime || "N/A"}
          </p>
          <p>
            <strong>CNC Setup Required:</strong> {part.cncSetupRequired}
          </p>
          <p>
            <strong>Raw Material Type:</strong> {part.rawMaterialType}
          </p>

           <p>
            <strong>Gross Weight:</strong> {part.grossWeight ||0} 
          </p>
          <p>
            <strong>RM Rate:</strong> {part.rmRate}
          </p>

          {part.drawingFileUrl && (
            <div>
              <strong>Drawing File:</strong>{" "}
              <a
                href={part.drawingFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Drawing
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GetPartDetails;

