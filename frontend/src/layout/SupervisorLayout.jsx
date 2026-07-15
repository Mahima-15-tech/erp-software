// layout/SupervisorLayout.jsx
import React, { useState } from 'react';
import SupervisorSidebar from '../components/supervisor/SupervisorSidebar';

const SupervisorLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = (forceState) => {
    setSidebarOpen(typeof forceState === 'boolean' ? forceState : !isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <SupervisorSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Topbar (Mobile only) */}
        <div className="lg:hidden bg-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <button onClick={toggleSidebar}>
            <span className="text-xl">&#9776;</span> {/* Hamburger */}
          </button>
          <span className="font-semibold">Supervisor Panel</span>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SupervisorLayout;
