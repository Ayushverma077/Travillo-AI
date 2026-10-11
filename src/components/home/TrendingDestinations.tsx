import React, { useState } from 'react';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Destination } from '../../types';
import { DestinationCard } from '../destinations/DestinationCard';

interface TrendingDestinationsProps {
  destinations: Destination[];
  onSelectDestination: (destination: Destination) => void;
  onPlanTrip: (destination: Destination) => void;
  onViewAll: () => void;
}

export const TrendingDestinations: React.FC<TrendingDestinationsProps> = ({
  destinations,
  onSelectDestination,
  onPlanTrip,
  onViewAll
}) => {
  const [filter, setFilter] = useState<string>('All India');

  const filterTabs = ['All India', 'North India', 'South India', 'West & Coast', 'Mountains', 'Heritage'];

  const filteredDestinations = destinations.filter(d => {
    if (filter === 'All India') return true;
    if (filter === 'North India') return d.region === 'North India';
    if (filter === 'South India') return d.region === 'South India';
    if (filter === 'West & Coast') return d.region === 'West India' || d.travelStyles.includes('Beaches');
    if (filter === 'Mountains') return d.travelStyles.includes('Mountains');
    if (filter === 'Heritage') return d.travelStyles.includes('Heritage');
    return true;
  }).slice(0, 6);

  return (
    <section className="py-20 bg-slate-50/50 dark:bg-[#090D16]/50 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 mb-2">
              <span className="p-1 rounded-md bg-violet-500/10"><TrendingUp className="w-3.5 h-3.5" /></span>
              <span className="uppercase tracking-widest">🔥 Trending Now</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              Iconic Escapes Across India
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-xl font-normal">
              Most requested itineraries, alpine sanctuaries, and sun-soaked coastlines trending this travel season.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/60 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Destination Cards */}
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

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-400 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
          >
            <span>Explore All 35+ India Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
