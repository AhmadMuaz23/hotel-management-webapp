import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  UserIcon,
  UsersIcon,
  BriefcaseIcon,
  GlobeAsiaAustraliaIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const categories = [
    { id: 'all', name: 'Discovery All', icon: <GlobeAsiaAustraliaIcon className="h-5 w-5" /> },
    { id: 'single_room', name: 'Haven Solo', icon: <UserIcon className="h-5 w-5" /> },
    { id: 'couple_room', name: 'Haven Duo', icon: <UsersIcon className="h-5 w-5" /> },
    { id: 'family_room', name: 'Haven Family', icon: <UserGroupIcon className="h-5 w-5" /> },
    { id: 'presidential_suite', name: 'Haven Elite', icon: <BriefcaseIcon className="h-5 w-5" /> },
  ];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      // Fetching all rooms once and filtering on client for instant experience with 24 rooms
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (err) {
      console.error('Error fetching rooms', err);
    }
    setLoading(false);
  };

  const filteredAndSortedRooms = rooms
    .filter(room => {
      const matchesCategory = activeCategory === 'all' || room.category === activeCategory;
      const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price_per_night - b.price_per_night;
      if (sortBy === 'price-high') return b.price_per_night - a.price_per_night;
      return b.id - a.id; // newest
    });

  return (
    <div className="bg-[#fcfaf8] min-h-screen">
      {/* ── High-End Minimalist Hero ──────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-200/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
                <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Available Collections</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-brand-600 tracking-tighter leading-none uppercase">
                The Haven <br />
                <span className="italic font-medium text-brand-400 font-display">Hotels.</span>
              </h1>
              <p className="text-brand-500 font-bold text-lg max-w-md leading-relaxed">
                Explore our meticulously curated sanctuaries, designed for those who seek more than just a stay.
              </p>
            </motion.div>

            {/* Premium Search Command Center - Modern design */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-[450px]"
            >
              <div className="bg-white p-8 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(56,34,15,0.15)] border border-brand-100 space-y-6">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-brand-300 uppercase tracking-widest pl-2">Discover by name</label>
                    <div className="relative group">
                       <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-400 group-focus-within:text-brand-600 transition-colors" />
                       <input 
                         type="text" 
                         placeholder="e.g. Haven, Vista, Royal" 
                         className="w-full pl-14 pr-6 py-4 bg-brand-50 border border-brand-100 rounded-2xl text-brand-600 font-bold focus:outline-none focus:ring-2 focus:ring-brand-400/20 transition-all"
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                       />
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-4">
                       <label className="text-[10px] font-black text-brand-300 uppercase tracking-widest pl-2">Sort by</label>
                       <select 
                         className="w-full px-5 py-4 bg-brand-50 border border-brand-100 rounded-2xl text-brand-600 font-black text-[10px] tracking-widest uppercase focus:outline-none transition-all cursor-pointer"
                         onChange={(e) => setSortBy(e.target.value)}
                       >
                          <option value="newest">Newest First</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                       </select>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Category Discovery Navigation ───────────────────────── */}
      <div className="sticky top-20 z-40 bg-[#fcfaf8]/80 backdrop-blur-xl border-y border-brand-100">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between py-6 min-w-max">
            <div className="flex items-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-500 border ${
                    activeCategory === cat.id 
                      ? 'bg-brand-600 border-brand-600 text-white shadow-xl shadow-brand-600/30' 
                      : 'bg-white border-brand-100 text-brand-400 hover:text-brand-600 hover:border-brand-300'
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
              {[1,2,3,4,5,6].map(n => (
                <div key={n} className="h-[550px] bg-white border border-brand-100 rounded-[4rem] animate-pulse" />
              ))}
            </motion.div>
          ) : (
            <>
              {filteredAndSortedRooms.length > 0 ? (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16"
                >
                  {filteredAndSortedRooms.map((room, i) => (
                    <RoomCard key={room.id} room={room} index={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="py-32 text-center"
                >
                   <div className="text-8xl mb-8">🍂</div>
                   <h3 className="text-3xl font-black text-brand-600">No rooms found.</h3>
                   <p className="text-brand-400 font-bold mt-2 italic">Maybe try a different category or search term?</p>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const RoomCard = ({ room, index }) => {
  const roomImages = [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=65",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=65",
    "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=600&q=65",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=65",
    "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=600&q=65",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=65"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.15 }}
      viewport={{ once: true }}
      className="group relative h-full flex flex-col"
    >
      <div className="relative h-[420px] rounded-[4rem] overflow-hidden mb-8 border border-brand-100 shadow-xl group-hover:shadow-2xl transition-all duration-700">
        <img 
          src={roomImages[room.id % 6]} 
          alt={room.name} 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
        />
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.2)_0%,transparent_50%)]" />
        
        {/* Category Badge */}
        <div className="absolute top-8 left-8">
           <div className="bg-white/80 backdrop-blur-xl px-5 py-2 rounded-2xl text-[9px] font-black text-brand-600 uppercase tracking-widest border border-white/50">
              {room.category.replace('_', ' ')}
           </div>
        </div>

        {/* Action Reveal */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-brand-600/10 backdrop-blur-[2px]">
           <Link 
            to={`/rooms/${room.id}`}
            state={{ room }}
            className="bg-white text-brand-600 px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-brand-600 hover:text-white transition-all transform hover:scale-105"
           >
             Book Suite
           </Link>
        </div>
      </div>

      <div className="flex-1 space-y-6 px-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
             <h3 className="text-2xl font-black text-brand-600 tracking-tight leading-none uppercase">
               {room.name}
             </h3>
             <div className="flex items-center gap-4 py-1">
                <div className="flex items-center gap-1.5">
                   <UserGroupIcon className="h-4 w-4 text-brand-300" />
                   <span className="text-[10px] font-black text-brand-300 uppercase tracking-widest">{room.capacity} Guests</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-brand-200" />
                <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest italic">{room.category.replace('_', ' ')}</span>
             </div>
          </div>
          
          <div className="text-right">
             <div className="text-2xl font-black text-brand-600 italic font-display">Rs.{Math.round(room.price_per_night).toLocaleString()}</div>
             <div className="text-[9px] font-black text-brand-300 uppercase tracking-widest">per night</div>
          </div>
        </div>

        <p className="text-brand-500/70 font-bold text-xs leading-relaxed line-clamp-2">
          {room.description}
        </p>

        <div className="pt-2 flex items-center justify-between">
           <Link to={`/rooms/${room.id}`} state={{ room }} className="flex items-center gap-2 group/link cursor-pointer">
              <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest group-hover/link:text-brand-600 transition-colors">Details</span>
              <ArrowsRightLeftIcon className="h-4 w-4 text-brand-200 group-hover/link:text-brand-600 transition-colors" />
           </Link>
           <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${room.status === 'booked' ? 'bg-red-500' : 'bg-green-500'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${room.status === 'booked' ? 'text-red-500' : 'text-brand-400'}`}>
                 {room.status === 'booked' ? 'Occupied' : 'In Stock'}
              </span>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Rooms;
