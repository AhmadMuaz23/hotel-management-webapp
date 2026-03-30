import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-brand-50/80 backdrop-blur-xl sticky top-0 z-50 border-b border-brand-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-brand-500 rounded-2xl flex items-center justify-center text-brand-50 shadow-lg shadow-brand-200/50 group-hover:rotate-6 transition-transform duration-500">
                <span className="text-2xl font-black italic">H</span>
              </div>
              <span className="text-2xl font-black text-brand-600 tracking-tighter">
                Haven<span className="text-brand-400">Hotels</span>
              </span>
            </Link>

            <div className="hidden md:ml-12 md:flex md:space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-1 py-1 text-sm font-bold tracking-wide transition-colors duration-300 ${location.pathname === link.path ? 'text-brand-600' : 'text-brand-300 hover:text-brand-500'
                    }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-500 rounded-full"
                    />
                  )}
                </Link>
              ))}
              {user && (
                <Link
                  to={user.role === 'admin' ? '/admin' : '/profile'}
                  className={`relative px-1 py-1 text-sm font-bold tracking-wide transition-colors duration-300 ${location.pathname.startsWith(user.role === 'admin' ? '/admin' : '/profile') ? 'text-brand-600' : 'text-brand-300 hover:text-brand-500'
                    }`}
                >
                  {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                  {location.pathname.startsWith(user.role === 'admin' ? '/admin' : '/profile') && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-500 rounded-full"
                    />
                  )}
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                <div className="hidden lg:block text-right">
                  <p className="text-[10px] text-brand-300 font-black uppercase tracking-[0.2em]">
                    {user.role === 'admin' ? 'Administrator' : 'Guest'}
                  </p>
                  <p className="text-sm font-black text-brand-600">{user.name}</p>
                </div>
                <button
                  onClick={logout}
                  className="bg-brand-100 hover:bg-brand-200 text-brand-500 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-xs font-black text-brand-400 hover:text-brand-600 uppercase tracking-widest px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-500 hover:bg-brand-600 text-brand-50 px-7 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-200/50 active:scale-95"
                >
                  Reserve Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


