import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { TRAVEL_STYLES_INFO } from '../../data/destinations';
import { TravelStyle } from '../../types';

interface TravelStylesProps {
  onSelectStyle: (style: TravelStyle) => void;
}

export const TravelStyles: React.FC<TravelStylesProps> = ({ onSelectStyle }) => {
  return (
    <section className="py-24 bg-[#EFECE5] border-t border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-2">
            Thematic Journeys
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#171717] tracking-tight">
            Explore India your way
          </h2>
          <p className="text-sm text-[#525252] mt-1.5 font-light">
            Filter your journey by rhythm and spirit — whether seeking alpine stillness, ancient temple architecture, or coastal sanctuaries.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {TRAVEL_STYLES_INFO.map((style) => (
            <div
              key={style.name}
              onClick={() => onSelectStyle(style.name as TravelStyle)}
              className="group relative h-56 sm:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <img
                src={style.image}
                alt={style.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
              />
              {/* Refined gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

              {/* Top-right subtle arrow icon */}
              <div className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white/90 group-hover:bg-[#12372A] group-hover:text-white transition-all">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>

              {/* Text content */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-base sm:text-lg font-serif font-semibold text-white tracking-wide">
                  {style.name}
                </h3>
                <p className="text-xs text-white/75 line-clamp-2 mt-1 font-light leading-relaxed">
                  {style.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
