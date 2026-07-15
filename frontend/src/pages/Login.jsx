
import React, { useState } from 'react';
import axios from 'axios';
import { server } from '../constants/api';
import { FiUser, FiKey, FiMail, FiPhone, FiLock, FiArrowLeft, FiShield,FiEye, FiEyeOff } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Login = () => {
  const [role, setRole] = useState(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY;
  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    if (adminKey !== ADMIN_KEY) {
      toast.error('Invalid Admin Key. Access Denied!');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${server}/admin/send-otp`, { email: adminEmail }, { withCredentials: true });
      setShowOtp(true);
      toast.success('OTP sent to your email');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${server}/admin/login`,
        { email: adminEmail, otp, adminKey },
        { withCredentials: true }
      );
      toast.success('Admin login successful!');
      login('ADMIN', res.data.token); 
      navigate("/admin/dashboard")
    } catch (error) {
      console.error('OTP Verification Failed:', error);
      toast.error(error.response?.data?.message || 'Invalid OTP or Admin Key');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeLogin = async () => {
    if (!phone || !password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${server}/employee/login`, { phone, password }, { withCredentials: true });
      toast.success('Employee login successful!');

      if (res.data.role === "SUPERVISOR") {
        login(res.data.role, res.data.token);
        navigate("/supervisor/dashboard");
      } else {
        login(res.data.role, res.data.token);
        navigate("/employee/dashboard");
      }
    } catch (error) {
      console.error('Employee Login Error:', error);
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setShowOtp(false);
    setOtp('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      {loading && <Loader />}

      <div className="bg-[#C0C0C0] shadow-xl rounded-xl p-6 w-full max-w-md">

        {/* BRAND LOGO */}
        <div className="text-center mb-8">
          <img
            src="/logo11.png"
            alt="VR Logo"
            className="mx-auto w-24 h-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back ERP</h2>
          <p className="text-gray-500">Please login to continue</p>
        </div>

        {/* Role Switch Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => {
              setRole('admin');
              setShowOtp(false);
            }}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              role === 'admin'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <FiShield className="mr-2" />
            Admin
          </button>
          <button
            onClick={() => {
              setRole('employee');
              setShowOtp(false);
            }}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              role === 'employee'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <FiUser className="mr-2" />
            Employee
          </button>
        </div>

        {/* Admin Login Form */}
        {role === 'admin' && !showOtp && (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Admin Email"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </div>

         <div className="relative">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <FiLock className="text-gray-400" />
  </div>
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="admin key"
    className="w-full pl-10 pr-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    value={adminKey}
    onChange={(e) => setAdminKey(e.target.value)}
  />
  <div
    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FiEyeOff /> : <FiEye />}
  </div>
</div>

            <button
              onClick={handleAdminLogin}
              disabled={!adminEmail || !adminKey}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                !adminEmail || !adminKey
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
              }`}
            >
              Send OTP
            </button>
          </div>
        )}

        {/* Admin OTP Verification */}
        {role === 'admin' && showOtp && (
          <div className="space-y-4">
            <button
              onClick={handleBackToEmail}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-2"
            >
              <FiArrowLeft className="mr-1" /> Back to email
            </button>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-blue-700 text-sm">
                A 6-digit OTP has been sent to <span className="font-medium">{adminEmail}</span>. 
                Please check your inbox.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiShield className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
              />
            </div>

            <button
              onClick={handleAdminVerify}
              disabled={otp.length !== 6}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                otp.length !== 6
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-md'
              }`}
            >
              Verify & Login
            </button>
          </div>
        )}

        {/* Employee Login */}
        {role === 'employee' && (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="text-gray-400" />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              />
            </div>

           <div className="relative">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <FiLock className="text-gray-400" />
  </div>
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
    className="w-full pl-10 pr-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <div
    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FiEyeOff /> : <FiEye />}
  </div>
</div>

            <button
              onClick={handleEmployeeLogin}
              disabled={!phone || !password}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                !phone || !password
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
              }`}
            >
              Login
            </button>
          </div>
        )}

        {/* Footer */}
        {/* <div className="mt-6 text-center text-sm text-gray-500">
          <p>Need help? Contact info@smservice.co.in</p>
        </div> */}
       <div className="mt-6 text-center text-m">
  <a href="https://www.smservice.co.in/software" target='_blank'>Need help? Contact
    <img
      src="/smlogo.png" // replace with your actual logo file path
      alt="SM Service Logo"
      className="mx-auto h-8 w-auto hover:opacity-80 transition"
    />
  </a>
</div>


      </div>
    </div>
  );
};

export default Login;
