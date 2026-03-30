import { useState, useEffect } from 'react';
import api from '../../services/api';

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

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-black text-slate-900 tracking-tight">Booking Management</h1>
         <p className="text-slate-500 font-medium">Approve, cancel or modify hotel reservations.</p>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
        <table className="w-full text-left">
           <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                 <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">User</th>
                 <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Room</th>
                 <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Dates</th>
                 <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Total</th>
                 <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Status</th>
                 <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-right">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {bookings.length === 0 ? (
                <tr><td colSpan="6" className="p-10 text-center text-slate-400">No records found.</td></tr>
              ) : bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-blue-50/10 transition">
                   <td className="px-6 py-5 text-sm font-bold text-slate-900">{booking.user?.name || 'User'}</td>
                   <td className="px-6 py-5 text-sm">{booking.room?.name}</td>
                   <td className="px-6 py-5 text-xs text-slate-400">
                      {booking.check_in} — {booking.check_out}
                   </td>
                   <td className="px-6 py-5 font-bold text-blue-600">Rs. {Math.round(booking.total_price).toLocaleString()}</td>
                   <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         booking.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                         booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                         {booking.status}
                      </span>
                   </td>
                   <td className="px-6 py-5 text-right space-x-2">
                      {booking.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(booking.id, 'approve')} className="bg-emerald-600 text-white text-[10px] p-2 px-3 rounded-lg font-bold hover:shadow-lg shadow-emerald-200 transition">Approve</button>
                          <button onClick={() => updateStatus(booking.id, 'cancel')} className="bg-slate-100 text-slate-600 text-[10px] p-2 px-3 rounded-lg font-bold hover:bg-slate-200 transition">Deny</button>
                        </>
                      )}
                      {booking.status === 'cancelled' ? (
                          <button onClick={() => deleteBooking(booking.id)} className="bg-red-50 text-red-600 text-[10px] p-2 px-3 rounded-lg font-bold hover:bg-red-100 transition">Remove</button>
                      ) : (
                          <button className="text-slate-300 hover:text-blue-500 transition cursor-not-allowed">•••</button>
                      )}
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
