import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  UserGroupIcon, 
  CheckCircleIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  WifiIcon,
  TvIcon,
  BeakerIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    check_in: '',
    check_out: '',
    guests: 1
  });
  const [bookingMsg, setBookingMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchRoom();
    fetchReviews();
  }, [id]);

  const fetchRoom = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/rooms/${id}`);
      setRoom(response.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/rooms/${id}/reviews`);
      setReviews(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    
    try {
      await api.post('/bookings', { 
        room_id: id, 
        ...bookingData 
      });
      setBookingMsg({ type: 'success', text: 'Sanctuary reserved. Redirecting to your dashboard...' });
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.errors;
      const displayMsg = Array.isArray(errorMsg) ? errorMsg.join('. ') : (errorMsg || 'System delay. Please try again.');
      setBookingMsg({ type: 'error', text: displayMsg });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );

  if (!room) return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center space-y-4">
      <div className="text-6xl text-brand-200">🍂</div>
      <h2 className="text-2xl font-black text-brand-600">Sanctuary Not Found</h2>
      <button onClick={() => navigate('/rooms')} className="text-brand-400 font-black uppercase text-xs tracking-widest hover:text-brand-600 transition-colors">Return to Collection</button>
    </div>
  );

  const amenities = [
    { name: 'High-Speed WiFi', icon: <WifiIcon className="h-5 w-5" /> },
    { name: 'Climate Control', icon: <SparklesIcon className="h-5 w-5" /> },
    { name: '4K TV System', icon: <TvIcon className="h-5 w-5" /> },
    { name: 'Premium Mini-bar', icon: <BeakerIcon className="h-5 w-5" /> },
    { name: 'Luxury King Bed', icon: <CheckCircleIcon className="h-5 w-5" /> },
    { name: '24/7 Room Service', icon: <ShieldCheckIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="bg-brand-50 min-h-screen pb-32 pt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Simple Breadcrumb / Back button */}
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/rooms')}
          className="mb-10 text-brand-400 hover:text-brand-600 font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2 group transition-all"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Sanctuary
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* ── Left Content: Visuals & Story ─────────────────────── */}
          <div className="lg:col-span-8 space-y-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-30px_rgba(0,0,0,0.2)] aspect-video border border-brand-100"
            >
              <img 
                src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                alt={room.name} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-8 left-8">
                <div className="bg-white/80 backdrop-blur-xl px-6 py-2.5 rounded-2xl text-[10px] font-black text-brand-600 uppercase tracking-widest border border-white/50 shadow-2xl">
                  {room.category.replace('_', ' ')}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black text-brand-600 tracking-tighter leading-none">{room.name}</h1>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2 px-4 py-2 bg-brand-100 rounded-full text-brand-600">
                      <UserGroupIcon className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{room.capacity} Guests Max</span>
                   </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-brand-500/80 font-bold leading-relaxed italic border-l-4 border-brand-200 pl-8">
                "{room.description}"
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-y border-brand-100">
                {amenities.map(item => (
                  <div key={item.name} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-brand-100 flex items-center justify-center text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    <span className="text-xs font-black text-brand-600 uppercase tracking-widest">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Reviews Grid ────────────────────────────────────────── */}
            <div className="space-y-12">
               <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-brand-600 tracking-tight leading-tight uppercase">Guest Insights</h2>
                    <div className="h-1 w-12 bg-brand-200 rounded-full" />
                  </div>
                  <span className="text-[10px] font-black text-brand-300 uppercase tracking-[0.3em] pb-1">{reviews.length} Verified Reviews</span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {reviews.length === 0 ? (
                    <div className="col-span-full py-10 bg-white rounded-3xl border border-dashed border-brand-200 text-center text-brand-300">
                      <p className="text-sm font-bold uppercase tracking-widest italic">Be the first to share your experience</p>
                    </div>
                  ) : reviews.map((rev, i) => (
                    <motion.div 
                      key={rev.id} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-10 rounded-[3rem] border border-brand-50 shadow-xl shadow-brand-500/5 space-y-6"
                    >
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center font-black text-brand-600 text-xs italic">
                                {rev.user.name.charAt(0)}
                             </div>
                             <span className="font-black text-brand-600 text-sm uppercase tracking-tight">{rev.user.name}</span>
                          </div>
                       </div>
                       <p className="text-brand-500/70 font-bold text-sm leading-relaxed italic">"{rev.comment}"</p>
                    </motion.div>
                  ))}
               </div>
            </div>
          </div>

          {/* ── Right Column: The Reservation Vault ─────────────────── */}
          <div className="lg:col-span-4 sticky top-32">
             <motion.div 
               initial={{ opacity: 0, x: 30 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white p-12 rounded-[4rem] shadow-[0_60px_100px_-20px_rgba(56,34,15,0.18)] border border-brand-100 space-y-10"
             >
                <div className="space-y-6 border-b border-brand-50 pb-8">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-brand-300 uppercase tracking-[0.4em]">Investment</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-black text-brand-600 italic font-display">Rs.{Math.round(room.price_per_night).toLocaleString()}</span>
                          <span className="text-xs font-black text-brand-300 uppercase tracking-widest">/ night</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-brand-100 flex items-center justify-center text-brand-200">
                         <CalendarDaysIcon className="h-5 w-5" />
                      </div>
                   </div>
                </div>

                <form onSubmit={handleBooking} className="space-y-8">
                   <AnimatePresence>
                     {bookingMsg.text && (
                       <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center ${bookingMsg.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
                       >
                          {bookingMsg.text}
                       </motion.div>
                     )}
                   </AnimatePresence>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-brand-300 uppercase tracking-[0.2em] pl-2">Check-In</label>
                        <input 
                           type="date" required 
                           className="w-full bg-brand-50 border border-brand-100 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-brand-400/10 transition font-black text-xs text-brand-600" 
                           value={bookingData.check_in}
                           onChange={(e) => setBookingData({...bookingData, check_in: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-brand-300 uppercase tracking-[0.2em] pl-2">Check-Out</label>
                        <input 
                           type="date" required 
                           className="w-full bg-brand-50 border border-brand-100 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-brand-400/10 transition font-black text-xs text-brand-600" 
                           value={bookingData.check_out}
                           onChange={(e) => setBookingData({...bookingData, check_out: e.target.value})}
                        />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-brand-300 uppercase tracking-[0.2em] pl-2">Occupancy</label>
                      <select 
                         className="w-full bg-brand-50 border border-brand-100 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-brand-400/10 transition font-black text-xs text-brand-600 appearance-none cursor-pointer"
                         value={bookingData.guests}
                         onChange={(e) => setBookingData({...bookingData, guests: e.target.value})}
                      >
                         {[...Array(room.capacity)].map((_, i) => <option key={i+1} value={i+1}>{i+1} Guest{i>0?'s':''}</option>)}
                      </select>
                   </div>
                   
                   <div className="pt-4">
                      <button 
                         type="submit" 
                         className="group relative w-full h-16 rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-10px_rgba(56,34,15,0.4)] active:scale-95 transition-transform"
                      >
                         <div className="absolute inset-0 bg-brand-600 group-hover:bg-brand-500 transition-colors" />
                         <span className="relative z-10 text-white font-black text-[10px] uppercase tracking-[0.4em]">Initialize Reservation</span>
                      </button>
                      <div className="flex items-center justify-center gap-2 mt-6">
                        <ShieldCheckIcon className="h-4 w-4 text-brand-200" />
                        <span className="text-center text-brand-200 text-[9px] font-black uppercase tracking-widest italic">Guaranteed Serenity & Security</span>
                      </div>
                   </div>
                </form>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
