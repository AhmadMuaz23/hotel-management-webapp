import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import {
  ShieldCheckIcon,
  ArrowRightIcon,
  KeyIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import 'swiper/css';
import 'swiper/css/pagination';

/* ─── Category images (fallback per category) ──────────────── */
const categoryImages = {
  presidential: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80',
  couple:       'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
  single:       'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80',
  family:       'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
};

const categoryLabels = {
  single: 'Solo',
  couple: 'Couple',
  family: 'Family',
  presidential: 'Elite',
};

/* ─── Page ──────────────────────────────────────────────────── */
const Home = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [featuredRooms, setFeaturedRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms');
        const rooms = res.data;
        // Pick one room per category for variety
        const seen = {};
        const picked = [];
        for (const room of rooms) {
          if (!seen[room.category]) {
            seen[room.category] = true;
            picked.push(room);
          }
        }
        setFeaturedRooms(picked.length > 0 ? picked : rooms.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="overflow-hidden bg-brand-50">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[650px] flex items-center pt-20 px-4">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80"
            alt="Warm Interior"
            className="w-full h-full object-cover brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-100/80 via-brand-100/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="max-w-3xl space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12 bg-brand-400" />
              <span className="text-brand-500 text-xs font-black uppercase tracking-[0.4em]">Est. 1998</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-brand-600 leading-[1.1] tracking-tighter">
              Authentic <br />
              <span className="text-brand-400 italic font-medium">Warmth</span> &{' '}
              <br />
              Comfort
            </h1>

            <p className="text-lg text-brand-500/80 max-w-lg font-bold leading-relaxed">
              Step into a sanctuary of earthy tones and natural textures. HavenHotels offers a
              unique stay that feels like home, only better.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Philosophy ─────────────────────────────────────────── */}
      <section className="py-32 bg-brand-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="col-span-1 space-y-6">
              <h2 className="text-xs font-black text-brand-400 tracking-[0.3em] uppercase">
                Our Philosophy
              </h2>
              <p className="text-4xl font-black text-brand-600 leading-tight">
                Grounded in Nature's Beauty
              </p>
              <div className="h-1 w-20 bg-brand-200 rounded-full" />
            </div>
            <div className="col-span-1 md:col-span-2 text-lg text-brand-500 font-bold leading-relaxed opacity-80">
              We believe luxury shouldn't be cold. Inspired by the soft hues of desert sands and
              aged oak, our spaces are designed to calm the mind and soothe the soul. Every detail
              is handpicked to provide a textured, organic experience.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
            <InfoBox icon={<SparklesIcon className="h-8 w-8" />} title="Organic Textures" desc="Natural linen, solid wood, and stone finishes in every room." />
            <InfoBox icon={<KeyIcon className="h-8 w-8" />} title="Private Access" desc="Disguised entrances and private gardens for ultimate solitude." />
            <InfoBox icon={<ShieldCheckIcon className="h-8 w-8" />} title="Pure Comfort" desc="Eco-friendly climate control and soundproofing for deep rest." />
          </div>
        </div>
      </section>

      {/* ── Featured Rooms Slider ──────────────────────────────── */}
      <section className="py-24 bg-brand-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Section header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-14">
            <div className="space-y-3">
              <p className="text-xs font-black text-brand-400 tracking-[0.3em] uppercase">Selected Stays</p>
              <h2 className="text-4xl md:text-5xl font-black text-brand-600">The Comfort Collection</h2>
            </div>
            <Link
              to="/rooms"
              className="group flex items-center gap-3 border-b-2 border-brand-300 pb-1 font-black text-xs uppercase tracking-[0.2em] text-brand-600 hover:text-brand-400 hover:border-brand-400 transition-all"
            >
              Explore All Stays
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Slider wrapper — side padding creates gutters for buttons */}
          <div className="relative px-16">

            {/* Prev — absolute in left gutter, centered on card IMAGE (≈38% from top) */}
            <button
              ref={prevRef}
              aria-label="Previous"
              className="absolute left-0 top-[38%] -translate-y-1/2 z-20
                         w-12 h-12 rounded-2xl bg-white border border-brand-200 shadow-md
                         flex items-center justify-center
                         hover:bg-brand-600 hover:border-brand-600 hover:text-white
                         text-brand-600 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            {/* Next — absolute in right gutter */}
            <button
              ref={nextRef}
              aria-label="Next"
              className="absolute right-0 top-[38%] -translate-y-1/2 z-20
                         w-12 h-12 rounded-2xl bg-white border border-brand-200 shadow-md
                         flex items-center justify-center
                         hover:bg-brand-600 hover:border-brand-600 hover:text-white
                         text-brand-600 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>

            {/* Swiper fills the inner padded area — buttons are in the gutters */}
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              loop
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                640:  { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="w-full !pb-12"
            >
              {featuredRooms.map((room) => (
                <SwiperSlide key={room.id}>
                  <StayCard room={room} />
                </SwiperSlide>
              ))}
            </Swiper>

          </div>
        </div>
      </section>

      {/* ── Experience Section ─────────────────────────────────── */}
      <section className="py-32 px-4 bg-brand-50">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[4rem] overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1920&q=80"
                alt="Spa"
                className="w-full h-full object-cover grayscale opacity-30"
              />
              <div className="absolute inset-0 bg-brand-500/20 mix-blend-multiply" />
            </div>
            <div className="relative z-10 p-12 md:p-24 bg-white/60 backdrop-blur-lg border border-white/40 flex flex-col items-center text-center space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-brand-600">
                Refined Dining <br /> &amp; Wellness
              </h2>
              <p className="text-brand-500 max-w-xl font-bold">
                Our farm-to-table restaurant and thermal spas are designed around the same organic
                principles as our rooms.
              </p>
              <Link 
                to="/about"
                className="bg-brand-600 hover:bg-brand-500 text-white px-14 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-brand-500/30 inline-block"
              >
                Discover More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Achievements ──────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-brand-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-10 bg-brand-300" />
              <span className="text-brand-300 text-xs font-black uppercase tracking-[0.4em]">Our Legacy</span>
              <div className="h-[1px] w-10 bg-brand-300" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-brand-50 tracking-tight">
              Milestones That{' '}
              <span className="italic font-medium text-brand-200">Define Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[
              { icon: <ShieldCheckIcon className="h-8 w-8" />, value: '28+', label: 'Years of Legacy' },
              { icon: <UserIcon className="h-8 w-8" />, value: '12k+', label: 'Happy Guests' },
              { icon: <SparklesIcon className="h-8 w-8" />, value: '24', label: 'Premium Sanctuaries' },
              { icon: <KeyIcon className="h-8 w-8" />, value: 'Top', label: 'Guest Satisfaction' },
            ].map(({ icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-[2rem] p-8 text-center hover:bg-white/15 transition-all duration-500"
              >
                <div className="text-brand-200 mb-4 flex justify-center">{icon}</div>
                <p className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none">{value}</p>
                <p className="text-brand-300 text-xs font-black uppercase tracking-[0.2em] mt-3">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-brand-600">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-7xl font-black text-brand-50 tracking-tighter italic">
            Let the Journey <br /> Begin Naturally
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link
              to="/register"
              className="bg-brand-50 text-brand-600 px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Join the Circle
            </Link>
            <Link
              to="/rooms"
              className="text-brand-100 font-black text-xs uppercase tracking-widest group flex items-center gap-3"
            >
              Browse Rooms
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

/* ─── Sub-components ────────────────────────────────────────── */
const InfoBox = ({ icon, title, desc }) => (
  <div className="p-10 rounded-[3rem] bg-white shadow-xl shadow-brand-200/20 border border-brand-100/50 hover:border-brand-300 transition-all duration-500">
    <div className="mb-8 text-brand-400">{icon}</div>
    <h3 className="text-xl font-black text-brand-600 mb-4">{title}</h3>
    <p className="text-brand-500/70 font-bold text-sm leading-relaxed">{desc}</p>
  </div>
);

const StayCard = ({ room }) => {
  const image = categoryImages[room.category] || categoryImages.single;
  const label = categoryLabels[room.category] || room.category;
  const price = Number(room.price_per_night).toLocaleString();

  return (
    <Link to={`/rooms/${room.id}`} className="group block focus:outline-none">
      {/* Image box */}
      <div className="relative rounded-[3.5rem] overflow-hidden mb-8 aspect-[5/6] border border-brand-100 shadow-xl shadow-brand-500/5 bg-brand-50">
        <img
          src={image}
          alt={room.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
        />
        <div className="absolute top-6 left-6 z-10">
          <span className="bg-white/80 backdrop-blur-md px-5 py-2 rounded-2xl text-[9px] font-black text-brand-600 uppercase tracking-[0.2em] shadow-sm border border-white/40">
            {label}
          </span>
        </div>
      </div>

      <div className="px-6 space-y-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-black text-brand-600 group-hover:text-brand-400 transition-colors leading-tight uppercase tracking-tight">
            {room.name}
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-200" />
            <span className="text-[10px] font-black text-brand-300 uppercase tracking-widest leading-none">Verified Sanctuary</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-brand-50">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-brand-600 italic font-display">Rs.{price}</span>
            <span className="text-[9px] font-black text-brand-300 uppercase tracking-widest">/ night</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-300 group-hover:bg-brand-600 group-hover:text-white transition-all">
            <span className="text-xl">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Home;
