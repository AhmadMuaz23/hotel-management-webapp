import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { motion } from 'framer-motion';
import SmartAvatar from '../../components/ui/Avatar';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      const rawError = JSON.stringify(error, Object.getOwnPropertyNames(error));
      console.error('Failed to fetch users:', error);
      setErrorMsg(`Crash details: ${rawError}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (user) => {
    if (user.role === 'admin') return;
    try {
      const action = user.status === 'blocked' ? 'unblock' : 'block';
      await api.put(`/users/${user.id}/${action}`);
      fetchUsers();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.role === 'admin') return;
    if (!window.confirm(`Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`)) return;
    try {
      await api.delete(`/users/${user.id}`);
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole || (filterRole === 'guest' && user.role !== 'admin');
    return matchesSearch && matchesRole;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-brand-600 tracking-tighter uppercase leading-none italic">Guest Registry</h1>
          <p className="text-brand-300 font-bold italic text-xs uppercase tracking-widest">Oversee the residents of the haven sanctuary.</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-brand-500/5 border border-brand-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-300" />
          <input
            type="text"
            placeholder="Scan registry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-brand-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-brand-200 transition-all font-black text-[10px] uppercase tracking-widest text-brand-600"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-6 py-3.5 bg-brand-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-brand-200 font-black text-[10px] uppercase tracking-widest text-brand-400 cursor-pointer transition-all"
          >
            <option value="all">Every Persona</option>
            <option value="admin">Administrators</option>
            <option value="guest">Verified Guests</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-500/5 border border-brand-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-brand-50/30 text-brand-300 text-[10px] font-black uppercase tracking-widest border-b border-brand-50">
                <th className="px-10 py-6">Resident Details</th>
                <th className="px-6 py-6 text-center">Sanctuary Role</th>
                <th className="px-6 py-6 text-center">Vault Balance</th>
                <th className="px-6 py-6 text-center">Persona Status</th>
                <th className="px-6 py-6 text-center">Verified</th>
                <th className="px-10 py-6 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-[10px] font-black uppercase tracking-widest text-brand-200 italic">Synchronizing Guest list...</td>
                </tr>
              ) : errorMsg ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-[10px] font-black uppercase tracking-widest text-red-400 italic">Error: {errorMsg}</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-[10px] font-black uppercase tracking-widest text-brand-200 italic">Registry is silent.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-brand-50/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <SmartAvatar 
                          src={user.avatar_url} 
                          name={user.name} 
                          size="10" 
                          className="group-hover:ring-2 ring-brand-300 transition-all shadow-sm"
                        />
                        <div>
                          <p className="font-black text-sm text-brand-600 uppercase tracking-tight leading-none">{user.name}</p>
                          <p className="text-[10px] font-bold text-brand-300 italic mt-1">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm transform group-hover:scale-105 transition-all ${
                        user.role === 'admin' ? 'bg-brand-600 text-white italic' : 'bg-brand-50 text-brand-400 italic'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="font-black text-xs text-brand-600 italic">Rs. {(parseFloat(user.balance) || 0).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        user.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100 italic' :
                        'bg-red-50 text-red-600 border border-red-100 italic'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex justify-center">
                        {user.verified ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="w-5 h-5 text-brand-100" />
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      {user.role !== 'admin' && (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                          <button 
                            onClick={() => handleToggleBlock(user)}
                            className={`px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg ${
                               user.status === 'blocked' ? 
                               'bg-green-600 text-white shadow-green-200' : 
                               'bg-orange-50 text-orange-600 shadow-orange-50'
                            }`}
                          >
                            {user.status === 'blocked' ? 'Unblock' : 'Block'}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user)}
                            className="p-2.5 rounded-xl bg-red-50 text-red-600 shadow-lg hover:bg-red-600 hover:text-white transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                            title="Delete Resident"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

