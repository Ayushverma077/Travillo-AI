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
      <div className="py-20 bg-[#FAF9F6] min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-5 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h2 className="text-2xl font-bold font-serif-heading text-neutral-900">
            Sign In to Access Favorites
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Your favorited destinations are stored securely in your private Cloud Firestore account.
          </p>
          <button
            onClick={() => openAuthModal('signin')}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Sign In with Email or Google
          </button>
        </div>
      </div>
    );
  }

  // Match favorite records with full destination data
  const favoritedDestinations = favorites
    .map(fav => destinations.find(d => d.id === fav.destinationId))
    .filter((d): d is Destination => d !== undefined);

  return (
    <div className="py-12 bg-[#FAF9F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
              <Heart className="w-4 h-4 fill-current" />
              <span>Saved Places</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif-heading text-neutral-900 tracking-tight">
              My Favorite Destinations ({favorites.length})
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Destinations you have bookmarked for future exploration and AI itinerary generation.
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={onExplore}
              className="px-5 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
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
                className="group bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Remove Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(dest);
                    }}
                    className="absolute top-3.5 right-3.5 p-2 rounded-full bg-rose-500 text-white shadow-xs hover:bg-rose-600 transition-colors cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>

                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white text-xs font-medium flex items-center gap-1.5 drop-shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{dest.state ? `${dest.state}, ${dest.region}` : dest.region}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-serif-heading text-neutral-900 group-hover:text-emerald-800 transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {dest.shortDescription}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlanTrip(dest);
                      }}
                      className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Plan Trip Here</span>
                    </button>
                    <button
                      onClick={() => onSelectDestination(dest)}
                      className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Favorites */
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-neutral-200/80 shadow-xs max-w-lg mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold font-serif-heading text-neutral-900">
                You haven't saved any destinations yet
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                Click the heart icon on any destination card to curate your personal bucket list for easy trip planning.
              </p>
            </div>
            <button
              onClick={onExplore}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Destinations</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
