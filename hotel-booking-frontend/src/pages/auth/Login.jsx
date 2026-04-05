import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.errors || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-brand-200/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-brand-100/30 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full space-y-10 bg-white/90 backdrop-blur-2xl p-8 sm:p-12 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(56,34,15,0.08)] border border-brand-100/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 relative z-10"
      >
        <div className="text-center space-y-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl font-black text-brand-600 tracking-tighter leading-none uppercase italic"
          >
            Haven <span className="block text-brand-300 not-italic font-black text-2xl tracking-[0.2em] mt-2 group-hover:tracking-[0.3em] transition-all">Portal</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm font-black text-brand-300 uppercase tracking-[0.25em] italic"
          >
            Or{' '}
            <Link to="/register" className="text-brand-600 hover:text-brand-500 underline decoration-brand-200 underline-offset-4 decoration-2 transition-all">
              Initiate Registration
            </Link>
          </motion.p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-100 italic shadow-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-sm font-black text-brand-300 uppercase tracking-widest ml-4 italic group-focus-within:text-brand-600 transition-colors">User Email</label>
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                className="w-full bg-brand-50 border border-transparent rounded-[2rem] p-6 outline-none focus:bg-white focus:border-brand-200 focus:ring-8 focus:ring-brand-400/5 transition-all font-black text-brand-600 text-base tracking-widest italic placeholder:text-brand-200"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center px-4">
                <label className="text-sm font-black text-brand-300 uppercase tracking-widest italic group-focus-within:text-brand-600 transition-colors">Secret Key</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-black text-brand-200 hover:text-brand-600 uppercase tracking-widest transition-colors">
                   Lost Key?
                </Link>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-brand-50 border border-transparent rounded-[2rem] p-6 outline-none focus:bg-white focus:border-brand-200 focus:ring-8 focus:ring-brand-400/5 transition-all font-black text-brand-600 text-base tracking-widest italic tracking-[0.5em] placeholder:tracking-widest placeholder:text-brand-200"
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="group relative w-full h-16 rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-500/20"
          >
            <div className="absolute inset-0 bg-brand-600 group-hover:bg-brand-500 transition-colors duration-500" />
            <span className="relative z-10 text-white font-black text-base uppercase tracking-[0.5em] italic">Open Sanctuary</span>
          </motion.button>
        </form>

        <div className="text-center pt-8 border-t border-brand-50/50">
          <Link to="/admin/login" className="text-[11px] font-black text-brand-200 hover:text-brand-400 uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 group">
            Sanctuary Admin Gateway <span className="text-lg group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

// Internal AnimatePresence wrapper for cleaner code
const AnimatePresence = ({ children }) => {
  return <>{children}</>;
};

export default Login;

