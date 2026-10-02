import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  RotateCcw
} from 'lucide-react';
import { Destination, TravelStyle, BudgetTier } from '../../types';
import { DestinationCard } from './DestinationCard';

interface DiscoverViewProps {
  destinations: Destination[];
  onSelectDestination: (destination: Destination) => void;
  onPlanTrip: (destination: Destination) => void;
  initialStyleFilter?: TravelStyle | null;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  destinations,
  onSelectDestination,
  onPlanTrip,
  initialStyleFilter = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState<string>(initialStyleFilter || 'All');
  const [selectedBudget, setSelectedBudget] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [activeCollection, setActiveCollection] = useState<string>('All India');
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'budget-asc' | 'budget-desc'>('rating');

  const regions = [
    'All',
    'North India',
    'West India',
    'South India',
    'East India',
    'Northeast India',
    'Central India'
  ];

  // Dynamically extract unique states from destinations
  const uniqueStates = useMemo(() => {
    const states = Array.from(new Set(destinations.map(d => d.state))).filter(Boolean).sort();
    return ['All', ...states];
  }, [destinations]);

  const styles = [
    'All',
    'Mountains',
    'Beaches',
    'Adventure',
    'Heritage',
    'Spiritual',
    'Wildlife',
    'Nature',
    'Food',
    'Honeymoon',
    'Weekend Getaway',
    'Backpacking'
  ];

  const budgetTiers = ['All', 'Budget', 'Moderate', 'Luxury'];

  const collections = [
    'All India',
    'Trending in India',
    'Hidden Gems',
    'Weekend Getaways',
    'Mountain Escapes',
    'Beach Destinations',
    'Heritage India',
    'Spiritual Journeys',
    'Best for Backpackers'
  ];

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRegion('All');
    setSelectedState('All');
    setSelectedStyle('All');
    setSelectedBudget('All');
    setSelectedSeason('All');
    setActiveCollection('All India');
    setSortBy('rating');
  };

  const hasActiveFilters = 
    searchTerm !== '' || 
    selectedRegion !== 'All' || 
    selectedState !== 'All' || 
    selectedStyle !== 'All' || 
    selectedBudget !== 'All' || 
    selectedSeason !== 'All' || 
    activeCollection !== 'All India';

  // Filter & sort logic
  const filteredDestinations = useMemo(() => {
    return destinations
      .filter((dest) => {
        // Collection Quick Filter
        if (activeCollection === 'Trending in India' && dest.rating < 4.88) {
          return false;
        }
        if (activeCollection === 'Hidden Gems' && !dest.travelStyles.includes('Backpacking') && dest.region !== 'Northeast India') {
          return false;
        }
        if (activeCollection === 'Weekend Getaways' && !dest.travelStyles.includes('Weekend Getaway')) {
          return false;
        }
        if (activeCollection === 'Mountain Escapes' && !dest.travelStyles.includes('Mountains')) {
          return false;
        }
        if (activeCollection === 'Beach Destinations' && !dest.travelStyles.includes('Beaches')) {
          return false;
        }
        if (activeCollection === 'Heritage India' && !dest.travelStyles.includes('Heritage')) {
          return false;
        }
        if (activeCollection === 'Spiritual Journeys' && !dest.travelStyles.includes('Spiritual')) {
          return false;
        }
        if (activeCollection === 'Best for Backpackers' && !dest.travelStyles.includes('Backpacking') && dest.budgetLevel !== 'Budget') {
          return false;
        }

        // Search matching
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = dest.name.toLowerCase().includes(q);
          const matchState = dest.state.toLowerCase().includes(q);
          const matchRegion = dest.region.toLowerCase().includes(q);
          const matchStyle = dest.travelStyles.some(s => s.toLowerCase().includes(q));
          const matchHighlights = dest.highlights.some(h => h.toLowerCase().includes(q));
          if (!matchName && !matchState && !matchRegion && !matchStyle && !matchHighlights) {
            return false;
          }
        }

        // Region matching
        if (selectedRegion !== 'All') {
          if (dest.region !== selectedRegion) return false;
        }

        // State matching
        if (selectedState !== 'All') {
          if (dest.state !== selectedState) return false;
        }

        // Travel Style matching
        if (selectedStyle !== 'All') {
          if (!dest.travelStyles.includes(selectedStyle as TravelStyle)) return false;
        }

        // Budget matching
        if (selectedBudget !== 'All') {
          if (dest.budgetLevel !== selectedBudget) return false;
        }

        // Season matching
        if (selectedSeason !== 'All') {
          if (!dest.bestSeason.toLowerCase().includes(selectedSeason.toLowerCase())) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'budget-asc') {
          const budgetWeight = (bTier: BudgetTier) => {
            if (bTier === 'Budget') return 1;
            if (bTier === 'Moderate') return 2;
            return 3;
          };
          return budgetWeight(a.budgetLevel) - budgetWeight(b.budgetLevel);
        }
        if (sortBy === 'budget-desc') {
          const budgetWeight = (bTier: BudgetTier) => {
            if (bTier === 'Budget') return 1;
            if (bTier === 'Moderate') return 2;
            return 3;
          };
          return budgetWeight(b.budgetLevel) - budgetWeight(a.budgetLevel);
        }
        return 0;
      });
  }, [destinations, activeCollection, searchTerm, selectedRegion, selectedState, selectedStyle, selectedBudget, selectedSeason, sortBy]);

  return (
    <div className="py-16 bg-[#F7F5F0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-2xl mb-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-2">
            Destination Archives
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal text-[#171717] tracking-tight">
            Explore India
          </h1>
          <p className="text-sm text-[#525252] mt-2 font-light leading-relaxed">
            Curated destinations across all regions of India. Explore by state, Himalayan or coastal zones, travel style, and budget tier.
          </p>
        </div>

        {/* Quick Collection Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {collections.map((col) => {
            const isActive = activeCollection === col;
            return (
              <button
                key={col}
                onClick={() => setActiveCollection(col)}
                className={`px-4 py-2 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#12372A] text-white font-medium shadow-xs'
                    : 'bg-white hover:bg-[#EFECE5] text-[#374151] border border-black/[0.06]'
                }`}
              >
                {col}
              </button>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-black/[0.06] mb-10 space-y-4">
          {/* Top row: search & sorting */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#737373] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by destination, state, region, or activities..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F7F5F0] border border-black/[0.06] rounded-xl focus:outline-none focus:border-[#12372A] text-[#171717] placeholder:text-[#9CA3AF]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3 text-[#737373] hover:text-[#171717]"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full pl-3 pr-8 py-2.5 text-xs font-medium bg-[#F7F5F0] border border-black/[0.06] rounded-xl focus:outline-none text-[#171717] cursor-pointer"
                >
                  <option value="rating">Sort: Highest Rated</option>
                  <option value="name">Sort: Alphabetical (A-Z)</option>
                  <option value="budget-asc">Sort: Budget (Low to High)</option>
                  <option value="budget-desc">Sort: Budget (High to Low)</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-3.5 py-2.5 rounded-xl border border-black/[0.08] hover:bg-[#F7F5F0] text-[#525252] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-3 border-t border-black/[0.05]">
            {/* Region */}
            <div>
              <label className="block text-[10px] uppercase font-semibold text-[#737373] tracking-wider mb-1">
                Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-2.5 text-xs font-medium bg-[#F7F5F0] border border-black/[0.06] rounded-xl focus:outline-none text-[#171717] cursor-pointer"
              >
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-[10px] uppercase font-semibold text-[#737373] tracking-wider mb-1">
                State / UT
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-2.5 text-xs font-medium bg-[#F7F5F0] border border-black/[0.06] rounded-xl focus:outline-none text-[#171717] cursor-pointer"
              >
                {uniqueStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Travel Style */}
            <div>
              <label className="block text-[10px] uppercase font-semibold text-[#737373] tracking-wider mb-1">
                Travel Style
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full p-2.5 text-xs font-medium bg-[#F7F5F0] border border-black/[0.06] rounded-xl focus:outline-none text-[#171717] cursor-pointer"
              >
                {styles.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-[10px] uppercase font-semibold text-[#737373] tracking-wider mb-1">
                Budget Tier
              </label>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full p-2.5 text-xs font-medium bg-[#F7F5F0] border border-black/[0.06] rounded-xl focus:outline-none text-[#171717] cursor-pointer"
              >
                {budgetTiers.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Season */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] uppercase font-semibold text-[#737373] tracking-wider mb-1">
                Best Season
              </label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="w-full p-2.5 text-xs font-medium bg-[#F7F5F0] border border-black/[0.06] rounded-xl focus:outline-none text-[#171717] cursor-pointer"
              >
                <option value="All">All Seasons</option>
                <option value="September">Sep – Nov (Autumn)</option>
                <option value="December">Dec – Feb (Winter / Snow)</option>
                <option value="March">Mar – May (Spring / Summer)</option>
                <option value="Monsoon">Jul – Aug (Monsoon Lush)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between mb-8 text-xs text-[#737373] font-light">
          <span>
            Showing <strong className="font-semibold text-[#171717]">{filteredDestinations.length}</strong> of {destinations.length} destinations
          </span>
          <span className="hidden sm:inline">Select any destination card to inspect highlights or plan with AI</span>
        </div>

        {/* Destination Cards Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onSelect={onSelectDestination}
                onPlanTrip={onPlanTrip}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-2xl p-12 text-center border border-black/[0.06] max-w-md mx-auto space-y-4 shadow-xs">
            <h3 className="text-lg font-serif font-semibold text-[#171717]">
              No destinations match your criteria
            </h3>
            <p className="text-xs text-[#525252] leading-relaxed font-light">
              Try clearing filters or broadening your search query to explore other regions of India.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-[#12372A] hover:bg-[#184938] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
