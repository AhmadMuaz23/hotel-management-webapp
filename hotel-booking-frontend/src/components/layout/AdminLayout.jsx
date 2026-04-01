import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Squares2X2Icon, 
  UsersIcon, 
  HomeModernIcon, 
  ClipboardDocumentCheckIcon, 
  StarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: <Squares2X2Icon className="w-5 h-5" /> },
    { name: 'Guests', path: '/admin/users', icon: <UsersIcon className="w-5 h-5" /> },
    { name: 'Sanctuaries', path: '/admin/rooms', icon: <HomeModernIcon className="w-5 h-5" /> },
    { name: 'Reservations', path: '/admin/bookings', icon: <ClipboardDocumentCheckIcon className="w-5 h-5" /> },
    { name: 'Insights', path: '/admin/reviews', icon: <StarIcon className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Cog6ToothIcon className="w-5 h-5" /> }
  ];

  const SidebarContent = () => (
    <>
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
           <span className="font-black italic text-xl">H</span>
        </div>
        <span className="text-xl font-black text-brand-600 tracking-tighter">Admin<span className="text-brand-400">Portal</span></span>
      </div>

      <nav className="flex-1 w-full px-4 space-y-1.5">
        {navItems.map((item) => {
           const isActive = pathname === item.path;
           return (
             <Link 
               key={item.name} 
               to={item.path}
               onClick={() => setIsSidebarOpen(false)}
               className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black transition-all duration-300 ${
                 isActive 
                 ? 'bg-brand-600 text-white shadow-xl shadow-brand-200/50' 
                 : 'text-brand-300 hover:bg-brand-50 hover:text-brand-600'
               }`}
             >
               {item.icon}
               <span className="text-[11px] uppercase tracking-widest">{item.name}</span>
             </Link>
           );
        })}
      </nav>

      <div className="w-full px-4 pt-6 border-t border-brand-50">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-4 rounded-2xl text-brand-300 font-black hover:bg-red-50 hover:text-red-500 transition-all duration-300 w-full text-left active:scale-95"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span className="text-[11px] uppercase tracking-widest">Logout Session</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-brand-50 font-sans antialiased overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-brand-100 flex-col py-8 h-full flex-shrink-0 shadow-sm relative z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-brand-600/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden flex flex-col py-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-6 right-6 p-2 text-brand-300 hover:text-brand-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-brand-100 flex items-center justify-between px-4 md:px-10 flex-shrink-0 relative z-10">
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-brand-400 hover:bg-brand-50 rounded-xl transition-colors"
             >
                <Bars3Icon className="w-6 h-6" />
             </button>
             <div className="hidden md:relative md:block w-72 lg:w-96">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-300" />
                <input 
                  type="text" 
                  placeholder="Scan directory..." 
                  className="w-full pl-11 pr-4 py-3 bg-brand-50 border border-transparent rounded-2xl text-[10px] uppercase font-black tracking-widest text-brand-600 focus:bg-white focus:border-brand-200 outline-none transition-all"
                />
             </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-8">
            <button className="hidden sm:flex text-brand-300 hover:text-brand-600 transition relative p-2 bg-brand-50 rounded-xl">
              <BellIcon className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-500 rounded-full border-2 border-white"></div>
            </button>
            <div className="flex items-center gap-3 pl-3 md:pl-0">
               <div className="text-right hidden sm:block">
                  <p className="text-[8px] font-black text-brand-300 uppercase tracking-widest mb-0.5">Primary Admin</p>
                  <p className="text-[10px] font-black text-brand-600 uppercase italic tracking-tight">{user?.name}</p>
               </div>
               <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl border border-brand-100 overflow-hidden bg-brand-50 flex items-center justify-center font-black text-brand-400 shadow-sm text-sm">
                 {user?.name?.charAt(0) || 'A'}
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

