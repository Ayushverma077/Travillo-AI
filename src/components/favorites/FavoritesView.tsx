import React from 'react';
import { Heart, Sparkles, MapPin, ArrowRight, Trash2, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { Destination } from '../../types';

interface FavoritesViewProps {
  destinations: Destination[];
  onSelectDestination: (destination: Destination) => void;
  onPlanTrip: (destination: Destination) => void;
  onExplore: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  destinations,
  onSelectDestination,
  onPlanTrip,
  onExplore
}) => {
  const { user, openAuthModal } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();

  if (!user) {
    return (
      <div className="py-20 bg-slate-50 dark:bg-[#090D16] min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-6 bg-white dark:bg-[#0F172A] p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-violet-600 text-white flex items-center justify-center mx-auto shadow-md shadow-pink-500/25">
            <Heart className="w-8 h-8 fill-current" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-sans">
              Save your journey ✦
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Create an account or sign in to save trips, sync itineraries and access them from any device.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => openAuthModal('signin', {
                title: 'Save your journey ✦',
                subtitle: 'Create an account or sign in to save trips, sync itineraries and access them from any device.',
                pendingAction: { type: 'navigate', payload: 'favorites' }
              })}
              className="w-full flex items-center justify-center gap-2.5 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 transition-all cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => openAuthModal('signin', {
                title: 'Save your journey ✦',
                subtitle: 'Create an account or sign in to save trips, sync itineraries and access them from any device.',
                pendingAction: { type: 'navigate', payload: 'favorites' }
              })}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-500/20 transition-all cursor-pointer active:scale-95"
            >
              Sign In
            </button>

            <button
              onClick={() => openAuthModal('signup', {
                title: 'Save your journey ✦',
                subtitle: 'Create an account or sign in to save trips, sync itineraries and access them from any device.',
                pendingAction: { type: 'navigate', payload: 'favorites' }
              })}
              className="w-full py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const favoritedDestinations = favorites
    .map(fav => destinations.find(d => d.id === fav.destinationId))
    .filter((d): d is Destination => d !== undefined);

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#090D16] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold mb-2">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Saved Places</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              My Wishlist ({favorites.length})
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Destinations you have bookmarked for future exploration and AI itinerary generation.
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={onExplore}
              className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-500 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-violet-500" />
              <span>Explore More Destinations</span>
            </button>
          )}
        </div>

        {/* Favorites Grid */}
        {favoritedDestinations.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritedDestinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => onSelectDestination(dest)}
                className="group bg-white dark:bg-[#0F172A] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(dest);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-rose-500 backdrop-blur-md transition-colors cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">
                      {dest.state} · {dest.region}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal">
                    {dest.shortDescription}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Budget Est.</span>
                      <strong className="text-slate-900 dark:text-white tabular-nums">{dest.estimatedDailyBudget}</strong>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlanTrip(dest);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                      <span>Plan with AI ✦</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
            <Heart className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              No saved favorites yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Browse destinations and tap the heart icon on any card to save places to your wishlist.
            </p>
            <button
              onClick={onExplore}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 text-white font-bold text-xs shadow-md cursor-pointer active:scale-95"
            >
              Explore Destinations
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
