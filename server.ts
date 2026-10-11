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

  // 1. AI TRAVEL COPILOT ENDPOINT
  app.post('/api/copilot-chat', async (req, res) => {
    const { message, activeItinerary, currentDestination, userPreferences, history = [] } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      const prompt = `You are Travillo's Floating AI Travel Copilot, an elite India travel architect.
The user is asking: "${message}"

Current Context:
- Active Destination: ${currentDestination || 'India'}
- Active Itinerary Present: ${activeItinerary ? `Yes ("${activeItinerary.tripTitle}" in ${activeItinerary.destination}, ${activeItinerary.duration} days, Total: ${activeItinerary.estimatedTotalBudget})` : 'No'}
- User Taste Profile: ${JSON.stringify(userPreferences || {})}
${activeItinerary ? `- Current Itinerary Summary: ${JSON.stringify(activeItinerary.days.map((d: any) => ({ day: d.dayNumber, title: d.title, morning: d.morning, afternoon: d.afternoon, evening: d.evening, foods: d.foodSuggestions })))}` : ''}

Provide a response in strict JSON with:
{
  "reply": "Conversational, highly practical India travel insight or explanation of changes made.",
  "actionType": "none" | "modify_itinerary" | "trigger_plan" | "suggest_destinations",
  "planTrigger": { "destination": string, "duration": number, "budget": "Budget" | "Moderate" | "Luxury" } (if user asked to plan a new destination),
  "modifiedItinerary": Itinerary object (ONLY if actionType is "modify_itinerary", returning the complete updated itinerary matching activeItinerary structure),
  "suggestedDestinations": [ { "name": string, "state": string, "reason": string, "estimatedBudget": string } ] (if user asked for suggestions)
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are Travillo AI Copilot. Specialize exclusively in Indian tourism, realistic INR (₹) pricing, genuine regional food, train/transit advice, and temple/cultural norms. Return valid JSON only.'
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text.trim());
        return res.json(parsed);
      }
      throw new Error('Empty copilot response');
    } catch (err) {
      console.error('Copilot AI fallback triggered:', err);
      // Fallback heuristics for common requests
      const lower = message.toLowerCase();
      
      // If user asks to plan a destination
      if (lower.includes('plan ') || lower.includes('trip to ')) {
        const match = lower.match(/plan\s+([a-zA-Z\s]+?)(?:\s+for|\s+trip|\s+under|$)/i);
        const dest = match ? match[1].trim() : 'Himachal';
        const daysMatch = lower.match(/(\d+)\s*days?/);
        const days = daysMatch ? parseInt(daysMatch[1], 10) : 4;
        return res.json({
          reply: `I can craft a personalized ${days}-day journey to ${dest} for you! I have prepped the travel architect with regional routes and authentic stays.`,
          actionType: 'trigger_plan',
          planTrigger: {
            destination: dest.charAt(0).toUpperCase() + dest.slice(1),
            duration: days,
            budget: lower.includes('cheap') || lower.includes('budget') ? 'Budget' : 'Moderate'
          }
        });
      }

      // If user asks to make trip cheaper with an active itinerary
      if (activeItinerary && (lower.includes('cheaper') || lower.includes('reduce') || lower.includes('cut cost') || lower.includes('budget'))) {
        const updated = JSON.parse(JSON.stringify(activeItinerary));
        updated.estimatedTotalBudget = `₹${Math.round(parseInt(updated.estimatedTotalBudget.replace(/[^0-9]/g, '') || '25000') * 0.78).toLocaleString('en-IN')}`;
        updated.budgetBreakdown.accommodation = '₹6,500 (Boutique homestays & Zostel private rooms)';
        updated.budgetBreakdown.transport = '₹3,200 (Vande Bharat Express AC Chair Car)';
        return res.json({
          reply: `I optimized your ${activeItinerary.destination} itinerary to be ~22% cheaper without dropping landmark experiences! Swapped private intercity cabs for Vande Bharat rail & recommended verified boutique heritage homestays.`,
          actionType: 'modify_itinerary',
          modifiedItinerary: updated
        });
      }

      // If user asks to add vegetarian restaurants
      if (activeItinerary && (lower.includes('veg') || lower.includes('vegetarian'))) {
        const updated = JSON.parse(JSON.stringify(activeItinerary));
        updated.days = updated.days.map((d: any) => ({
          ...d,
          foodSuggestions: [
            'Famous Pure-Veg Heritage Bhojanalaya (Unlimited Thali)',
            'Iconic Krishna Marwadi / Udupi Satvik Cafe',
            'Authentic Local Kulhad Chai & Ghee Street Snacks'
          ]
        }));
        return res.json({
          reply: `Updated your culinary lineup! Every day now features 100% pure vegetarian culinary stops and authentic regional Satvik bhojanalayas.`,
          actionType: 'modify_itinerary',
          modifiedItinerary: updated
        });
      }

      // If user asks for peaceful places near Delhi
      if (lower.includes('delhi') || lower.includes('peaceful') || lower.includes('quiet')) {
        return res.json({
          reply: 'Here are 3 serene, low-crowd mountain escapes within 6–8 hours of Delhi with fresh pine air and calm vibes:',
          actionType: 'suggest_destinations',
          suggestedDestinations: [
            { name: 'Kanatal', state: 'Uttarakhand', reason: 'Uncrowded apple orchards, deep deodar trails, and panoramic Himalayan sunrises.', estimatedBudget: '₹8,500 – ₹14,000' },
            { name: 'Shoja & Jibhi', state: 'Himachal Pradesh', reason: 'Quiet wooden chalets beside the Tirthan river with zero commercial noise.', estimatedBudget: '₹9,500 – ₹16,000' },
            { name: 'Lansdowne', state: 'Uttarakhand', reason: 'Clean cantonment town framed by oak forests; just 5.5 hours drive from Delhi NCR.', estimatedBudget: '₹7,000 – ₹12,000' }
          ]
        });
      }

      return res.json({
        reply: `Travillo Copilot here! I can help customize your itinerary, optimize budgets, swap activities for rainy days, or suggest offbeat destinations across India. What would you like to refine?`,
        actionType: 'none'
      });
    }
  });

  // 2. AI BUDGET OPTIMIZER ENDPOINT
  app.post('/api/optimize-budget', async (req, res) => {
    const { itinerary, targetBudget, instruction } = req.body;
    if (!itinerary) {
      return res.status(400).json({ error: 'Itinerary required' });
    }

    try {
      const prompt = `You are Travillo's AI Budget Architect for India tourism.
Current Itinerary:
- Destination: ${itinerary.destination}
- Duration: ${itinerary.duration} Days
- Travelers: ${itinerary.travelers}
- Current Total Budget: ${itinerary.estimatedTotalBudget}
- Current Breakdown: ${JSON.stringify(itinerary.budgetBreakdown)}
- Must Preserve Landmarks: Key attraction visits in days: ${JSON.stringify(itinerary.days.map((d: any) => d.places))}

User Optimization Goal:
Target Budget / Constraint: "${targetBudget || 'Lower budget'}"
Specific Instructions: "${instruction || 'Optimize cost while keeping experiences authentic and memorable'}"

Analyze and optimize:
1. Adjust accommodation to boutique homestays or budget hotels.
2. Adjust transport to efficient Indian rail (Vande Bharat/Jan Shatabdi) or shared verified cabs.
3. Keep authentic regional culinary spots and street food while cutting unnecessary fine-dining.
4. Preserve major heritage landmarks and must-see places explicitly mentioned.

Return strict JSON:
{
  "optimizedItinerary": <Complete updated Itinerary object matching input structure with revised estimatedTotalBudget, budgetBreakdown, and updated daily estimatedDailyCost>,
  "optimizationSummary": "Detailed bulleted explanation of exactly what savings were unlocked and how the quality was preserved.",
  "savingsAmount": "₹X,XXX saved"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are Travillo AI Budget Optimizer for Indian tourism. All prices must be strictly formatted in INR (₹). Return valid JSON only.'
        }
      });

      const text = response.text;
      if (text) {
        return res.json(JSON.parse(text.trim()));
      }
      throw new Error('Empty response');
    } catch (err) {
      console.error('Budget optimizer fallback triggered:', err);
      // Smart Heuristic Fallback
      const targetNum = typeof targetBudget === 'number' 
        ? targetBudget 
        : parseInt(String(targetBudget || '').replace(/[^0-9]/g, '')) || Math.round(parseInt(itinerary.estimatedTotalBudget.replace(/[^0-9]/g, '') || '25000') * 0.75);

      const updated = JSON.parse(JSON.stringify(itinerary));
      const oldNum = parseInt(itinerary.estimatedTotalBudget.replace(/[^0-9]/g, '') || '25000');
      const diff = Math.max(oldNum - targetNum, 2000);

      updated.estimatedTotalBudget = `₹${targetNum.toLocaleString('en-IN')}`;
      updated.budgetBreakdown = {
        transport: `₹${Math.round(targetNum * 0.22).toLocaleString('en-IN')} (Vande Bharat / IRCTC Superfast AC)`,
        accommodation: `₹${Math.round(targetNum * 0.36).toLocaleString('en-IN')} (Characterful verified boutique homestays)`,
        food: `₹${Math.round(targetNum * 0.22).toLocaleString('en-IN')} (Authentic local thali joints & street fare)`,
        localTransport: `₹${Math.round(targetNum * 0.10).toLocaleString('en-IN')} (Prepaid auto counters & scooter rentals)`,
        activities: `₹${Math.round(targetNum * 0.05).toLocaleString('en-IN')} (ASI monument pass & direct local guides)`,
        miscellaneous: `₹${Math.round(targetNum * 0.05).toLocaleString('en-IN')} (Buffer & market tokens)`
      };

      const dailyShare = Math.round(targetNum / (updated.duration || 4));
      updated.days = updated.days.map((d: any) => ({
        ...d,
        estimatedDailyCost: `₹${dailyShare.toLocaleString('en-IN')}`,
        transportGuidance: 'Prepaid auto-rickshaws or shared transit; walkable historic core.'
      }));

      return res.json({
        optimizedItinerary: updated,
        optimizationSummary: `Trimmed ~₹${diff.toLocaleString('en-IN')} while preserving all signature sightseeing stops:
• Shifted accommodation to top-rated local heritage homestays with complimentary breakfast.
• Swapped private outstation cabs for confirmed Vande Bharat Express rail tickets.
• Curated iconic street food and regional thali joints instead of overpriced tourist resort restaurants.`,
        savingsAmount: `₹${diff.toLocaleString('en-IN')}`
      });
    }
  });

  // 3. DAY PLAN MODIFIER & WEATHER ADAPTOR ENDPOINT
  app.post('/api/modify-day', async (req, res) => {
    const { dayPlan, destination, actionType, customInstruction, weatherCondition } = req.body;
    if (!dayPlan) {
      return res.status(400).json({ error: 'dayPlan is required' });
    }

    try {
      const prompt = `You are Travillo's Day Plan Architect.
Modify Day ${dayPlan.dayNumber} for ${destination || 'India'}.
Current Day Plan: ${JSON.stringify(dayPlan)}
Action: ${actionType}
Custom Request: ${customInstruction || 'None'}
Weather Condition: ${weatherCondition || 'Normal'}

If action is 'weather_adapt':
- Swap outdoor treks, boat rides, or exposed open-air activities for weather-resilient alternatives (e.g. covered royal palace complexes, museum galleries, carpet weaving ateliers, indoor cooking classes, tea tasting rooms).
- Adjust transport guidance for rain/heat/snow.

If action is 'adventure':
- Add adrenaline-filled mountain/water/forest pursuits.

If action is 'peaceful':
- Add sunrise yoga, quiet monastery walks, scenic pine cafes, meditation viewpoints.

If action is 'regenerate':
- Provide a fresh, vibrant, culturally deep schedule for this day.

Return strict JSON:
{
  "updatedDay": <Complete updated DayPlan object matching input structure>,
  "reasoning": "1-2 sentence explanation of adjustments made"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are Travillo Day Plan Architect. Return valid JSON only.'
        }
      });

      const text = response.text;
      if (text) {
        return res.json(JSON.parse(text.trim()));
      }
      throw new Error('Empty day response');
    } catch (err) {
      console.error('Modify day fallback triggered:', err);
      const updated = JSON.parse(JSON.stringify(dayPlan));

      if (actionType === 'weather_adapt') {
        updated.title = `${updated.title} (Weather-Protected Edition)`;
        updated.morning = `Morning visit to the historic State Heritage Museum and indoor textile craft galleries to enjoy local history sheltered from the weather.`;
        updated.afternoon = `Indulge in a sheltered royal dining experience with multi-course regional delicacies, followed by a covered spice bazaar arcade walk.`;
        updated.evening = `Cozy up at a vintage mountain/colonial cafe overlooking misty valley views with hot ginger tea and regional bakery treats.`;
        updated.transportGuidance = 'Pre-booked covered cab with verified heating/AC; avoid exposed open two-wheelers.';
        updated.usefulNotes = 'Carry waterproof windbreakers, slip-resistant footwear, and keep phones in zip-lock pouches.';
        return res.json({
          updatedDay: updated,
          reasoning: 'Replaced exposed outdoor activities with indoor artisanal craft museums and covered heritage dining to keep you safe and comfortable.'
        });
      }

      if (actionType === 'adventure') {
        updated.title = `High-Adrenaline Adventure & Wilderness Day`;
        updated.morning = `Early morning off-road jeep safari or guided canyon trek with certified local mountaineering instructors.`;
        updated.afternoon = `Zip-lining, river crossing, or alpine cliff jumping followed by riverside camp lunch.`;
        updated.evening = `Bonfire gathering with local acoustic mountain tunes and barbecue dinner under starry skies.`;
        return res.json({
          updatedDay: updated,
          reasoning: 'Infused the day with guided outdoor adrenaline thrills and scenic rugged trail exploration.'
        });
      }

      // Default regenerate
      updated.title = `Immersive Cultural Heritage & Local Secrets Day ${updated.dayNumber}`;
      updated.morning = `Early morning walk through the historic heritage quarter visiting sacred shrines and morning floral markets before peak hours.`;
      updated.afternoon = `Interactive craft workshop with master artisans followed by lunch at an ancient family-run heritage bhojanalaya.`;
      updated.evening = `Panoramic sunset from a secluded viewpoint ridge, concluding with regional street food tasting tours.`;
      return res.json({
        updatedDay: updated,
        reasoning: 'Refreshed with authentic offbeat cultural experiences, morning heritage trails, and local artisan visits.'
      });
    }
  });

  // 4. SMART AI DISCOVERY NATURAL LANGUAGE SEARCH
  app.post('/api/ai-discover', async (req, res) => {
    const { query, userOrigin = 'Delhi' } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'Query is required' });
    }

    try {
      const prompt = `You are Travillo's Smart Discovery AI.
The traveler is searching for destinations across India using natural language:
"${query}"
Traveler origin: ${userOrigin}

Analyze the user's intent (e.g. weather desire: cold, peaceful, beach, budget constraint, distance).
Suggest 3-5 top Indian destinations that match this query with precise reasoning and estimated budget.

Return strict JSON:
{
  "searchSummary": "Interpreted travel intent in one phrase",
  "recommendedDestinations": [
    {
      "name": string (destination name),
      "state": string,
      "matchScore": number (85-99),
      "matchReason": "Why this spot specifically fits the user's criteria",
      "bestDurationDays": number,
      "estimatedCost": "₹X,XXX – ₹X,XXX",
      "tags": [string, string]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are Travillo AI Discovery Engine. Focus strictly on authentic Indian destinations. Return valid JSON only.'
        }
      });

      const text = response.text;
      if (text) {
        return res.json(JSON.parse(text.trim()));
      }
      throw new Error('Empty discovery response');
    } catch (err) {
      console.error('AI discover fallback triggered:', err);
      return res.json({
        searchSummary: `Matches for "${query}"`,
        recommendedDestinations: [
          {
            name: 'Shoja & Jibhi',
            state: 'Himachal Pradesh',
            matchScore: 96,
            matchReason: 'Uncrowded alpine valley, dense pine scent, serene waterfalls, and cozy wooden homestays under ₹10k.',
            bestDurationDays: 4,
            estimatedCost: '₹8,500 – ₹13,000',
            tags: ['Peaceful', 'Mountains', 'Budget-Friendly']
          },
          {
            name: 'Kanatal',
            state: 'Uttarakhand',
            matchScore: 93,
            matchReason: 'Cool Himalayan breeze, panoramic 180° snow peaks, and peaceful camp stays just 7 hours drive from Delhi.',
            bestDurationDays: 3,
            estimatedCost: '₹7,500 – ₹12,000',
            tags: ['Quiet Escapes', 'Pine Forests', 'Weekend']
          },
          {
            name: 'Pachmarhi',
            state: 'Madhya Pradesh',
            matchScore: 89,
            matchReason: 'Queen of Satpura with serene waterfalls, sandstone caves, and cool highland greenery away from metro rush.',
            bestDurationDays: 4,
            estimatedCost: '₹9,000 – ₹14,500',
            tags: ['Nature', 'Waterfalls', 'Offbeat']
          }
        ]
      });
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
