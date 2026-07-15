// import React, { useState } from 'react';
// import axios from 'axios';
// import { FiClock, FiMapPin } from 'react-icons/fi';
// import { server } from '../constants/api';
// import toast from 'react-hot-toast';
// import Loader from '../components/Loader';
// import { useAuthStore } from '../store/useAuthStore';
// import SupervisorLayout from '../layout/SupervisorLayout';
// import AttendanceTable from '../components/AttendanceTable';
// import EmployeeLayout from '../layout/EmployeeLayout';
// const MarkAttendance = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [actionType, setActionType] = useState(null);
//   const [lastAction, setLastAction] = useState({
//     time: null,
//     location: null,
//     type: null
//   });

//     const role = useAuthStore((state) => state.role);

//   const getLocation = () => {
//     return new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error('Geolocation is not supported by your browser'));
//       }

//       navigator.geolocation.getCurrentPosition(
//         position => {
//           resolve({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           });
//         },
//         error => {
//           switch (error.code) {
//             case error.PERMISSION_DENIED:
//               reject(new Error('Location access denied. Please enable location services.'));
//               break;
//             case error.POSITION_UNAVAILABLE:
//               reject(new Error('Location information is unavailable.'));
//               break;
//             case error.TIMEOUT:
//               reject(new Error('The request to get location timed out.'));
//               break;
//             default:
//               reject(new Error('An unknown error occurred.'));
//           }
//         },
//         { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//       );
//     });
//   };

//   const markAttendance = async (type) => {
//     setIsLoading(true);
//     setActionType(type);
    
//     try {
//       // Get user's location
//       const location = await getLocation();
      
//       // Prepare payload based on action type
//       const payload = type === 'in' 
//         ? { inLocation: location } 
//         : { outLocation: location };
      
//       // Determine endpoint
//       const endpoint = type === 'in' 
//         ? `${server}/employee/mark-inTimeAttendance` 
//         : `${server}/employee/mark-outTimeAttendance`;
      
//       // Make API request
//       const response = await axios.post(endpoint, payload, { withCredentials: true });
      
//       // Update last action info
//       setLastAction({
//         time: new Date().toLocaleTimeString(),
//         location: location,
//         type: type
//       });
      
//       toast.success(response.data.message || 'Attendance marked successfully!');
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to mark attendance';
//       toast.error(errorMessage);
//       console.error('Error marking attendance:', error);
//     } finally {
//       setIsLoading(false);
//       setActionType(null);
//     }
//   };

//     const Layout = role === 'SUPERVISOR' ? SupervisorLayout : EmployeeLayout;

//   return (
//   <Layout>
//       <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center">
//           <FiClock className="mr-2" /> Mark Attendance
//         </h2>
//         <p className="text-gray-600 mt-2">
//           Record your in-time and out-time with location verification
//         </p>
//       </div>

//       <div className="grid grid-cols-2 gap-4 mb-8">
//         <button
//           onClick={() => markAttendance('in')}
//           disabled={isLoading}
//           className={`py-4 px-6 rounded-xl text-white font-medium transition-all flex flex-col items-center justify-center ${
//             isLoading && actionType === 'in'
//               ? 'bg-blue-400 cursor-not-allowed'
//               : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {isLoading && actionType === 'in' ? (
//             <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
//           ) : (
//             <>
//               <FiClock className="text-xl mb-1" />
//               <span>Mark In-Time</span>
//             </>
//           )}
//         </button>

//         <button
//           onClick={() => markAttendance('out')}
//           disabled={isLoading}
//           className={`py-4 px-6 rounded-xl text-white font-medium transition-all flex flex-col items-center justify-center ${
//             isLoading && actionType === 'out'
//               ? 'bg-red-400 cursor-not-allowed'
//               : 'bg-red-600 hover:bg-red-700'
//           }`}
//         >
//           {isLoading && actionType === 'out' ? (
//             <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
//           ) : (
//             <>
//               <FiClock className="text-xl mb-1" />
//               <span>Mark Out-Time</span>
//             </>
//           )}
//         </button>
//       </div>

//       {lastAction.time && (
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h3 className="font-medium text-gray-800 mb-2 flex items-center">
//             <FiMapPin className="mr-2" />
//             Last {lastAction.type === 'in' ? 'In-Time' : 'Out-Time'} Recorded
//           </h3>
//           <p className="text-sm text-gray-600">
//             <span className="font-medium">Time:</span> {lastAction.time}
//           </p>
//           <p className="text-sm text-gray-600">
//             <span className="font-medium">Location:</span> {lastAction.location?.lat?.toFixed(6)}, {lastAction.location?.lng?.toFixed(6)}
//           </p>
//         </div>
//       )}

//       <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//         <h3 className="font-medium text-yellow-800 mb-1">Important Notes:</h3>
//         <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-1">
//           <li>Ensure location services are enabled on your device</li>
//           <li>You must be within 20 meters of the office location</li>
//           <li>Mark in-time when arriving and out-time when leaving</li>
//           <li>Only one in-time and out-time can be recorded per day</li>
//         </ul>
//       </div>
      
//       {isLoading && <Loader />}
//     </div>
//   </Layout>
//   );
// };

// export default MarkAttendance;



import React, { useState } from 'react';
import axios from 'axios';
import { FiClock, FiMapPin, FiCalendar } from 'react-icons/fi';
import { server } from '../constants/api';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { useAuthStore } from '../store/useAuthStore';
import SupervisorLayout from '../layout/SupervisorLayout';
import AttendanceTable from '../components/AttendanceTable';
import EmployeeLayout from '../layout/EmployeeLayout';

const MarkAttendance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [lastAction, setLastAction] = useState({
    time: null,
    location: null,
    type: null
  });

  const role = useAuthStore((state) => state.role);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        error => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('Location access denied. Please enable location services.'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Location information is unavailable.'));
              break;
            case error.TIMEOUT:
              reject(new Error('The request to get location timed out.'));
              break;
            default:
              reject(new Error('An unknown error occurred.'));
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const markAttendance = async (type) => {
    setIsLoading(true);
    setActionType(type);
    
    try {
      // Get user's location
      const location = await getLocation();
      
      // Prepare payload based on action type
      const payload = type === 'in' 
        ? { inLocation: location } 
        : { outLocation: location };
      
      // Determine endpoint
      const endpoint = type === 'in' 
        ? `${server}/employee/mark-inTimeAttendance` 
        : `${server}/employee/mark-outTimeAttendance`;
      
      // Make API request
      const response = await axios.post(endpoint, payload, { withCredentials: true });
      
      // Update last action info
      setLastAction({
        time: new Date().toLocaleTimeString(),
        location: location,
        type: type
      });
      
      toast.success(response.data.message || 'Attendance marked successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to mark attendance';
      toast.error(errorMessage);
      console.error('Error marking attendance:', error);
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  const Layout = role === 'SUPERVISOR' ? SupervisorLayout : EmployeeLayout;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Attendance Marking Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center">
              <FiClock className="mr-2" /> Mark Attendance
            </h2>
            <p className="text-gray-600 mt-2">
              Record your in-time and out-time with location verification
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => markAttendance('in')}
              disabled={isLoading}
              className={`py-4 px-6 rounded-xl text-white font-medium transition-all flex flex-col items-center justify-center ${
                isLoading && actionType === 'in'
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading && actionType === 'in' ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <>
                  <FiClock className="text-xl mb-1" />
                  <span>Mark In-Time</span>
                </>
              )}
            </button>

            <button
              onClick={() => markAttendance('out')}
              disabled={isLoading}
              className={`py-4 px-6 rounded-xl text-white font-medium transition-all flex flex-col items-center justify-center ${
                isLoading && actionType === 'out'
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isLoading && actionType === 'out' ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <>
                  <FiClock className="text-xl mb-1" />
                  <span>Mark Out-Time</span>
                </>
              )}
            </button>
          </div>

          {lastAction.time && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                <FiMapPin className="mr-2" />
                Last {lastAction.type === 'in' ? 'In-Time' : 'Out-Time'} Recorded
              </h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Time:</span> {lastAction.time}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Location:</span> {lastAction.location?.lat?.toFixed(6)}, {lastAction.location?.lng?.toFixed(6)}
              </p>
            </div>
          )}

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-medium text-yellow-800 mb-1">Important Notes:</h3>
            <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-1">
              <li>Ensure location services are enabled on your device</li>
              <li>You must be within 20 meters of the office location</li>
              <li>Mark in-time when arriving and out-time when leaving</li>
              <li>Only one in-time and out-time can be recorded per day</li>
            </ul>
          </div>
          
          {isLoading && <Loader />}
        </div>

        {/* Attendance History Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FiCalendar className="mr-2" /> My Attendance Records
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              View your complete attendance history with in/out times
            </p>
          </div>
          <AttendanceTable />
        </div>
      </div>
    </Layout>
  );
};

export default MarkAttendance;