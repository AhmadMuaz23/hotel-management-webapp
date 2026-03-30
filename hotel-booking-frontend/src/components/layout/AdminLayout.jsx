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
  BellIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <Squares2X2Icon className="w-5 h-5" /> },
    { name: 'Users', path: '/admin/users', icon: <UsersIcon className="w-5 h-5" /> },
    { name: 'Rooms', path: '/admin/rooms', icon: <HomeModernIcon className="w-5 h-5" /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <ClipboardDocumentCheckIcon className="w-5 h-5" /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <StarIcon className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Cog6ToothIcon className="w-5 h-5" /> }
  ];

  return (
    <div className="flex h-screen bg-[#F4F7FB] font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col items-center py-6 h-full flex-shrink-0">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-8 shadow-sm shadow-blue-500/30">
          {/* Logo icon representation */}
          <div className="w-6 h-1 bg-white rounded-full"></div>
          <div className="w-6 h-1 bg-white rounded-full absolute mt-2"></div>
        </div>

        <nav className="flex-1 w-full px-4 space-y-1">
          {navItems.map((item) => {
             const isActive = pathname === item.path;
             return (
               <Link 
                 key={item.name} 
                 to={item.path}
                 className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition duration-200 ${
                   isActive 
                   ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' 
                   : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                 }`}
               >
                 {item.icon}
                 <span className="text-sm">{item.name}</span>
               </Link>
             );
          })}
        </nav>

        <div className="w-full px-4 pt-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 font-bold hover:bg-red-50 hover:text-red-500 transition duration-200 w-full text-left"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="relative w-96">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-700 transition relative">
              <BellIcon className="w-6 h-6" />
              <div className="absolute top-0 right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></div>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-slate-100 overflow-hidden bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
