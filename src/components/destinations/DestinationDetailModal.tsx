import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Sparkles, 
  Calendar, 
  Clock, 
  Star, 
  Check, 
  Share2, 
  Train, 
  Utensils, 
  CheckCircle2, 
  Compass,
  MapPin
} from 'lucide-react';
import { Destination } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';

interface DestinationDetailModalProps {
  destination: Destination | null;
  onClose: () => void;
  onPlanTrip: (destination: Destination) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  onClose,
  onPlanTrip
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<'overview' | 'highlights' | 'food_reach' | 'tips' | 'gallery'>('overview');
  const [copied, setCopied] = useState(false);

  if (!destination) return null;

  const favorited = isFavorite(destination.id);

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin} - Explore ${destination.name}, ${destination.state} on Travillo AI`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="destination-title"
    >
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#0F172A] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Floating */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header */}
        <div className="relative h-64 sm:h-80 w-full shrink-0 overflow-hidden bg-slate-950">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Floating Details on Hero */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
              <span className="font-bold text-cyan-300">
                {destination.travelStyles.join(' · ')}
              </span>
              <span className="text-white/40">·</span>
              <div className="flex items-center gap-1 text-white/90">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-bold">{destination.rating}</span>
                <span className="text-white/60">({destination.reviewsCount} reviews)</span>
              </div>
            </div>

            <h2 id="destination-title" className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              {destination.name}
            </h2>
            <div className="text-slate-300 text-sm mt-1 flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-violet-400" />
              <span>{destination.state} · {destination.region}</span>
            </div>
          </div>
        </div>

        {/* Information Strip */}
        <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Best Season</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-violet-500 shrink-0" />
              <span className="truncate">{destination.bestSeason}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Ideal Duration</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-violet-500 shrink-0" />
              <span>{destination.idealDays} Days</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Estimated Budget</span>
            <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 tabular-nums">
              {destination.estimatedDailyBudget} / day
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Budget Tier</span>
            <div className="font-bold text-violet-600 dark:text-violet-400 mt-0.5">
              {destination.budgetLevel} Comfort
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] overflow-x-auto gap-6 text-xs shrink-0">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'highlights', label: 'Highlights & Activities' },
            { id: 'food_reach', label: 'Food & How to Reach' },
            { id: 'tips', label: 'Local Insights' },
            { id: 'gallery', label: 'Photo Gallery' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 border-b-2 font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
                  About {destination.name}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {destination.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
                  Key Attractions & Places
                </h4>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {destination.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'highlights' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Recommended Experiences & Adventures
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {destination.activities.map((act, i) => (
                  <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-violet-500 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{act}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'food_reach' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-pink-500/5 border border-pink-500/20 space-y-2">
                <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold text-xs uppercase tracking-wider">
                  <Utensils className="w-4 h-4" />
                  <span>Signature Regional Cuisine</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {destination.localFood.map((food, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-pink-200 dark:border-pink-900 text-slate-800 dark:text-slate-200 font-semibold text-xs shadow-2xs">
                      🥘 {food}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <Train className="w-4 h-4" />
                  <span>How to Reach & Transit Corridor</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                  {destination.howToReach}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Traveler Tips & Local Etiquette
              </h4>
              <div className="space-y-2">
                {destination.travelTips.map((tip, i) => (
                  <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {destination.gallery.map((img, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-2xs">
                  <img
                    src={img}
                    alt={`${destination.name} ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(destination)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                favorited
                  ? 'border-rose-400 bg-rose-50 text-rose-600 dark:bg-rose-950/40'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current text-rose-500' : ''}`} />
              <span>{favorited ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title="Share destination"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onPlanTrip(destination);
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Plan with AI ✦</span>
          </button>
        </div>
      </div>
    </div>
  );
};
