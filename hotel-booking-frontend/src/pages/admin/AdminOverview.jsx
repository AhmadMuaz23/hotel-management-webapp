import { useState, useEffect } from 'react';
import api from '../../services/api';

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
    <div className="flex items-center justify-center h-full text-blue-500 font-bold">
      Loading Dashboard...
    </div>
  );

  const { stats, recent_bookings, recent_users } = dashboardData || {};

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Settings Grid - 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={(stats?.total_users || 0).toLocaleString()} />
        <StatCard title="Total Rooms" value={(stats?.total_rooms || 0).toLocaleString()} />
        <StatCard title="Total Bookings" value={(stats?.active_bookings || 0).toLocaleString()} />
        <StatCard title="Total Revenue" value={`Rs. ${(stats?.total_revenue || 0).toLocaleString()}`} />
      </div>

      {/* Main Lists Section */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Recent Bookings - Taking full available width in this layout approach */}
        <div className="bg-white rounded-[1.5rem] shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 w-1/4">Guest</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500">Room</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500">Check-In</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500">Check-Out</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recent_bookings?.length > 0 ? recent_bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-600 text-xs text-center border shadow-sm">
                        {booking.user?.name?.charAt(0) || 'G'}
                      </div>
                      <span className="font-bold text-sm text-slate-800">{booking.user?.name || 'Guest'}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{booking.room?.name || 'Standard Room'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{new Date(booking.check_in).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{new Date(booking.check_out).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-md ${
                        booking.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-100' :
                        booking.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                        'bg-orange-50 text-orange-600 border border-orange-100'
                      }`}>
                        {booking.status === 'approved' ? 'Confirmed' : booking.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800 text-right">
                      Rs. {Math.round(booking.total_price).toLocaleString()}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="text-center py-8 text-sm text-slate-400">No recent bookings found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users - Card Layout below */}
        <div className="bg-white rounded-[1.5rem] shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden w-full max-w-2xl">
          <div className="px-8 py-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Recent Users</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {recent_users?.length > 0 ? recent_users.map((u) => (
              <div key={u.id} className="px-8 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 border shadow-sm">
                    {u.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{u.name}</h3>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                </div>
                <button className="text-slate-300 group-hover:text-slate-600 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )) : (
               <div className="px-8 py-6 text-sm text-slate-400">No recent users.</div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-[1.25rem] p-6 shadow-sm shadow-slate-200/50 border border-slate-100 flex flex-col justify-center space-y-2 h-[120px]">
    <h3 className="text-sm font-bold text-slate-500">{title}</h3>
    <p className="text-3xl font-bold text-slate-800">{value}</p>
  </div>
);

export default AdminOverview;
