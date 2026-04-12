import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EnvelopeIcon, 
  TrashIcon, 
  ChatBubbleLeftEllipsisIcon,
  UserIcon,
  EnvelopeOpenIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [statusFilter, setStatusFilter] = useState('active'); // 'active' or 'resolved'

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact_messages');
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const resolveMessage = async (id) => {
    try {
      await api.put(`/contact_messages/${id}/resolve`);
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'resolved' } : m));
      // Optionally deselect if filtering
      if (statusFilter === 'active') {
        setSelectedMessage(null);
      }
    } catch (err) {
      alert('Failed to resolve inquiry');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await api.delete(`/contact_messages/${id}`);
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'active') {
      return matchesSearch && m.status !== 'resolved';
    } else {
      return matchesSearch && m.status === 'resolved';
    }
  });

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-brand-600 tracking-tighter uppercase leading-none italic">User Inquiries</h1>
          <p className="text-sm font-bold text-brand-400 italic">Manage and respond to guest messages.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white p-1 rounded-2xl border border-brand-100 shadow-sm">
            <button 
              onClick={() => setStatusFilter('active')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'active' ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' : 'text-brand-300 hover:text-brand-600'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setStatusFilter('resolved')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'resolved' ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' : 'text-brand-300 hover:text-brand-600'}`}
            >
              Resolved
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-300" />
            <input 
              type="text" 
              placeholder="Search landscape..."
              className="w-full bg-white border border-brand-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-brand-600 outline-none focus:ring-4 focus:ring-brand-400/10 transition-all font-black uppercase tracking-widest"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 bg-white/50 backdrop-blur-md rounded-3xl border border-dashed border-brand-200">
              <p className="text-xs font-bold text-brand-300 uppercase italic">No inquiries found.</p>
            </div>
          ) : filteredMessages.map(msg => (
            <motion.div 
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              whileHover={{ x: 4 }}
              className={`p-6 bg-white/80 backdrop-blur-xl border ${selectedMessage?.id === msg.id ? 'border-brand-600 ring-4 ring-brand-600/5' : 'border-white/50'} rounded-3xl cursor-pointer transition-all shadow-sm group`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-brand-600 uppercase tracking-tight line-clamp-1">{msg.name}</h4>
                  <p className="text-[10px] font-bold text-brand-300">{msg.email}</p>
                </div>
                <span className="text-[9px] font-black uppercase text-brand-400 italic">{new Date(msg.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-xs font-black text-brand-500 uppercase tracking-widest line-clamp-1">{msg.subject}</p>
            </motion.div>
          ))}
        </div>

        {/* Message Detail View */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div 
                key={selectedMessage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[3rem] p-10 lg:p-12 shadow-xl shadow-brand-500/5 h-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                
                <div className="relative z-10 space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-brand-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl">
                        <EnvelopeOpenIcon className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-brand-300 uppercase tracking-[0.2em]">{selectedMessage.subject}</p>
                        <h2 className="text-2xl font-black text-brand-600 uppercase tracking-tight italic">From: {selectedMessage.name}</h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       {selectedMessage.status !== 'resolved' && (
                         <button 
                           onClick={() => resolveMessage(selectedMessage.id)}
                           className="flex items-center gap-2 px-5 py-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm font-black text-[9px] uppercase tracking-widest"
                           title="Close Inquiry"
                         >
                            <CheckCircleIcon className="h-5 w-5" />
                            Close Inquiry
                         </button>
                       )}
                       <button 
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="Delete Permanently"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-brand-50">
                    <div className="flex items-center gap-4">
                      <UserIcon className="h-5 w-5 text-brand-300" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-brand-300 tracking-widest leading-none">Sender Name</span>
                        <span className="text-sm font-black text-brand-600">{selectedMessage.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <EnvelopeIcon className="h-5 w-5 text-brand-300" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-brand-300 tracking-widest leading-none">Callback Email</span>
                        <span className="text-sm font-black text-brand-600 underline decoration-brand-200 underline-offset-4">{selectedMessage.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 bg-brand-50/50 p-8 rounded-[2.5rem] min-h-[200px]">
                     <div className="flex items-center gap-2 mb-2">
                        <ChatBubbleLeftEllipsisIcon className="h-4 w-4 text-brand-300" />
                        <span className="text-[9px] font-black uppercase text-brand-300 tracking-widest">Guest's Message Content</span>
                     </div>
                     <p className="text-brand-600 font-bold leading-relaxed text-lg italic whitespace-pre-wrap">
                       "{selectedMessage.message}"
                     </p>
                  </div>

                  <div className="pt-6">
                    <a 
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="inline-flex items-center gap-3 bg-brand-600 hover:bg-brand-500 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-600/20 transition-all"
                    >
                      Draft Email Response
                      <EnvelopeIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/50 border border-brand-100 rounded-[3rem] border-dashed">
                <div className="w-20 h-20 bg-brand-100 rounded-[2rem] flex items-center justify-center text-brand-400 mb-6 drop-shadow-sm">
                  <EnvelopeIcon className="h-10 w-10 opacity-30" />
                </div>
                <h3 className="text-xl font-black text-brand-600 uppercase tracking-tight italic">Message Archive</h3>
                <p className="text-[10px] font-black text-brand-300 uppercase tracking-[0.2em] mt-2 max-w-xs">Select an inquiry from the list to preview details and respond.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ManageMessages;
