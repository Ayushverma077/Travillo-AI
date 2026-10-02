import React from 'react';
import { Sparkles, DollarSign, Compass, Bookmark, ShieldCheck, Clock } from 'lucide-react';

export const WhyTravillo: React.FC = () => {
  const pillars = [
    {
      icon: <Sparkles className="w-4 h-4 text-[#12372A]" />,
      title: 'Contextual AI Reasoning',
      description: 'Gemini plans each day by geographic proximity, realistic transit intervals, and seasonal daylight hours rather than random checklist items.'
    },
    {
      icon: <DollarSign className="w-4 h-4 text-[#12372A]" />,
      title: 'Transparent INR Budgets',
      description: 'Granular budget allocations across rail/air transit, hotels, heritage permits, and dining in Indian Rupees without hidden charges.'
    },
    {
      icon: <Compass className="w-4 h-4 text-[#12372A]" />,
      title: 'Curated Regional Diversity',
      description: 'Comprehensive destination intelligence across every zone of India, from high Himalayan passes to Western Ghats coffee estates.'
    },
    {
      icon: <Bookmark className="w-4 h-4 text-[#12372A]" />,
      title: 'Private Firestore Workspaces',
      description: 'Your itineraries and saved wishlists are synchronized in real-time to your authenticated Firebase account for anytime access.'
    },
    {
      icon: <Clock className="w-4 h-4 text-[#12372A]" />,
      title: 'Thoughtful Day Pacing',
      description: 'Clustered activities prevent exhausting cross-city transfers, reserving gentle space for sunset chai and unexpected discoveries.'
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-[#12372A]" />,
      title: 'Local Cultural Etiquette',
      description: 'Context-specific advice on sacred temple attire, photography guidelines, shoe deposit counters, and fair auto-rickshaw fares.'
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-2">
            The Travillo Standard
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#171717] tracking-tight">
            Designed for mindful exploration in India.
          </h2>
          <p className="text-sm text-[#525252] mt-2 font-light">
            We replaced conflicting blog posts and disjointed spreadsheets with one calm, intelligent travel planning workspace.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#F7F5F0] border border-black/[0.04] space-y-3 transition-colors hover:border-black/[0.1]"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-black/[0.06] flex items-center justify-center">
                {pillar.icon}
              </div>
              <h3 className="text-base font-serif font-semibold text-[#171717]">
                {pillar.title}
              </h3>
              <p className="text-xs text-[#525252] leading-relaxed font-light">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
