import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1e1108 0%, #2d1a0e 30%, #462e1d 60%, #75543c 100%)' }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #c5a059 0%, transparent 70%)' }}
        />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #8b5e3c 0%, transparent 70%)' }}
        />
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent-gold/20 rounded-full" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-accent-gold/15 rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 bg-accent-gold/10 rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #c5a059 0%, #8b5e3c 100%)' }}
          >
            <span className="text-3xl font-black italic text-white font-display">H</span>
          </div>
          <h1 className="text-2xl font-black text-brand-100 tracking-tight font-display">
            Haven<span className="text-accent-gold">Hotels</span>
          </h1>
          <p className="text-brand-300 text-xs font-bold uppercase tracking-[0.25em] mt-1">
            Administration Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl p-8 shadow-2xl border border-white/10 backdrop-blur-xl"
          style={{ background: 'rgba(253, 251, 247, 0.07)' }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-black text-brand-50 font-display">Admin Sign In</h2>
            <p className="text-brand-300/80 text-sm mt-1">
              Enter your administrator credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-brand-200 uppercase tracking-[0.2em] mb-2">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                required
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium text-brand-50 placeholder-brand-300/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/30 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                value={email}
                autoComplete="off"
                placeholder="admin@havenhotels.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-brand-200 uppercase tracking-[0.2em] mb-2">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium text-brand-50 placeholder-brand-300/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/30 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                value={password}
                autoComplete="off"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #c5a059 0%, #8b5e3c 100%)' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-bold text-brand-300/50 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Guest login link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-bold text-brand-300/70 hover:text-accent-gold transition-colors duration-300"
            >
              Sign in as Guest →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-brand-300/40 text-xs mt-6 font-medium">
          © 2026 Haven Hotels. Secure Admin Access.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
