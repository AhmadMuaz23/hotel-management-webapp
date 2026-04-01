import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err) {
      const msg = err.response?.data?.errors || 'Admin login failed';
      setError(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0705]">
      {/* Immersive Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-brand-800/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-brand-900/20 rounded-full blur-[120px]" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-brand-200 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-brand-300 rounded-full animate-ping" />
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-brand-400 rounded-full animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo / Authority Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] mb-6 shadow-2xl bg-gradient-to-br from-brand-600 to-brand-800 border border-brand-500/30"
          >
            <span className="text-4xl font-black italic text-white leading-none">H</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-black text-brand-50 tracking-tighter uppercase italic leading-none"
          >
            Sanctuary <span className="text-brand-400 not-italic">Control</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[9px] font-black text-brand-300/60 uppercase tracking-[0.4em] mt-3"
          >
            Secure Administrative Access
          </motion.p>
        </div>

        {/* Secure Login Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-[3rem] p-8 sm:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 backdrop-blur-3xl bg-white/[0.03]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center italic"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2 group">
              <label className="block text-[9px] font-black text-brand-300 uppercase tracking-[0.25em] ml-4 italic group-focus-within:text-brand-400 transition-colors">
                Command Identity
              </label>
              <input
                id="admin-email"
                type="email"
                required
                className="w-full px-6 py-4 rounded-[1.5rem] text-[11px] font-black text-brand-50 placeholder-brand-300/20 border border-white/10 focus:outline-none focus:bg-white/[0.05] focus:border-brand-500/50 transition-all duration-500 uppercase tracking-widest italic bg-white/[0.02]"
                value={email}
                autoComplete="off"
                placeholder="ADMIN@HAVEN.COM"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2 group">
              <label className="block text-[9px] font-black text-brand-300 uppercase tracking-[0.25em] ml-4 italic group-focus-within:text-brand-400 transition-colors">
                Authority Code
              </label>
              <input
                id="admin-password"
                type="password"
                required
                className="w-full px-6 py-4 rounded-[1.5rem] text-[11px] font-black text-brand-50 placeholder-brand-300/20 border border-white/10 focus:outline-none focus:bg-white/[0.05] focus:border-brand-500/50 transition-all duration-500 tracking-[0.5em] italic bg-white/[0.02]"
                value={password}
                autoComplete="new-password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <motion.button
              id="admin-login-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-16 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.5em] text-white transition-all duration-500 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-brand-600 to-brand-800 shadow-brand-900/50 italic"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authorizing
                </span>
              ) : (
                'Confirm Access'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[8px] font-black text-brand-300/30 uppercase tracking-[0.4em] italic">Or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Guest login link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-[9px] font-black text-brand-300/50 hover:text-brand-200 uppercase tracking-widest transition-all duration-300 group inline-flex items-center gap-2 italic"
            >
              Switch to Guest Portal <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </motion.div>

        {/* Footer info */}
        <p className="text-center text-brand-300/20 text-[8px] mt-10 font-black uppercase tracking-[0.3em] italic">
          System Integrity: Optimal • © 2026 Haven Sanctuary Control
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

