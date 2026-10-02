import React from 'react';
import { Heart, Star, Sparkles, ArrowRight } from 'lucide-react';
import { Destination } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';

interface DestinationCardProps {
  destination: Destination;
  onSelect: (destination: Destination) => void;
  onPlanTrip: (destination: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onSelect,
  onPlanTrip
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
      className="group bg-white rounded-2xl overflow-hidden border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-0.5"
    >
      {/* Visual Photography Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EFECE5]">
        <img
          src={destination.heroImage}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
        />
        {/* Subtle scrim for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

        {/* Top Floating Favorite Action */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            favorited
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-black/30 hover:bg-black/50 text-white/90'
          }`}
          title={favorited ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label={`Wishlist ${destination.name}`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>

        {/* Rating overlay badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[11px] font-medium">
          <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
          <span>{destination.rating}</span>
        </div>

        {/* Bottom image overlay: travel style & duration */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-medium drop-shadow-sm">
          <span>{destination.travelStyles[0]}</span>
          <span>{destination.idealDays} Days</span>
        </div>
      </div>

      {/* Editorial Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* State & Region */}
          <div className="text-[11px] text-[#737373] tracking-wide font-medium">
            {destination.state} <span aria-hidden="true">·</span> {destination.region}
          </div>

          {/* Destination Name */}
          <h3 className="text-base sm:text-lg font-serif font-semibold text-[#171717] group-hover:text-[#12372A] transition-colors mt-0.5 line-clamp-1">
            {destination.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#525252] line-clamp-2 mt-1.5 leading-relaxed font-light">
            {destination.shortDescription}
          </p>
        </div>

        {/* Bottom meta & actions */}
        <div className="mt-4 pt-3 border-t border-black/[0.05] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#737373] uppercase tracking-wider block font-medium">Daily Budget</span>
            <span className="text-xs font-semibold text-[#171717] tabular-nums">
              {destination.estimatedDailyBudget}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePlanClick}
              className="py-1.5 px-3 rounded-lg bg-[#12372A] hover:bg-[#184938] text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-emerald-300" />
              <span>Plan</span>
            </button>
            <button
              onClick={() => onSelect(destination)}
              className="p-1.5 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-black/[0.04] transition-colors cursor-pointer"
              title="View destination guide"
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
