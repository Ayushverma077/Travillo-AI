import React, { useState } from 'react';
import { Sparkles, MapPin, Navigation, Calendar, Users, ArrowRight } from 'lucide-react';
import { DESTINATIONS } from '../../data/destinations';

interface HeroProps {
  onPlanTrip: (destinationName?: string, travelers?: number) => void;
  onExplore: () => void;
  onSelectDestination: (destName: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onPlanTrip,
  onExplore,
  onSelectDestination
}) => {
  const [destinationInput, setDestinationInput] = useState('');
  const [startingCity, setStartingCity] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('Upcoming Season');
  const [travelersCount, setTravelersCount] = useState('2');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleDestinationChange = (value: string) => {
    setDestinationInput(value);
    if (value.trim().length > 1) {
      const filtered = DESTINATIONS
        .filter(d => 
          d.name.toLowerCase().includes(value.toLowerCase()) ||
          d.state.toLowerCase().includes(value.toLowerCase()) ||
          d.region.toLowerCase().includes(value.toLowerCase())
        )
        .map(d => d.name)
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(travelersCount, 10) || 2;
    onPlanTrip(destinationInput.trim(), count);
  };

  const popularDestinations = [
    'Rishikesh',
    'Udaipur',
    'Munnar',
    'Spiti Valley',
    'Goa',
    'Varanasi',
    'Meghalaya'
  ];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#0C1210] text-white">
      {/* Background Cinematic Photography with Rich Layered Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=88"
          alt="Majestic Indian mountain sanctuary"
          className="w-full h-full object-cover object-center scale-[1.02] filter brightness-[0.78]"
        />
        {/* Editorial gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C1210]/60 via-transparent to-[#0C1210]/90" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0C1210]/20 to-[#0C1210]/70" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 text-center flex flex-col items-center">
        {/* Editorial Sub-kicker */}
        <div className="mb-4 text-xs font-semibold tracking-[0.25em] uppercase text-[#E0E7E3]/90">
          Curated India Journeys · Powered by Gemini
        </div>

        {/* Cinematic Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight text-white max-w-3xl leading-[1.08] text-balance">
          Discover India. <br />
          <span className="italic font-light text-[#E5E9E4]">Plan intelligently.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-5 text-base sm:text-lg text-[#D1D5DB] max-w-2xl font-light leading-relaxed text-balance">
          From hidden mountain villages to coastal escapes, Travillo turns your travel ideas into personalized journeys.
        </p>

        {/* Primary CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onPlanTrip()}
            className="px-7 py-3.5 bg-[#12372A] hover:bg-[#184938] text-white font-medium text-sm rounded-xl border border-white/10 shadow-lg shadow-black/30 transition-all cursor-pointer hover:scale-[1.01]"
          >
            Plan My India Trip
          </button>

          <button
            onClick={onExplore}
            className="px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white font-medium text-sm rounded-xl backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-[1.01]"
          >
            Explore India
          </button>
        </div>

        {/* Sophisticated Floating Search & Planning Surface */}
        <div className="w-full max-w-4xl mt-12 bg-white rounded-2xl p-2.5 sm:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-black/[0.08] text-[#171717]">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 items-center">
            {/* Where to */}
            <div className="relative text-left px-3.5 py-2.5 rounded-xl hover:bg-[#F7F5F0] transition-colors lg:col-span-4">
              <label className="block text-[11px] font-medium text-[#737373] tracking-wide">
                Where do you want to go?
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <MapPin className="w-4 h-4 text-[#12372A] shrink-0" />
                <input
                  type="text"
                  value={destinationInput}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  onFocus={() => { if (suggestions.length) setShowSuggestions(true); }}
                  onBlur={() => { setTimeout(() => setShowSuggestions(false), 250); }}
                  placeholder="e.g. Rishikesh, Munnar, Udaipur..."
                  className="w-full text-sm font-medium text-[#171717] placeholder:text-[#9CA3AF] bg-transparent focus:outline-none"
                />
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-black/[0.08] py-1.5 z-30">
                  {suggestions.map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => {
                        setDestinationInput(dest);
                        setShowSuggestions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#374151] hover:bg-[#F7F5F0] hover:text-[#12372A] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#12372A]" />
                      <span>{dest}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Starting from */}
            <div className="text-left px-3.5 py-2.5 rounded-xl hover:bg-[#F7F5F0] transition-colors lg:col-span-2">
              <label className="block text-[11px] font-medium text-[#737373] tracking-wide">
                Starting from
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <Navigation className="w-3.5 h-3.5 text-[#737373] shrink-0" />
                <input
                  type="text"
                  value={startingCity}
                  onChange={(e) => setStartingCity(e.target.value)}
                  placeholder="Delhi / Mumbai"
                  className="w-full text-sm font-medium text-[#171717] placeholder:text-[#9CA3AF] bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* When / Season */}
            <div className="text-left px-3.5 py-2.5 rounded-xl hover:bg-[#F7F5F0] transition-colors lg:col-span-2">
              <label className="block text-[11px] font-medium text-[#737373] tracking-wide">
                When?
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#737373] shrink-0" />
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-full text-xs font-medium text-[#171717] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="Upcoming Season">Upcoming Season</option>
                  <option value="Autumn (Oct – Nov)">Autumn (Oct – Nov)</option>
                  <option value="Winter (Dec – Feb)">Winter (Dec – Feb)</option>
                  <option value="Spring (Mar – May)">Spring (Mar – May)</option>
                  <option value="Monsoon (Jul – Sep)">Monsoon (Jul – Sep)</option>
                </select>
              </div>
            </div>

            {/* Travelers */}
            <div className="text-left px-3.5 py-2.5 rounded-xl hover:bg-[#F7F5F0] transition-colors lg:col-span-2">
              <label className="block text-[11px] font-medium text-[#737373] tracking-wide">
                Travelers
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <Users className="w-3.5 h-3.5 text-[#737373] shrink-0" />
                <select
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(e.target.value)}
                  className="w-full text-xs font-medium text-[#171717] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="1">1 Traveler (Solo)</option>
                  <option value="2">2 Travelers (Couple)</option>
                  <option value="3">3 Travelers</option>
                  <option value="4">4 Travelers (Family/Group)</option>
                  <option value="6">6+ Travelers</option>
                </select>
              </div>
            </div>

            {/* Action CTA */}
            <div className="p-1 lg:col-span-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#12372A] hover:bg-[#184938] text-white text-xs font-semibold tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Plan with AI</span>
              </button>
            </div>
          </form>
        </div>

        {/* Featured Destinations Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-[#9CA3AF]">
          <span className="font-normal text-[#D1D5DB]">Trending places:</span>
          {popularDestinations.map((dest, i) => (
            <React.Fragment key={dest}>
              <button
                onClick={() => onSelectDestination(dest)}
                className="text-white hover:text-emerald-300 transition-colors cursor-pointer font-medium"
              >
                {dest}
              </button>
              {i < popularDestinations.length - 1 && <span className="text-white/30">·</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
