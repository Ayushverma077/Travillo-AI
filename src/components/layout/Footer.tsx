import React from 'react';
import { Sparkles, MapPin, Bookmark, Heart, Shield, Info, FileText } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'discover' | 'planner' | 'trips' | 'favorites') => void;
  onOpenAbout: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenAbout,
  onOpenPrivacy,
  onOpenTerms
}) => {
  return (
    <footer className="relative bg-slate-950 text-slate-300 pt-16 pb-20 md:pb-12 border-t border-slate-800/80 overflow-hidden">
      {/* Top Gradient Aurora Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-violet-500 via-pink-500 to-cyan-400" />
      
      {/* Ambient Radial Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-t from-violet-600/10 via-pink-600/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-violet-600 to-pink-500 p-[1.5px] shadow-lg shadow-violet-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-sans">
                  TRAVILLO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 font-bold">✦ AI</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Your World. Your Vibe. Planned by AI.
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Travillo AI combines authentic Indian destination intelligence, verified logistical routing, and Gemini generative models to create bespoke, day-by-day travel journeys customized to your budget, pace, and vibe.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-pink-400 animate-pulse"></span>
              <span className="text-slate-300">Powered by Gemini 3.8 Flash & Google Cloud Firestore</span>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-200 mb-4 flex items-center gap-1.5">
              <span>Platform</span>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('discover')}
                  className="hover:text-violet-400 transition-colors flex items-center gap-2 cursor-pointer text-slate-400"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Discover India</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('planner')}
                  className="hover:text-violet-400 transition-colors flex items-center gap-2 cursor-pointer text-slate-400"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>AI Trip Planner</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('trips')}
                  className="hover:text-violet-400 transition-colors flex items-center gap-2 cursor-pointer text-slate-400"
                >
                  <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                  <span>My Saved Trips</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('favorites')}
                  className="hover:text-violet-400 transition-colors flex items-center gap-2 cursor-pointer text-slate-400"
                >
                  <Heart className="w-3.5 h-3.5 text-slate-500" />
                  <span>Wishlist & Favorites</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Product Col */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-200 mb-4 flex items-center gap-1.5">
              <span>Intelligence</span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-violet-400 transition-colors flex items-center gap-2 cursor-pointer text-slate-400"
                >
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  <span>About Travillo AI</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-violet-400 transition-colors flex items-center gap-2 cursor-pointer text-slate-400"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-violet-400 transition-colors flex items-center gap-2 cursor-pointer text-slate-400"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Terms of Service</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Travillo AI Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-[11px]">
              Crafted for India Travel 🇮🇳
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
