import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client with telemetry header
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      platform: 'Travillo India',
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(apiKey)
    });
  });

  // Flagship India AI Itinerary Generation endpoint
  app.post('/api/plan-trip', async (req, res) => {
    try {
      const {
        destination,
        startingLocation = 'Delhi',
        duration = 4,
        approximateDates = 'Upcoming Season',
        budget = 'Balanced',
        travelers = 2,
        travelerType = 'Couple',
        travelStyle = 'Balanced',
        interests = ['Heritage', 'Nature', 'Food'],
        transportPreference = 'Train',
        accommodationPreference = 'Hotel',
        notes = ''
      } = req.body;

      if (!destination || !destination.trim()) {
        return res.status(400).json({ error: 'Indian destination is required.' });
      }

      const numDays = Math.min(Math.max(Number(duration) || 3, 1), 14);
      const numTravelers = Math.max(Number(travelers) || 1, 1);

      const prompt = `You are Travillo's Chief Travel Architect for India. Create an authentic, highly detailed, logistically coherent, day-by-day travel itinerary for an Indian journey:
Destination in India: ${destination}
Starting City / Origin in India: ${startingLocation || 'Delhi / Nearest Metro'}
Trip Duration: ${numDays} Days
Approximate Travel Dates / Season: ${approximateDates}
Budget Tier: ${budget}
Currency: Strictly INR (₹)
Traveler Group: ${numTravelers} Travelers (${travelerType})
Travel Style: ${travelStyle}
Travel Interests: ${Array.isArray(interests) ? interests.join(', ') : interests}
Preferred Intercity Transport: ${transportPreference}
Preferred Stay Type: ${accommodationPreference}
Special Traveler Wishes: ${notes || 'None'}

CRITICAL GUIDELINES:
1. Provide all pricing and cost estimates exclusively in Indian Rupees (₹ INR).
2. All food recommendations must be genuine regional Indian delicacies and specific dishes.
3. Keep daily schedules geographically realistic. Do not group far-flung Indian towns in a single morning.
4. Detail the recommended way to reach the destination from ${startingLocation} (direct Vande Bharat/Express trains, flights, or highways).
5. Specify local transit tips (auto-rickshaw negotiation, metro lines, prepaid taxis, scooty rentals).
6. Note essential cultural & temple etiquette (head coverings, removing footwear, modest attire, photography rules).`;

      // Call Gemini 3.8 Flash model
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are Travillo's senior travel intelligence architect specializing strictly in India tourism.
- Never hallucinate non-existent Indian trains, fake flights, or closed attractions.
- Use realistic Indian pricing (e.g. ₹500 to ₹1,500 for budget daily food; ₹1,800 to ₹6,000 for mid-range hotels).
- Format all prices clearly with the ₹ symbol and standard Indian numbering conventions.
- Explicitly emphasize that all rates and travel conditions are estimates subject to seasonal changes.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tripTitle: { type: Type.STRING, description: 'Catchy, evocative journey title' },
              destination: { type: Type.STRING, description: 'Destination name in India' },
              state: { type: Type.STRING, description: 'Indian State or Union Territory' },
              startingCity: { type: Type.STRING, description: 'Starting city' },
              summary: { type: Type.STRING, description: '2-3 sentence overview of this Indian journey' },
              duration: { type: Type.INTEGER, description: 'Number of days' },
              travelers: { type: Type.INTEGER, description: 'Number of travelers' },
              travelerType: { type: Type.STRING, description: 'Solo, Couple, Family, or Friends' },
              travelStyle: { type: Type.STRING, description: 'Travel style' },
              estimatedTotalBudget: { type: Type.STRING, description: 'Total estimated budget in INR (e.g. ₹28,500)' },
              budgetBreakdown: {
                type: Type.OBJECT,
                properties: {
                  transport: { type: Type.STRING, description: 'Intercity flights / trains / buses in ₹' },
                  accommodation: { type: Type.STRING, description: 'Hotels / resorts / homestays in ₹' },
                  food: { type: Type.STRING, description: 'Meals & street food in ₹' },
                  localTransport: { type: Type.STRING, description: 'Autos, cabs, scooty in ₹' },
                  activities: { type: Type.STRING, description: 'Monument entry passes & tours in ₹' },
                  miscellaneous: { type: Type.STRING, description: 'Buffer & shopping in ₹' }
                },
                required: ['transport', 'accommodation', 'food', 'localTransport', 'activities', 'miscellaneous']
              },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING, description: 'Day theme' },
                    morning: { type: Type.STRING, description: 'Morning activity and timing' },
                    afternoon: { type: Type.STRING, description: 'Afternoon plan and cultural highlight' },
                    evening: { type: Type.STRING, description: 'Evening sunset or dining experience' },
                    places: { type: Type.ARRAY, items: { type: Type.STRING } },
                    activities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    foodSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    transportGuidance: { type: Type.STRING, description: 'Local autos/cabs guidance' },
                    estimatedDailyCost: { type: Type.STRING, description: 'Daily spend in ₹' },
                    usefulNotes: { type: Type.STRING, description: 'Pro-tips and timing' }
                  },
                  required: ['dayNumber', 'title', 'morning', 'afternoon', 'evening', 'places', 'activities', 'foodSuggestions', 'transportGuidance', 'estimatedDailyCost', 'usefulNotes']
                }
              },
              howToReachRecommendations: { type: Type.STRING, description: 'Best trains, flights, or road routes from origin' },
              localTransportSuggestions: { type: Type.STRING, description: 'How to get around locally (auto rates, scooty, metro)' },
              accommodationAreaGuidance: { type: Type.STRING, description: 'Recommended neighborhoods or sectors to book' },
              localFoodsWorthTrying: { type: Type.ARRAY, items: { type: Type.STRING } },
              packingSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              culturalEtiquette: { type: Type.ARRAY, items: { type: Type.STRING } },
              practicalTravelTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              bestSeasonConsiderations: { type: Type.STRING, description: 'Weather and seasonal guidance' }
            },
            required: [
              'tripTitle',
              'destination',
              'state',
              'startingCity',
              'summary',
              'duration',
              'travelers',
              'travelerType',
              'travelStyle',
              'estimatedTotalBudget',
              'budgetBreakdown',
              'days',
              'howToReachRecommendations',
              'localTransportSuggestions',
              'accommodationAreaGuidance',
              'localFoodsWorthTrying',
              'packingSuggestions',
              'culturalEtiquette',
              'practicalTravelTips',
              'bestSeasonConsiderations'
            ]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response from AI model');
      }

      const parsedData = JSON.parse(responseText.trim());
      return res.json(parsedData);
    } catch (error: unknown) {
      console.error('Gemini itinerary generation error:', error);

      // Intelligent India-specific fallback
      const { 
        destination = 'Selected Indian Destination', 
        startingLocation = 'Delhi', 
        duration = 4, 
        budget = 'Balanced', 
        travelers = 2,
        travelerType = 'Couple',
        travelStyle = 'Balanced'
      } = req.body;
      const numDays = Math.min(Math.max(Number(duration) || 3, 1), 14);
      const numTravelers = Math.max(Number(travelers) || 1, 1);

      const dailyRate = budget === 'Luxury' ? 6500 : budget === 'Budget' ? 1800 : 3500;
      const totalCost = numTravelers * numDays * dailyRate;

      const fallbackDays = Array.from({ length: numDays }, (_, i) => {
        const day = i + 1;
        return {
          dayNumber: day,
          title: day === 1 
            ? `Arrival & Old Heritage Orientation` 
            : day === numDays 
            ? `Farewell Bazaars & Scenic Lookout` 
            : `Immersive Heritage & Regional Sights Day ${day}`,
          morning: `Begin Day ${day} with fresh regional breakfast and hot chai. Embark on a guided morning walk exploring prominent temples, monuments, or scenic valleys around ${destination} before the midday sun.`,
          afternoon: `Savor an authentic thali or regional specialty. Spend the early afternoon touring landmark heritage structures, local artisanal craft centers, or botanical gardens.`,
          evening: `Stroll through the lively local market or riverfront/viewpoint promenade. Enjoy dinner at a celebrated local eatery tasting signature regional gravies and fresh breads.`,
          places: [`${destination} Historic Landmark`, `Central Bazaar`, `Panoramic Sunset Viewpoint`],
          activities: ['Heritage architectural walk', 'Local bazaar foraging', 'Sunset photography'],
          foodSuggestions: ['Signature regional lunch thali', 'Evening street snacks & kulhad chai', 'Traditional dinner specialty'],
          transportGuidance: 'Prepaid auto-rickshaw or app-based cab for intra-city transit; walking within heritage bazaars.',
          estimatedDailyCost: `₹${dailyRate.toLocaleString('en-IN')}`,
          usefulNotes: 'Keep modest clothing handy for temple visits and carry cash in small denominations for street stalls.'
        };
      });

      const fallbackItinerary = {
        tripTitle: `The Essential ${destination} Experience`,
        destination: destination,
        state: 'India',
        startingCity: startingLocation,
        summary: `A culturally rich, carefully paced ${numDays}-day journey across ${destination}, tailored for ${numTravelers} travelers with authentic regional cuisine, historic landmarks, and comfortable transit.`,
        duration: numDays,
        travelers: numTravelers,
        travelerType: travelerType,
        travelStyle: travelStyle,
        estimatedTotalBudget: `₹${totalCost.toLocaleString('en-IN')}`,
        budgetBreakdown: {
          transport: `₹${Math.round(totalCost * 0.25).toLocaleString('en-IN')}`,
          accommodation: `₹${Math.round(totalCost * 0.35).toLocaleString('en-IN')}`,
          food: `₹${Math.round(totalCost * 0.20).toLocaleString('en-IN')}`,
          localTransport: `₹${Math.round(totalCost * 0.10).toLocaleString('en-IN')}`,
          activities: `₹${Math.round(totalCost * 0.05).toLocaleString('en-IN')}`,
          miscellaneous: `₹${Math.round(totalCost * 0.05).toLocaleString('en-IN')}`
        },
        days: fallbackDays,
        howToReachRecommendations: `Check direct Vande Bharat or superfast express trains from ${startingLocation}, or fly to the nearest operational airport followed by verified state road transport or private cab.`,
        localTransportSuggestions: `Auto-rickshaws with meters or fixed prepaid counter rates at transit hubs. Rental scooters/bikes are widely available for independent daily exploration.`,
        accommodationAreaGuidance: `Opt for boutique homestays or heritage hotels near the historic quarter or riverside for walking convenience and character.`,
        localFoodsWorthTrying: [
          'Authentic regional breakfast with freshly brewed chai',
          'Traditional multi-dish local thali',
          'Famous street food snacks from heritage bazaar stalls',
          'Signature regional desserts and milk sweets'
        ],
        packingSuggestions: [
          'Comfortable slip-on walking shoes (easy for temple entry)',
          'Breathable cotton apparel and a light stole/scarf for temple head coverings',
          'Universal power bank and water bottle',
          'Light sweater or shawl for early mornings and air-conditioned transit'
        ],
        culturalEtiquette: [
          'Remove shoes outside temple sanctuaries and sacred shrines.',
          'Dress modestly with shoulders and knees covered in holy sites.',
          'Always seek permission prior to photographing residents, monks, or holy ceremonies.'
        ],
        practicalTravelTips: [
          'UPI digital payments (PhonePe, GPay, Paytm) are accepted almost everywhere, but carry cash for remote tolls and village stalls.',
          'Book train tickets 30–60 days in advance via IRCTC for guaranteed confirmed berths.'
        ],
        bestSeasonConsiderations: `October through March offers pleasant weather across most regions. Check monsoon status (July–August) for mountain landslides or coastal rainfall.`
      };

      return res.json(fallbackItinerary);
    }
  });

  // Vite integration
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Travillo India server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
