import { Destination, IndiaTravelStyle } from '../types';

export const DESTINATIONS: Destination[] = [
  // --- NORTH INDIA ---
  {
    id: 'rishikesh-uttarakhand',
    name: 'Rishikesh Yoga & Rapids',
    state: 'Uttarakhand',
    region: 'North India',
    travelStyles: ['Spiritual', 'Adventure', 'Nature', 'Weekend Getaway', 'Backpacking'],
    bestSeason: 'September – November & March – May',
    budgetLevel: 'Budget',
    estimatedDailyBudget: '₹1,800 – ₹3,500',
    rating: 4.88,
    reviewsCount: 3120,
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588096344356-9b6d92003c2a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'The Yoga Capital of the World along the roaring emerald Ganges, framed by forested Himalayan foothills.',
    description: 'Set where the holy Ganga surges down from the higher Garhwal Himalayas into the plains, Rishikesh is an iconic blend of ancient spirituality and high-octane adventure. Attend the mesmerizing Ganga Aarti at Triveni Ghat, raft through Grade IV rapids at Shivpuri, and retreat into peaceful riverbank yoga ashrams.',
    highlights: [
      'Whitewater river rafting through the thrilling rapids of Shivpuri and Marine Drive',
      'Mesmerizing evening Maha Aarti ceremony at Triveni Ghat and Parmarth Niketan',
      'Exploring the Beatles Ashram (Chaurasi Kutia) with vintage psychedelic graffiti',
      'Cliff jumping, bungee jumping, and giant swing at Mohan Chatti'
    ],
    activities: [
      'River Rafting',
      'Sunrise Yoga & Meditation',
      'Ganga Aarti Attendance',
      'Café Hopping at Tapovan',
      'Bungee Jumping'
    ],
    localFood: [
      'Aloo Puri at Chotiwala',
      'Ayurvedic Herbal Teas & Smoothies',
      'Garhwali Kafuli & Mandua Roti',
      'Piping hot Jalebi with Rabdi'
    ],
    howToReach: 'Dehradun Jolly Grant Airport (21 km) or direct Vande Bharat / Express trains to Rishikesh / Haridwar Railway Station.',
    travelTips: [
      'Rishikesh is an alcohol and strictly vegetarian holy town; respect local traditions.',
      'Book rafting during post-monsoon autumn (Sep–Nov) for clear turquoise waters.',
      'Rent a scooty in Tapovan to easily cross between Ram Jhula and Laxman Jhula banks.'
    ],
    idealDays: 3,
    coordinates: { lat: 30.0869, lng: 78.2676 }
  },
  {
    id: 'auli-uttarakhand',
    name: 'Auli Alpine Meadows & Ski Slopes',
    state: 'Uttarakhand',
    region: 'North India',
    travelStyles: ['Mountains', 'Adventure', 'Nature', 'Honeymoon'],
    bestSeason: 'December – March (Snow/Ski) & April – June (Lush Meadows)',
    budgetLevel: 'Moderate',
    estimatedDailyBudget: '₹3,500 – ₹7,000',
    rating: 4.92,
    reviewsCount: 1650,
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'India’s premier ski destination offering 180-degree unobstructed panoramas of Nanda Devi, Kamet, and Trishul peaks.',
    description: 'Perched at 2,800 to 3,050 meters amidst towering pine and coniferous forests, Auli transforms into a winter fairytale of powdery snow and Europe-grade ski slopes. Ride the 4 km long Joshimath-Auli ropeway—one of the highest cable cars in Asia—and gaze at the majestic 7,816m Nanda Devi sanctuary peak.',
    highlights: [
      'Riding the Joshimath-Auli cable car above dense deodar canopy',
      'Skiing and snowboarding lessons on certified Himalayan powder slopes',
      'Panoramic 360-degree vistas of Nanda Devi, Hathi Parbat, and Trishul',
      'Trek to Gorson Bugyal alpine meadow and Chattrakund lake'
    ],
    activities: [
      'Skiing & Snowboarding',
      'Cable Car Ropeway Ride',
      'Gorson Bugyal Trek',
      'Starry Night Astrophotography'
    ],
    localFood: [
      'Garhwali Chainsoo & Phaanu',
      'Bhang ki Chutney with warm Parathas',
      'Mountain Maggi & Ginger Lemon Honey Tea',
      'Singori sweet wrapped in Malu leaf'
    ],
    howToReach: 'Dehradun Airport (270 km) then scenic drive via Rishikesh, Devprayag, and Joshimath. Cable car operates Joshimath to Auli.',
    travelTips: [
      'Winter drivers must use snow chains when ascending from Joshimath to Auli.',
      'Wear waterproof boots and windproof thermals; temperatures fall below -8°C at night.',
      'Check snow conditions beforehand if visiting specifically for ski championships in Jan–Feb.'
    ],
    idealDays: 4,
    coordinates: { lat: 30.5306, lng: 79.5670 }
  },
  {
    id: 'manali-himachal',
    name: 'Manali & Solang Valley',
    state: 'Himachal Pradesh',
    region: 'North India',
    travelStyles: ['Mountains', 'Adventure', 'Nature', 'Honeymoon', 'Backpacking'],
    bestSeason: 'October – February (Snow) & March – June (Pleasant)',
    budgetLevel: 'Moderate',
    estimatedDailyBudget: '₹2,500 – ₹5,500',
    rating: 4.86,
    reviewsCount: 4200,
    heroImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Crystalline Beas River, towering cedar forests of Old Manali, and snow thrill adventures at Atal Tunnel.',
    description: 'Nestled on the banks of the Beas River, Manali is Himachal’s quintessential mountain hub. From wooden apple orchards and peaceful Bohemian cafés in Old Manali to paragliding at Solang Valley and crossing the engineering marvel of Atal Tunnel into Lahaul, Manali provides unforgettable high-altitude memories.',
    highlights: [
      'Crossing the 9.02 km Atal Tunnel into the pristine snow plains of Sissu in Lahaul',
      'Visiting the 16th-century wooden Pagoda-style Hadimba Devi Temple',
      'Paragliding, zorbing, and quad-biking across Solang Valley',
      'Live acoustic indie music and trout fish in Old Manali cafés'
    ],
    activities: [
      'Atal Tunnel & Sissu Day Trip',
      'Solang Paragliding',
      'Old Manali Heritage Village Walk',
      'Jogini Waterfall Trek'
    ],
    localFood: [
      'Himachali Siddu with Ghee & Dal',
      'Pan-fried Himalayan River Trout',
      'Babru (Himachal stuffed kachori)',
      'Thukpa & Steamed Mutton Momos'
    ],
    howToReach: 'Kullu-Bhuntar Airport (50 km) or overnight luxury Volvo buses from New Delhi (12 hours) and Chandigarh (8 hours).',
    travelTips: [
      'Stay in Old Manali or Naggar for serene pine forests away from Mall Road traffic.',
      'Obtain the Rohtang Pass permit well in advance online if traveling between June and October.',
      'Try fresh apple cider from orchards along the Naggar heritage trail.'
    ],
    idealDays: 4,
    coordinates: { lat: 32.2432, lng: 77.1892 }
  },
  {
    id: 'spiti-valley-himachal',
    name: 'Spiti Middle Land Expedition',
    state: 'Himachal Pradesh',
    region: 'North India',
    travelStyles: ['Mountains', 'Adventure', 'Spiritual', 'Backpacking'],
    bestSeason: 'June – September (Full Circuit via Rohtang & Kunzum Pass)',
    budgetLevel: 'Moderate',
    estimatedDailyBudget: '₹2,800 – ₹5,500',
    rating: 4.96,
    reviewsCount: 1420,
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Cold mountain desert, millennium-old cliffside Key Monastery, and the world’s highest post office at Hikkim.',
    description: 'Spiti, meaning "The Middle Land" between India and Tibet, is a raw, wind-swept moonscape guarded by stark barren mountains and raging glacial torrents. Discover fossil villages at Langza, send postcards from 14,567 ft at Hikkim, and spend nights under billions of glittering stars in remote Buddhist homestays.',
    highlights: [
      'Key Monastery fortress perched atop a conical hill at 13,668 ft',
      'Sending a handwritten postcard from Hikkim (World’s Highest Post Office)',
      'Camping by the crescent-shaped turquoise waters of Chandratal Lake',
      'Finding 100-million-year-old Tethys Sea marine fossils in Langza village'
    ],
    activities: [
      'High-Altitude Himalayan Road Trip',
      'Stargazing & Milky Way Photography',
      'Monastery Morning Chanting',
      'Chandratal Glacial Lake Trek'
    ],
    localFood: [
      'Seabuckthorn Mountain Tea',
      'Spitian Tingmo with spicy vegetable gravy',
      'Spiti Butter Salt Tea (Po Cha)',
      'Fresh Yak Cheese (Chhurpi)'
    ],
    howToReach: 'Shimla via Kinnaur (open year-round) or Manali via Atal Tunnel and Kunzum Pass (June to October). Dedicated 4WD or SUV recommended.',
    travelTips: [
      'Mandatory acclimatization is required; take the Shimla-Kinnaur route for gradual altitude gain.',
      'ATMs and card machines are extremely rare beyond Kaza; carry ample cash.',
      'Only BSNL and Jio postpaid network signals function in select Spiti villages.'
    ],
    idealDays: 7,
    coordinates: { lat: 32.2276, lng: 78.0710 }
  },
  {
    id: 'srinagar-kashmir',
    name: 'Srinagar Paradise & Dal Lake',
    state: 'Jammu & Kashmir',
    region: 'North India',
    travelStyles: ['Nature', 'Honeymoon', 'Food', 'Heritage'],
    bestSeason: 'April – October (Lush & Gardens) & December – February (Snow)',
    budgetLevel: 'Moderate',
    estimatedDailyBudget: '₹3,000 – ₹7,500',
    rating: 4.93,
    reviewsCount: 3890,
    heroImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Carved cedarwood houseboats floating on mirror waters, floating flower markets, and terraced Mughal gardens.',
    description: 'Referred to by Emperor Jahangir as "Paradise on Earth", Srinagar is an enchanting landscape of tranquil lakes, snowy Pir Panjal silhouettes, and centuries-old chinar trees. Glide silently in a vibrant shikara through Dal Lake, wake to the call of floating dawn vegetable markets, and savor authentic multi-course Wazwan cuisine.',
    highlights: [
      'Sleeping in an intricately carved vintage cedarwood houseboat on Nigeen or Dal Lake',
      'Dawn shikara ride through the historic floating vegetable and flower market',
      'Strolling terraced cascade fountains at Shalimar Bagh and Nishat Bagh',
      'Day trip to the snowy alpine meadows of Gulmarg and betaab valley in Pahalgam'
    ],
    activities: [
      'Shikara Lake Ride',
      'Mughal Heritage Garden Walk',
      'Old Srinagar Copper Bazaar Tour',
      'Traditional Wazwan Feast'
    ],
    localFood: [
      'Kashmiri Rogan Josh & Gushtaba',
      'Traditional Kahwa Tea with Saffron & Almonds',
      'Nadru Yakhni (Lotus stem yogurt curry)',
      'Crisp Kashmiri Lavasa & Sheermal Bread'
    ],
    howToReach: 'Direct flights to Srinagar International Airport (SXR) or scenic train/road route from Jammu Tawi railway station.',
    travelTips: [
      'Choose houseboats on quieter Nigeen Lake for deep peaceful rest away from city motorboat buzz.',
      'Saffron and Kashmiri walnuts are best purchased at government-authorized emporiums in Pampore.',
      'Pre-book gondola tickets online for Gulmarg day excursion to skip long counter queues.'
    ],
    idealDays: 4,
    coordinates: { lat: 34.0837, lng: 74.7973 }
  },
  {
    id: 'leh-ladakh',
    name: 'Leh-Ladakh High Passes & Monasteries',
    state: 'Ladakh',
    region: 'North India',
    travelStyles: ['Mountains', 'Adventure', 'Spiritual', 'Backpacking'],
    bestSeason: 'June – September (Open Passes & Clear Skies)',
    budgetLevel: 'Moderate',
    estimatedDailyBudget: '₹3,500 – ₹7,500',
    rating: 4.97,
    reviewsCount: 3950,
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Cobalt reflections on Pangong Tso, white sand dunes of Nubra Valley, and ancient cliff monasteries.',
    description: 'Perched in the high Himalayas, Ladakh is a surreal desert kingdom of painted stupas, prayer wheels, and world-record motorable mountain passes. Ride double-humped Bactrian camels across the cold dunes of Hunder, cross 17,982 ft Khardung La pass, and marvel at the color-shifting waters of Pangong Tso.',
    highlights: [
      'Pangong Tso lake changing shades from turquoise to deep indigo',
      'Hunder white sand dunes and riding Bactrian double-humped camels in Nubra',
      'Thiksey Monastery dawn prayers with long Tibetan horns',
      'Confluence of Zanskar and Indus rivers (Sangam) with river rafting'
    ],
    activities: [
      'High-Pass Motorcycle & SUV Expedition',
      'Monastery Chanting & Meditation',
      'Stargazing at Hanle Dark Sky Reserve',
      'River Rafting at Zanskar Confluence'
    ],
    localFood: [
      'Ladakhi Skyu (hearty pasta vegetable stew)',
      'Steamed Mutton & Veg Tingmo',
      'Apricot Jam and Fresh Apricot Juice',
      'Warm Thukpa with mountain herbs'
    ],
    howToReach: 'Daily flights to Kushok Bakula Rimpochee Airport (IXL) in Leh, or epic road routes from Manali and Srinagar.',
    travelTips: [
      'Mandatory 48-hour complete rest in Leh city before traveling to Nubra or Pangong is vital for AMS prevention.',
      'Obtain Inner Line Permits (ILP) online for Pangong, Nubra, and Tso Moriri.',
      'Carry refillable water bottles and water purification tablets to protect Ladakh’s fragile ecology.'
    ],
    idealDays: 6,
    coordinates: { lat: 34.1526, lng: 77.5771 }
  },
  {
    id: 'varanasi-up',
    name: 'Varanasi Ancient Ghats & Ganga Aarti',
    state: 'Uttar Pradesh',
    region: 'North India',
    travelStyles: ['Spiritual', 'Heritage', 'Food', 'Backpacking'],
    bestSeason: 'October – March',
    budgetLevel: 'Budget',
    estimatedDailyBudget: '₹1,500 – ₹3,500',
    rating: 4.87,
    reviewsCount: 3600,
    heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'The oldest living city in the world, with 88 ghats lining the holy crescent curve of the Ganges.',
    description: 'Varanasi (Kashi) is the timeless spiritual heart of India. From sunrise rowboat journeys witnessing dawn ablutions across centuries-old ghats to the majestic fire ritual of the evening Ganga Aarti at Dashashwamedh, Varanasi is a sensory and philosophical revelation like nowhere else on Earth.',
    highlights: [
      'Sunset Ganga Aarti ceremony with rhythmic conches, bells, and towering brass lamps',
      'Dawn rowboat ride watching morning rituals across ancient riverfront palaces',
      'Visiting Sarnath Deer Park where Lord Buddha delivered his first sermon',
      'Exploring Kashi Vishwanath corridor and ancient silk weaver alleys'
    ],
    activities: [
      'Dawn & Dusk Boat Cruise',
      'Heritage Alleyway Walking Tour',
      'Silk Weaving Workshop Visit',
      'Sarnath Archaeological Exploration'
    ],
    localFood: [
      'Famous Banarasi Paan',
      'Kachori Sabzi & Jalebi at Ram Bhandar',
      'Creamy Malaiyo (winter saffron milk froth)',
      'Thandai & Blue Lassi with fresh pomegranates'
    ],
    howToReach: 'Lal Bahadur Shastri International Airport (VNS) or direct train connectivity to Varanasi Junction (BSB) / Deen Dayal Upadhyaya Junction.',
    travelTips: [
      'Experience the river twice: at dawn (serene contemplation) and sunset (dramatic Aarti energy).',
      'Respect strict photography restrictions at cremation ghats (Manikarnika and Harishchandra).',
      'Wear slip-on footwear as heritage temples require frequent shoe removal.'
    ],
    idealDays: 3,
    coordinates: { lat: 25.3176, lng: 82.9739 }
  },

  // --- WEST INDIA ---
  {
    id: 'jaipur-rajasthan',
    name: 'Jaipur The Royal Pink City',
    state: 'Rajasthan',
    region: 'West India',
    travelStyles: ['Heritage', 'Food', 'Culture', 'Weekend Getaway'],
    bestSeason: 'October – March',
    budgetLevel: 'Moderate',
    estimatedDailyBudget: '₹2,500 – ₹6,500',
    rating: 4.89,
    reviewsCount: 4500,
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Regal hilltop ramparts of Amer Fort, the honeycomb façade of Hawa Mahal, and bustling gem bazaars.',
    description: 'Jaipur, the capital of royal Rajasthan, is a magnificent open-air museum of terracotta-hued walls, grand courtyards, and Rajput chivalry. Ascend the cobbled ramparts of Amer Fort, marvel at the 953 jharokhas of Hawa Mahal, and explore the astronomical wonders of Jantar Mantar.',
    highlights: [
      'Amer Fort mirror palace (Sheesh Mahal) and elephant ramparts path',
      'Sunrise photography at Hawa Mahal and Panna Meena Ka Kund stepwell',
      'Sunset tea atop Nahargarh Fort overlooking the glowing city lights',
      'Hand block printing workshop in Sanganer and textile foraging in Johari Bazaar'
    ],
    activities: [
      'Heritage Palace Tour',
      'Stepwell Exploration',
      'Sunrise Hot Air Ballooning',
      'Artisanal Block Printing Workshop'
    ],
    localFood: [
      'Dal Baati Churma with Pure Ghee',
      'Laxmi Mishthan Bhandar (LMB) Ghewar & Pyaaz Kachori',
      'Laal Maas (traditional royal spicy mutton)',
      'Mawa Kachori and Kulhad Chai'
    ],
    howToReach: 'Jaipur International Airport (JAI) or frequent express trains from Delhi (4 hours), Mumbai, and major Indian cities.',
    travelTips: [
      'Purchase the Composite Monument Ticket at Amer Fort to save entry costs across city sites.',
      'Visit Nahargarh Fort around 5:00 PM for the most dramatic panoramic sunset over Jaipur.',
      'Shop for authentic blue pottery and gemstone jewelry at government-certified craft emporiums.'
    ],
    idealDays: 3,
    coordinates: { lat: 26.9124, lng: 75.7873 }
  },
  {
    id: 'udaipur-rajasthan',
    name: 'Udaipur City of Lakes & Palaces',
    state: 'Rajasthan',
    region: 'West India',
    travelStyles: ['Heritage', 'Honeymoon', 'Food', 'Culture'],
    bestSeason: 'October – March',
    budgetLevel: 'Luxury',
    estimatedDailyBudget: '₹3,500 – ₹9,000',
    rating: 4.94,
    reviewsCount: 3800,
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'White marble palaces floating on serene Lake Pichola against the soft purple backdrop of the Aravalli Hills.',
    description: 'Frequently voted the most romantic city in India, Udaipur is crowned by the sprawling City Palace complex overlooking Lake Pichola. Watch golden sunsets from Ambrai Ghat, cruise past the iconic Lake Palace and Jag Mandir island, and experience royal Mewari hospitality.',
    highlights: [
      'Boat cruise on Lake Pichola passing the illuminated Lake Palace and Jag Mandir',
      'Exploring the colossal City Palace museum and crystal gallery',
      'Evening cultural folk dance performance at Bagore Ki Haveli',
      'Sunset candlelit dinner at Ambrai Ghat directly facing the illuminated palace'
    ],
    activities: [
      'Lake Pichola Boat Cruise',
      'City Palace Heritage Walk',
      'Ropeway to Karni Mata Temple',
      'Vintage Car Collection Visit'
    ],
    localFood: [
      'Traditional Mewari Thali',
      'Kachori with spicy mint chutney at Jagdish Chowk',
      'Gatta Curry and Bajra Roti',
      'Rose Kulfi Falooda'
    ],
    howToReach: 'Maharana Pratap Airport (UDR) or direct trains from Delhi, Mumbai, and Jaipur to Udaipur City station.',
    travelTips: [
      'Reserve lakefront rooftop dinner tables at least 24 hours in advance during peak winter.',
      'Combine your trip with a day trip to the imposing Kumbhalgarh Fort and Ranakpur Jain Temple.',
      'Stay in a heritage haveli near Lal Ghat for walking access to the old city.'
    ],
    idealDays: 3,
    coordinates: { lat: 24.5854, lng: 73.7125 }
  },
  {
    id: 'goa-shores',
    name: 'Goa Coastal Sun & Latin Heritage',
    state: 'Goa',
    region: 'West India',
    travelStyles: ['Beaches', 'Food', 'Relaxation', 'Weekend Getaway', 'Backpacking'],
    bestSeason: 'November – February',
    budgetLevel: 'Moderate',
    estimatedDailyBudget: '₹2,500 – ₹6,000',
    rating: 4.88,
    reviewsCount: 5200,
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Golden sand beaches, swaying coconut palms, Portuguese Latin Quarter villas, and coastal seafood shacks.',
    description: 'Goa is India’s coastal sanctuary where Portuguese heritage meets relaxed tropical beach life. Stroll through the pastel 18th-century mansions of Fontainhas in Panaji, kayak through peaceful mangroves in South Goa, and savor fiery Goan fish curry with local poi bread at beachside shacks.',
    highlights: [
      'Heritage architecture walk through the vibrant Fontainhas Latin Quarter',
      'Sunset beach sessions at secluded Palolem, Agonda, or Ashwem',
      'Exploring UNESCO World Heritage Basilica of Bom Jesus in Old Goa',
      'Spice plantation tour with authentic Goan Saraswat buffet lunch'
    ],
    activities: [
      'Beach Hopping & Water Sports',
      'Fontainhas Walking Tour',
      'Mangrove Sunset Kayaking',
      'Spice Plantation Tour'
    ],
    localFood: [
      'Goan Fish Curry Rice with Kingfish Rava Fry',
      'Pork or Mushroom Vindaloo',
      'Traditional Bebinca Dessert',
      'Fresh Poi bread and Chourico Pao'
    ],
    howToReach: 'Dabolim Airport (GOI) or Manohar International Airport Mopa (GOX), or trains to Madgaon (MAO) / Thivim (THVM).',
    travelTips: [
      'Stay in South Goa (Palolem, Benaulim) for peaceful luxury, or North Goa (Anjuna, Ashwem) for lively beach culture.',
      'Rent a two-wheeler with official yellow commercial plates for flexible coastal exploration.',
      'Visit local family-run beach shacks for authentic, fresh catch-of-the-day preparations.'
    ],
    idealDays: 4,
    coordinates: { lat: 15.2993, lng: 74.1240 }
  },

  // --- SOUTH INDIA ---
  {
    id: 'kerala-backwaters',
    name: 'Alleppey Emerald Backwaters',
    state: 'Kerala',
    region: 'South India',
    travelStyles: ['Nature', 'Relaxation', 'Food', 'Honeymoon'],
    bestSeason: 'October – March',
    budgetLevel: 'Moderate',
    estimatedDailyBudget: '₹3,000 – ₹7,000',
    rating: 4.91,
    reviewsCount: 2900,
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Meander through tranquil emerald canals, serene paddy fields, and sleep aboard a traditional wooden houseboat.',
    description: 'Alleppey (Alappuzha) is the Venice of the East, famed for its labyrinth of palm-fringed canals, backwater lagoons, and rustic village hamlets. Board a traditional handcrafted Kettuvallam houseboat, savor fresh Karimeen fish cooked with grated coconut, and experience restorative Ayurvedic therapies.',
    highlights: [
      'Overnight stay on a traditional wooden houseboat (Kettuvallam) in Punnamada Lake',
      'Sunrise canoeing through narrow village canals in Kuttanad',
      'Traditional Kerala Sadya feast served on fresh banana leaves',
      'Ayurvedic wellness rejuvenation massages under coconut groves'
    ],
    activities: [
      'Houseboat Backwater Cruise',
      'Narrow Canal Canoe Tour',
      'Village Toddy Shop Visit',
      'Ayurvedic Spa Treatment'
    ],
    localFood: [
      'Karimeen Pollichathu (Pearl spot fish baked in banana leaf)',
      'Kerala Sadya on Banana Leaf',
      'Appam with Vegetable or Chicken Stew',
      'Puttu with Kadala Curry'
    ],
    howToReach: 'Cochin International Airport (COK, 82 km) or direct trains to Alappuzha Railway Station (ALLP).',
    travelTips: [
      'Book air-conditioned houseboats with an upper open deck for 360-degree sunset cruising.',
      'Small country canoes can access intimate shallow canals that motor houseboats cannot reach.',
      'Carry natural mosquito repellent and lightweight cotton clothing.'
    ],
    idealDays: 3,
    coordinates: { lat: 9.4981, lng: 76.3388 }
  },
  {
    id: 'munnar-kerala',
    name: 'Munnar Tea Plantations & Misty Hills',
    state: 'Kerala',
    region: 'South India',
    travelStyles: ['Mountains', 'Nature', 'Honeymoon', 'Weekend Getaway'],
    bestSeason: 'September – March',
    budgetLevel: 'Moderate',
    estimatedDailyBudget: '₹2,500 – ₹5,500',
    rating: 4.90,
    reviewsCount: 3100,
    heroImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Rolling emerald carpet of tea gardens, misty Western Ghat peaks, and endangered Nilgiri Tahr wildlife.',
    description: 'Set at the confluence of three mountain streams in the Western Ghats at 1,600m altitude, Munnar is a cool hill station wrapped in manicured emerald tea plantations and silver oak groves. Spot the endangered Nilgiri Tahr at Eravikulam National Park and hike to the highest peak in South India, Anamudi.',
    highlights: [
      'Walking through the misty undulating tea estates of Kolukkumalai (World’s highest tea estate)',
      'Spotting the endangered mountain goat (Nilgiri Tahr) at Eravikulam National Park',
      'Boating in the quiet reflection waters of Mattupetty Dam',
      'Visiting the historic Tata Tea Museum to learn orthodox processing'
    ],
    activities: [
      'Kolukkumalai Sunrise 4x4 Safari',
      'Tea Factory & Tasting Tour',
      'Eravikulam Wildlife Trail',
      'Attukad Waterfall Trek'
    ],
    localFood: [
      'Malabar Parotta with Pepper Chicken',
      'Fresh Garden-picked Cardamom & Ginger Tea',
      'Kerala Puttu with steamed bananas',
      'Handmade dark chocolates from local estate boutiques'
    ],
    howToReach: 'Cochin International Airport (COK, 110 km) followed by a scenic 3.5-hour mountain ghat road drive past Cheeyappara waterfalls.',
    travelTips: [
      'Book the Kolukkumalai sunrise safari early morning for breathtaking cloud inversion views.',
      'Pack light woolens as evenings get crisp and chilly even in summer.',
      'Buy authentic single-origin orthodox black tea and fresh spices directly from plantation outlets.'
    ],
    idealDays: 3,
    coordinates: { lat: 10.0889, lng: 77.0595 }
  },
  {
    id: 'hampi-karnataka',
    name: 'Hampi Vijayanagara Boulder Ruins',
    state: 'Karnataka',
    region: 'South India',
    travelStyles: ['Heritage', 'Backpacking', 'Culture', 'Adventure'],
    bestSeason: 'October – February',
    budgetLevel: 'Budget',
    estimatedDailyBudget: '₹1,500 – ₹3,500',
    rating: 4.95,
    reviewsCount: 3200,
    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'UNESCO World Heritage stone chariot, monolithic boulder landscapes, and 14th-century Vijayanagara empire ruins.',
    description: 'Hampi is an astonishing open-air museum of giant rust-orange granite boulders, monolithic statues, and stone palaces lining the Tungabhadra River. Once the capital of one of the richest empires on earth, Hampi combines sacred living shrines like Virupaksha Temple with Bohemian chill on the Hippie Island side.',
    highlights: [
      'The iconic stone chariot and musical stone pillars at Vijaya Vittala Temple',
      'Sunrise climb to Matanga Hill for 360-degree views across the surreal boulder sea',
      'Crossing the Tungabhadra river on a circular wicker coracle boat',
      'Active worship rituals at the 7th-century Virupaksha Temple'
    ],
    activities: [
      'Bicycle Ruins Exploration',
      'Sunset from Hemakuta Hill',
      'Coracle Boat River Crossing',
      'Boulder Scrambling & Bouldering'
    ],
    localFood: [
      'South Indian Banana Leaf Thali at Mango Tree',
      'Crisp Benne Dosa with coconut chutney',
      'Filter Kaapi (South Indian filter coffee)',
      'Wood-fired thin-crust pizza on Hippie Island'
    ],
    howToReach: 'Hubli Airport (140 km) or overnight trains to Hosapete Junction (HPT, 13 km from Hampi).',
    travelTips: [
      'Rent a bicycle or hire an auto-rickshaw for the entire day to cover distant monument clusters.',
      'Carry sun protection, a hat, and plenty of water as the granite boulders absorb heavy afternoon heat.',
      'Climb Hemakuta Hill for the most tranquil sunset away from big tourist buses.'
    ],
    idealDays: 3,
    coordinates: { lat: 15.3350, lng: 76.4600 }
  },

  // --- NORTHEAST INDIA ---
  {
    id: 'shillong-meghalaya',
    name: 'Shillong & Cherrapunji Living Root Bridges',
    state: 'Meghalaya',
    region: 'Northeast India',
    travelStyles: ['Nature', 'Adventure', 'Mountains', 'Backpacking'],
    bestSeason: 'October – May (Caving/Trekking) & June – September (Raging Waterfalls)',
    budgetLevel: 'Moderate',
    estimatedDailyBudget: '₹2,500 – ₹5,000',
    rating: 4.93,
    reviewsCount: 2200,
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Centuries-old bio-engineered living root bridges, crystalline Umngot river, and roaring plunge waterfalls.',
    description: 'Known as the "Abode of Clouds", Meghalaya is home to the wettest places on earth, towering plunges like Nohkalikai Falls, and living root bridges trained by Khasi tribes across rushing torrents. Boat on the crystal-clear glass waters of Dawki and trek down 3,500 stone steps to the Double Decker Root Bridge in Nongriat.',
    highlights: [
      'Trek through rainforest to the legendary Double Decker Living Root Bridge in Nongriat',
      'Boating on the glass-transparent turquoise waters of Umngot River in Dawki',
      'Witnessing India’s tallest plunge waterfall, Nohkalikai Falls, tumbling 1,115 ft',
      'Spelunking through natural limestone formations in Mawsmai and Arwah caves'
    ],
    activities: [
      'Living Root Bridge Trek',
      'Glass-Water Boating in Dawki',
      'Cave Spelunking & Exploration',
      'Music Café Culture in Shillong'
    ],
    localFood: [
      'Khasi Jadoh (fragrant rice cooked with pork or chicken herbs)',
      'Dohkhlieh (traditional spicy pork salad)',
      'Tungrymbai fermented bean delicacy',
      'Fresh pineapples and wild hill berries'
    ],
    howToReach: 'Guwahati Airport (GAU, 120 km) followed by a scenic 3-hour highway drive past Umiam Lake to Shillong.',
    travelTips: [
      'The Nongriat trek requires climbing 3,500 steep stone steps each way; wear proper grip trekking shoes.',
      'Dawki water is crystal-transparent only between November and April; it turns muddy in monsoon.',
      'Respect sacred Khasi groves where taking even a leaf or twig out of the forest is forbidden by tradition.'
    ],
    idealDays: 5,
    coordinates: { lat: 25.5788, lng: 91.8933 }
  },
  {
    id: 'darjeeling-wb',
    name: 'Darjeeling Queen of the Hills',
    state: 'West Bengal',
    region: 'East India',
    travelStyles: ['Mountains', 'Heritage', 'Nature', 'Food'],
    bestSeason: 'March – May & October – December',
    budgetLevel: 'Moderate',
    estimatedDailyBudget: '₹2,200 – ₹4,800',
    rating: 4.87,
    reviewsCount: 2800,
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'Golden sunrise over Kangchenjunga from Tiger Hill, the UNESCO Toy Train, and fragrant orthodox tea estates.',
    description: 'Set against the colossal snowy wall of Kangchenjunga (world’s third highest peak), Darjeeling is a timeless Victorian hill retreat. Listen to the steam whistle of the historic Darjeeling Himalayan Railway Toy Train, sip Muscatel champagne-grade tea at Glenary’s, and gaze at red pandas in Padmaja Naidu Himalayan Zoo.',
    highlights: [
      'Witnessing the first rays of dawn turn Mt. Kangchenjunga gold from Tiger Hill (2,590m)',
      'Joy ride on the UNESCO World Heritage Toy Train steam locomotive through Batasia Loop',
      'English breakfast and fresh bakery pastries at the iconic century-old Glenary’s',
      'Tea estate tour and tea tasting session at Happy Valley Tea Estate'
    ],
    activities: [
      'Tiger Hill Sunrise Watch',
      'UNESCO Toy Train Joyride',
      'Himalayan Mountaineering Institute Visit',
      'Tea Tasting & Heritage Walk'
    ],
    localFood: [
      'Steamed Darjeeling Pork/Chicken Momos with spicy Dalle chili paste',
      'Traditional Tibetan Thukpa & Shaphalay',
      'First Flush Darjeeling Orthodox Tea',
      'Glenary’s Apple Pie & Rum Balls'
    ],
    howToReach: 'Bagdogra Airport (IXB, 68 km) or New Jalpaiguri Railway Station (NJP, 70 km), followed by a scenic 3-hour hill drive.',
    travelTips: [
      'Depart hotel by 4:00 AM for Tiger Hill to beat traffic jams and secure prime sunrise viewing.',
      'Book the Toy Train Joyride (Darjeeling–Ghum–Darjeeling) online via IRCTC well in advance.',
      'Pick up authentic certified Darjeeling Tea with the official board logo from Nathmulls on Mall Road.'
    ],
    idealDays: 3,
    coordinates: { lat: 27.0410, lng: 88.2663 }
  },

  // --- CENTRAL INDIA ---
  {
    id: 'khajuraho-mp',
    name: 'Khajuraho Chandela Sculptural Temples',
    state: 'Madhya Pradesh',
    region: 'Central India',
    travelStyles: ['Heritage', 'Culture', 'Spiritual'],
    bestSeason: 'October – March',
    budgetLevel: 'Budget',
    estimatedDailyBudget: '₹1,800 – ₹3,800',
    rating: 4.85,
    reviewsCount: 1850,
    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80'
    ],
    shortDescription: 'UNESCO-listed sandstone temples celebrating life, spirituality, and supreme medieval stone craftsmanship.',
    description: 'Built between 950 and 1050 AD by the Chandela dynasty, the temples of Khajuraho represent the zenith of Indian temple architecture. Carved from golden sandstone, the intricately detailed friezes celebrate the full spectrum of human existence—from spiritual devotion to celestial dancers and passionate intimacy.',
    highlights: [
      'Kandariya Mahadeva Temple with over 800 intricately carved sandstone sculptures',
      'Evening sound and light show narrated by Amitabh Bachchan in temple gardens',
      'Eastern group Jain temples with exquisite detailing at Parshvanatha Temple',
      'Day trip to Panna National Park for tiger safaris and Ken River gorge'
    ],
    activities: [
      'Temple Architectural Guided Walk',
      'Panna Tiger Safari Day Trip',
      'Raneh Falls Canyon Tour',
      'Evening Sound & Light Show'
    ],
    localFood: [
      'Bundelkhandi Thali with Kadhi & Kodo millet',
      'Crispy Jalebis with hot Rabdi at Raja Café',
      'Bhutte ka Kees (spiced grated corn)',
      'Traditional Dal Bafla'
    ],
    howToReach: 'Khajuraho Airport (HJR) or direct trains to Khajuraho Railway Station (KURJ) connected to Delhi and Varanasi.',
    travelTips: [
      'Hire an ASI-certified official guide at the Western Group ticket counter for profound architectural insights.',
      'Visit Raneh Falls (20 km away) to see the dramatic multi-colored crystalline granite canyon.',
      'Explore in the early morning when the golden sandstone radiates warmly under morning sunlight.'
    ],
    idealDays: 2,
    coordinates: { lat: 24.8318, lng: 79.9199 }
  }
];

export const TRAVEL_STYLES_INFO = [
  {
    name: 'Mountains',
    description: 'Snow peaks of Ladakh & Himachal, pine meadows, and mist-clad Western Ghats.',
    icon: 'Mountain',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Beaches',
    description: 'Golden Goa coasts, cliff shores of Varkala, and pristine waters of the Konkan & Islands.',
    icon: 'Waves',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Heritage',
    description: 'Centuries-old Rajput palaces, Vijayanagara ruins in Hampi, and Chandela stone temples.',
    icon: 'Landmark',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Adventure',
    description: 'Whitewater Ganga rafting, Auli ski slopes, and high-altitude Spiti expeditions.',
    icon: 'Compass',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Spiritual',
    description: 'Varanasi dawn Ganga aartis, Himalayan monasteries, and sacred yoga sanctuaries.',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Wildlife',
    description: 'Kaziranga one-horned rhinos, Bengal tiger reserves, and Nilgiri Tahr mountain sanctuaries.',
    icon: 'Binoculars',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Nature',
    description: 'Alleppey emerald canals, Meghalaya living root bridges, and rolling Munnar tea valleys.',
    icon: 'Trees',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Food',
    description: 'Authentic royal Rajasthani feasts, fiery coastal curries, and aromatic street delicacies.',
    icon: 'UtensilsCrossed',
    image: 'https://images.unsplash.com/photo-1588096344356-9b6d92003c2a?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Honeymoon',
    description: 'Cedarwood houseboats in Dal Lake, romantic Udaipur lake palaces, and private hill chalets.',
    icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Weekend Getaway',
    description: 'Quick rejuvenating escapes from Delhi, Mumbai, Bengaluru, and major metro hubs.',
    icon: 'Calendar',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Backpacking',
    description: 'Budget-friendly hostels, Himalayan trails, riverside community cafés, and ancient towns.',
    icon: 'Backpack',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80'
  }
];
