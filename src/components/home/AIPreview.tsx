import React from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

interface AIPreviewProps {
  onStartPlanning: () => void;
}

export const AIPreview: React.FC<AIPreviewProps> = ({ onStartPlanning }) => {
  return (
    <section className="py-24 bg-[#F7F5F0] overflow-hidden border-t border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Story & Flow (7 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#737373]">
              Intelligent Travel Architecture
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#171717] tracking-tight leading-tight text-balance">
              A bespoke Indian itinerary in seconds, without browser tab chaos.
            </h2>

            <p className="text-sm text-[#525252] leading-relaxed font-light text-balance">
              Unlike generic chatbots that return unstructured walls of text, Travillo reasons across train schedules, temple opening hours, sunset timings, and regional culinary traditions to produce a structured, realistic day-by-day roadmap.
            </p>

            {/* Editorial 4-Step Journey */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-black/[0.06] shadow-2xs">
                <span className="text-xs font-mono font-semibold text-[#12372A] mt-0.5">
                  01
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-[#171717]">Define your journey parameters</h4>
                  <p className="text-xs text-[#737373] mt-0.5 font-light">
                    Select destination, starting city, pacing, daily budget tier, and companions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-black/[0.06] shadow-2xs">
                <span className="text-xs font-mono font-semibold text-[#12372A] mt-0.5">
                  02
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-[#171717]">Gemini travel intelligence reasons</h4>
                  <p className="text-xs text-[#737373] mt-0.5 font-light">
                    Balances Vande Bharat rail connections, daylight pacing, and authentic food spots.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-black/[0.06] shadow-2xs">
                <span className="text-xs font-mono font-semibold text-[#12372A] mt-0.5">
                  03
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-[#171717]">Receive structured morning-to-evening flow</h4>
                  <p className="text-xs text-[#737373] mt-0.5 font-light">
                    Clear activity phases, local transit strategies, packing notes, and INR budget breakdowns.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-black/[0.06] shadow-2xs">
                <span className="text-xs font-mono font-semibold text-[#12372A] mt-0.5">
                  04
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-[#171717]">Save to Cloud Firestore & access on the road</h4>
                  <p className="text-xs text-[#737373] mt-0.5 font-light">
                    Securely tied to your account for offline-ready reference on mobile or desktop.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onStartPlanning}
                className="px-6 py-3.5 bg-[#12372A] hover:bg-[#184938] text-white text-xs font-semibold tracking-wide rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer group"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Create Personalized Itinerary</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Itinerary Card Mockup (6 cols) */}
          <div className="lg:col-span-6 relative">
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-black/[0.08] space-y-5">
              {/* Itinerary Header */}
              <div className="flex items-start justify-between border-b border-black/[0.06] pb-4">
                <div>
                  <div className="text-[11px] font-mono text-[#12372A] uppercase tracking-wider font-semibold">
                    Sample Gemini Plan
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#171717] mt-0.5">
                    Sacred Waters & Spice Canals
                  </h3>
                  <div className="text-xs text-[#737373] font-light mt-0.5">
                    Alleppey & Kumarakom, Kerala <span aria-hidden="true">·</span> 4 Days <span aria-hidden="true">·</span> 2 Travelers
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#737373] uppercase tracking-wider block font-medium">Estimated Total</span>
                  <span className="text-lg font-serif font-bold text-[#171717] tabular-nums">₹28,500</span>
                </div>
              </div>

              {/* Sample Day Card */}
              <div className="p-4 rounded-xl bg-[#F7F5F0] border border-black/[0.05] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold text-[#12372A] tracking-wider uppercase">
                    Day 02 · Kuttanad Waterways
                  </span>
                  <span className="text-xs font-medium text-[#737373] tabular-nums">
                    Est. ₹6,200
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#374151]">
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#12372A] mt-1.5 shrink-0" />
                    <p className="font-light">
                      <strong className="font-medium text-[#171717]">Morning:</strong> Sunrise wooden canoe glide through narrow palm-shaded village canals.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#12372A] mt-1.5 shrink-0" />
                    <p className="font-light">
                      <strong className="font-medium text-[#171717]">Afternoon:</strong> Authentic Kerala Sadya served on fresh banana leaf with red matta rice.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#12372A] mt-1.5 shrink-0" />
                    <p className="font-light">
                      <strong className="font-medium text-[#171717]">Evening:</strong> Sunset tea and warm plantain fritters on the upper sundeck of your houseboat.
                    </p>
                  </div>
                </div>
              </div>

              {/* Budget Allocation Visualization */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-medium text-[#171717]">Estimated Budget Breakdown</span>
                  <span className="text-[#737373] font-mono text-[11px]">100% Calculated</span>
                </div>
                <div className="h-2 w-full bg-[#E5E2DA] rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#12372A] w-[50%]" title="Lodging (50%)" />
                  <div className="h-full bg-[#0F766E] w-[25%]" title="Food (25%)" />
                  <div className="h-full bg-[#C29B38] w-[15%]" title="Activities (15%)" />
                  <div className="h-full bg-[#737373] w-[10%]" title="Transit (10%)" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#737373] mt-2 font-light">
                  <span>Stay (₹14.2k)</span>
                  <span>Dining (₹7.1k)</span>
                  <span>Activities (₹4.3k)</span>
                  <span>Transit (₹2.9k)</span>
                </div>
              </div>

              {/* Footer Trust Marker */}
              <div className="pt-2 border-t border-black/[0.05] flex items-center justify-between text-xs text-[#737373]">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#12372A]" />
                  <span>Cloud Firestore Sync</span>
                </div>
                <span className="font-medium text-[#12372A]">Ready to save to My Trips</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
