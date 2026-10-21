export interface GlobeCity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  description: string;
  image: string;
  topSights: string[];
  averageCostPerDayINR: number;
  bestSeason: string;
  color: string;
}

export const GLOBE_CITIES: GlobeCity[] = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    lat: 48.8566,
    lng: 2.3522,
    description: 'City of Light renowned for the Eiffel Tower, Louvre masterpieces, and world-class culinary artistry.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    topSights: ['Eiffel Tower Summit', 'Louvre Museum Guided Tour', 'Seine Sunset River Cruise', 'Montmartre Sacré-Cœur'],
    averageCostPerDayINR: 12500,
    bestSeason: 'Apr - Oct',
    color: '#38bdf8', // sky
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    lat: 41.3879,
    lng: 2.1699,
    description: 'Catalan jewel celebrated for Gaudí architecture, Mediterranean beaches, and lively tapas culture.',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=80',
    topSights: ['Sagrada Familia Tower Climb', 'Park Güell Panoramas', 'Gothic Quarter Tapas Crawl', 'Barceloneta Beach'],
    averageCostPerDayINR: 9500,
    bestSeason: 'May - Oct',
    color: '#f59e0b', // amber
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    description: 'Historic metropolis blending royal landmarks, iconic red buses, West End theater, and premier museums.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
    topSights: ['Tower of London & Crown Jewels', 'West End Musical Theatre', 'Sky Garden City Lookout', 'Borough Market Street Food'],
    averageCostPerDayINR: 13500,
    bestSeason: 'May - Sep',
    color: '#818cf8', // indigo
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    lat: 41.9028,
    lng: 12.4964,
    description: 'The Eternal City with thousands of years of empire ruins, Vatican treasures, and handcrafted pastas.',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    topSights: ['Colosseum Underground Access', 'Vatican Museums & Sistine Chapel', 'Trevi Fountain & Spanish Steps', 'Trastevere Pasta Lab'],
    averageCostPerDayINR: 10500,
    bestSeason: 'Apr - Jun, Sep - Nov',
    color: '#ec4899', // pink
  },
  {
    id: 'zurich',
    name: 'Zurich',
    country: 'Switzerland',
    lat: 47.3769,
    lng: 8.5417,
    description: 'Alpine lakeside financial hub with crystal-clear waters, snow-capped mountain views, and luxury wellness.',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80',
    topSights: ['Thermal Baths & Spa Above City', 'Uetliberg Mountain Summit', 'Lake Zurich Sunset Boat Cruise', 'Old Town Fondue'],
    averageCostPerDayINR: 16000,
    bestSeason: 'Jun - Sep, Dec - Mar',
    color: '#2dd4bf', // teal
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    description: 'Futuristic megacity merging neon skyscrapers, Michelin gastronomy, vintage arcades, and tranquil Shinto shrines.',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    topSights: ['teamLab Borderless Digital Art', 'Shibuya Sky 360 Lookout', 'Tsukiji Outer Market Food Crawl', 'Akihabara Otaku Culture'],
    averageCostPerDayINR: 11000,
    bestSeason: 'Mar - May, Oct - Dec',
    color: '#a855f7', // purple
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    lat: 35.0116,
    lng: 135.7681,
    description: 'Ancient imperial capital of wooden teahouses, vermilion shrine gates, Zen rock gardens, and geisha districts.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    topSights: ['Fushimi Inari Torii Gate Hike', 'Arashiyama Bamboo Grove', 'Kennin-ji Zen Meditation', 'Gion Historic Teahouse Tour'],
    averageCostPerDayINR: 9800,
    bestSeason: 'Mar - May, Oct - Nov',
    color: '#f43f5e', // rose
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    lat: 13.7563,
    lng: 100.5018,
    description: 'Vibrant sensory capital of gilded royal temples, neon tuk-tuks, floating river markets, and street food feasts.',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80',
    topSights: ['Grand Palace & Emerald Buddha', 'Chinatown Midnight Food Tuk-Tuk', 'Wat Arun Temple of Dawn', 'Chao Phraya Longtail Boat'],
    averageCostPerDayINR: 5500,
    bestSeason: 'Nov - Feb',
    color: '#eab308', // yellow
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    lat: 40.7128,
    lng: -74.0060,
    description: 'Electrifying skyline capital with Broadway entertainment, Central Park vistas, Michelin dining, and highline art.',
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=600&q=80',
    topSights: ['Broadway VIP Orchestra Seating', 'High Line & Chelsea Market', 'Empire State Observation Deck', 'Central Park Bicycle Loop'],
    averageCostPerDayINR: 17500,
    bestSeason: 'Apr - Jun, Sep - Dec',
    color: '#06b6d4', // cyan
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    description: 'Harbor paradise featuring the iconic Opera House sails, coastal cliff walks, turquoise ocean baths, and surf breaks.',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
    topSights: ['Sydney Opera House Architectural Tour', 'Bondi to Coogee Coastal Walk', 'Harbour Bridge Pylon Climb', 'Manly Ferry Ride'],
    averageCostPerDayINR: 11500,
    bestSeason: 'Sep - Nov, Feb - Apr',
    color: '#10b981', // emerald
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    lat: 25.2048,
    lng: 55.2708,
    description: 'Futuristic desert oasis boasting the world tallest skyscrapers, luxury desert safaris, and man-made island wonders.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    topSights: ['Burj Khalifa At The Top Lounge', 'Desert Dunes Safari & Sunset BBQ', 'Palm Jumeirah Boardwalk', 'Dubai Mall Fountain Show'],
    averageCostPerDayINR: 14000,
    bestSeason: 'Nov - Mar',
    color: '#fbbf24', // amber gold
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    description: 'Garden city-state renowned for solar-powered Supertree Grove, rooftop infinity pools, and hawker culinary culture.',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80',
    topSights: ['Gardens by the Bay Supertrees', 'Marina Bay Sands SkyPark', 'Chinatown Hawker Center Crawl', 'Sentosa Island Cable Car'],
    averageCostPerDayINR: 12000,
    bestSeason: 'Year-round',
    color: '#14b8a6', // teal
  },
  {
    id: 'cairo',
    name: 'Cairo',
    country: 'Egypt',
    lat: 30.0444,
    lng: 31.2357,
    description: 'Cradle of ancient civilization with Great Pyramids of Giza, Sphinx mysteries, and storied Nile river feluccas.',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80',
    topSights: ['Great Pyramids of Giza & Sphinx', 'Grand Egyptian Museum Antiquities', 'Nile Sunset Felucca Sail', 'Khan el-Khalili Bazaar'],
    averageCostPerDayINR: 6500,
    bestSeason: 'Oct - Apr',
    color: '#f97316', // orange
  },
  {
    id: 'rio',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    lat: -22.9068,
    lng: -43.1729,
    description: 'Marvelous coastal metropolis cradled between dramatic granite peaks, Christ the Redeemer, and Copacabana sands.',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80',
    topSights: ['Christ the Redeemer Corcovado', 'Sugarloaf Mountain Cableway', 'Copacabana & Ipanema Stroll', 'Santa Teresa Bohemian Cafes'],
    averageCostPerDayINR: 8200,
    bestSeason: 'May - Oct',
    color: '#84cc16', // lime
  },
  {
    id: 'cape-town',
    name: 'Cape Town',
    country: 'South Africa',
    lat: -33.9249,
    lng: 18.4241,
    description: 'Spectacular coastal promontory flanked by flat-topped Table Mountain, penguin colonies, and rolling Cape Winelands.',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80',
    topSights: ['Table Mountain Aerial Cableway', 'Boulders Beach African Penguins', 'Cape Point Scenic Coastal Drive', 'V&A Waterfront Catamaran'],
    averageCostPerDayINR: 8800,
    bestSeason: 'Nov - Apr',
    color: '#0284c7', // light blue
  },
];
