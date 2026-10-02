import React from 'react';
import { Search, Sliders, Sparkles, Bookmark } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: <Search className="w-4 h-4 text-[#12372A]" />,
      title: 'Discover India',
      description: 'Explore destinations across 6 Indian zones, vetted seasons, budget tiers, and authentic experiences.'
    },
    {
      step: '02',
      icon: <Sliders className="w-4 h-4 text-[#12372A]" />,
      title: 'Set Your Rhythm',
      description: 'Choose your origin metro, travel days, companions, stay preferences, and transport style.'
    },
    {
      step: '03',
      icon: <Sparkles className="w-4 h-4 text-[#12372A]" />,
      title: 'Gemini Architects',
      description: 'Our engine generates a cohesive morning-to-evening itinerary with regional food pairings and INR costs.'
    },
    {
      step: '04',
      icon: <Bookmark className="w-4 h-4 text-[#12372A]" />,
      title: 'Save & Journey',
      description: 'Store your journey in Cloud Firestore to reference packing tips and local transport guidance on your trip.'
    }
  ];

  return (
    <section className="py-24 bg-[#F7F5F0] border-t border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-2">
            The Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#171717] tracking-tight">
            How Travillo Works
          </h2>
          <p className="text-sm text-[#525252] mt-2 font-light">
            From first spark of inspiration to a structured daily agenda in four simple milestones.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-2xl border border-black/[0.06] shadow-2xs flex flex-col justify-between space-y-6 hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-[#F7F5F0] border border-black/[0.05] flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-sm font-mono font-medium text-[#737373]">
                  {item.step}
                </span>
              </div>

              <div>
                <h3 className="text-base font-serif font-semibold text-[#171717]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#525252] leading-relaxed mt-1.5 font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
