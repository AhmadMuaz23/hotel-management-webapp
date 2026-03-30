import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { verifyEmail, resendCode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-4">Invalid Access</h2>
            <button onClick={() => navigate('/login')} className="text-blue-600 font-bold underline">Go to Login</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await verifyEmail(email, code);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.errors || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendCode(email);
      setMessage('Code resent successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 font-body">
      <div className="max-w-md w-full p-10 bg-white rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-blue-50">
        <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verify Identity</h2>
            <p className="mt-4 text-sm text-slate-500 font-bold px-6 leading-relaxed">
                Enter the 6-digit code sent to <br/><span className="text-slate-900">{email}</span>
            </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100">{error}</div>}
            {message && <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-xs font-bold border border-green-100">{message}</div>}
            
            <input
                type="text"
                required
                maxLength="6"
                placeholder="000000"
                className="w-full text-center text-4xl font-black tracking-[0.5em] py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-200 transition"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-sm font-black rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 active:scale-95 transition-all disabled:opacity-50"
            >
                {loading ? 'Verifying...' : 'Complete Verification'}
            </button>

            <div className="text-center">
                <button type="button" onClick={handleResend} className="text-xs font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4">
                    Resend Code
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
