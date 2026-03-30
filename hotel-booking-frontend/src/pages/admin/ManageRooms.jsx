import { useState, useEffect } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

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
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Manage Rooms</h1>
          <p className="text-slate-500 mt-1 font-medium">Add, update, or remove hotel rooms</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-blue-600/20"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Room
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-sm font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-5">Room Name</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Price/Night</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Capacity</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500 font-medium">Loading rooms...</td>
                </tr>
              ) : filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500 font-medium">No rooms found.</td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-full max-w-[200px]">
                        <div className="font-bold text-slate-800 text-base truncate">{room.name}</div>
                        {room.is_featured && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 mt-1 uppercase tracking-widest">Featured</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize font-bold text-slate-700">{room.category.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4 text-blue-600 font-black">
                      Rs. {Number(room.price_per_night).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        room.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                        room.status === 'booked' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {room.capacity} Guests
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(room)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Room">
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(room.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Room">
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Room Name</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea required className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-medium min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                  <select className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-bold" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="single_room">Single Room</option>
                    <option value="couple_room">Couple Room</option>
                    <option value="family_room">Family Room</option>
                    <option value="presidential_suite">Presidential Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                  <select className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-bold" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Capacity</label>
                  <input required type="number" min="1" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-bold" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Price Per Night (Rs)</label>
                  <input required type="number" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-bold text-blue-600" value={formData.price_per_night} onChange={e => setFormData({...formData, price_per_night: e.target.value})} />
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="w-5 h-5 accent-blue-600" />
                  <label htmlFor="is_featured" className="font-bold text-slate-700 cursor-pointer">Feature this room on the homepage</label>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 font-bold text-slate-600 rounded-xl transition">Cancel</button>
                <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 font-bold text-white rounded-xl transition shadow-lg shadow-blue-600/20">
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
