import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  UserGroupIcon, 
  InformationCircleIcon, 
  CreditCardIcon, 
  CheckBadgeIcon, 
  ArrowRightIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  // Stats calculation
  const totalBookings = bookings.length;
  const activeReservations = bookings.filter(b => b.status === 'approved' || b.status === 'pending').length;
  const totalSpent = bookings.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="font-display font-medium text-brand-400 animate-pulse">Initializing your Haven experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-50 min-h-screen pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 text-brand-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-brand-200/50">
              <CheckBadgeIcon className="h-3 w-3" />
              Verified Haven Member
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-brand-600 tracking-tight">
              Welcome back, <span className="text-brand-400 italic font-medium">{user?.name}</span>
            </h1>
            <p className="mt-2 text-brand-300 font-medium">Your sanctuary away from home is waiting for you.</p>
          </div>
          
          <div className="flex gap-4">
            <Link 
              to="/rooms" 
              className="px-8 py-4 bg-brand-500 text-brand-50 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-200/50 hover:bg-brand-600 hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center gap-2"
            >
              Book Again
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <StatCard 
            title="Total Memories" 
            value={totalBookings} 
            icon={<ShoppingBagIcon className="h-7 w-7" />} 
            label="Bookings so far"
            variants={itemVariants}
          />
          <StatCard 
            title="Active Stays" 
            value={activeReservations} 
            icon={<CalendarIcon className="h-7 w-7" />} 
            label="Upcoming visits"
            variants={itemVariants}
          />
          <StatCard 
            title="Haven Investment" 
            value={`Rs. ${totalSpent.toLocaleString()}`} 
            icon={<CreditCardIcon className="h-7 w-7" />} 
            label="Total Amount"
            variants={itemVariants}
          />
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Recent Bookings List */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-display font-black text-brand-600">Recent Stays</h2>
              <p className="text-xs font-bold text-brand-300 uppercase tracking-widest">History</p>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-16 border border-brand-200/30 text-center shadow-sm">
                <div className="w-20 h-20 bg-brand-100 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">🧳</div>
                <h3 className="text-2xl font-display font-bold text-brand-600 mb-2">No journeys yet.</h3>
                <p className="text-brand-300 font-medium mb-8 max-w-sm mx-auto">Your first stay at Haven Hotels will be the beginning of something beautiful.</p>
                <Link to="/rooms" className="text-brand-500 font-black text-xs uppercase tracking-widest hover:text-brand-600 transition-colors flex items-center justify-center gap-2">
                  Find your room <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <motion.div 
                    key={booking.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white/80 backdrop-blur-md border border-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-brand-100/50 transition-all duration-300 flex flex-col sm:flex-row items-center gap-6"
                  >
                    <div className="w-full sm:w-40 h-28 rounded-2xl overflow-hidden shrink-0 shadow-md">
                      <img 
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt={booking.room?.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h4 className="text-xl font-display font-bold text-brand-600 leading-tight">
                          {booking.room?.name || 'Haven Suite'}
                        </h4>
                        <span className={`self-center text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-brand-400">
                          <CalendarIcon className="h-4 w-4 text-brand-300" />
                          <span className="text-xs font-semibold">{booking.check_in}</span>
                        </div>
                        <div className="flex items-center gap-2 text-brand-400">
                          <UserGroupIcon className="h-4 w-4 text-brand-300" />
                          <span className="text-xs font-semibold">{booking.guests} Guests</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-center sm:text-right">
                      <p className="text-2xl font-display font-black text-brand-500 mb-2">Rs. {parseFloat(booking.total_price).toLocaleString()}</p>
                      <button className="text-[10px] font-black uppercase tracking-widest text-brand-300 hover:text-brand-500 transition-colors">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Sidebar / Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-brand-600 rounded-[2.5rem] p-8 text-brand-50 shadow-2xl shadow-brand-200/80 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <h3 className="text-2xl font-display font-bold mb-4 relative z-10">Elite Concierge</h3>
              <p className="text-brand-200 text-sm mb-8 relative z-10 leading-relaxed font-medium">Need something special for your next stay? Our 24/7 dedicated team is here to assist.</p>
              
              <Link to="/contact" className="w-full bg-white text-brand-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-50 transition-colors flex items-center justify-center gap-2 relative z-10 shadow-lg">
                Contact Support
              </Link>
            </div>

            <div className="bg-white/50 backdrop-blur-md border border-brand-200/30 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-xl font-display font-bold text-brand-600 mb-6">Manage Profile</h3>
              <div className="space-y-4">
                <QuickLink label="Account Settings" />
                <QuickLink label="Payment Methods" />
                <QuickLink label="Communication Preferences" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const StatCard = ({ title, value, icon, label, variants }) => (
  <motion.div 
    variants={variants}
    className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-brand-100 flex flex-col gap-6 group hover:shadow-2xl hover:shadow-brand-100/50 transition-all duration-500"
  >
    <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-brand-50 group-hover:rotate-6 transition-all duration-500">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-brand-300 uppercase tracking-[0.2em] mb-1">{title}</p>
      <p className="text-3xl font-display font-black text-brand-600">{value}</p>
      <p className="text-[10px] font-bold text-brand-200 uppercase tracking-widest mt-2">{label}</p>
    </div>
  </motion.div>
);

const QuickLink = ({ label }) => (
  <button className="w-full flex items-center justify-between py-3 px-1 border-b border-brand-100/50 text-brand-400 hover:text-brand-600 transition-colors group">
    <span className="text-sm font-bold">{label}</span>
    <ArrowRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
  </button>
);

export default UserDashboard;
