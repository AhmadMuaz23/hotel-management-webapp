import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Secret keys do not match.' });
    }

    setLoading(true);
    try {
      await api.post('/passwords/reset', { token, password });
      setMessage({ type: 'success', text: 'Your secret key has been restored. Access granted.' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.errors?.[0] || 'Recovery failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 py-12 px-6 lg:px-8">
      <div className="max-w-md w-full space-y-12 bg-white/80 backdrop-blur-xl p-12 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(56,34,15,0.1)] border border-brand-100">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-display font-black text-brand-600 tracking-tight leading-tight uppercase underline decoration-brand-200 decoration-4 underline-offset-8">Restoration</h2>
          <p className="text-[10px] font-black text-brand-300 uppercase tracking-widest leading-relaxed">
             Define your new sanctuary secret key <br/> to regain access.
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {message.text && (
            <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border italic ${
               message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-brand-300 uppercase tracking-widest ml-2 italic">New Secret Key</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-brand-50 border border-brand-100 rounded-3xl p-5 outline-none focus:ring-4 focus:ring-brand-400/10 transition font-bold text-brand-600 text-sm italic tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-brand-300 uppercase tracking-widest ml-2 italic">Confirm New Key</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-brand-50 border border-brand-100 rounded-3xl p-5 outline-none focus:ring-4 focus:ring-brand-400/10 transition font-bold text-brand-600 text-sm italic tracking-widest"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full h-16 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-10px_rgba(56,34,15,0.3)] active:scale-95 transition-transform mt-4 disabled:opacity-70"
          >
            <div className="absolute inset-0 bg-brand-600 group-hover:bg-brand-500 transition-colors" />
            <span className="relative z-10 text-white font-black text-[10px] uppercase tracking-[0.4em]">
               {loading ? 'Restoring...' : 'Restore Access'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
