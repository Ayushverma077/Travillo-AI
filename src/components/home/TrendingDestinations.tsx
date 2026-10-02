import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
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
    <section className="py-24 bg-[#F7F5F0] border-t border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-2">
              Curated Highlights
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#171717] tracking-tight">
              Trending Destinations
            </h2>
            <p className="text-sm text-[#525252] mt-1.5 max-w-xl font-light">
              Iconic regions and tucked-away sanctuaries curated for upcoming travel seasons.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex flex-wrap items-center gap-1 bg-black/[0.04] p-1 rounded-xl border border-black/[0.04]">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-white text-[#171717] shadow-xs font-semibold'
                    : 'text-[#525252] hover:text-[#171717]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredDestinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onSelect={onSelectDestination}
              onPlanTrip={onPlanTrip}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-black/[0.12] bg-white hover:bg-[#FAF8F5] text-[#171717] text-xs font-semibold tracking-wide transition-all shadow-2xs cursor-pointer group"
          >
            <span>Explore All {destinations.length} Indian Destinations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#12372A]" />
          </button>
        </div>
      </div>
    </section>
  );
};
