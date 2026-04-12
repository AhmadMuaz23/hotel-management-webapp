import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  MapPinIcon, 
  HeartIcon,
  UserGroupIcon,
  TrophyIcon,
  KeyIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { id: 1, name: 'Years of Legacy', value: '28+', icon: <SparklesIcon className="h-6 w-6" /> },
    { id: 2, name: 'Happy Guests', value: '12k+', icon: <UserGroupIcon className="h-6 w-6" /> },
    { id: 3, name: 'Premium Properties', value: '24', icon: <KeyIcon className="h-6 w-6" /> },
    { id: 4, name: 'Guest Satisfaction', value: 'Top', icon: <ShieldCheckIcon className="h-6 w-6" /> },
  ];

  const team = [
    {
      name: 'Ahmad Muaaz',
      role: 'Founder & CEO',
      initials: 'AM',
      color: 'bg-brand-500',
    },
    {
      name: 'Bilal Khan',
      role: 'Technical Director',
      initials: 'BK',
      color: 'bg-brand-400',
    },
    {
      name: 'Tania Zaka',
      role: 'Operations Manager',
      initials: 'TZ',
      color: 'bg-accent-gold',
    },
  ];

  return (
    <div className="bg-brand-50 overflow-hidden">
      {/* ── Hero/Our Story Section ────────────────────────────── */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Image with organic masking inspiration */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=75" 
                alt="Our Tradition" 
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            {/* Subtle floating element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-200 rounded-full blur-3xl opacity-50 z-[-1]" />
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-brand-300 rounded-full blur-3xl opacity-20 z-[-1]" />
          </motion.div>

          {/* Right: Text content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2 space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-xs font-black text-brand-400 tracking-[0.4em] uppercase">Our Story</h2>
              <h1 className="text-4xl md:text-6xl font-black text-brand-600 tracking-tight leading-tight">
                A Tradition of <br />
                <span className="italic font-medium text-brand-400 font-display">Excellence</span> Since 1998
              </h1>
            </div>
            
            <p className="text-brand-500 font-bold leading-relaxed text-lg">
              Founded with a vision to provide travelers with a home away from home, Haven Hotels has grown into a leading name in luxury hospitality. We believe that every guest deserves more than just a place to sleep—they deserve an experience.
            </p>
            
            <p className="text-brand-500/80 font-bold leading-relaxed">
              From our meticulously designed rooms to our award-winning culinary offerings, every detail is crafted to perfection. Our team of dedicated professionals works round the clock to ensure your stay is seamless, comfortable, and truly memorable.
            </p>

            <div className="pt-6">
              <Link 
                to="/rooms" 
                className="inline-flex items-center justify-center px-10 py-4 bg-brand-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-500 transition-all shadow-xl shadow-brand-500/30"
              >
                Book Your Stay
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Statistics Section ─────────────────────────────────── */}
      <section className="bg-brand-600 py-24 px-6 lg:px-8 relative overflow-hidden">
        {/* Pattern overlap */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-10 bg-brand-300" />
              <span className="text-brand-300 text-xs font-black uppercase tracking-[0.4em]">Our Legacy</span>
              <div className="h-[1px] w-10 bg-brand-300" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-brand-50 tracking-tight">
              Milestones That <span className="italic font-medium text-brand-200 font-display">Define Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 text-brand-100 mb-2">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-1">{stat.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-200">{stat.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Section ────────────────────────────────────────── */}
      <section className="py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="space-y-4">
            <h2 className="text-xs font-black text-brand-400 tracking-[0.4em] uppercase">Excellence in Leadership</h2>
            <h3 className="text-4xl md:text-6xl font-black text-brand-600 tracking-tight leading-tight">Meet the Experts</h3>
          </div>
          <div className="hidden md:block w-24 h-[1px] bg-brand-200 mb-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative group h-full"
            >
              {/* Background Index Number - for that "Different" look */}
              <span className="absolute -top-10 -left-4 text-9xl font-black text-brand-100/40 select-none group-hover:text-brand-200/50 transition-colors duration-500">
                0{i + 1}
              </span>

              <div className="relative bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-brand-500/5 border border-brand-100 hover:border-brand-400 transition-all duration-500 h-full flex flex-col items-center justify-between space-y-10">
                {/* Initials Circle - styled with more depth */}
                <div className="relative">
                  <div className={`w-32 h-32 ${member.color} rounded-full flex items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] ring-8 ring-brand-50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700`}>
                    <span className="text-5xl font-black text-white italic tracking-tighter">{member.initials}</span>
                  </div>
                  {/* Subtle accent dot */}
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full border-4 border-brand-100 shadow-lg" />
                </div>

                <div className="text-center space-y-3">
                  <h4 className="text-2xl font-black text-brand-600 tracking-tight leading-tight">{member.name}</h4>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">
                    {member.role}
                  </div>
                </div>

                {/* Decorative element */}
                <div className="flex gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-200" />
                  <div className="w-8 h-1.5 rounded-full bg-brand-100 group-hover:bg-brand-400 transition-colors duration-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-200" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Values Section ──────────────────────────────────────── */}
      <section className="bg-brand-100 py-32 rounded-[5rem] mx-4 mb-24 overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <HeartIcon className="h-16 w-16 text-brand-400 mx-auto opacity-40" />
            <h2 className="text-3xl md:text-5xl font-black text-brand-600 leading-tight">
              Values That <span className="italic font-medium text-brand-400 font-display">Resonate</span> Through Every Hallway
            </h2>
            <p className="text-brand-500 font-bold leading-relaxed">
              At Haven Hotels, our culture is built on empathy, attention to detail, and a deep respect for natural beauty. We strive to be more than a business; we aim to be a sanctuary.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
