import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { CalendarIcon, UserGroupIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const UserBookings = () => {
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
      console.error(err);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
         <h1 className="text-3xl font-extrabold text-slate-900 border-l-8 border-blue-600 pl-6 mb-2">My Bookings</h1>
         <p className="text-slate-500 font-medium pl-8">Welcome back, {user.name}. Manage your reservations and stay history.</p>
      </div>

      {loading ? (
        <div className="text-center p-20 text-blue-600 animate-bounce font-bold">Scanning the registry...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-200 text-center">
           <div className="text-6xl mb-6">🧳</div>
           <h3 className="text-2xl font-bold text-slate-800 mb-2">No bookings found</h3>
           <p className="text-slate-500 mb-8">Ready for your next adventure? Find your perfect room today.</p>
           <a href="/rooms" className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:shadow-xl transition">Explore Rooms</a>
        </div>
      ) : (
        <div className="space-y-6">
           {bookings.map(booking => (
             <div key={booking.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition duration-300 flex flex-col md:flex-row gap-8 items-center">
                <div className="h-32 w-full md:w-48 rounded-2xl overflow-hidden shadow-md">
                   <img src="https://images.unsplash.com/photo-1578683062331-1eec0b4e2808?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 space-y-4 w-full text-center md:text-left">
                   <div className="flex justify-between items-start">
                      <div>
                         <h3 className="text-2xl font-bold text-slate-800">{booking.room?.name}</h3>
                         <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{booking.room?.category?.replace('_', ' ')}</span>
                      </div>
                      <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                         {booking.status}
                      </span>
                   </div>
                   
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-slate-600">
                         <CalendarIcon className="h-5 w-5 text-blue-500" />
                         <span className="text-sm font-medium">{booking.check_in} — {booking.check_out}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                         <UserGroupIcon className="h-5 w-5 text-blue-500" />
                         <span className="text-sm font-medium">{booking.guests} Guest{booking.guests>1?'s':''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-700 font-bold">
                         <InformationCircleIcon className="h-5 w-5" />
                         <span className="text-lg">Rs. {Math.round(booking.total_price).toLocaleString()}</span>
                      </div>
                   </div>
                </div>

                <div className="flex gap-4">
                   {booking.status === 'pending' && (
                     <button className="text-red-500 text-sm font-bold border border-red-100 px-4 py-2 rounded-xl hover:bg-red-50 transition">Cancel</button>
                   )}
                   <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:shadow-blue-200 transition">View Details</button>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;
