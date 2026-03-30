import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
    <div className="min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-blue-50">
        
        {step === 'register' ? (
          <>
            <div>
              <h2 className="text-center text-4xl font-black text-slate-900 tracking-tight">Create account</h2>
              <p className="mt-4 text-center text-sm text-slate-500 font-bold">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-blue-200">
                  Log in here
                </Link>
              </p>
            </div>
            <form className="mt-10 space-y-5" onSubmit={handleRegisterSubmit}>
              {errors.length > 0 && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 italic">
                  {errors.map((err, i) => <p key={i}>{err}</p>)}
                </div>
              )}
              <div className="space-y-5">
                <InputGroup label="Full Name" type="text" value={formData.name} onChange={(val) => setFormData({ ...formData, name: val })} />
                <InputGroup label="Email Address" type="email" value={formData.email} onChange={(val) => setFormData({ ...formData, email: val })} />
                <InputGroup label="Password" type="password" value={formData.password} onChange={(val) => setFormData({ ...formData, password: val })} />
                <InputGroup label="Confirm Password" type="password" value={formData.password_confirmation} onChange={(val) => setFormData({ ...formData, password_confirmation: val })} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-sm font-black rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 active:scale-95 transition-all mt-4 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Create Account'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div>
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight">Verify Email</h2>
              <p className="mt-4 text-center text-sm text-slate-500 font-bold leading-relaxed px-4">
                We've sent a 6-digit code to <span className="text-slate-900">{formData.email}</span>
              </p>
            </div>
            <form className="mt-10 space-y-6" onSubmit={handleVerifySubmit}>
              {errors.length > 0 && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100">
                  {errors.map((err, i) => <p key={i}>{err}</p>)}
                </div>
              )}
              {successMessage && (
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-xs font-bold border border-green-100">
                  {successMessage}
                </div>
              )}
              <div>
                <input
                  type="text"
                  required
                  maxLength="6"
                  placeholder="000000"
                  className="w-full text-center text-3xl font-black tracking-[0.5em] py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-sm font-black rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <p className="text-center text-xs font-bold text-slate-400">
                Didn't receive the code?{' '}
                <button type="button" onClick={handleResend} className="text-blue-600 hover:text-blue-700 underline">
                  Resend Code
                </button>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const InputGroup = ({ label, type, value, onChange }) => (
  <div>
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">{label}</label>
    <input
      type={type}
      required
      className="appearance-none rounded-2xl block w-full px-5 py-4 border border-slate-100 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition sm:text-sm bg-slate-50/50"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default Register;
