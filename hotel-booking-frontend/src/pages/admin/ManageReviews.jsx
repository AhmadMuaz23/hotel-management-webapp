import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import api from '../../services/api';
import { motion } from 'framer-motion';

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/admin/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setErrorMsg('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (review) => {
    if (!window.confirm(`Are you sure you want to permanently delete this review by ${review.user?.name}?`)) return;
    try {
      await api.delete(`/admin/reviews/${review.id}`);
      fetchReviews();
    } catch (error) {
      alert('Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const searchLower = searchTerm.toLowerCase();
    const matchesUser = (review.user?.name || '').toLowerCase().includes(searchLower);
    const matchesRoom = (review.room?.name || '').toLowerCase().includes(searchLower);
    const matchesComment = (review.comment || '').toLowerCase().includes(searchLower);
    return matchesUser || matchesRoom || matchesComment;
  });

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          i < rating ? 
            <StarIconSolid key={i} className="w-3 h-3 text-yellow-400" /> : 
            <StarIcon key={i} className="w-3 h-3 text-brand-100" />
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-brand-600 tracking-tighter uppercase leading-none italic">Guest Insights</h1>
          <p className="text-brand-300 font-bold italic text-xs uppercase tracking-widest">Oversee the whispers and murmurs of the sanctuary.</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-brand-500/5 border border-brand-50 flex flex-col justify-between gap-6">
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-300" />
          <input
            type="text"
            placeholder="Search insights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-brand-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-brand-200 transition-all font-black text-[10px] uppercase tracking-widest text-brand-600"
          />
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-brand-500/5 border border-brand-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-brand-50/30 text-brand-300 text-[10px] font-black uppercase tracking-widest border-b border-brand-50">
                <th className="px-10 py-6">Resident</th>
                <th className="px-6 py-6">Sanctuary</th>
                <th className="px-6 py-6 text-center">Score</th>
                <th className="px-6 py-6 w-1/3">Commentary</th>
                <th className="px-6 py-6 text-center">Date</th>
                <th className="px-10 py-6 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-[10px] font-black uppercase tracking-widest text-brand-200 italic">Gathering interpretations...</td>
                </tr>
              ) : errorMsg ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-[10px] font-black uppercase tracking-widest text-red-400 italic">Error: {errorMsg}</td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-[10px] font-black uppercase tracking-widest text-brand-200 italic">No whispers found in the registry.</td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-brand-50/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center font-black text-brand-600 text-xs italic shadow-sm group-hover:bg-brand-600 group-hover:text-white transition-all">
                          {review.user?.name?.charAt(0) || 'G'}
                        </div>
                        <div>
                          <p className="font-black text-sm text-brand-600 uppercase tracking-tight leading-none">{review.user?.name || 'Unknown'}</p>
                          <p className="text-[10px] font-bold text-brand-300 italic mt-1">{review.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="font-black text-[11px] text-brand-500 uppercase tracking-wider">{review.room?.name || 'Deleted Room'}</span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-black text-xs text-brand-600 italic">{review.rating}.0</span>
                        {renderStars(review.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-xs text-brand-500 font-medium leading-relaxed italic line-clamp-2" title={review.comment}>
                        "{review.comment}"
                      </p>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="font-bold text-[10px] text-brand-400 uppercase tracking-widest">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <button 
                          onClick={() => handleDeleteReview(review)}
                          className="p-2.5 rounded-xl bg-red-50 text-red-600 shadow-lg hover:bg-red-600 hover:text-white transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                          title="Purge Interpretation"
                        >
                          <TrashIcon className="w-4 h-4" />
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
    </motion.div>
  );
}
