import React from 'react';
import { X, User as UserIcon, Mail, Bookmark, Heart, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close profile modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="p-8 pb-6 text-center border-b border-neutral-100 bg-[#FAF9F6]">
          <div className="relative inline-block mb-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg mx-auto">
                {(user.displayName || user.email || 'T').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 text-white rounded-full border-2 border-white shadow-xs">
              <Shield className="w-3 h-3" />
            </div>
          </div>

          <h3 className="text-xl font-bold font-serif-heading text-neutral-900">
            {user.displayName || 'Traveler'}
          </h3>
          <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 mt-1">
            <Mail className="w-3.5 h-3.5" />
            <span>{user.email}</span>
          </div>
        </div>

        {/* Profile Statistics */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { onClose(); onNavigateTrips(); }}
              className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/70 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <Bookmark className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-extrabold text-neutral-900">{savedTrips.length}</span>
              </div>
              <p className="text-xs font-semibold text-neutral-700">Saved Itineraries</p>
              <p className="text-[11px] text-neutral-500">View planned trips</p>
            </button>

            <button
              onClick={() => { onClose(); onNavigateFavorites(); }}
              className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/70 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <Heart className="w-4 h-4 text-rose-600 fill-rose-600 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-extrabold text-neutral-900">{favorites.length}</span>
              </div>
              <p className="text-xs font-semibold text-neutral-700">Favorites</p>
              <p className="text-[11px] text-neutral-500">Saved destinations</p>
            </button>
          </div>

          {/* Account info pill */}
          <div className="p-3.5 rounded-xl border border-neutral-100 bg-[#FAF9F6] text-xs text-neutral-600 flex items-center justify-between">
            <span className="font-medium text-neutral-700">Authentication</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
              {user.providerData?.[0]?.providerId === 'google.com' ? 'Google Account' : 'Verified Email'}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-2 py-3 border border-red-200 bg-red-50/40 hover:bg-red-50 text-red-700 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
