import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyIcon, ArrowRightOnRectangleIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function AdminSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');

    if (!passwords.current_password) {
      setErrorMsg("Current Secret Key is required.");
      return;
    }

    if (passwords.password !== passwords.password_confirmation) {
      setErrorMsg("New Secret Keys do not match.");
      return;
    }

    if (passwords.password.length < 6) {
      setErrorMsg("Secret Key must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/users/${user.id}`, {
        current_password: passwords.current_password,
        password: passwords.password,
        password_confirmation: passwords.password_confirmation
      });
      setMessage('Secret Key updated successfully.');
      setPasswords({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      setErrorMsg(err.response?.data?.errors?.[0] || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 max-w-4xl"
    >
      {/* Header section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-brand-600 tracking-tighter uppercase leading-none italic">System Settings</h1>
        <p className="text-brand-300 font-bold italic text-xs uppercase tracking-widest">Update your admin credentials and session options.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Change Password Section */}
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-brand-500/5 border border-brand-50 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 text-brand-50 opacity-50 group-hover:scale-110 transition-transform duration-700">
            <KeyIcon className="w-64 h-64" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 shadow-inner">
                <KeyIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-brand-600 uppercase tracking-tighter italic">Update Secret Key</h2>
            </div>
            
            <form onSubmit={handlePasswordUpdate} className="space-y-5">
              {message && (
                <div className="p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                  <CheckCircleIcon className="w-5 h-5" />
                  {message}
                </div>
              )}
              {errorMsg && (
                <div className="p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-300 ml-4">Current Secret Key</label>
                <input
                  type="password"
                  name="current_password"
                  value={passwords.current_password}
                  onChange={handleChange}
                  placeholder="Enter current secret key"
                  className="w-full px-6 py-4 rounded-2xl border border-brand-100 bg-brand-50 focus:bg-white focus:outline-none focus:border-brand-300 transition-all font-bold text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-300 ml-4">New Secret Entry</label>
                <input
                  type="password"
                  name="password"
                  value={passwords.password}
                  onChange={handleChange}
                  placeholder="Enter new secret key"
                  className="w-full px-6 py-4 rounded-2xl border border-brand-100 bg-brand-50 focus:bg-white focus:outline-none focus:border-brand-300 transition-all font-bold text-sm"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-300 ml-4">Verify Secret Entry</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={passwords.password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirm new secret key"
                  className="w-full px-6 py-4 rounded-2xl border border-brand-100 bg-brand-50 focus:bg-white focus:outline-none focus:border-brand-300 transition-all font-bold text-sm"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest text-white bg-brand-600 hover:bg-brand-500 shadow-xl shadow-brand-200/50 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Encrypting...' : 'Save Configuration'}
              </button>
            </form>
          </div>
        </div>

        {/* Session Options Section */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-brand-500/5 border border-red-50 relative overflow-hidden group hover:border-red-100 transition-all">
            <div className="absolute -right-6 -bottom-6 text-red-50 opacity-50 group-hover:scale-110 transition-transform duration-700">
               <ArrowRightOnRectangleIcon className="w-48 h-48" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-inner">
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-red-600 uppercase tracking-tighter italic">End Session</h2>
              </div>
              
              <p className="text-xs text-brand-400 font-semibold italic mb-8">
                Securely terminate your connection to the central administrative sanctuary. Your auth token will be wiped.
              </p>

              <button 
                onClick={handleLogout}
                className="w-full py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest text-white bg-red-500 hover:bg-red-600 shadow-xl shadow-red-200/50 transition-all active:scale-95"
              >
                Logout Immediately
              </button>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
