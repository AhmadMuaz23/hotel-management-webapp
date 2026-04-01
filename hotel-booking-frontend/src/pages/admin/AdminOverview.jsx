import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  UsersIcon, 
  HomeModernIcon, 
  ClipboardDocumentCheckIcon, 
  CurrencyDollarIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const AdminOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setDashboardData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-400">Syncing Sanctuary Data...</p>
    </div>
  );

  const { stats, recent_bookings, recent_users } = dashboardData || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 md:space-y-16"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <StatCard 
          title="Total Guests" 
          value={(stats?.total_users || 0).toLocaleString()} 
          icon={<UsersIcon className="w-6 h-6" />}
          delay={0.1}
        />
        <StatCard 
          title="Available Units" 
          value={(stats?.total_rooms || 0).toLocaleString()} 
          icon={<HomeModernIcon className="w-6 h-6" />}
          delay={0.2}
        />
        <StatCard 
          title="Active Stays" 
          value={(stats?.active_bookings || 0).toLocaleString()} 
          icon={<ClipboardDocumentCheckIcon className="w-6 h-6" />}
          delay={0.3}
        />
        <StatCard 
          title="Total Revenue" 
          value={`Rs. ${(stats?.total_revenue || 0).toLocaleString()}`} 
          icon={<CurrencyDollarIcon className="w-6 h-6" />}
          delay={0.4}
        />
      </div>

      {/* Main Lists Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Recent Bookings */}
        <motion.div 
          variants={itemVariants}
          className="xl:col-span-2 bg-white rounded-[3rem] shadow-xl shadow-brand-500/5 border border-brand-50 overflow-hidden"
        >
          <div className="px-8 md:px-10 py-8 border-b border-brand-50 flex items-center justify-between">
            <h2 className="text-xl font-black text-brand-600 uppercase tracking-tighter">Recent Reservations</h2>
            <div className="h-1 w-12 bg-brand-200 rounded-full" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-brand-50">
                  <th className="px-10 py-5 text-[10px] font-black text-brand-300 uppercase tracking-widest">Guest Details</th>
                  <th className="px-6 py-5 text-[10px] font-black text-brand-300 uppercase tracking-widest">Stay Period</th>
                  <th className="px-6 py-5 text-[10px] font-black text-brand-300 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-5 text-[10px] font-black text-brand-300 uppercase tracking-widest text-right">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50/50">
                {recent_bookings?.length > 0 ? recent_bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-brand-50/30 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center font-black text-brand-600 text-xs italic shadow-sm group-hover:bg-brand-600 group-hover:text-white transition-all">
                          {booking.user?.name?.charAt(0) || 'G'}
                        </div>
                        <div>
                          <p className="font-black text-sm text-brand-600 uppercase tracking-tight">{booking.user?.name || 'Guest'}</p>
                          <p className="text-[10px] font-bold text-brand-300">{booking.room?.name || 'Sanctuary Unit'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-xs text-brand-500 italic">
                      {new Date(booking.check_in).toLocaleDateString()} — {new Date(booking.check_out).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full ${
                        booking.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-100' :
                        booking.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                        'bg-orange-50 text-orange-600 border border-orange-100'
                      }`}>
                        {booking.status === 'approved' ? 'Confirmed' : booking.status === 'cancelled' ? 'Invalid' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-sm font-black text-brand-600 text-right italic">
                      Rs. {Math.round(booking.total_price).toLocaleString()}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center py-20 text-[10px] font-black uppercase tracking-widest text-brand-200">No recent activity detected</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-[3rem] shadow-xl shadow-brand-500/5 border border-brand-50 overflow-hidden h-fit"
        >
          <div className="px-8 py-8 border-b border-brand-50">
            <h2 className="text-xl font-black text-brand-600 uppercase tracking-tighter">New Arrivals</h2>
          </div>
          <div className="divide-y divide-brand-50/50">
            {recent_users?.length > 0 ? recent_users.map((u) => (
              <div key={u.id} className="px-8 py-6 flex items-center justify-between hover:bg-brand-50/30 transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-brand-50 flex items-center justify-center font-black text-brand-400 border border-brand-100 group-hover:bg-brand-600 group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
                    {u.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-brand-600 uppercase tracking-tight">{u.name}</h3>
                    <p className="text-[10px] font-bold text-brand-300 italic">{u.email}</p>
                  </div>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-brand-100 group-hover:text-brand-600 transition-colors" />
              </div>
            )) : (
               <div className="px-8 py-10 text-[10px] font-black uppercase tracking-widest text-brand-200 text-center">Quiet landscape...</div>
            )}
          </div>
        </motion.div>
        
      </div>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-brand-500/5 border border-brand-50 relative overflow-hidden group hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500"
  >
    <div className="relative z-10 space-y-4">
      <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 shadow-sm">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">{title}</h3>
        <p className="text-3xl font-black text-brand-600 tracking-tighter italic">{value}</p>
      </div>
    </div>
    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
       <div className="scale-[3]">{icon}</div>
    </div>
  </motion.div>
);

export default AdminOverview;

