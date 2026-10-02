export type IndiaRegion = 
  | 'North India'
  | 'West India'
  | 'South India'
  | 'East India'
  | 'Northeast India'
  | 'Central India';

export type IndiaTravelStyle = 
  | 'Mountains'
  | 'Beaches'
  | 'Adventure'
  | 'Heritage'
  | 'Spiritual'
  | 'Wildlife'
  | 'Nature'
  | 'Food'
  | 'Honeymoon'
  | 'Weekend Getaway'
  | 'Backpacking'
  | 'Culture'
  | 'Relaxation';

export type TravelStyle = IndiaTravelStyle;

export type BudgetTier = 'Budget' | 'Moderate' | 'Luxury';

export type TravelerType = 'Solo' | 'Couple' | 'Family' | 'Friends/Group';

export type TransportPreference = 
  | 'Train' 
  | 'Flight' 
  | 'Bus' 
  | 'Self-drive' 
  | 'Flexible / Recommend for me';

export type AccommodationPreference = 
  | 'Hostel' 
  | 'Budget Hotel' 
  | 'Homestay' 
  | 'Hotel' 
  | 'Resort' 
  | 'Flexible';

export interface Destination {
  id: string;
  name: string;
  state: string;
  country?: string;
  region: IndiaRegion;
  description: string;
  shortDescription: string;
  heroImage: string;
  gallery: string[];
  travelStyles: IndiaTravelStyle[];
  bestSeason: string;
  budgetLevel: BudgetTier;
  estimatedDailyBudget: string; // e.g. "₹2,500 – ₹4,500"
  rating: number;
  reviewsCount: number;
  highlights: string[];
  activities: string[];
  localFood: string[];
  howToReach: string;
  travelTips: string[];
  idealDays: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  places: string[];
  activities: string[];
  foodSuggestions: string[];
  transportGuidance: string;
  estimatedDailyCost: string; // e.g. "₹2,200"
  usefulNotes: string;
}

export interface IndiaBudgetBreakdown {
  transport: string;        // Flights / Trains / Intercity bus
  accommodation: string;    // Hotels / Homestays / Resorts
  food: string;             // Meals, Street food, Local cafes
  foodAndDining?: string;
  localTransport: string;   // Autos, Cabs, Scooty rentals, Metro
  localTransit?: string;
  activities: string;       // Entry permits, Boating, Guides
  activitiesAndEntry?: string;
  miscellaneous: string;    // Souvenirs, Tips, Buffer
}

export interface Itinerary {
  tripTitle: string;
  destination: string;
  state: string;
  startingCity: string;
  summary: string;
  duration: number;
  travelers: number;
  travelerType: string;
  travelStyle: string;
  estimatedTotalBudget: string; // e.g. "₹28,500"
  budgetBreakdown: IndiaBudgetBreakdown;
  days: DayPlan[];
  howToReachRecommendations: string;
  localTransportSuggestions: string;
  accommodationAreaGuidance: string;
  accommodationGuidance?: string;
  transportRecommendations?: string;
  localFoodsWorthTrying: string[];
  packingSuggestions: string[];
  culturalEtiquette: string[];
  practicalTravelTips: string[];
  bestSeasonConsiderations: string;
}

export interface PlannerInput {
  destination: string;
  startingLocation: string;
  duration: number;
  approximateDates?: string;
  budget: BudgetTier;
  currency?: string;
  travelers: number;
  travelerType: TravelerType;
  travelStyle: string;
  interests: string[];
  transportPreference: TransportPreference;
  accommodationPreference: AccommodationPreference;
  notes?: string;
}

export interface SavedTrip {
  id: string;
  userId: string;
  title: string;
  destination: string;
  state?: string;
  startingLocation: string;
  duration: number;
  approximateDates?: string;
  budget: string;
  currency: string;
  travelers: number;
  travelerType?: string;
  interests: string[];
  travelStyle: string;
  transportPreference: string;
  accommodationPreference: string;
  notes?: string;
  itinerary: Itinerary;
  estimatedCost: string;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteItem {
  destinationId: string;
  userId: string;
  destinationName: string;
  destinationState?: string;
  destinationCountry?: string;
  destinationRegion: string;
  heroImage: string;
  createdAt: string;
}

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
  updatedAt: string;
}
