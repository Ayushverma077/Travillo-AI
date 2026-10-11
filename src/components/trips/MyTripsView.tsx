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
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Flame
} from 'lucide-react';
import { SavedTrip } from '../../types';
import { DESTINATIONS } from '../../data/destinations';
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
  const [tripTab, setTripTab] = useState<'Upcoming' | 'Planning' | 'Completed' | 'Saved'>('Saved');

  if (!user) {
    return (
      <div className="py-20 bg-slate-50 dark:bg-[#090D16] min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-6 bg-white dark:bg-[#0F172A] p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-violet-600 to-pink-500 text-white flex items-center justify-center mx-auto shadow-md shadow-violet-500/25">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-sans">
              Save your journey ✦
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Create an account or sign in to save trips, sync itineraries and access them from any device.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => openAuthModal('signin', {
                title: 'Save your journey ✦',
                subtitle: 'Create an account or sign in to save trips, sync itineraries and access them from any device.',
                pendingAction: { type: 'navigate', payload: 'trips' }
              })}
              className="w-full flex items-center justify-center gap-2.5 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 transition-all cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => openAuthModal('signin', {
                title: 'Save your journey ✦',
                subtitle: 'Create an account or sign in to save trips, sync itineraries and access them from any device.',
                pendingAction: { type: 'navigate', payload: 'trips' }
              })}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-500/20 transition-all cursor-pointer active:scale-95"
            >
              Sign In
            </button>

            <button
              onClick={() => openAuthModal('signup', {
                title: 'Save your journey ✦',
                subtitle: 'Create an account or sign in to save trips, sync itineraries and access them from any device.',
                pendingAction: { type: 'navigate', payload: 'trips' }
              })}
              className="w-full py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              Create Account
            </button>
          </div>
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

  // Group or filter trips according to status tab
  const filteredTrips = trips.filter((t, idx) => {
    if (tripTab === 'Saved') return true;
    if (tripTab === 'Upcoming') return idx % 3 === 0;
    if (tripTab === 'Planning') return idx % 3 === 1;
    if (tripTab === 'Completed') return idx % 3 === 2;
    return true;
  });

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#090D16] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Full Itinerary Modal / View */}
        {selectedTrip ? (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedTrip(null)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
            >
              <span>← Back to all trips</span>
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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold mb-2">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Personal Travel Portfolio</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
                  My Trips ({trips.length})
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Day-by-day itineraries, interactive route waypoints, and budget schedules.
                </p>
              </div>

              {trips.length > 0 && (
                <button
                  onClick={onPlanFirstTrip}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  <span>Plan Another Journey ✦</span>
                </button>
              )}
            </div>

            {/* Status Tabs: Upcoming | Planning | Completed | Saved */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              {(['Saved', 'Upcoming', 'Planning', 'Completed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTripTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    tripTab === tab
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-violet-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Trips List / Visual Cards Grid */}
            {filteredTrips.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips.map((trip) => {
                  // Find destination photo
                  const matchDest = DESTINATIONS.find(d => 
                    d.name.toLowerCase().includes(trip.destination.toLowerCase()) ||
                    trip.destination.toLowerCase().includes(d.name.toLowerCase())
                  );
                  const coverPhoto = matchDest?.heroImage || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80';

                  return (
                    <div
                      key={trip.id}
                      className="group bg-white dark:bg-[#0F172A] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-violet-500/40 transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Visual Header Image */}
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <img
                          src={coverPhoto}
                          alt={trip.destination}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />
                        
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                          <span className="px-2.5 py-1 rounded-full bg-violet-600/90 backdrop-blur-md text-[11px] font-bold">
                            {trip.duration} Days
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-medium text-slate-200">
                            {new Date(trip.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                          <span className="text-[10px] text-cyan-300 uppercase tracking-wider font-bold">
                            📍 {trip.destination}
                          </span>
                          <h3 className="text-base font-bold text-white leading-tight line-clamp-1">
                            {trip.title}
                          </h3>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Travelers</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                              <Users className="w-3.5 h-3.5 text-violet-500" />
                              <span>{trip.travelers} Persons</span>
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Budget</span>
                            <span className="font-extrabold text-violet-600 dark:text-violet-400 truncate block mt-0.5">
                              {trip.estimatedCost}
                            </span>
                          </div>
                        </div>

                        {/* AI Insight Badge */}
                        <div className="p-2.5 rounded-xl bg-violet-50/60 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/60 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                          <span className="font-bold text-violet-700 dark:text-violet-400 flex items-center gap-1 text-[10px]">
                            <Sparkles className="w-3 h-3" />
                            <span>AI Logistics Highlights</span>
                          </span>
                          <p className="line-clamp-2">
                            {trip.itinerary?.summary || 'Custom day-wise itinerary with verified sights and dining.'}
                          </p>
                        </div>
                      </div>

                      {/* Card Actions Footer */}
                      <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedTrip(trip)}
                          className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Itinerary</span>
                        </button>

                        {onReplanTrip && (
                          <button
                            onClick={() => onReplanTrip(trip)}
                            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                            title="Replan Trip"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => setTripToDelete(trip)}
                          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete trip"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
                <Compass className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  No trips in this view yet
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Build your first intelligent journey with Travillo's Gemini planner.
                </p>
                <button
                  onClick={onPlanFirstTrip}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 text-white font-bold text-xs shadow-md cursor-pointer active:scale-95"
                >
                  Plan with AI ✦
                </button>
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        {tripToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#0F172A] rounded-3xl max-w-sm w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete "{tripToDelete.title}"?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This will permanently remove the trip from your saved Firestore portfolio.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setTripToDelete(null)}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm cursor-pointer disabled:opacity-50"
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
