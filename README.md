# Travillo — Intelligent Travel Discovery & AI Trip Planning

> *"Your journey, intelligently planned."*

Travillo is a modern, full-stack travel-tech platform that marries curated global destination discovery with Gemini-powered personalized itinerary generation, real-time Firebase Authentication, and user-scoped Cloud Firestore persistence.

---

## 🌟 Key Features

1. **Curated Destination Discovery**
   - Rich seed guides across India (Alleppey, Jaipur, Ladakh, Varanasi, Goa) and iconic world regions (Kyoto, Swiss Alps, Banff, Amalfi Coast, Bali, Queenstown, Iceland).
   - Real-time multi-attribute filtering (Region, Travel Style, Budget Tier, Best Season).
   - Dynamic sorting by highest ratings, budget tiers, and alphabetical order.
   - Comprehensive destination detail modals with signature highlights, insider travel tips, and photography galleries.

2. **Gemini 3.8 Flash AI Trip Planner (Flagship)**
   - Collects departure origin, trip duration (1–14 days), budget tier, currency preference, group size, and distinct travel interests.
   - Generates structured day-by-day itineraries with morning, afternoon, and evening phases, local culinary pairings, transit guidance, and daily cost projections.
   - Category budget breakdown (Lodging, Food, Activities, Transit, Buffer).
   - Accommodation guidance, transport strategy, packing checklists, and cultural etiquette.

3. **Firebase Authentication**
   - Real Firebase Auth supporting one-click Google Sign-In and Email/Password signup & login.
   - Auth state persistence across browser sessions.
   - Dedicated user profile view with live statistics (Trips Saved, Favorites Count).

4. **Cloud Firestore Persistence**
   - **Saved Itineraries (`users/{userId}/trips/{tripId}`)**: Save AI-generated plans with a single click and review day-by-day timeline schedules anytime.
   - **User Favorites (`users/{userId}/favorites/{destinationId}`)**: Synchronized bookmarking across all destination cards and detail pages.
   - Real-time reactive data subscriptions with zero-latency UI updates.

5. **Hardened ABAC Security Rules**
   - Zero-trust security rules with Attribute-Based Access Control (ABAC).
   - Rigid owner validation preventing cross-user read/write leaks.

6. **Premium Luxury Aesthetic**
   - Typography paired with *Playfair Display* and *Plus Jakarta Sans*.
   - Warm neutral surfaces (`#FAF9F6`), emerald accents, cinematic photography, and subtle micro-interactions.
   - Fully responsive design optimized for desktop, tablet, and mobile screens.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend / API**: Express 4, Node.js (via `server.ts` entry point with Vite middleware)
- **AI Engine**: `@google/genai` TypeScript SDK (`gemini-3.8-flash`) with telemetry headers and structured JSON schemas
- **Authentication**: Firebase Auth (Google Provider + Email/Password)
- **Database**: Google Cloud Firestore (Enterprise Edition, user-scoped schema)

---

## 📁 Project Architecture

```
├── firebase-applet-config.json    # Firebase client configuration
├── firebase-blueprint.json        # Firestore IR Schema definition
├── firestore.rules                # Hardened production Firestore security rules
├── server.ts                      # Full-stack Express server with Gemini AI endpoint
├── src/
│   ├── components/
│   │   ├── auth/                  # AuthModal (Google & Email/Password)
│   │   ├── common/                # About, Privacy, and Terms Modals
│   │   ├── destinations/          # DiscoverView, DestinationCard, DestinationDetailModal
│   │   ├── favorites/             # FavoritesView (synced with Firestore)
│   │   ├── home/                  # Hero, TrendingDestinations, TravelStyles, AIPreview, WhyTravillo, HowItWorks, FinalCTA
│   │   ├── layout/                # Navbar (with user dropdown & responsive drawer), Footer
│   │   ├── planner/               # AIPlannerView, ItineraryView
│   │   ├── profile/               # ProfileModal with user stats
│   │   └── trips/                 # MyTripsView with full itinerary inspector & deletion
│   ├── context/
│   │   ├── AuthContext.tsx        # Firebase Auth context & user profile sync
│   │   └── FavoritesContext.tsx   # Real-time Firestore favorites synchronization
│   ├── data/
│   │   └── destinations.ts        # Comprehensive destination seed database
│   ├── lib/
│   │   ├── firebase.ts            # Firebase initialization & error handler
│   │   └── firestoreService.ts    # User profile, trips, and favorites CRUD services
│   ├── types/
│   │   └── index.ts               # Core TypeScript data contracts
│   ├── App.tsx                    # Root routing & tab coordination
│   ├── main.tsx                   # React root entry
│   └── index.css                  # Tailwind styles and luxury typography rules
```

---

## 🔐 Firestore Architecture & Security Rules

### Document Paths
- `users/{userId}`: Private user profile (display name, email, avatar, timestamps).
- `users/{userId}/trips/{tripId}`: User's saved Gemini-generated itineraries.
- `users/{userId}/favorites/{destinationId}`: User's bookmarked destinations.

### Hardened Rules Highlights
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false; // Default deny
    }

    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow get, list, create, update, delete: if isOwner(userId);

      match /trips/{tripId} {
        allow get, list, create, update, delete: if isOwner(userId);
      }

      match /favorites/{destinationId} {
        allow get, list, create, update, delete: if isOwner(userId);
      }
    }
  }
}
```

---

## 🚀 Environment Variables (`.env.example`)

```bash
# GEMINI_API_KEY: Required for Gemini AI API calls on the backend.
# Injected automatically in AI Studio runtime.
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# APP_URL: The hosted URL of the application.
APP_URL="http://localhost:3000"
```

---

## 💻 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:3000`.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Start Production Server**:
   ```bash
   npm start
   ```

---

## 🗺 Future Roadmap

- [ ] Interactive offline maps integration with Google Maps Platform Code Assist.
- [ ] Export itinerary directly to PDF format and calendar files (`.ics`).
- [ ] Group collaboration on saved itineraries via shared trip invite codes.
- [ ] Real-time flight & train transit booking API integrations.
