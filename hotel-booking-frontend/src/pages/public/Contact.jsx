import { motion } from 'framer-motion';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  ChatBubbleLeftRightIcon,
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

import { useState } from 'react';
import api from '../../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const response = await api.post('/contact_messages', formData);
      setStatus({ type: 'success', text: response.data.message });
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.join(', ') || 'Something went wrong. Please try again.';
      setStatus({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };
  const contactInfo = [
    {
      title: 'Voice of Haven',
      detail: '+92 306 4368762',
      sub: 'Mon - Sun, 24/7 Support',
      icon: <PhoneIcon className="h-6 w-6" />,
    },
    {
      title: 'Digital Sanctuary',
      detail: 'stays@havenhotels.com',
      sub: 'Concierge response in 2h',
      icon: <EnvelopeIcon className="h-6 w-6" />,
    },
    {
      title: 'Physical Retreat',
      detail: 'DHA Phase 6, Lahore',
      sub: 'Punjab, Pakistan',
      icon: <MapPinIcon className="h-6 w-6" />,
    },
  ];

  return (
    <div className="bg-brand-50 min-h-screen overflow-hidden">
      {/* ── Cinematic Hero Section ────────────────────────────── */}
      <section className="relative h-[50vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1280&q=70" 
            alt="Hotel Lobby" 
            className="w-full h-full object-cover brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-600/40 via-transparent to-brand-50" />
        </div>
        
        <div className="relative z-10 text-center space-y-4 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand-200 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Connect with Us</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none"
          >
            Your Haven <br />
            <span className="italic font-medium text-brand-200 font-display capitalize">Awaits Your Call</span>
          </motion.h1>
        </div>
      </section>

      {/* ── Contact Grid ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 -mt-24 pb-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: The Inquiry Form */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-white rounded-[4rem] p-12 lg:p-16 shadow-[0_50px_100px_-30px_rgba(56,34,15,0.15)] border border-brand-100 space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-brand-600 tracking-tight leading-tight uppercase">Send a Message</h2>
              <div className="h-1.5 w-16 bg-brand-200 rounded-full" />
              <p className="text-brand-500/70 font-bold text-sm leading-relaxed max-w-md">
                Whether it's a special request or a simple inquiry, our concierge team is ready to curate your perfect stay.
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              {status.text && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-3xl text-[10px] font-black uppercase tracking-widest text-center border ${
                    status.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-red-50 text-red-600 border-red-100'
                  }`}
                >
                  {status.text}
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-brand-300 uppercase tracking-widest pl-2">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-brand-50 border border-brand-100 rounded-2xl p-5 text-brand-600 font-bold outline-none focus:ring-4 focus:ring-brand-400/10 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-brand-300 uppercase tracking-widest pl-2">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-brand-50 border border-brand-100 rounded-2xl p-5 text-brand-600 font-bold outline-none focus:ring-4 focus:ring-brand-400/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-brand-300 uppercase tracking-widest pl-2">Subject</label>
                <select 
                  className="w-full bg-brand-50 border border-brand-100 rounded-2xl p-5 text-brand-600 font-black text-xs uppercase tracking-widest outline-none focus:ring-4 focus:ring-brand-400/10 transition-all appearance-none cursor-pointer"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option>General Inquiry</option>
                  <option>Reservation Support</option>
                  <option>Event Planning</option>
                  <option>Special Packages</option>
                </select>
              </div>

              <div className="space-y-3 relative">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-brand-300 uppercase tracking-widest pl-2">Your Thoughts</label>
                  <span className={`text-[9px] font-black uppercase tracking-widest pr-2 ${formData.message.length >= 500 ? 'text-red-400' : 'text-brand-300'}`}>
                    {formData.message.length}/500
                  </span>
                </div>
                <textarea 
                  required
                  rows="3"
                  maxLength={500}
                  placeholder="How can we make your stay extraordinary?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-brand-50 border border-brand-100 rounded-[2rem] p-6 text-brand-600 font-bold outline-none focus:ring-4 focus:ring-brand-400/10 transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="group relative w-full h-20 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(56,34,15,0.4)] active:scale-[0.98] transition-all disabled:opacity-70"
              >
                <div className="absolute inset-0 bg-brand-600 group-hover:bg-brand-500 transition-colors" />
                <div className="relative z-10 flex items-center justify-center gap-4 text-white">
                  <span className="font-black text-[11px] uppercase tracking-[0.5em]">
                    {loading ? 'Dispatching...' : 'Dispatch Message'}
                  </span>
                  <ChatBubbleLeftRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </form>
          </motion.div>

          {/* Right Column: Contact Details & Map Vibe */}
          <div className="lg:col-span-5 space-y-12">
            
            {/* Info Cards */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {contactInfo.map((info, i) => (
                <div 
                  key={i} 
                  className="bg-white p-10 rounded-[3.5rem] border border-brand-50 shadow-xl shadow-brand-500/5 flex items-start gap-8 group hover:border-brand-300 transition-all"
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
                    {info.icon}
                  </div>
                  <div className="space-y-1 pt-2">
                    <h4 className="text-[10px] font-black text-brand-300 uppercase tracking-[0.3em]">{info.title}</h4>
                    <p className="text-xl font-black text-brand-600 uppercase tracking-tighter">{info.detail}</p>
                    <p className="text-xs font-bold text-brand-400 italic">{info.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Aesthetic Visual Box */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-brand-600 rounded-[4rem] p-12 text-white relative overflow-hidden group shadow-2xl"
            >
              {/* Background abstract element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10 space-y-8">
                <div className="space-y-3">
                  <h3 className="text-2xl font-black uppercase tracking-tight italic">Our Global <br />Standards</h3>
                  <div className="h-1 w-12 bg-white/30 rounded-full" />
                </div>
                
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <ClockIcon className="h-6 w-6 text-brand-200" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-100">Global Response 24h</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <GlobeAltIcon className="h-6 w-6 text-brand-200" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-100">Lahore • Dubai • London</span>
                   </div>
                </div>

                <div className="pt-4">
                  <p className="text-xs font-bold text-brand-200 italic leading-relaxed">
                    "Rooted in tradition, responding with modern speed. We treat every inquiry with the same warmth we treat our guests."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── Experience Closer ───────────────────────────────────── */}
      <section className="py-32 bg-brand-100 border-t border-brand-200 flex flex-col items-center justify-center text-center space-y-10">
          <h2 className="text-4xl md:text-6xl font-black text-brand-600 tracking-tighter uppercase italic max-w-2xl px-6 leading-none">
            Escape the Ordinary <br /> 
            <span className="text-brand-400 font-medium">Join us at Haven</span>
          </h2>
          <div className="flex gap-4">
             <div className="w-2 h-2 rounded-full bg-brand-400" />
             <div className="w-2 h-2 rounded-full bg-brand-300" />
             <div className="w-2 h-2 rounded-full bg-brand-200" />
          </div>
      </section>
    </div>
  );
};

export default Contact;
