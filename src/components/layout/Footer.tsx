import React from 'react';
import { Compass, Sparkles, MapPin, Bookmark, Heart, Shield, Info, FileText } from 'lucide-react';

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
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800/80">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-emerald-500/10">
                <Compass className="w-5 h-5 text-neutral-950" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight font-serif-heading text-white">
                  TRAVILLO
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-400 -mt-1">
                  Discover India
                </span>
              </div>
            </div>

            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              "Discover India. Plan intelligently." Travillo brings together authentic Indian destinations, verified logistical routes, and Gemini-powered travel reasoning to build realistic, day-by-day itineraries across India.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-neutral-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Gemini 3.8 Flash AI Model & Cloud Firestore</span>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('discover')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Discover Destinations</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('planner')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>AI Trip Planner</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('trips')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 text-neutral-500" />
                  <span>My Saved Trips</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('favorites')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Saved Favorites</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Product Col */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-200 mb-4">
              Travillo Intelligence
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-neutral-500" />
                  <span>About Platform</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Terms & Estimates</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} Travillo. All travel prices and durations are estimates. Verify local conditions and bookings independently.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={onOpenAbout} className="hover:text-neutral-300 transition-colors cursor-pointer">
              About
            </button>
            <button onClick={onOpenPrivacy} className="hover:text-neutral-300 transition-colors cursor-pointer">
              Privacy
            </button>
            <button onClick={onOpenTerms} className="hover:text-neutral-300 transition-colors cursor-pointer">
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
