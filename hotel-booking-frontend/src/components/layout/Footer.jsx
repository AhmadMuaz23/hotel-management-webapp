import { Link, useLocation } from 'react-router-dom';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/profile') || location.pathname.startsWith('/admin');

  if (isDashboard) return null;

  return (
    <footer className="bg-brand-50 border-t border-brand-200/50 text-brand-600">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">

          {/* Col 1 — Brand */}
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">H</span>
              </div>
              <div className="leading-tight">
                <span className="text-brand-600 font-black text-xl tracking-tight">Haven</span>
                <span className="text-brand-400 font-black text-xl tracking-tight">Hotels</span>
              </div>
            </div>

            <p className="text-brand-500/80 text-sm leading-relaxed font-bold">
              Grounded in nature's warmth. Every room, every texture, every stay is crafted to bring you closer to comfort that feels like home.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { label: 'Instagram', path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7.5 2h9a5.5 5.5 0 015.5 5.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z' },
                { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
              ].map(({ label, path }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-white border border-brand-200 text-brand-400 hover:bg-brand-500 hover:text-white hover:scale-110 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div className="space-y-6">
            <div>
              <h4 className="text-brand-600 font-black text-sm uppercase tracking-[0.2em]">Quick Links</h4>
              <div className="h-[2px] w-8 bg-brand-400 rounded-full mt-2"></div>
            </div>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Rooms & Suites', to: '/rooms' },
                { label: 'Book Now', to: '/rooms' },
                { label: 'My Bookings', to: '/profile' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Sign In', to: '/login' },
                { label: 'Register', to: '/register' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm font-bold text-brand-500/80 hover:text-brand-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-[1px] w-3 bg-brand-300 group-hover:w-5 group-hover:bg-brand-400 transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Room Categories */}
          <div className="space-y-6">
            <div>
              <h4 className="text-brand-600 font-black text-sm uppercase tracking-[0.2em]">Room Categories</h4>
              <div className="h-[2px] w-8 bg-brand-400 rounded-full mt-2"></div>
            </div>
            <ul className="space-y-3">
              {[
                'Classic Suites',
                'Nature Retreats',
                'Minimalist Studios',
                'Romantic Rooms',
                'Rustic Cabins',
                'Family Quarters',
              ].map((room) => (
                <li key={room}>
                  <Link
                    to="/rooms"
                    className="text-sm font-bold text-brand-500/80 hover:text-brand-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-[1px] w-3 bg-brand-300 group-hover:w-5 group-hover:bg-brand-400 transition-all duration-300" />
                    {room}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact + Newsletter */}
          <div className="space-y-8">
            {/* Contact */}
            <div className="space-y-5">
              <div>
                <h4 className="text-brand-600 font-black text-sm uppercase tracking-[0.2em]">Contact Us</h4>
                <div className="h-[2px] w-8 bg-brand-400 rounded-full mt-2"></div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-brand-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-bold text-brand-500/80 leading-relaxed">
                    DHA Phase 6, Lahore, Punjab, Pakistan
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 text-brand-400 shrink-0" />
                  <a href="tel:+923064368762" className="text-sm font-bold text-brand-500/80 hover:text-brand-400 transition-colors">
                    +92 306 4368762
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <EnvelopeIcon className="h-5 w-5 text-brand-400 shrink-0" />
                  <a href="mailto:stays@havenhotels.com" className="text-sm font-bold text-brand-500/80 hover:text-brand-400 transition-colors">
                    stays@havenhotels.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <div>
                <h4 className="text-brand-600 font-black text-sm uppercase tracking-[0.2em]">Newsletter</h4>
                <div className="h-[2px] w-8 bg-brand-400 rounded-full mt-2"></div>
              </div>
              <p className="text-sm font-bold text-brand-500/80 italic">
                Get exclusive deals and earthy escapes.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-white border border-brand-200 rounded-xl px-4 py-3 text-sm text-brand-600 placeholder-brand-300 flex-1 focus:outline-none focus:ring-2 focus:ring-brand-400/20 transition-all"
                />
                <button className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 hover:scale-105 shrink-0">
                  Join
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar — Premium Finish */}
      <div className="border-t border-brand-200/50 bg-brand-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] text-center md:text-left">
            &copy; {new Date().getFullYear()} <span className="text-brand-600">HavenHotels.</span> All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] hover:text-brand-600 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
