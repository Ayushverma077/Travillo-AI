import React from 'react';
import { Sparkles } from 'lucide-react';

interface FinalCTAProps {
  onPlanTrip: () => void;
  onExplore: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onPlanTrip, onExplore }) => {
  return (
    <section className="relative py-28 overflow-hidden bg-[#0C1210] text-white">
      {/* Background imagery with subtle dark luxury overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=80"
          alt="Atmospheric Indian landscape"
          className="w-full h-full object-cover opacity-30 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1210] via-[#0C1210]/60 to-[#0C1210]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#E0E7E3]/80">
          Start Your Journey
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white leading-tight">
          Your next Indian journey begins with an idea.
        </h2>

        <p className="text-sm sm:text-base text-[#D1D5DB] max-w-xl mx-auto leading-relaxed font-light">
          From tranquil backwater houseboats to snow-crowned alpine valleys, let Travillo structure your timeline, train connections, and daily budget.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onPlanTrip}
            className="px-7 py-3.5 bg-[#12372A] hover:bg-[#184938] text-white font-medium text-sm rounded-xl shadow-lg border border-white/10 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Plan My India Trip</span>
          </button>

          <button
            onClick={onExplore}
            className="px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white font-medium text-sm rounded-xl backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-[1.01]"
          >
            Explore Destinations
          </button>
        </div>
      </div>
    </section>
  );
};
