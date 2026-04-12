import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  ArrowRightOnRectangleIcon, 
  Cog6ToothIcon,
  Squares2X2Icon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import SmartAvatar from '../ui/Avatar';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const menuItems = [
    { 
      name: 'My Sanctuary', 
      path: '/profile', 
      icon: <UserIcon className="w-4 h-4" />,
      hideForAdmin: true 
    },
    { 
      name: 'Admin Panel', 
      path: '/admin', 
      icon: <Squares2X2Icon className="w-4 h-4" />,
      adminOnly: true 
    },
    { 
      name: 'Identity Settings', 
      path: user.role === 'admin' ? '/admin/settings' : '/profile', 
      icon: <Cog6ToothIcon className="w-4 h-4" /> 
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-brand-100 transition-all duration-300 group"
      >
        <SmartAvatar 
          src={user.avatar_url} 
          name={user.name} 
          size="11" 
          className="rounded-xl overflow-hidden shadow-lg shadow-brand-200/50 border-2 border-transparent group-hover:border-white transition-all"
        />
        
        <div className="text-left hidden sm:block">
          <p className="text-[10px] font-black text-brand-300 uppercase tracking-[0.2em] mb-0.5 flex items-center gap-1">
            {user.role === 'admin' && <ShieldCheckIcon className="w-2.5 h-2.5 text-brand-500" />}
            {user.role === 'admin' ? 'Administrator' : 'Verified Resident'}
          </p>
          <p className="text-[12px] font-black text-brand-600 uppercase tracking-tight group-hover:text-brand-400 transition-colors">
            {user.name}
          </p>
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl shadow-brand-600/10 border border-brand-100 p-3 z-50 overflow-hidden"
          >
            {/* Header Info */}
            <div className="p-4 mb-2 bg-brand-50 rounded-[1.5rem] flex items-center gap-4 border border-brand-100/50">
                <SmartAvatar 
                  src={user.avatar_url} 
                  name={user.name} 
                  size="12" 
                  className="rounded-xl"
                />
               <div className="min-w-0 pr-2">
                  <p className="text-[11px] font-black text-brand-600 uppercase tracking-tight truncate">{user.name}</p>
                  <p className="text-[9px] font-bold text-brand-300 uppercase tracking-widest truncate">{user.email}</p>
               </div>
            </div>

            {/* Links */}
            <div className="space-y-1">
              {menuItems.map((item) => {
                if (item.adminOnly && user.role !== 'admin') return null;
                if (item.hideForAdmin && user.role === 'admin') return null;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-brand-300 font-bold hover:bg-brand-50 hover:text-brand-600 transition-all group"
                  >
                    <div className="p-1.5 bg-transparent group-hover:bg-brand-100 rounded-lg transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Logout */}
            <div className="mt-2 pt-2 border-t border-brand-50">
              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-300 font-bold hover:bg-red-50 hover:text-red-500 transition-all group active:scale-95"
              >
                <div className="p-1.5 bg-transparent group-hover:bg-red-100 rounded-lg transition-colors">
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em]">Depart Sanctuary</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
