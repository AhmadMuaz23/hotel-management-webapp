import { useState, useEffect } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'single_room',
    status: 'available',
    capacity: 1,
    price_per_night: '',
    is_featured: false
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        name: room.name,
        description: room.description,
        category: room.category,
        status: room.status,
        capacity: room.capacity,
        price_per_night: room.price_per_night,
        is_featured: room.is_featured
      });
    } else {
      setEditingRoom(null);
      setFormData({
        name: '', description: '', category: 'single_room', status: 'available', capacity: 1, price_per_night: '', is_featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.id}`, formData);
      } else {
        await api.post('/rooms', formData);
      }
      setIsModalOpen(false);
      fetchRooms();
    } catch (error) {
      alert('Operation failed. Please check the form data.');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this room?')) {
      try {
        await api.delete(`/rooms/${id}`);
        fetchRooms();
      } catch (error) {
        alert('Deletion failed.');
      }
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 relative"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-brand-600 tracking-tighter uppercase leading-none italic">Manage Rooms</h1>
          <p className="text-brand-300 font-bold italic text-xs uppercase tracking-widest">Architect and refine the hotel collection.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-3 bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-brand-200 active:scale-95"
        >
          <PlusIcon className="w-4 h-4" />
          Add Room
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-brand-500/5 border border-brand-50">
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-300" />
          <input
            type="text"
            placeholder="Scan inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-brand-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-brand-200 transition-all font-black text-[10px] uppercase tracking-widest text-brand-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-500/5 border border-brand-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-brand-50/30 text-brand-300 text-[10px] font-black uppercase tracking-widest border-b border-brand-50">
                <th className="px-10 py-6">Room Details</th>
                <th className="px-6 py-6 text-center">Category</th>
                <th className="px-6 py-6 text-center">Identity</th>
                <th className="px-6 py-6 text-center">Availability</th>
                <th className="px-6 py-6 text-center">Capacity</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50/50 font-bold text-brand-500">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-[10px] font-black uppercase tracking-widest text-brand-200 italic">Syncing unit data...</td>
                </tr>
              ) : filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-[10px] font-black uppercase tracking-widest text-brand-200 italic">No inventory matches found.</td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-brand-50/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="w-full max-w-[250px]">
                        <div className="font-black text-brand-600 text-sm uppercase tracking-tight">{room.name}</div>
                        {room.is_featured && (
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black bg-brand-600 text-white mt-1.5 uppercase tracking-[0.2em] italic shadow-lg shadow-brand-100">
                            Signature Collection
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="capitalize font-black text-[10px] text-brand-600 uppercase tracking-widest italic">{room.category.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-6 text-center font-black text-xs text-brand-400 italic">
                      Rs. {Number(room.price_per_night).toLocaleString()}
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        room.status === 'available' ? 'bg-green-50 text-green-600 border border-green-100 italic' :
                        room.status === 'booked' ? 'bg-orange-50 text-orange-600 border border-orange-100 italic' :
                        'bg-red-50 text-red-600 border border-red-100 italic'
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center text-xs font-black text-brand-300">
                      {room.capacity} Guests
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <button onClick={() => handleOpenModal(room)} className="p-2.5 text-brand-300 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all hover:scale-110" title="Edit Room">
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(room.id)} className="p-2.5 text-brand-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all hover:scale-110" title="Delete Room">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-600/10 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] p-8 md:p-12 w-full max-w-2xl shadow-2xl relative z-20 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-brand-600 uppercase tracking-tighter italic leading-none">{editingRoom ? 'Edit Room' : 'Create Room'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-brand-300 hover:text-brand-600 bg-brand-50 p-2.5 rounded-full transition-colors active:scale-90">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-[9px] font-black text-brand-300 uppercase tracking-widest ml-1 italic">Identity Name</label>
                    <input required type="text" className="w-full bg-brand-50 border border-transparent px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-brand-600 focus:bg-white focus:border-brand-200 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-[9px] font-black text-brand-300 uppercase tracking-widest ml-1 italic">Story & Description</label>
                    <textarea required className="w-full bg-brand-50 border border-transparent px-5 py-4 rounded-2xl font-bold text-xs italic text-brand-500 min-h-[120px] focus:bg-white focus:border-brand-200 outline-none transition-all leading-relaxed" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-brand-300 uppercase tracking-widest ml-1 italic">Room Category</label>
                    <select className="w-full bg-brand-50 border border-transparent px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-brand-600 focus:bg-white focus:border-brand-200 outline-none transition-all cursor-pointer" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="single_room">Single Retreat</option>
                      <option value="couple_room">Couple Haven</option>
                      <option value="family_room">Family Sanctuary</option>
                      <option value="presidential_suite">Presidential Suite</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-brand-300 uppercase tracking-widest ml-1 italic">Availability Status</label>
                    <select className="w-full bg-brand-50 border border-transparent px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-brand-600 focus:bg-white focus:border-brand-200 outline-none transition-all cursor-pointer" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-brand-300 uppercase tracking-widest ml-1 italic">Guest Capacity</label>
                    <input required type="number" min="1" className="w-full bg-brand-50 border border-transparent px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-brand-600 focus:bg-white focus:border-brand-200 outline-none transition-all" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-brand-300 uppercase tracking-widest ml-1 italic">Premium Price (Rs)</label>
                    <input required type="number" className="w-full bg-brand-50 border border-transparent px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-brand-600 focus:bg-white focus:border-brand-200 outline-none transition-all italic" value={formData.price_per_night} onChange={e => setFormData({...formData, price_per_night: e.target.value})} />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-4 bg-brand-50 p-4 rounded-2xl">
                    <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="w-5 h-5 accent-brand-600 cursor-pointer" />
                    <label htmlFor="is_featured" className="text-[10px] font-black text-brand-600 uppercase tracking-widest cursor-pointer mt-0.5">Exhibit on Signature Collection</label>
                  </div>
                </div>

                <div className="pt-10 border-t border-brand-50 flex flex-col sm:flex-row justify-end gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-5 bg-brand-50 hover:bg-brand-100 font-black text-[10px] uppercase tracking-[0.3em] text-brand-400 rounded-2xl transition-all">Close</button>
                  <button type="submit" className="px-10 py-5 bg-brand-600 hover:bg-brand-500 font-black text-[10px] uppercase tracking-[0.3em] text-white rounded-2xl transition-all shadow-xl shadow-brand-200 active:scale-95">
                    {editingRoom ? 'Save Changes' : 'Create Room'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

