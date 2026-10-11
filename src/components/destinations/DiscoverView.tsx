import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Calendar,
  Star,
  Compass,
  MapPin,
  Clock
} from 'lucide-react';
import { Destination, TravelStyle, BudgetTier } from '../../types';
import { DestinationCard } from './DestinationCard';
import { usePreferences } from '../../context/PreferencesContext';

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
  const { preferences, openPreferenceModal } = usePreferences();
  const [searchTerm, setSearchTerm] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState<{
    searchSummary: string;
    recommendedDestinations: Array<{
      name: string;
      state: string;
      matchScore: number;
      matchReason: string;
      bestDurationDays: number;
      estimatedCost: string;
      tags: string[];
    }>;
  } | null>(null);

  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState<string>(initialStyleFilter || 'All');
  const [selectedBudget, setSelectedBudget] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
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

  const resetFilters = () => {
    setSearchTerm('');
    setAiPrompt('');
    setAiResults(null);
    setSelectedRegion('All');
    setSelectedState('All');
    setSelectedStyle('All');
    setSelectedBudget('All');
    setSelectedSeason('All');
    setSelectedDuration('All');
    setSelectedRating('All');
    setActiveCollection('All India');
    setSortBy('rating');
  };

  const handleAiSearch = async (queryToUse?: string) => {
    const q = queryToUse || aiPrompt;
    if (!q.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, userOrigin: preferences.homeCity })
      });
      if (!res.ok) throw new Error('AI search failed');
      const data = await res.json();
      setAiResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const hasActiveFilters = 
    searchTerm !== '' || 
    aiResults !== null ||
    selectedRegion !== 'All' || 
    selectedState !== 'All' || 
    selectedStyle !== 'All' || 
    selectedBudget !== 'All' || 
    selectedSeason !== 'All' || 
    selectedDuration !== 'All' || 
    selectedRating !== 'All' || 
    activeCollection !== 'All India';

  // Filter & sort logic
  const filteredDestinations = useMemo(() => {
    return destinations
      .filter((dest) => {
        // AI result matching priority
        if (aiResults && aiResults.recommendedDestinations.length > 0) {
          const isAiMatch = aiResults.recommendedDestinations.some(
            rec => dest.name.toLowerCase().includes(rec.name.toLowerCase()) || 
                   rec.name.toLowerCase().includes(dest.name.toLowerCase()) ||
                   dest.state.toLowerCase().includes(rec.state.toLowerCase())
          );
          if (!isAiMatch) return false;
        }

        // Collection Quick Filter
        if (activeCollection === 'Trending in India' && dest.rating < 4.88) return false;
        if (activeCollection === 'Hidden Gems' && !dest.travelStyles.includes('Backpacking') && dest.region !== 'Northeast India') return false;
        if (activeCollection === 'Weekend Getaways' && !dest.travelStyles.includes('Weekend Getaway')) return false;
        if (activeCollection === 'Mountain Escapes' && !dest.travelStyles.includes('Mountains')) return false;
        if (activeCollection === 'Beach Destinations' && !dest.travelStyles.includes('Beaches')) return false;
        if (activeCollection === 'Heritage India' && !dest.travelStyles.includes('Heritage')) return false;
        if (activeCollection === 'Spiritual Journeys' && !dest.travelStyles.includes('Spiritual')) return false;
        if (activeCollection === 'Best for Backpackers' && !dest.travelStyles.includes('Backpacking') && dest.budgetLevel !== 'Budget') return false;

        // Search matching
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = dest.name.toLowerCase().includes(q);
          const matchState = dest.state.toLowerCase().includes(q);
          const matchRegion = dest.region.toLowerCase().includes(q);
          const matchStyle = dest.travelStyles.some(s => s.toLowerCase().includes(q));
          const matchHighlights = dest.highlights.some(h => h.toLowerCase().includes(q));
          if (!matchName && !matchState && !matchRegion && !matchStyle && !matchHighlights) return false;
        }

        if (selectedRegion !== 'All' && dest.region !== selectedRegion) return false;
        if (selectedState !== 'All' && dest.state !== selectedState) return false;
        if (selectedStyle !== 'All' && !dest.travelStyles.includes(selectedStyle as TravelStyle)) return false;
        if (selectedBudget !== 'All' && dest.budgetLevel !== selectedBudget) return false;
        if (selectedSeason !== 'All' && !dest.bestSeason.toLowerCase().includes(selectedSeason.toLowerCase())) return false;

        if (selectedDuration !== 'All') {
          if (selectedDuration === '1-3 Days' && dest.idealDays > 3) return false;
          if (selectedDuration === '4-5 Days' && (dest.idealDays < 4 || dest.idealDays > 5)) return false;
          if (selectedDuration === '6+ Days' && dest.idealDays < 6) return false;
        }

        if (selectedRating !== 'All') {
          if (selectedRating === '4.9+' && dest.rating < 4.9) return false;
          if (selectedRating === '4.8+' && dest.rating < 4.8) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'budget-asc') {
          const budgetWeight = (bTier: BudgetTier) => bTier === 'Budget' ? 1 : bTier === 'Moderate' ? 2 : 3;
          return budgetWeight(a.budgetLevel) - budgetWeight(b.budgetLevel);
        }
        if (sortBy === 'budget-desc') {
          const budgetWeight = (bTier: BudgetTier) => bTier === 'Budget' ? 1 : bTier === 'Moderate' ? 2 : 3;
          return budgetWeight(b.budgetLevel) - budgetWeight(a.budgetLevel);
        }
        return 0;
      });
  }, [destinations, activeCollection, searchTerm, selectedRegion, selectedState, selectedStyle, selectedBudget, selectedSeason, selectedDuration, selectedRating, aiResults, sortBy]);

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#090D16] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* ================= Large AI Prompt Header ================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-pink-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Smart AI Discovery Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Where do you want to <span className="ai-gradient-text">escape?</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Search naturally with budget, vibes, or companions. Gemini reasons through all Indian regions to find your match.
          </p>

          {/* Large Command Search Input with Gradient Border */}
          <div className="pt-2">
            <div className="p-[1.5px] rounded-2xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 shadow-xl shadow-violet-500/15">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAiSearch();
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white dark:bg-[#0F172A] rounded-[15px] p-2 gap-2"
              >
                <div className="relative flex-1 flex items-center pl-3">
                  <Sparkles className="w-5 h-5 text-violet-500 shrink-0" />
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder='e.g. "Cold peaceful places under ₹10k near Delhi"'
                    className="w-full pl-3 pr-8 py-2.5 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-hidden font-medium"
                  />
                  {aiPrompt && (
                    <button
                      type="button"
                      onClick={() => {
                        setAiPrompt('');
                        setAiResults(null);
                      }}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={aiLoading || !aiPrompt.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95"
                >
                  {aiLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-cyan-200" />
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-cyan-200" />
                      <span>AI Discover</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pt-3 flex-wrap">
              {[
                '🏔️ Cold peaceful places under ₹10k near Delhi',
                '🌊 Quiet beaches with cafes in South India',
                '☕ Monsoon coffee estates & waterfalls',
                '🛕 Ancient sacred temples with mountain views'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const cleaned = chip.replace(/^[^\s]+\s*/, '');
                    setAiPrompt(cleaned);
                    handleAiSearch(cleaned);
                  }}
                  className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shadow-2xs hover:border-violet-500"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= AI Results Banner ================= */}
        {aiResults && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-pink-500/10 border border-violet-500/30 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  ✦ Gemini Match Analysis
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {aiResults.searchSummary}
                </h3>
              </div>
              <button
                onClick={() => {
                  setAiResults(null);
                  setAiPrompt('');
                }}
                className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-bold cursor-pointer"
              >
                Clear AI Filter
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {aiResults.recommendedDestinations.map((rec, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-violet-500/20 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{rec.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                      {rec.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {rec.matchReason}
                  </p>
                  <div className="flex items-center justify-between pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700">
                    <span>{rec.bestDurationDays} Days Ideal</span>
                    <strong className="text-slate-800 dark:text-slate-200">{rec.estimatedCost}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= Modern Filter Chips & Controls ================= */}
        <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          
          {/* Collection Pills Rail */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {collections.map((col) => {
              const isActive = activeCollection === col;
              return (
                <button
                  key={col}
                  onClick={() => setActiveCollection(col)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {col}
                </button>
              );
            })}
          </div>

          {/* Search by text & sorting */}
          <div className="flex flex-col md:flex-row items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by destination name, state, key monuments or food..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-violet-500 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full md:w-48 pl-3 pr-8 py-2.5 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="rating">Sort: Highest Rated</option>
                <option value="name">Sort: Alphabetical (A-Z)</option>
                <option value="budget-asc">Sort: Budget (Low to High)</option>
                <option value="budget-desc">Sort: Budget (High to Low)</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            {/* Region */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
              >
                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">State / UT</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
              >
                {uniqueStates.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Travel Style */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Style</label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full p-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
              >
                {styles.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Budget</label>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full p-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
              >
                {budgetTiers.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Trip Duration */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Duration</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full p-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Durations</option>
                <option value="1-3 Days">1–3 Days</option>
                <option value="4-5 Days">4–5 Days</option>
                <option value="6+ Days">6+ Days</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Rating</label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full p-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Ratings</option>
                <option value="4.9+">★ 4.9+ Top Tier</option>
                <option value="4.8+">★ 4.8+ Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= Destination Editorial / Bento Grid ================= */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Showing {filteredDestinations.length} Destinations
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Taste profile: {preferences.homeCity || 'India'}
            </span>
          </div>

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
            <div className="text-center py-20 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-4">
              <Compass className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                No destinations matched these specific filters
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Try broadening your criteria or reset all filters to view our full collection of 35+ verified destinations.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
