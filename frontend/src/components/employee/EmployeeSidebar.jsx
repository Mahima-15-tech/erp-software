// components/supervisor/SupervisorSidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiLayout, FiClock, FiUsers, FiPackage, FiUserPlus, FiSettings, FiList,FiLogOut
} from 'react-icons/fi';

import { useAuthStore } from '../../store/useAuthStore'; // adjust path if needed
import axios from 'axios';
import { server } from '../../constants/api';
import toast from 'react-hot-toast';

  const menuItems = [
    { name: 'Dashboard', icon: <FiLayout className="text-xl" />, to: '/employee/dashboard' },
    { name: 'Attendance', icon: <FiUsers className="text-xl" />, to: '/employee/attendance' },
    { name: 'Task', icon: <FiList className="text-xl" />, to: '/employee/task' },
    {name:'All Task',icon:<FiList className='text-xl' />, to:"/employee/allTasks"},
   
  ];


const EmployeeSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
     const logoutStore = useAuthStore(state => state.logout);
    const navigate = useNavigate()

    const handleLogout = async () => {
      try {
       // console.log(server)
     const response =   await axios.post(`${server}/logout`,{}, { withCredentials: true });
     toast.success(response.data.message)
        logoutStore(); // clear from zustand
        navigate('/'); // redirect to login page
      } catch (error) {
        console.error('Logout failed:', error);
        toast.error("Failed to logout")
      }
    };

  return (
    <div
      className={`fixed lg:static top-0 left-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-200 z-50
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 font-bold text-xl border-b border-gray-700">Employee Panel</div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-700 ${
                location.pathname === item.to ? 'bg-gray-800' : ''
              }`}
              onClick={() => toggleSidebar(false)} // hide on mobile click
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
           <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-red-600 mt-4 bg-red-500 text-white"
                    >
                      <FiLogOut className="text-xl" />
                      <span>Logout</span>
                    </button>
        </nav>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
