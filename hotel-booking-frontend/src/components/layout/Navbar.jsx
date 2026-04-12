import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import UserMenu from './UserMenu';
import SmartAvatar from '../ui/Avatar';
import { 
  Bars3Icon, 
  XMarkIcon,
  ShoppingBagIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-brand-50/80 backdrop-blur-xl sticky top-0 z-50 border-b border-brand-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 md:w-11 md:h-11 bg-brand-500 rounded-2xl flex items-center justify-center text-brand-50 shadow-lg shadow-brand-200/50 group-hover:rotate-6 transition-transform duration-500">
                <span className="text-xl md:text-2xl font-black italic">H</span>
              </div>
              <span className="text-xl md:text-2xl font-black text-brand-600 tracking-tighter">
                Haven<span className="text-brand-400">Hotels</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-12 md:flex md:space-x-8 lg:space-x-10">
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
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {user ? (
              <UserMenu />
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
                  className="bg-brand-500 hover:bg-brand-600 text-brand-50 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-200/50 active:scale-95"
                >
                  Reserve Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-xl text-brand-400 hover:bg-brand-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-50/98 backdrop-blur-2xl border-t border-brand-100 overflow-hidden shadow-2xl"
          >
            <motion.div 
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
              className="px-6 py-10 space-y-8"
            >
              <div className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <motion.div 
                    key={link.path}
                    variants={{
                      open: { opacity: 1, x: 0 },
                      closed: { opacity: 0, x: -20 }
                    }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-2xl font-black uppercase tracking-[0.2em] transition-colors ${location.pathname === link.path ? 'text-brand-600' : 'text-brand-300'
                        }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                {user && (
                  <motion.div 
                    variants={{
                      open: { opacity: 1, x: 0 },
                      closed: { opacity: 0, x: -20 }
                    }}
                  >
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/profile'}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-black uppercase tracking-[0.2em] text-brand-400"
                    >
                      {user.role === 'admin' ? 'Control' : 'My Vault'}
                    </Link>
                  </motion.div>
                )}
              </div>

              <div className="pt-8 border-t border-brand-100">
                {user ? (
                  <div className="space-y-8">
                    <div className="flex items-center gap-5">
                     <SmartAvatar 
                       src={user.avatar_url} 
                       name={user.name} 
                       size="14" 
                       className="rounded-2xl shadow-inner"
                     />
                      <div>
                        <p className="text-[10px] text-brand-300 font-black uppercase tracking-[0.3em]">
                          {user.role === 'admin' ? 'Administrator' : 'Guest'}
                        </p>
                        <p className="text-lg font-black text-brand-600 uppercase tracking-tight">{user.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full bg-brand-600 text-brand-50 py-5 rounded-2xl font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(56,34,15,0.4)] active:scale-95 transition-all"
                    >
                      Terminate Session
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-2 text-brand-400 font-black uppercase tracking-[0.2em]"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center bg-brand-500 text-brand-50 py-5 rounded-2xl font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(151,117,82,0.3)] active:scale-95 transition-all"
                    >
                      Reserve Now
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;



