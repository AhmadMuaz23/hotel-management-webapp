import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/passwords/forgot', { email });
      setMessage({ type: 'success', text: response.data.message });
      // NOTE: In development, token is in response.data.debug_token
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.errors?.[0] || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 py-12 px-6 lg:px-8">
      <div className="max-w-md w-full space-y-12 bg-white/80 backdrop-blur-xl p-12 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(56,34,15,0.1)] border border-brand-100">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-display font-black text-brand-600 tracking-tight leading-tight uppercase underline decoration-brand-200 decoration-4 underline-offset-8">Password Recovery</h2>
          <p className="text-[10px] font-black text-brand-300 uppercase tracking-widest leading-relaxed">
             Enter your email and we'll send you <br/> instructions to reset your password.
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
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-brand-300 uppercase tracking-widest ml-2 italic">Recovery Email</label>
            <input
              type="email"
              required
              placeholder="email@havenhotels.com"
              className="w-full bg-brand-50 border border-brand-100 rounded-3xl p-5 outline-none focus:ring-4 focus:ring-brand-400/10 transition font-bold text-brand-600 text-sm italic"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full h-16 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-10px_rgba(56,34,15,0.3)] active:scale-95 transition-transform disabled:opacity-70"
          >
            <div className="absolute inset-0 bg-brand-600 group-hover:bg-brand-500 transition-colors" />
            <span className="relative z-10 text-white font-black text-[10px] uppercase tracking-[0.4em]">
               {loading ? 'Processing...' : 'Send Recovery Link'}
            </span>
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-[10px] font-black text-brand-400 hover:text-brand-600 uppercase tracking-widest transition-colors underline underline-offset-4">
             Back to Sanctum Entrance
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
