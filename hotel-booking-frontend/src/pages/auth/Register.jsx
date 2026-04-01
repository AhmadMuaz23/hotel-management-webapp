import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const [step, setStep] = useState('register'); // 'register' or 'verify'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { register, verifyEmail, resendCode } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    try {
      await register(formData);
      setStep('verify');
    } catch (err) {
      setErrors(Array.isArray(err.response?.data?.errors) ? err.response.data.errors : [err.response?.data?.errors || 'Registration failed']);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    try {
      await verifyEmail(formData.email, verificationCode);
      navigate('/');
    } catch (err) {
      setErrors(Array.isArray(err.response?.data?.errors) ? err.response.data.errors : [err.response?.data?.errors || 'Verification failed']);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendCode(formData.email);
      setSuccessMessage('Code resent to your email.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors(['Failed to resend code.']);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-brand-200/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-brand-100/30 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-10 bg-white/90 backdrop-blur-2xl p-8 sm:p-12 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(56,34,15,0.08)] border border-brand-100/50 relative z-10"
      >
        
        <AnimatePresence mode="wait">
          {step === 'register' ? (
            <motion.div
              key="reg-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl sm:text-5xl font-black text-brand-600 tracking-tighter leading-none uppercase italic">Join <span className="block text-brand-300 not-italic font-black text-2xl tracking-[0.15em] mt-2 group-hover:tracking-[0.25em] transition-all">Sanctuary</span></h2>
                <p className="text-[10px] font-black text-brand-300 uppercase tracking-[0.2em] italic">
                  Already a resident?{' '}
                  <Link to="/login" className="text-brand-600 hover:text-brand-500 underline decoration-brand-200 underline-offset-4 decoration-2 transition-all">
                    Access Portal
                  </Link>
                </p>
              </div>
              
              <form className="space-y-6 mt-10" onSubmit={handleRegisterSubmit}>
                {errors.length > 0 && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center border border-red-100 italic shadow-sm">
                    {errors.map((err, i) => <p key={i}>{err}</p>)}
                  </div>
                )}
                
                <div className="space-y-5">
                  <InputGroup label="Chosen Name" type="text" placeholder="Ahmad Muaz" value={formData.name} onChange={(val) => setFormData({ ...formData, name: val })} />
                  <InputGroup label="Resident Email" type="email" placeholder="you@haven.com" value={formData.email} onChange={(val) => setFormData({ ...formData, email: val })} />
                  <InputGroup label="Secret Key" type="password" placeholder="Min. 8 characters" value={formData.password} onChange={(val) => setFormData({ ...formData, password: val })} />
                  <InputGroup label="Verify Key" type="password" placeholder="Repeat Key" value={formData.password_confirmation} onChange={(val) => setFormData({ ...formData, password_confirmation: val })} />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="group relative w-full h-16 rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-500/20 mt-4 disabled:opacity-70 transition-all"
                >
                  <div className="absolute inset-0 bg-brand-600 group-hover:bg-brand-500 transition-colors duration-500" />
                  <span className="relative z-10 text-white font-black text-[10px] uppercase tracking-[0.5em] italic">
                     {loading ? 'Processing...' : 'Initialize Persona'}
                  </span>
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="verify-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-brand-50 rounded-[1.5rem] flex items-center justify-center mx-auto text-brand-600 shadow-sm border border-brand-100">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-brand-600 tracking-tighter uppercase italic leading-none">Verify Identity</h2>
                <p className="text-[10px] font-black text-brand-300 uppercase tracking-widest leading-relaxed italic">
                  Registry code sent to:<br/>
                  <span className="text-brand-600 not-italic mt-2 block">{formData.email}</span>
                </p>
              </div>

              <form className="mt-10 space-y-8" onSubmit={handleVerifySubmit}>
                {errors.length > 0 && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center border border-red-100 italic shadow-sm">
                    {errors.map((err, i) => <p key={i}>{err}</p>)}
                  </div>
                )}
                {successMessage && (
                  <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center border border-green-100 italic shadow-sm">
                    {successMessage}
                  </div>
                )}
                
                <div className="space-y-4">
                  <input
                    type="text"
                    required
                    maxLength="6"
                    placeholder="000000"
                    className="w-full text-center text-4xl font-black tracking-[0.5em] py-8 bg-brand-50 border border-transparent rounded-[2.5rem] text-brand-600 focus:bg-white focus:border-brand-200 focus:ring-8 focus:ring-brand-400/5 transition-all outline-none italic placeholder:text-brand-100"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="group relative w-full h-16 rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-500/20 transition-all disabled:opacity-70"
                >
                  <div className="absolute inset-0 bg-brand-600 group-hover:bg-brand-500 transition-colors duration-500" />
                  <span className="relative z-10 text-white font-black text-[10px] uppercase tracking-[0.5em] italic">
                     {loading ? 'Confirming...' : 'Authorize Access'}
                  </span>
                </motion.button>

                <button 
                  type="button" 
                  onClick={handleResend} 
                  className="w-full text-[9px] font-black text-brand-300 hover:text-brand-600 uppercase tracking-widest transition-colors italic underline underline-offset-4 decoration-brand-100"
                >
                  Request New Identity Code
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const InputGroup = ({ label, type, placeholder, value, onChange }) => (
  <div className="space-y-2 group">
    <label className="text-[9px] font-black text-brand-300 uppercase tracking-widest ml-4 italic group-focus-within:text-brand-600 transition-colors">{label}</label>
    <input
      type={type}
      required
      placeholder={placeholder}
      className="w-full bg-brand-50 border border-transparent rounded-[2rem] p-5 outline-none focus:bg-white focus:border-brand-200 focus:ring-8 focus:ring-brand-400/5 transition-all font-black text-brand-600 text-[11px] tracking-widest italic placeholder:text-brand-200"
      value={value}
      autoComplete="new-password"
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default Register;

