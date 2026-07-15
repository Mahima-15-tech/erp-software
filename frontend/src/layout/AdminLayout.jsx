// import React, { useState } from 'react';
// import { FaBars } from 'react-icons/fa';
// import AdminSidebar from '../components/admin/AdminSidebar';

// const AdminLayout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       {/* Sidebar */}
//       <div className="hidden md:block w-64 flex-shrink-0">
//         <AdminSidebar />
//       </div>

//       {/* Mobile Sidebar Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//           onClick={toggleSidebar}
//         />
//       )}

//       {/* Mobile Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 md:hidden ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         <AdminSidebar />
//       </div>

//       {/* Content Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Mobile Header */}
//         <div className="md:hidden bg-white shadow px-4 py-3 flex items-center justify-between">
//           <h1 className="text-xl font-semibold text-blue-800">Admin Panel</h1>
//           <button onClick={toggleSidebar}>
//             <FaBars className="text-2xl text-blue-800" />
//           </button>
//         </div>

//         {/* Main Content */}
//         <main className="flex-1 p-4 overflow-y-auto">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;



// layout/SupervisorLayout.jsx
import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = (forceState) => {
    setSidebarOpen(typeof forceState === 'boolean' ? forceState : !isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Topbar (Mobile only) */}
        <div className="lg:hidden bg-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <button onClick={toggleSidebar}>
            <span className="text-xl">&#9776;</span> {/* Hamburger */}
          </button>
          <span className="font-semibold">Admin Panel</span>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
