import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrashIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';

const ManageBookings = () => {
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
      console.error(err);
    }
    setLoading(false);
  };

  const updateStatus = async (id, action) => {
    try {
      await api.put(`/bookings/${id}/${action}`);
      fetchBookings(); // Refresh list
    } catch (err) {
      alert('Action failed');
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to permanently remove this booking record?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      alert('Failed to delete booking');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-400">Loading Reservations...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div className="space-y-2">
         <h1 className="text-3xl md:text-4xl font-black text-brand-600 tracking-tighter uppercase leading-none italic">Manage Bookings</h1>
         <p className="text-brand-300 font-bold italic text-xs uppercase tracking-widest">Maintain the sanctuary occupancy and reservation flow.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] overflow-hidden shadow-xl shadow-brand-500/5 border border-white/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
             <thead>
                <tr className="bg-brand-50/30 border-b border-brand-50">
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-300">Guest</th>
                   <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-brand-300">Sanctuary</th>
                   <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-brand-300">Timeline</th>
                   <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-brand-300">Premium</th>
                   <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-brand-300">Status</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-brand-300 text-right">Sanctuary Control</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-brand-50/50">
                {bookings.length === 0 ? (
                  <tr><td colSpan="6" className="p-20 text-center text-[10px] font-black uppercase tracking-[0.2em] text-brand-200 italic">No reservation records found.</td></tr>
                ) : bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-brand-50/20 transition-all group">
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center font-black text-brand-600 text-[10px] italic group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm">
                              {booking.user?.name?.charAt(0) || 'G'}
                           </div>
                           <span className="text-sm font-black text-brand-600 uppercase tracking-tight">{booking.user?.name || 'Guest'}</span>
                        </div>
                     </td>
                     <td className="px-6 py-6 text-[11px] font-bold text-brand-500 uppercase tracking-wide italic">{booking.room?.name || 'Sanctuary Unit'}</td>
                     <td className="px-6 py-6">
                       <p className="text-[10px] font-black text-brand-400 uppercase tracking-tighter italic">
                          {new Date(booking.check_in).toLocaleDateString()} — {new Date(booking.check_out).toLocaleDateString()}
                       </p>
                     </td>
                     <td className="px-6 py-6 font-black text-xs text-brand-600 italic">Rs. {Math.round(booking.total_price).toLocaleString()}</td>
                     <td className="px-6 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                           booking.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-100 italic' :
                           booking.status === 'completed' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 italic' :
                           booking.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100 italic' : 'bg-orange-50 text-orange-600 border border-orange-100 italic'
                        }`}>
                           {booking.status}
                        </span>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 transition-all">
                          {booking.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => updateStatus(booking.id, 'approve')} 
                                className="bg-brand-600 text-white p-2.5 rounded-xl shadow-lg shadow-brand-200 hover:scale-110 active:scale-95 transition-all"
                                title="Confirm Reservation"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => updateStatus(booking.id, 'cancel')} 
                                className="bg-white border border-brand-100 text-brand-400 p-2.5 rounded-xl hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all hover:scale-110 active:scale-95"
                                title="Deny Reservation"
                              >
                                <XCircleIcon className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          
                          {booking.status === 'approved' && (
                            <button 
                              onClick={() => updateStatus(booking.id, 'cancel')} 
                              className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all hover:scale-110 active:scale-95 shadow-lg shadow-red-50 border border-red-100"
                              title="Cancel & Refund Reservation"
                            >
                              <XCircleIcon className="w-4 h-4" />
                            </button>
                          )}

                          {booking.status === 'cancelled' ? (
                              <button 
                                onClick={() => deleteBooking(booking.id)} 
                                className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-md shadow-red-100 hover:scale-110 active:scale-95"
                                title="Remove Permanently"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                          ) : (
                              (booking.status !== 'approved' && booking.status !== 'pending') && (
                                <div className="p-2.5 text-brand-100 cursor-not-allowed">
                                  <EllipsisHorizontalIcon className="w-4 h-4" />
                                </div>
                              )
                          )}
                        </div>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageBookings;
