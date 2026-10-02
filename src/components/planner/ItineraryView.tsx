import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  Sun, 
  Sunset, 
  Moon, 
  Utensils, 
  Compass, 
  Briefcase, 
  ShieldAlert, 
  Bookmark, 
  Check, 
  Share2, 
  RotateCcw,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Itinerary, SavedTrip } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ItineraryViewProps {
  itinerary: Itinerary;
  onSaveTrip: () => Promise<void>;
  isSaving: boolean;
  isSaved: boolean;
  onReplan: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  onSaveTrip,
  isSaving,
  isSaved,
  onReplan
}) => {
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'timeline' | 'logistics' | 'budget'>('timeline');
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [copied, setCopied] = useState(false);

  const toggleDay = (dayNum: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  const expandAllDays = () => {
    const all: Record<number, boolean> = {};
    itinerary.days.forEach(d => { all[d.dayNumber] = true; });
    setExpandedDays(all);
  };

  const collapseAllDays = () => {
    setExpandedDays({});
  };

  const handleShare = () => {
    const text = `Check out my ${itinerary.duration}-day travel itinerary for ${itinerary.destination} on Travillo: "${itinerary.tripTitle}". Estimated budget: ${itinerary.estimatedTotalBudget}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveClick = async () => {
    if (!user) {
      openAuthModal('signin');
      return;
    }
    await onSaveTrip();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/60 to-teal-50/40 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-neutral-100">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Gemini 3.8 Intelligent Itinerary</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-semibold">
                {itinerary.duration} Days
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold font-serif-heading text-neutral-900 tracking-tight">
              {itinerary.tripTitle}
            </h1>

            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{itinerary.destination}</span>
              <span>•</span>
              <Users className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>{itinerary.travelers} Travelers</span>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed pt-1">
              {itinerary.summary}
            </p>
          </div>

          {/* Budget Highlight & Save Actions */}
          <div className="lg:text-right shrink-0 space-y-3 bg-[#FAF9F6] p-5 rounded-2xl border border-neutral-200/70">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Estimated Total Trip Budget
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif-heading">
                {itinerary.estimatedTotalBudget}
              </div>
              <span className="text-[11px] text-neutral-500">
                For {itinerary.travelers} {itinerary.travelers === 1 ? 'traveler' : 'travelers'} ({itinerary.duration} days)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={handleSaveClick}
                disabled={isSaving || isSaved}
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                  isSaved
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Saved in My Trips</span>
                  </>
                ) : isSaving ? (
                  <span>Saving to Cloud...</span>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save Trip</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors cursor-pointer"
                title="Share itinerary"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onReplan}
                className="p-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors cursor-pointer"
                title="Adjust planner inputs"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-4 pt-4 border-b border-neutral-100">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Day-by-Day Timeline ({itinerary.days.length})
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === 'budget'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Budget Breakdown
          </button>
          <button
            onClick={() => setActiveTab('logistics')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === 'logistics'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Stay, Transport & Packing
          </button>
        </div>
      </div>

      {/* Tab 1: Day-by-Day Timeline */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-serif-heading text-neutral-900">
              Daily Schedule & Experiences
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={expandAllDays}
                className="text-emerald-700 hover:underline cursor-pointer font-medium"
              >
                Expand all
              </button>
              <span className="text-neutral-300">|</span>
              <button
                onClick={collapseAllDays}
                className="text-neutral-500 hover:underline cursor-pointer font-medium"
              >
                Collapse all
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {itinerary.days.map((day) => {
              const isExpanded = !!expandedDays[day.dayNumber];
              return (
                <div
                  key={day.dayNumber}
                  className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden transition-all"
                >
                  {/* Collapsible Card Header */}
                  <div
                    onClick={() => toggleDay(day.dayNumber)}
                    className="p-5 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-neutral-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex flex-col items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        <span className="text-[10px] uppercase text-neutral-400">Day</span>
                        <span className="text-base leading-none">{day.dayNumber}</span>
                      </div>
                      <div>
                        <h4 className="text-base font-bold font-serif-heading text-neutral-900">
                          {day.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5">
                          <span>Est. Daily Spend: <strong className="text-neutral-800">{day.estimatedDailyCost}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
                        {isExpanded ? 'Hide details' : 'View plan'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-neutral-100 space-y-5 text-xs text-neutral-700">
                      {/* 3 Day Parts: Morning, Afternoon, Evening */}
                      <div className="grid md:grid-cols-3 gap-3.5">
                        {/* Morning */}
                        <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-2">
                          <div className="flex items-center gap-2 text-amber-800 font-bold uppercase tracking-wider text-[10px]">
                            <Sun className="w-3.5 h-3.5 text-amber-600" />
                            <span>Morning Phase</span>
                          </div>
                          <p className="text-neutral-700 leading-relaxed text-xs">
                            {day.morning}
                          </p>
                        </div>

                        {/* Afternoon */}
                        <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 space-y-2">
                          <div className="flex items-center gap-2 text-emerald-800 font-bold uppercase tracking-wider text-[10px]">
                            <Sunset className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Afternoon Highlights</span>
                          </div>
                          <p className="text-neutral-700 leading-relaxed text-xs">
                            {day.afternoon}
                          </p>
                        </div>

                        {/* Evening */}
                        <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200/60 space-y-2">
                          <div className="flex items-center gap-2 text-indigo-800 font-bold uppercase tracking-wider text-[10px]">
                            <Moon className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Evening & Dining</span>
                          </div>
                          <p className="text-neutral-700 leading-relaxed text-xs">
                            {day.evening}
                          </p>
                        </div>
                      </div>

                      {/* Places & Activities */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-neutral-400 font-semibold text-[11px]">Key Places:</span>
                        {day.places.map((place, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 font-medium">
                            {place}
                          </span>
                        ))}
                      </div>

                      {/* Food & Dining Recommendations */}
                      <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-neutral-200/60 flex items-start gap-3">
                        <Utensils className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-neutral-900 block text-[11px] uppercase tracking-wide">
                            Signature Food & Culinary Pairings
                          </span>
                          <p className="text-neutral-600 mt-0.5">
                            {day.foodSuggestions.join(' • ')}
                          </p>
                        </div>
                      </div>

                      {/* Transport Guidance & Notes */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                          <span className="font-semibold text-neutral-800 block text-[11px]">Transit Guidance:</span>
                          <p className="text-neutral-600 mt-0.5">{day.transportGuidance}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                          <span className="font-semibold text-neutral-800 block text-[11px]">Timing & Pro-Tips:</span>
                          <p className="text-neutral-600 mt-0.5">{day.usefulNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Budget Breakdown */}
      {activeTab === 'budget' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold font-serif-heading text-neutral-900">
              Comprehensive Budget Projection
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Estimated total cost of {itinerary.estimatedTotalBudget} structured across five critical travel categories.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-neutral-200/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Lodging & Accommodation</span>
              <div className="text-xl font-bold text-neutral-900">{itinerary.budgetBreakdown.accommodation}</div>
              <p className="text-[11px] text-neutral-500">Hotels, boutique villas, or guesthouses</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-neutral-200/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Food & Dining</span>
              <div className="text-xl font-bold text-neutral-900">{itinerary.budgetBreakdown.foodAndDining || itinerary.budgetBreakdown.food}</div>
              <p className="text-[11px] text-neutral-500">Daily breakfast, authentic regional dining & street food</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-neutral-200/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Activities & Entry Tickets</span>
              <div className="text-xl font-bold text-neutral-900">{itinerary.budgetBreakdown.activitiesAndEntry || itinerary.budgetBreakdown.activities}</div>
              <p className="text-[11px] text-neutral-500">Heritage monument tickets, safaris & local guides</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-neutral-200/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Local Transit & Transfers</span>
              <div className="text-xl font-bold text-neutral-900">{itinerary.budgetBreakdown.localTransit || itinerary.budgetBreakdown.localTransport}</div>
              <p className="text-[11px] text-neutral-500">Autos, metro, cabs & scooty rentals</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-neutral-200/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Buffer & Miscellaneous</span>
              <div className="text-xl font-bold text-neutral-900">{itinerary.budgetBreakdown.miscellaneous}</div>
              <p className="text-[11px] text-neutral-500">Tips, local sim cards, emergencies & shopping</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Logistics & Packing */}
      {activeTab === 'logistics' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold font-serif-heading text-neutral-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>Accommodation Area Guidance</span>
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {itinerary.accommodationGuidance || itinerary.accommodationAreaGuidance || 'Stay close to key hubs for easy transit and authentic dining.'}
            </p>

            <h3 className="text-base font-bold font-serif-heading text-neutral-900 flex items-center gap-2 pt-3 border-t border-neutral-100">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>Transport & Getting Around</span>
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {itinerary.transportRecommendations || itinerary.localTransportSuggestions || itinerary.howToReachRecommendations || 'Use authorized pre-paid auto counters, metro passes, or vetted cab aggregators.'}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold font-serif-heading text-neutral-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-700" />
              <span>Recommended Packing List</span>
            </h3>
            <ul className="space-y-2 text-xs text-neutral-600">
              {itinerary.packingSuggestions.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-base font-bold font-serif-heading text-neutral-900 flex items-center gap-2 pt-3 border-t border-neutral-100">
              <ShieldAlert className="w-4 h-4 text-emerald-700" />
              <span>Essential Etiquette & Practical Tips</span>
            </h3>
            <ul className="space-y-2 text-xs text-neutral-600">
              {itinerary.practicalTravelTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Safety Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Travel Note:</strong> Pricing estimates and activity schedules are generated for planning guidance. Weather patterns, seasonal opening hours, local permits, and hotel availability change dynamically. Always double check with official authorities and operators prior to booking.
        </p>
      </div>
    </div>
  );
};
