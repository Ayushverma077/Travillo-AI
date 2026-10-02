import React, { useState } from 'react';
import { 
  Bookmark, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Compass,
  AlertCircle,
  Eye,
  RotateCcw
} from 'lucide-react';
import { SavedTrip } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { deleteTripFromFirestore } from '../../lib/firestoreService';
import { ItineraryView } from '../planner/ItineraryView';

interface MyTripsViewProps {
  trips: SavedTrip[];
  onPlanFirstTrip: () => void;
  onTripDeleted: (tripId: string) => void;
  onReplanTrip?: (trip: SavedTrip) => void;
}

export const MyTripsView: React.FC<MyTripsViewProps> = ({
  trips,
  onPlanFirstTrip,
  onTripDeleted,
  onReplanTrip
}) => {
  const { user, openAuthModal } = useAuth();
  const [selectedTrip, setSelectedTrip] = useState<SavedTrip | null>(null);
  const [tripToDelete, setTripToDelete] = useState<SavedTrip | null>(null);
  const [deleting, setDeleting] = useState(false);

  // If unauthenticated
  if (!user) {
    return (
      <div className="py-20 bg-[#FAF9F6] min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-5 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-serif-heading text-neutral-900">
            Sign In to Access Saved Trips
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Your customized journeys are tied to your private account for multi-device synchronization and security.
          </p>
          <button
            onClick={() => openAuthModal('signin')}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Sign In with Email or Google
          </button>
        </div>
      </div>
    );
  }

  const confirmDelete = async () => {
    if (!tripToDelete) return;
    setDeleting(true);
    try {
      await deleteTripFromFirestore(user.uid, tripToDelete.id);
      onTripDeleted(tripToDelete.id);
      if (selectedTrip?.id === tripToDelete.id) {
        setSelectedTrip(null);
      }
      setTripToDelete(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="py-12 bg-[#FAF9F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Full Itinerary Modal / View */}
        {selectedTrip ? (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedTrip(null)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-900 cursor-pointer"
            >
              <span>← Back to all saved trips</span>
            </button>

            <ItineraryView
              itinerary={selectedTrip.itinerary}
              onSaveTrip={async () => {}}
              isSaving={false}
              isSaved={true}
              onReplan={onPlanFirstTrip}
            />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
                  <Bookmark className="w-4 h-4" />
                  <span>Personal Travel Portfolio</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold font-serif-heading text-neutral-900 tracking-tight">
                  My Saved Trips ({trips.length})
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                  Access your customized Gemini itineraries, daily schedules, and budget allocations.
                </p>
              </div>

              {trips.length > 0 && (
                <button
                  onClick={onPlanFirstTrip}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Plan Another Trip</span>
                </button>
              )}
            </div>

            {/* Trips List / Grid */}
            {trips.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="p-6 space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-3 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {trip.duration} Days
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {new Date(trip.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Title & Dest */}
                      <div>
                        <h3 className="text-lg font-bold font-serif-heading text-neutral-900 line-clamp-1">
                          {trip.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium mt-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{trip.destination}</span>
                        </div>
                      </div>

                      {/* Details Box */}
                      <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-neutral-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Travelers</span>
                          <span className="font-semibold text-neutral-800 flex items-center gap-1 mt-0.5">
                            <Users className="w-3 h-3 text-neutral-400" />
                            <span>{trip.travelers} Persons</span>
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Est. Budget</span>
                          <span className="font-semibold text-emerald-800 truncate block mt-0.5">
                            {trip.estimatedCost}
                          </span>
                        </div>
                      </div>

                      {/* Summary snippet */}
                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                        {trip.itinerary?.summary || 'Tailored multi-day travel itinerary with daily morning, afternoon, and evening phases.'}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="px-6 py-4 bg-neutral-50/60 border-t border-neutral-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedTrip(trip)}
                        className="flex-1 py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Itinerary</span>
                      </button>

                      {onReplanTrip && (
                        <button
                          onClick={() => onReplanTrip(trip)}
                          className="p-2 text-neutral-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                          title="Replan / customize trip"
                          aria-label="Replan trip"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => setTripToDelete(trip)}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete saved trip"
                        aria-label="Delete saved trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-neutral-200/80 shadow-xs max-w-lg mx-auto space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                  <Bookmark className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold font-serif-heading text-neutral-900">
                    No trips saved yet
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                    Use our AI Trip Planner to craft your first personalized itinerary and save it here for offline reference.
                  </p>
                </div>
                <button
                  onClick={onPlanFirstTrip}
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Plan Your First Trip</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Dialog */}
        {tripToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-neutral-200 shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif-heading text-neutral-900">
                  Delete Saved Trip?
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Are you sure you want to remove <strong>"{tripToDelete.title}"</strong> from your saved trips? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setTripToDelete(null)}
                  disabled={deleting}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {deleting ? 'Deleting...' : 'Delete Trip'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
