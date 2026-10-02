import React from 'react';
import { X, ShieldCheck, Compass, FileText, CheckCircle2 } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, title, icon, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200/80 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              {icon}
            </div>
            <h2 className="text-xl font-bold font-serif-heading text-neutral-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-neutral-700 leading-relaxed text-sm">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const AboutModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="About Travillo"
      icon={<Compass className="w-5 h-5" />}
    >
      <div className="space-y-4">
        <p className="text-base text-neutral-900 font-medium">
          Travillo is an intelligent travel discovery and personalized trip-planning platform dedicated exclusively to exploring India.
        </p>
        <p>
          We combine cutting-edge artificial intelligence, verified geographical intelligence across Indian states and union territories, and authentic regional culinary guides to craft tailor-made, day-by-day travel itineraries within seconds.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-xl border border-neutral-100 bg-[#FAF9F6]">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Smart Pacing</span>
            </div>
            <p className="text-xs text-neutral-600">
              Itineraries structured with realistic travel times, logical route clustering, and restful breathing room.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-neutral-100 bg-[#FAF9F6]">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Budget Clarity</span>
            </div>
            <p className="text-xs text-neutral-600">
              Clear budget breakdown across accommodation, dining, activities, and local transit.
            </p>
          </div>
        </div>
        <p className="text-xs text-neutral-500 pt-2 border-t border-neutral-100">
          Travillo AI uses Google’s Gemini intelligence model alongside Firebase cloud infrastructure for real-time trip synchronizations.
        </p>
      </div>
    </BaseModal>
  );
};

export const PrivacyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy Policy"
      icon={<ShieldCheck className="w-5 h-5" />}
    >
      <div className="space-y-3">
        <p>
          At <strong>Travillo</strong>, your privacy and data security are fundamental. This policy outlines how your information is handled.
        </p>
        <h4 className="font-semibold text-neutral-900 pt-2">1. Data Storage & Ownership</h4>
        <p>
          Your saved trips, itineraries, and favorite destinations are stored securely within your private Cloud Firestore scope. We enforce zero-trust Attribute-Based Access Control (ABAC) ensuring only you can access or modify your personal travel records.
        </p>
        <h4 className="font-semibold text-neutral-900 pt-2">2. Authentication</h4>
        <p>
          Authentication is handled directly through Google Firebase Auth. We never store or inspect your raw passwords on any external server.
        </p>
        <h4 className="font-semibold text-neutral-900 pt-2">3. AI Planning Data</h4>
        <p>
          Travel prompts and preferences sent to the AI planner are processed securely to generate your itinerary and are not used to identify you personally.
        </p>
      </div>
    </BaseModal>
  );
};

export const TermsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms of Service"
      icon={<FileText className="w-5 h-5" />}
    >
      <div className="space-y-3">
        <p>
          By using <strong>Travillo</strong>, you agree to these Terms of Service.
        </p>
        <h4 className="font-semibold text-neutral-900 pt-2">1. AI Trip Recommendations & Disclaimers</h4>
        <p>
          All generated itineraries, travel times, activity recommendations, and cost estimates provided by Travillo are for planning guidance only. Pricing, operational hours, permit requirements, and seasonal weather patterns are subject to real-world change. Travelers are responsible for verifying bookings and official local regulations.
        </p>
        <h4 className="font-semibold text-neutral-900 pt-2">2. User Accounts</h4>
        <p>
          Users are responsible for maintaining the confidentiality of their credentials and all activities occurring under their authenticated accounts.
        </p>
        <h4 className="font-semibold text-neutral-900 pt-2">3. Acceptable Use</h4>
        <p>
          You agree not to abuse, reverse-engineer, or overwhelm Travillo’s trip generation endpoints or Firestore database services.
        </p>
      </div>
    </BaseModal>
  );
};
