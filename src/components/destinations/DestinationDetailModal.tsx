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
  Compass
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
    navigator.clipboard.writeText(`${window.location.origin} - Explore ${destination.name}, ${destination.state} on Travillo`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="destination-title"
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-black/[0.08] overflow-hidden max-h-[92vh] flex flex-col"
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
        <div className="relative h-64 sm:h-80 w-full shrink-0 overflow-hidden bg-[#0C1210]">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Floating Details on Hero */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
              <span className="font-semibold text-emerald-300">
                {destination.travelStyles.join(' · ')}
              </span>
              <span className="text-white/40">·</span>
              <div className="flex items-center gap-1 text-white/90">
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span className="font-medium">{destination.rating} ({destination.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 id="destination-title" className="text-2xl sm:text-4xl font-serif font-normal">
              {destination.name}
            </h1>

            <div className="text-white/80 text-sm mt-1 font-light">
              {destination.state} <span aria-hidden="true">·</span> {destination.region}
            </div>
          </div>
        </div>

        {/* Refined Information Strip */}
        <div className="bg-[#F7F5F0] border-b border-black/[0.06] px-6 py-3.5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#737373] block text-[10px] uppercase font-semibold tracking-wider">Best Season</span>
            <div className="flex items-center gap-1.5 font-medium text-[#171717] mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-[#12372A] shrink-0" />
              <span className="truncate">{destination.bestSeason}</span>
            </div>
          </div>

          <div>
            <span className="text-[#737373] block text-[10px] uppercase font-semibold tracking-wider">Ideal Duration</span>
            <div className="flex items-center gap-1.5 font-medium text-[#171717] mt-0.5">
              <Clock className="w-3.5 h-3.5 text-[#12372A] shrink-0" />
              <span>{destination.idealDays} Days recommended</span>
            </div>
          </div>

          <div>
            <span className="text-[#737373] block text-[10px] uppercase font-semibold tracking-wider">Estimated Budget</span>
            <div className="font-medium text-[#171717] mt-0.5 tabular-nums">
              {destination.estimatedDailyBudget} / day
            </div>
          </div>

          <div>
            <span className="text-[#737373] block text-[10px] uppercase font-semibold tracking-wider">Budget Tier</span>
            <div className="font-medium text-[#12372A] mt-0.5">
              {destination.budgetLevel} Comfort
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 border-b border-black/[0.06] bg-white overflow-x-auto gap-6 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#12372A] text-[#12372A] font-semibold'
                : 'border-transparent text-[#737373] hover:text-[#171717]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={`py-3.5 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'highlights'
                ? 'border-[#12372A] text-[#12372A] font-semibold'
                : 'border-transparent text-[#737373] hover:text-[#171717]'
            }`}
          >
            Highlights & Activities
          </button>
          <button
            onClick={() => setActiveTab('food_reach')}
            className={`py-3.5 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'food_reach'
                ? 'border-[#12372A] text-[#12372A] font-semibold'
                : 'border-transparent text-[#737373] hover:text-[#171717]'
            }`}
          >
            Food & How to Reach
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`py-3.5 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'tips'
                ? 'border-[#12372A] text-[#12372A] font-semibold'
                : 'border-transparent text-[#737373] hover:text-[#171717]'
            }`}
          >
            Local Insights
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-3.5 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'border-[#12372A] text-[#12372A] font-semibold'
                : 'border-transparent text-[#737373] hover:text-[#171717]'
            }`}
          >
            Gallery ({destination.gallery.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-serif font-semibold text-[#171717] mb-2">
                  About {destination.name}
                </h3>
                <p className="text-sm text-[#525252] leading-relaxed font-light">
                  {destination.description}
                </p>
              </div>

              {/* Signature Highlights */}
              <div>
                <h4 className="text-[11px] uppercase font-semibold text-[#737373] tracking-wider mb-3">
                  Signature Experiences
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {destination.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F5F0] border border-black/[0.04]">
                      <CheckCircle2 className="w-4 h-4 text-[#12372A] shrink-0 mt-0.5" />
                      <span className="text-xs text-[#374151] leading-relaxed font-light">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'highlights' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase font-semibold tracking-wider text-[#737373] mb-3">
                  Key Attractions
                </h3>
                <ul className="space-y-2.5">
                  {destination.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-[#F7F5F0] rounded-xl border border-black/[0.04] text-xs text-[#374151]">
                      <span className="font-mono text-[#12372A] font-semibold shrink-0">
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      <span className="font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs uppercase font-semibold tracking-wider text-[#737373] mb-3">
                  Recommended Activities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {destination.activities.map((act, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-lg bg-white border border-black/[0.08] text-xs font-medium text-[#171717] flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#12372A]" />
                      <span>{act}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'food_reach' && (
            <div className="space-y-6">
              {/* How to reach */}
              <div className="p-4 rounded-xl bg-[#F7F5F0] border border-black/[0.05] space-y-2">
                <div className="flex items-center gap-2 text-[#12372A] font-semibold text-xs uppercase tracking-wide">
                  <Train className="w-4 h-4" />
                  <span>How to Reach {destination.name}</span>
                </div>
                <p className="text-xs text-[#525252] leading-relaxed font-light">
                  {destination.howToReach}
                </p>
              </div>

              {/* Local food */}
              <div>
                <h3 className="text-xs uppercase font-semibold tracking-wider text-[#737373] mb-3 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#12372A]" />
                  <span>Authentic Regional Delicacies</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {destination.localFood.map((dish, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#F7F5F0] border border-black/[0.04] text-xs text-[#171717] font-medium flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#12372A] shrink-0" />
                      <span>{dish}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-3">
              <div className="text-xs text-[#737373] font-light mb-2">
                Verified travel wisdom for respectful and smooth journey execution in {destination.state}.
              </div>
              {destination.travelTips.map((tip, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-black/[0.05] bg-[#F7F5F0] text-xs text-[#374151] leading-relaxed flex items-start gap-2.5 font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#12372A] mt-1.5 shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {destination.gallery.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden aspect-video bg-[#EFECE5] border border-black/[0.06]">
                  <img
                    src={img}
                    alt={`${destination.name} gallery ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 border-t border-black/[0.06] bg-[#F7F5F0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(destination)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                favorited
                  ? 'border-rose-300 bg-rose-50 text-rose-700'
                  : 'border-black/[0.1] bg-white hover:bg-neutral-50 text-[#171717]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current text-rose-600' : ''}`} />
              <span>{favorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-black/[0.1] bg-white hover:bg-neutral-50 text-[#171717] transition-colors cursor-pointer"
              title="Share destination"
              aria-label="Share destination"
            >
              {copied ? <Check className="w-4 h-4 text-[#12372A]" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onPlanTrip(destination);
            }}
            className="px-6 py-2.5 bg-[#12372A] hover:bg-[#184938] text-white text-xs font-medium tracking-wide rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Plan This India Trip with AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
