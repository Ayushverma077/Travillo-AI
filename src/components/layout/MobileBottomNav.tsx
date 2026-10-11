import React from 'react';
import { Compass, Sparkles, Bookmark, User, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  currentTab: 'home' | 'discover' | 'planner' | 'trips' | 'favorites';
  onNavigate: (tab: 'home' | 'discover' | 'planner' | 'trips' | 'favorites') => void;
  onOpenProfile: () => void;
  savedTripsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onNavigate,
  onOpenProfile,
  savedTripsCount,
}) => {
  const { user, openAuthModal } = useAuth();

  const handleProtectedNavigate = (tab: 'trips' | 'favorites') => {
    if (user) {
      onNavigate(tab);
    } else {
      openAuthModal('signin', {
        title: 'Save your journey ✦',
        subtitle: 'Create an account or sign in to save trips, sync itineraries and access them from any device.',
        pendingAction: { type: 'navigate', payload: tab }
      });
    }
  };

  const handleProfileClick = () => {
    if (user) {
      onOpenProfile();
    } else {
      openAuthModal('signin', {
        title: 'Save your journey ✦',
        subtitle: 'Create an account or sign in to save trips, sync itineraries and access them from any device.',
        pendingAction: { type: 'open_profile' }
      });
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#090D16]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentTab === 'home'
              ? 'text-violet-600 dark:text-violet-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Discover */}
        <button
          onClick={() => onNavigate('discover')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentTab === 'discover'
              ? 'text-violet-600 dark:text-violet-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Discover</span>
        </button>

        {/* AI Planner Centerpiece */}
        <button
          onClick={() => onNavigate('planner')}
          className={`relative -top-3 flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-blue-600 via-violet-600 to-pink-500 text-white shadow-md shadow-violet-500/30 transition-transform active:scale-95 cursor-pointer ${
            currentTab === 'planner' ? 'ring-2 ring-violet-400 scale-105' : ''
          }`}
          aria-label="AI Planner"
        >
          <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-[9px] font-bold tracking-tight">✦ AI</span>
        </button>

        {/* Trips */}
        <button
          onClick={() => handleProtectedNavigate('trips')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
            currentTab === 'trips'
              ? 'text-violet-600 dark:text-violet-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Trips</span>
          {savedTripsCount > 0 && (
            <span className="absolute top-0.5 right-1.5 w-2 h-2 rounded-full bg-pink-500" />
          )}
        </button>

        {/* Profile */}
        <button
          onClick={handleProfileClick}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{user ? 'Profile' : 'Sign In'}</span>
        </button>
      </div>
    </nav>
  );
};
