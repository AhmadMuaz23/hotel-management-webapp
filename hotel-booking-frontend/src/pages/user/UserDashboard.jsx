import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarIcon, 
  UserGroupIcon, 
  InformationCircleIcon, 
  CreditCardIcon, 
  CheckBadgeIcon, 
  ArrowRightIcon,
  ShoppingBagIcon,
  KeyIcon,
  UserIcon,
  StarIcon as StarOutline,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user, setUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await api.put(`/users/${user.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(response.data);
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarRemove = async () => {
    if (!window.confirm('Erase your profile identity image?')) return;
    
    setUploadingAvatar(true);
    try {
      const response = await api.delete(`/users/${user.id}/remove_avatar`);
      setUser(response.data);
    } catch (err) {
      console.error('Failed to remove image:', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchUserReviews();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const response = await api.get('/reviews/me');
      setUserReviews(response.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const finishLoading = () => setLoading(false);
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(finishLoading, 800);
    return () => clearTimeout(timer);
  }, []);

  const [reviewingBooking, setReviewingBooking] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState({ type: '', text: '' });

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview.id}`, reviewData);
      } else {
        await api.post(`/rooms/${reviewingBooking.room_id}/reviews`, reviewData);
      }
      setReviewMsg({ type: 'success', text: editingReview ? 'Review updated!' : 'Insight posted!' });
      setTimeout(() => {
        setReviewingBooking(null);
        setEditingReview(null);
        setReviewData({ rating: 5, comment: '' });
        setReviewMsg({ type: '', text: '' });
        fetchUserReviews();
      }, 1500);
    } catch (err) {
      setReviewMsg({ type: 'error', text: 'Operation failed' });
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (!window.confirm('Erase this insight?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      fetchUserReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (review) => {
    setEditingReview(review);
    setReviewData({ rating: review.rating, comment: review.comment });
    setReviewingBooking({ room: review.room });
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
            <h1 className="text-4xl md:text-5xl font-display font-black text-brand-600 tracking-tight leading-tight">
              Welcome back, <span className="text-brand-500 italic font-medium">{user?.name}</span>
            </h1>
            <p className="mt-3 text-brand-500 font-bold text-lg">Your sanctuary away from home is ready for you.</p>
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16"
        >
          <StatCard 
            title="Total Memories" 
            value={totalBookings} 
            icon={<ShoppingBagIcon className="h-6 w-6" />} 
            label="Bookings so far"
            variants={itemVariants}
          />
          <StatCard 
            title="Haven Wallet" 
            value={`Rs. ${(parseFloat(user?.balance) || 0).toLocaleString()}`} 
            icon={<CreditCardIcon className="h-6 w-6" />} 
            label="Available Balance"
            variants={itemVariants}
          />
          <StatCard 
            title="Active Stays" 
            value={activeReservations} 
            icon={<CalendarIcon className="h-6 w-6" />} 
            label="Upcoming visits"
            variants={itemVariants}
          />
          <StatCard 
            title="Haven Investment" 
            value={`Rs. ${totalSpent.toLocaleString()}`} 
            icon={<CheckBadgeIcon className="h-6 w-6" />} 
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-display font-black text-brand-600 underline decoration-brand-200 decoration-8 underline-offset-8">Recent Stays</h2>
              <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest bg-brand-100 px-3 py-1 rounded-full">Record History</p>
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
                      
                      <div className="grid grid-cols-2 gap-6 mt-4">
                        <div className="flex items-center gap-3 text-brand-600">
                          <div className="p-2 bg-brand-50 rounded-xl">
                            <CalendarIcon className="h-5 w-5 text-brand-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase text-brand-300 tracking-widest">Check-In</span>
                            <span className="text-sm font-black">{booking.check_in}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-brand-600">
                          <div className="p-2 bg-brand-50 rounded-xl">
                            <UserGroupIcon className="h-5 w-5 text-brand-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase text-brand-300 tracking-widest">Occupancy</span>
                            <span className="text-sm font-black">{booking.guests} Residents</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {booking.status === 'approved' && (
                      <button 
                        onClick={() => setReviewingBooking(booking)}
                        className="px-6 py-4 bg-brand-50 text-brand-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-600 hover:text-white transition-all duration-300 active:scale-95 border border-brand-100 flex items-center gap-2 group"
                      >
                        <StarIcon className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                        Rate Sanctuary
                      </button>
                    )}

                  </motion.div>
                ))}
              </div>
            )}

            {/* User Reviews Section - Moved to Left Column for better readability */}
            <div className="bg-white/70 backdrop-blur-md border border-brand-100 rounded-[2.5rem] p-10 shadow-xl shadow-brand-500/5 mt-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-display font-black text-brand-600 tracking-tight leading-tight uppercase underline decoration-brand-200 decoration-4 underline-offset-8">Your Haven Insights</h3>
                <p className="text-[10px] font-black text-brand-300 uppercase tracking-widest">{userReviews.length} Shared Experiences</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userReviews.length === 0 ? (
                  <div className="col-span-full py-12 text-center bg-brand-50/50 rounded-3xl border border-dashed border-brand-200">
                    <p className="text-xs font-bold text-brand-300 italic uppercase tracking-widest">No insights shared yet. Your story begins with your first stay.</p>
                  </div>
                ) : userReviews.map(rev => (
                  <motion.div 
                    key={rev.id} 
                    whileHover={{ y: -5 }}
                    className="p-8 bg-white border border-brand-50 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <p className="text-xs font-black text-brand-600 uppercase tracking-wider">{rev.room?.name}</p>
                        <div className="flex gap-1 text-brand-400">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`h-3 w-3 ${i < rev.rating ? 'text-brand-400' : 'text-brand-100'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-brand-400 italic leading-relaxed mb-6 opacity-80 line-clamp-3">"{rev.comment}"</p>
                    <div className="flex gap-6 border-t border-brand-50 pt-5">
                      <button onClick={() => openEditModal(rev)} className="text-[10px] font-black text-brand-500 hover:text-brand-600 uppercase tracking-widest transition-colors">Edit Insight</button>
                      <button onClick={() => handleReviewDelete(rev.id)} className="text-[10px] font-black text-red-300 hover:text-red-500 uppercase tracking-widest transition-colors">Delete</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Review Modal Backdrop */}
            <AnimatePresence>
              {reviewingBooking && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-brand-600/40 backdrop-blur-sm flex items-center justify-center p-4"
                >
                   <motion.div 
                     initial={{ scale: 0.9, y: 20 }}
                     animate={{ scale: 1, y: 0 }}
                     className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative"
                   >
                      <button 
                        onClick={() => setReviewingBooking(null)}
                        className="absolute top-8 right-8 text-brand-300 hover:text-brand-600 font-bold"
                      >Close</button>

                      <div className="text-center space-y-4 mb-10">
                         <h3 className="text-3xl font-display font-black text-brand-600 tracking-tight leading-tight uppercase">Rate Your Sanctuary</h3>
                         <p className="text-xs font-black text-brand-300 uppercase tracking-widest leading-relaxed">
                            {reviewingBooking.room?.name || 'Haven Suite'}
                         </p>
                      </div>

                      <form onSubmit={handleReviewSubmit} className="space-y-8">
                         {reviewMsg.text && (
                           <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center ${reviewMsg.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                             {reviewMsg.text}
                           </div>
                         )}

                         <div className="flex justify-center gap-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewData({...reviewData, rating: star})}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${reviewData.rating >= star ? 'bg-brand-600 text-white shadow-xl' : 'bg-brand-50 text-brand-200'}`}
                              >
                                <StarIcon className="h-6 w-6" />
                              </button>
                            ))}
                         </div>

                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-brand-300 uppercase tracking-widest ml-2 italic">Your Remarks</label>
                            <textarea 
                              required
                              rows="4"
                              placeholder="Tell us about the textures, the light, the comfort..."
                              className="w-full bg-brand-50 border border-brand-100 rounded-3xl p-6 outline-none focus:ring-4 focus:ring-brand-400/10 transition font-bold text-brand-600 text-sm italic"
                              value={reviewData.comment}
                              onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                            />
                         </div>

                         <button 
                           type="submit"
                           className="w-full bg-brand-600 text-white h-16 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-brand-600/20 active:scale-95 transition-all"
                         >
                           {editingReview ? 'Update Insight' : 'Post Insight'}
                         </button>
                      </form>
                   </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sidebar / Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-8"
          >
            {/* Modern User Profile Card */}
            <div className="bg-white border-2 border-brand-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-brand-500/10 transition-all duration-500">
              {/* Header / Banner / Avatar */}
              <div className="h-24 bg-brand-600 relative">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-full border-4 border-white bg-brand-50 flex items-center justify-center text-brand-600 shadow-xl overflow-hidden group cursor-pointer relative"
                  >
                    {uploadingAvatar ? (
                      <div className="w-6 h-6 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
                    ) : user?.avatar_url ? (
                      <img src={user.avatar_url} alt="Profile Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <UserIcon className="h-10 w-10 opacity-40 group-hover:scale-110 transition-transform" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="text-white text-[8px] font-black uppercase tracking-widest text-center mt-6">Upload</span>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  {user?.avatar_url && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAvatarRemove(); }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
                      title="Remove Identity Image"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-14 pb-8 px-6 text-center">
                <h3 className="text-xl font-display font-black text-brand-600 uppercase tracking-tighter">{user?.name}</h3>
                <p className="text-[10px] font-black text-brand-300 uppercase tracking-widest mt-1">Sanctuary Resident</p>
                
                <div className="mt-8 space-y-2">
                  <button className="w-full py-4 px-6 bg-brand-50 hover:bg-brand-100 rounded-[1.5rem] border border-brand-100/50 flex items-center gap-4 text-brand-600 transition-all group">
                    <UserIcon className="h-5 w-5 opacity-50" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:tracking-[0.25em] transition-all">Update Identity</span>
                  </button>

                  <button className="w-full py-4 px-6 bg-brand-50 hover:bg-brand-100 rounded-[1.5rem] border border-brand-100/50 flex items-center gap-4 text-brand-600 transition-all group">
                    <KeyIcon className="h-5 w-5 opacity-50" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:tracking-[0.25em] transition-all">Change Secret Key</span>
                  </button>

                  <div className="pt-4 mt-4 border-t border-brand-50">
                    <button 
                      onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
                      className="w-full py-4 px-6 bg-red-50 hover:bg-red-500 hover:text-white rounded-[1.5rem] flex items-center justify-center gap-4 text-red-600 transition-all group shadow-sm"
                    >
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Depart Sanctuary</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Elite Concierge Card */}
            <div className="bg-brand-600 rounded-[3rem] p-8 text-brand-50 shadow-2xl shadow-brand-200/80 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <h3 className="text-2xl font-display font-bold mb-4 relative z-10">Elite Concierge</h3>
              <p className="text-brand-200 text-sm mb-8 relative z-10 leading-relaxed font-medium">Need something special for your next stay? Our 24/7 dedicated team is here to assist.</p>
              
              <Link to="/contact" className="w-full bg-white text-brand-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-50 transition-colors flex items-center justify-center gap-2 relative z-10 shadow-lg">
                Contact Support
              </Link>
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
      <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em] mb-1">{title}</p>
      <p className="text-3xl font-display font-black text-brand-600">{value}</p>
      <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mt-2">{label}</p>
    </div>
  </motion.div>
);

const QuickLink = ({ label }) => (
  <button className="w-full flex items-center justify-between py-4 px-5 bg-brand-50/50 rounded-2xl border border-transparent hover:border-brand-200 hover:bg-white text-brand-500 hover:text-brand-600 transition-all group">
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    <ArrowRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-black" />
  </button>
);

export default UserDashboard;
