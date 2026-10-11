import React from 'react';
import { X, User as UserIcon, Mail, Bookmark, Heart, LogOut, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { usePreferences } from '../../context/PreferencesContext';
import { SavedTrip } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTrips: SavedTrip[];
  onNavigateTrips: () => void;
  onNavigateFavorites: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  savedTrips,
  onNavigateTrips,
  onNavigateFavorites
}) => {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { preferences, openPreferenceModal } = usePreferences();

  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#0F172A] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          aria-label="Close profile modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="p-8 pb-6 text-center border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-500/5 via-violet-500/10 to-pink-500/5">
          <div className="relative inline-block mb-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg mx-auto ring-2 ring-violet-500/40"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 via-violet-600 to-pink-500 text-white flex items-center justify-center text-2xl font-bold border-4 border-white dark:border-slate-800 shadow-lg mx-auto">
                {(user.displayName || user.email || 'T').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute bottom-0 right-0 p-1.5 bg-gradient-to-tr from-blue-600 to-violet-600 text-white rounded-full border-2 border-white dark:border-slate-800 shadow-xs">
              <Shield className="w-3 h-3" />
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-sans">
            {user.displayName || 'Traveler'}
          </h3>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <Mail className="w-3.5 h-3.5" />
            <span>{user.email}</span>
          </div>

          {/* Taste badge */}
          <div className="mt-3">
            <button
              onClick={() => {
                onClose();
                openPreferenceModal();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 text-xs font-semibold cursor-pointer hover:bg-violet-500/20 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>DNA: {preferences.homeCity || 'India'} · {preferences.budgetLevel} (Edit)</span>
            </button>
          </div>
        </div>

        {/* Profile Statistics */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { onClose(); onNavigateTrips(); }}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <Bookmark className="w-4 h-4 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{savedTrips.length}</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Saved Itineraries</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">View planned trips</p>
            </button>

            <button
              onClick={() => { onClose(); onNavigateFavorites(); }}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{favorites.length}</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Wishlist Places</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Saved destinations</p>
            </button>
          </div>

          {/* Account Details Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span>Account Type:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Travillo AI Explorer</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cloud Persistence:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Firestore Connected</span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out from Travillo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
