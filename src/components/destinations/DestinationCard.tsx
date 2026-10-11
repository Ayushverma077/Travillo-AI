import React from 'react';
import { Heart, Star, Sparkles, ArrowRight, MapPin, Clock, DollarSign } from 'lucide-react';
import { Destination } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';

interface DestinationCardProps {
  destination: Destination;
  onSelect: (destination: Destination) => void;
  onPlanTrip: (destination: Destination) => void;
  variant?: 'standard' | 'featured' | 'compact';
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onSelect,
  onPlanTrip,
  variant = 'standard'
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(destination.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(destination);
  };

  const handlePlanClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlanTrip(destination);
  };

  return (
    <article
      onClick={() => onSelect(destination)}
      className="group relative bg-white dark:bg-[#111827] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 hover:border-violet-500/40 dark:hover:border-violet-500/50 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1.5"
    >
      {/* Visual Photography Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={destination.heroImage}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Subtle scrim for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Floating Actions & Tags */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {/* Rating */}
          <div className="flex items-center gap-1 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-semibold shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="tabular-nums">{destination.rating}</span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-xs ${
              favorited
                ? 'bg-rose-500 text-white scale-110'
                : 'bg-slate-950/50 hover:bg-slate-950/80 text-white hover:scale-105'
            }`}
            title={favorited ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label={`Wishlist ${destination.name}`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom image overlay: duration & travel style */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs drop-shadow-md">
          <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white">
            {destination.travelStyles[0]}
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-200 text-xs">
            <Clock className="w-3 h-3 text-cyan-300" />
            <span>{destination.idealDays} Days</span>
          </span>
        </div>
      </div>

      {/* Editorial Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Location & Region */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 mb-1">
            <MapPin className="w-3.5 h-3.5 text-violet-500" />
            <span>{destination.state}</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-slate-500 dark:text-slate-400">{destination.region}</span>
          </div>

          {/* Destination Name */}
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-1 font-sans">
            {destination.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {destination.shortDescription}
          </p>
        </div>

        {/* Bottom meta & actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-semibold">
              Daily Est.
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
              {destination.estimatedDailyBudget}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePlanClick}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md hover:shadow-violet-500/20 active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-cyan-200" />
              <span>✨ Plan with AI</span>
            </button>
            <button
              onClick={() => onSelect(destination)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="View destination details"
              aria-label="View details"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
