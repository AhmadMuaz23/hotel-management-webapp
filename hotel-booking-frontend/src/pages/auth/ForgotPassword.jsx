import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
  const [step, setStep] = useState('email'); // 'email' or 'reset'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await api.post('/passwords/forgot', { email });
      const msgText = response.data.debug_code 
        ? `${response.data.message} [AUTO-SYSTEM CODE: ${response.data.debug_code}]` 
        : response.data.message;
      setMessage({ type: 'success', text: msgText });
      setStep('reset');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.errors?.[0] || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      return setMessage({ type: 'error', text: 'Secret keys do not match' });
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('/passwords/reset', { 
        token: code,
        password: password,
        password_confirmation: passwordConfirmation
      });
      setMessage({ type: 'success', text: 'Secret key re-established. Redirecting...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.errors?.[0] || 'Recovery failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 py-12 px-6 lg:px-8 relative overflow-hidden">
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
            Lost <span className="block text-brand-300 not-italic font-black text-2xl tracking-[0.2em] mt-2 group-hover:tracking-[0.3em] transition-all">Key</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm font-black text-brand-300 uppercase tracking-[0.25em] italic"
          >
            {step === 'email' ? 'Identify your sanctuary access' : 'Authenticate & Reset'}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border italic shadow-sm ${
                message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {step === 'email' ? (
            <motion.form 
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8" 
              onSubmit={handleSendCode}
            >
              <div className="space-y-2 group">
                <label className="text-sm font-black text-brand-300 uppercase tracking-widest ml-4 italic group-focus-within:text-brand-600 transition-colors">Recovery Email</label>
                <input
                  type="email"
                  required
                  placeholder="example@havenhotels.com"
                  className="w-full bg-brand-50 border border-transparent rounded-[2rem] p-6 outline-none focus:bg-white focus:border-brand-200 focus:ring-8 focus:ring-brand-400/5 transition-all font-black text-brand-600 text-base tracking-widest italic placeholder:text-brand-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="group relative w-full h-16 rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-500/20 disabled:opacity-70"
              >
                <div className="absolute inset-0 bg-brand-600 group-hover:bg-brand-500 transition-colors duration-500" />
                <span className="relative z-10 text-white font-black text-base uppercase tracking-[0.5em] italic">
                   {loading ? 'Processing...' : 'Request Code'}
                </span>
              </motion.button>
            </motion.form>
          ) : (
            <motion.form 
              key="reset-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6" 
              onSubmit={handleResetPassword}
            >
              <div className="space-y-2 group">
                <label className="text-sm font-black text-brand-300 uppercase tracking-widest ml-4 italic group-focus-within:text-brand-600 transition-colors">6-Digit Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="000000"
                  className="w-full bg-brand-50 border border-transparent rounded-[2rem] p-6 outline-none focus:bg-white focus:border-brand-200 focus:ring-8 focus:ring-brand-400/5 transition-all font-black text-brand-600 text-2xl tracking-[1em] text-center italic placeholder:text-brand-200"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-black text-brand-300 uppercase tracking-widest ml-4 italic group-focus-within:text-brand-600 transition-colors">New Secret Key</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-brand-50 border border-transparent rounded-[2rem] p-6 outline-none focus:bg-white focus:border-brand-200 focus:ring-8 focus:ring-brand-400/5 transition-all font-black text-brand-600 text-base tracking-[0.5em] italic placeholder:tracking-widest placeholder:text-brand-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-black text-brand-300 uppercase tracking-widest ml-4 italic group-focus-within:text-brand-600 transition-colors">Verify Secret Key</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-brand-50 border border-transparent rounded-[2rem] p-6 outline-none focus:bg-white focus:border-brand-200 focus:ring-8 focus:ring-brand-400/5 transition-all font-black text-brand-600 text-base tracking-[0.5em] italic placeholder:tracking-widest placeholder:text-brand-200"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="group relative w-full h-16 rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-500/20 disabled:opacity-70"
              >
                <div className="absolute inset-0 bg-brand-600 group-hover:bg-brand-500 transition-colors duration-500" />
                <span className="relative z-10 text-white font-black text-base uppercase tracking-[0.5em] italic">
                   {loading ? 'Safeguarding...' : 'Reset Secret Key'}
                </span>
              </motion.button>
              
              <button 
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-[10px] font-black text-brand-300 hover:text-brand-600 uppercase tracking-widest transition-colors"
              >
                Use different email
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="text-center pt-8 border-t border-brand-50/50">
          <Link to="/login" className="text-[11px] font-black text-brand-200 hover:text-brand-600 uppercase tracking-widest transition-colors underline underline-offset-4 decoration-2">
             Back to Sanctum Entrance
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
