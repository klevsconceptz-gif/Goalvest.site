/**
 * GoalVest Data Store & Pricing Engine
 * Provides deterministic dynamic pricing and realistic datasets.
 */

// Deterministic Pseudo-Random Generator (LCG)
class PRNG {
  constructor(seed = 133742) {
    this.seed = seed;
  }
  next() {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
}

const prng = new PRNG(Date.now() % 100000);

// Default User Storage
const DEFAULT_USERS = [];

// Stocks Database (Major tech & Elon-related)
const STOCKS_DB = [
  { symbol: "TSLA", name: "Tesla, Inc.", basePrice: 248.50, sector: "Automotive & Autonomy", pe: 64.2, divYield: "0.00%", beta: 2.12, volume: "98.4M", marketCap: "$788.5B", focus: "Elon / Tech", exchange: "NASDAQ" },
  { symbol: "NVDA", name: "NVIDIA Corporation", basePrice: 142.30, sector: "Semiconductors / AI", pe: 54.8, divYield: "0.03%", beta: 1.68, volume: "56.2M", marketCap: "$3.49T", focus: "Tech", exchange: "NASDAQ" },
  { symbol: "AMD", name: "Advanced Micro Devices", basePrice: 156.40, sector: "Semiconductors", pe: 46.1, divYield: "0.00%", beta: 1.74, volume: "42.1M", marketCap: "$252.8B", focus: "Tech", exchange: "NASDAQ" },
  { symbol: "AAPL", name: "Apple Inc.", basePrice: 231.80, sector: "Consumer Tech", pe: 33.4, divYield: "0.45%", beta: 1.04, volume: "48.9M", marketCap: "$3.52T", focus: "Tech", exchange: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft Corporation", basePrice: 428.10, sector: "Cloud & Software", pe: 35.8, divYield: "0.72%", beta: 1.18, volume: "22.4M", marketCap: "$3.18T", focus: "Tech", exchange: "NASDAQ" },
  { symbol: "GOOGL", name: "Alphabet Inc.", basePrice: 168.20, sector: "Internet & AI", pe: 23.5, divYield: "0.48%", beta: 1.08, volume: "28.5M", marketCap: "$2.08T", focus: "Tech", exchange: "NASDAQ" },
  { symbol: "META", name: "Meta Platforms", basePrice: 585.90, sector: "Social & AI Hardware", pe: 28.2, divYield: "0.34%", beta: 1.25, volume: "14.6M", marketCap: "$1.48T", focus: "Tech", exchange: "NASDAQ" },
  { symbol: "PLTR", name: "Palantir Technologies", basePrice: 44.80, sector: "Enterprise AI & Defense", pe: 95.0, divYield: "0.00%", beta: 2.45, volume: "74.8M", marketCap: "$101.2B", focus: "Tech", exchange: "NYSE" },
  { symbol: "AVGO", name: "Broadcom Inc.", basePrice: 178.60, sector: "Semiconductors", pe: 38.6, divYield: "1.20%", beta: 1.34, volume: "16.8M", marketCap: "$834.1B", focus: "Tech", exchange: "NASDAQ" },
  { symbol: "TSM", name: "Taiwan Semiconductor", basePrice: 198.40, sector: "Foundry Fabrication", pe: 27.4, divYield: "1.05%", beta: 1.22, volume: "19.3M", marketCap: "$1.02T", focus: "Tech", exchange: "NYSE" },
  { symbol: "ASML", name: "ASML Holding N.V.", basePrice: 712.50, sector: "Lithography Equip.", pe: 36.2, divYield: "0.95%", beta: 1.40, volume: "2.1M", marketCap: "$280.4B", focus: "Tech", exchange: "NASDAQ" },
  { symbol: "ARM", name: "Arm Holdings plc", basePrice: 152.90, sector: "IP Architecture", pe: 88.0, divYield: "0.00%", beta: 1.95, volume: "12.4M", marketCap: "$160.1B", focus: "Tech", exchange: "NASDAQ" },
  { symbol: "ORCL", name: "Oracle Corporation", basePrice: 172.10, sector: "Cloud Infrastructure", pe: 41.3, divYield: "0.93%", beta: 1.10, volume: "11.2M", marketCap: "$475.2B", focus: "Tech", exchange: "NYSE" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", basePrice: 494.60, sector: "Tech ETF", pe: 29.8, divYield: "0.58%", beta: 1.12, volume: "38.5M", marketCap: "$288.7B", focus: "Tech", exchange: "NASDAQ" },
  { symbol: "RKLB", name: "Rocket Lab USA", basePrice: 11.20, sector: "Space & Satellite", pe: -18.2, divYield: "0.00%", beta: 2.05, volume: "18.2M", marketCap: "$5.6B", focus: "Elon / Space", exchange: "NASDAQ" },
  { symbol: "JOBY", name: "Joby Aviation", basePrice: 5.85, sector: "eVTOL Autonomy", pe: -12.4, divYield: "0.00%", beta: 1.88, volume: "8.4M", marketCap: "$4.1B", focus: "Mobility", exchange: "NYSE" }
];

// Crypto Assets Database
const CRYPTO_DB = [
  { symbol: "BTC", name: "Bitcoin", basePrice: 68420.00, marketCap: "$1.35T", volume: "$32.4B", dominance: "55.8%", tvl: "-", category: "Layer 1 / Store of Value" },
  { symbol: "ETH", name: "Ethereum", basePrice: 2640.50, marketCap: "$318.2B", volume: "$18.1B", dominance: "13.4%", tvl: "$48.2B", category: "Smart Contracts L1" },
  { symbol: "SOL", name: "Solana", basePrice: 178.40, marketCap: "$83.6B", volume: "$4.8B", dominance: "3.5%", tvl: "$6.1B", category: "High-Throughput L1" },
  { symbol: "BNB", name: "BNB Chain", basePrice: 592.10, marketCap: "$86.5B", volume: "$1.2B", dominance: "3.6%", tvl: "$4.9B", category: "Exchange L1" },
  { symbol: "XRP", name: "XRP", basePrice: 0.542, marketCap: "$30.8B", volume: "$1.1B", dominance: "1.3%", tvl: "-", category: "Cross-Border Payments" },
  { symbol: "DOGE", name: "Dogecoin", basePrice: 0.142, marketCap: "$20.8B", volume: "$1.4B", dominance: "0.9%", tvl: "-", category: "Memecoin / Community" },
  { symbol: "USDT", name: "Tether USD", basePrice: 1.0001, marketCap: "$120.4B", volume: "$48.9B", dominance: "5.1%", tvl: "-", category: "Stablecoin" },
  { symbol: "USDC", name: "USD Coin", basePrice: 0.9999, marketCap: "$35.2B", volume: "$6.4B", dominance: "1.5%", tvl: "-", category: "Stablecoin" },
  { symbol: "ADA", name: "Cardano", basePrice: 0.362, marketCap: "$13.0B", volume: "$310M", dominance: "0.5%", tvl: "$220M", category: "Layer 1" },
  { symbol: "TRX", name: "TRON", basePrice: 0.165, marketCap: "$14.3B", volume: "$480M", dominance: "0.6%", tvl: "$8.1B", category: "Payments L1" },
  { symbol: "AVAX", name: "Avalanche", basePrice: 28.50, marketCap: "$11.5B", volume: "$420M", dominance: "0.5%", tvl: "$1.1B", category: "Layer 1 Subnets" },
  { symbol: "LINK", name: "Chainlink", basePrice: 12.40, marketCap: "$7.5B", volume: "$280M", dominance: "0.3%", tvl: "-", category: "Oracle / RWA" },
  { symbol: "TON", name: "Toncoin", basePrice: 5.15, marketCap: "$13.1B", volume: "$210M", dominance: "0.5%", tvl: "$420M", category: "Layer 1 Telegram" },
  { symbol: "DOT", name: "Polkadot", basePrice: 4.45, marketCap: "$6.4B", volume: "$180M", dominance: "0.3%", tvl: "-", category: "Interoperability L0" },
  { symbol: "MATIC", name: "Polygon Ecosystem", basePrice: 0.384, marketCap: "$3.1B", volume: "$120M", dominance: "0.15%", tvl: "$890M", category: "Ethereum L2 / ZK" },
  { symbol: "ARB", name: "Arbitrum One", basePrice: 0.582, marketCap: "$2.1B", volume: "$195M", dominance: "0.09%", tvl: "$2.5B", category: "Ethereum L2 Rollup" },
  { symbol: "OP", name: "Optimism", basePrice: 1.72, marketCap: "$2.0B", volume: "$160M", dominance: "0.08%", tvl: "$720M", category: "Ethereum L2 Superchain" },
  { symbol: "UNI", name: "Uniswap", basePrice: 8.12, marketCap: "$4.9B", volume: "$220M", dominance: "0.2%", tvl: "$5.4B", category: "DeFi DEX" },
  { symbol: "AAVE", name: "Aave Protocol", basePrice: 162.40, marketCap: "$2.4B", volume: "$185M", dominance: "0.1%", tvl: "$12.8B", category: "DeFi Lending" },
  { symbol: "PEPE", name: "Pepe Coin", basePrice: 0.0000104, marketCap: "$4.4B", volume: "$980M", dominance: "0.18%", tvl: "-", category: "Memecoin" }
];

// Properties Database
const PROPERTIES_DB = [
  {
    id: "prop-1",
    name: "The Obsidian Penthouse",
    city: "Manhattan",
    state: "NY",
    address: "530 W 56th St, Penthouse 48",
    price: 4850000,
    beds: 4,
    baths: 4.5,
    sqft: 4200,
    type: "Sale Properties",
    status: "Available",
    mortgageMonthly: 24800,
    rentalMonthly: 38000,
    nightlyEst: 1650,
    reitPrice: null,
    reitYield: null,
    downPaymentOptions: [20, 25, 30],
    matchingGoalTier: "Wealth",
    image: "assets/images/properties/prop-1.png",
    description: "Ultra-luxury full-floor penthouse with unobstructed 360-degree skyline and Hudson River views, private rooftop pool, and direct elevator access."
  },
  {
    id: "prop-2",
    name: "Pacific Coast Villa",
    city: "Malibu",
    state: "CA",
    address: "31820 Broad Beach Road",
    price: 6900000,
    beds: 5,
    baths: 6.0,
    sqft: 5800,
    type: "Mortgages",
    status: "Available",
    mortgageMonthly: 35200,
    rentalMonthly: 55000,
    nightlyEst: 2800,
    reitPrice: null,
    reitYield: null,
    downPaymentOptions: [20, 30, 40],
    matchingGoalTier: "Private",
    image: "assets/images/properties/prop-2.png",
    description: "Modernist oceanfront estate with seamless indoor-outdoor architectural flow, zero-edge pool, private beach stairs, and solar battery backup."
  },
  {
    id: "prop-3",
    name: "Skyline Heights Luxury Suite",
    city: "Miami Beach",
    state: "FL",
    address: "1100 West Ave, Penthouse 18B",
    price: 1250000,
    beds: 2,
    baths: 2.0,
    sqft: 1450,
    type: "Short-term stays",
    status: "Available",
    mortgageMonthly: 6400,
    rentalMonthly: 8500,
    nightlyEst: 520,
    reitPrice: null,
    reitYield: null,
    downPaymentOptions: [15, 20, 25],
    matchingGoalTier: "Wealth",
    image: "assets/images/properties/prop-3.png",
    description: "Turnkey luxury condo certified for short-term hospitality licensing. Fully automated smart locks, designer furnishings, and high historical occupancy."
  },
  {
    id: "prop-4",
    name: "Apex Innovation Tech REIT",
    city: "Austin & Silicon Valley",
    state: "TX / CA",
    address: "Tech Core REIT Trust Fund (APEX-REIT)",
    price: 124.50,
    beds: null,
    baths: null,
    sqft: 1280000,
    type: "REITs",
    status: "Available",
    mortgageMonthly: null,
    rentalMonthly: null,
    nightlyEst: null,
    reitPrice: 124.50,
    reitYield: "8.4% APY",
    downPaymentOptions: [5, 10, 20],
    matchingGoalTier: "Starter",
    image: "assets/images/properties/prop-4.png",
    description: "Fractional diversified REIT portfolio holding prime autonomous vehicle research facilities, AI data infrastructure, and modern tech campus office spaces."
  },
  {
    id: "prop-5",
    name: "Emerald Ridge Modern Eco-Rental",
    city: "Seattle",
    state: "WA",
    address: "2410 4th Ave W",
    price: 920000,
    beds: 3,
    baths: 2.0,
    sqft: 2150,
    type: "Rental spaces",
    status: "Available",
    mortgageMonthly: 4700,
    rentalMonthly: 3450,
    nightlyEst: 280,
    reitPrice: null,
    reitYield: null,
    downPaymentOptions: [10, 20],
    matchingGoalTier: "Wealth",
    image: "assets/images/properties/prop-5.png",
    description: "LEED Platinum multi-level townhome with dedicated EV charging garage, rooftop cedar deck, and continuous corporate tenant demand."
  },
  {
    id: "prop-6",
    name: "Nordic Solitude Mountain Cabin",
    city: "Aspen",
    state: "CO",
    address: "420 Red Mountain Rd",
    price: 3450000,
    beds: 3,
    baths: 3.0,
    sqft: 3100,
    type: "Short-term stays",
    status: "Available",
    mortgageMonthly: 17600,
    rentalMonthly: 24000,
    nightlyEst: 780,
    reitPrice: null,
    reitYield: null,
    downPaymentOptions: [20, 25],
    matchingGoalTier: "Wealth",
    image: "assets/images/properties/prop-6.png",
    description: "Ski-in ski-out Scandinavian timber retreat with heated stone floors, geothermal climate system, private hot tub, and proven winter rental yields."
  },
  {
    id: "prop-7",
    name: "Metropolitan Multi-Family REIT",
    city: "Chicago & Boston",
    state: "IL / MA",
    address: "Urban Living Real Estate Trust (METRO-REIT)",
    price: 89.20,
    beds: null,
    baths: null,
    sqft: 850000,
    type: "REITs",
    status: "Available",
    mortgageMonthly: null,
    rentalMonthly: null,
    nightlyEst: null,
    reitPrice: 89.20,
    reitYield: "7.2% APY",
    downPaymentOptions: [5, 10],
    matchingGoalTier: "Starter",
    image: "assets/images/properties/prop-7.png",
    description: "Institutional portfolio of 2,400 multi-family residential units in high-density transit corridors with 96.8% historical tenancy."
  },
  {
    id: "prop-8",
    name: "Desert Horizon Modernist Estate",
    city: "Scottsdale",
    state: "AZ",
    address: "10480 E Desert Mountain Pkwy",
    price: 2450000,
    beds: 4,
    baths: 4.0,
    sqft: 4500,
    type: "Sale Properties",
    status: "Available",
    mortgageMonthly: 12500,
    rentalMonthly: 16000,
    nightlyEst: 950,
    reitPrice: null,
    reitYield: null,
    downPaymentOptions: [20, 30],
    matchingGoalTier: "Wealth",
    image: "assets/images/properties/prop-8.png",
    description: "Architectural desert compound featuring rammed-earth walls, solar photovoltaic canopies, negative-edge reflection pool, and mountain panoramas."
  }
];

// Shop Products Database (EVs, Humanoids, Wearables, Apparel, Emerging Tech)
const SHOP_PRODUCTS_DB = [
  // Electric Vehicles
  {
    id: "prod-ev-1",
    name: "Model S Plaid",
    category: "Electric Vehicles",
    price: 89990,
    isReservation: true,
    deposit: 1000,
    rating: 4.9,
    reviews: 320,
    image: "assets/images/vehicles/model-s-plaid.png",
    variants: ["Stealth Grey", "Solid Black", "Deep Blue Metallic", "Ultra Red"],
    specs: { "0-60 mph": "1.99 s", "Top Speed": "200 mph", "Range": "396 miles", "Powertrain": "Tri-Motor AWD (1,020 hp)" },
    description: "The quickest accelerating production car on Earth. Features carbon-sleeved rotors, tri-motor all-wheel drive, and interactive gaming console."
  },
  {
    id: "prod-ev-2",
    name: "Model 3 Long Range",
    category: "Electric Vehicles",
    price: 47490,
    isReservation: true,
    deposit: 500,
    rating: 4.8,
    reviews: 580,
    image: "assets/images/vehicles/model-3-lr.png",
    variants: ["Pearl White Multi-Coat", "Solid Black", "Stealth Grey", "Deep Blue"],
    specs: { "0-60 mph": "4.2 s", "Top Speed": "125 mph", "Range": "341 miles", "Powertrain": "Dual Motor AWD" },
    description: "Upgraded acoustic glass cabin, 360-degree ambient lighting, 17-speaker premium audio, and ultra-efficient electric travel."
  },
  {
    id: "prod-ev-3",
    name: "Model X Plaid",
    category: "Electric Vehicles",
    price: 94990,
    isReservation: true,
    deposit: 1000,
    rating: 4.9,
    reviews: 215,
    image: "assets/images/vehicles/model-x-plaid.png",
    variants: ["Stealth Grey", "Pearl White", "Ultra Red"],
    specs: { "0-60 mph": "2.5 s", "Top Speed": "163 mph", "Range": "326 miles", "Doors": "Falcon Wing Automatic" },
    description: "The highest performing SUV ever built. Unrivaled utility, seating for six with captain chairs, and staggering hypercar acceleration."
  },
  {
    id: "prod-ev-4",
    name: "Model Y Long Range",
    category: "Electric Vehicles",
    price: 48990,
    isReservation: true,
    deposit: 500,
    rating: 4.8,
    reviews: 940,
    image: "assets/images/vehicles/model-y-lr.png",
    variants: ["Stealth Grey", "Quicksilver", "Ultra Red", "Pearl White"],
    specs: { "0-60 mph": "4.8 s", "Top Speed": "135 mph", "Range": "310 miles", "Cargo": "76 cu ft Maximum" },
    description: "World's bestselling crossover EV. Versatile cargo space, dual motor all-weather traction, and comprehensive safety engineering."
  },
  {
    id: "prod-ev-5",
    name: "Cybertruck",
    category: "Electric Vehicles",
    price: 99990,
    isReservation: true,
    deposit: 1000,
    rating: 4.9,
    reviews: 410,
    image: "assets/images/vehicles/cybertruck.png",
    variants: ["Raw Stainless Steel", "Matte Black Armor Wrap", "Cyber White Wrap"],
    specs: { "0-60 mph": "2.6 s", "Towing Capacity": "11,000 lbs", "Range": "320 miles", "Armor": "Shatter-Resistant Glass" },
    description: "Ultra-hard 30X cold-rolled stainless steel exoskeleton, steer-by-wire, 48V architecture, and adaptive air suspension."
  },
  {
    id: "prod-ev-6",
    name: "Roadster",
    category: "Electric Vehicles",
    price: 200000,
    isReservation: true,
    deposit: 5000,
    rating: 5.0,
    reviews: 145,
    image: "assets/images/vehicles/roadster.png",
    variants: ["Founder Series Red", "Obsidian Black", "Liquid Silver"],
    specs: { "0-60 mph": "1.1 s (SpaceX Package)", "Top Speed": "250+ mph", "Range": "620 miles", "Roof": "Lightweight Removable Glass" },
    description: "An all-electric supercar that maximizes the potential of aerodynamic engineering into unprecedented performance and efficiency."
  },
  {
    id: "prod-ev-7",
    name: "Tesla Semi",
    category: "Electric Vehicles",
    price: 180000,
    isReservation: true,
    deposit: 5000,
    rating: 4.9,
    reviews: 78,
    image: "assets/images/vehicles/tesla-semi.png",
    variants: ["300 Mile Standard", "500 Mile Long Haul"],
    specs: { "GVWR": "82,000 lbs", "Range": "500 miles fully loaded", "Charging": "Megawatt Charging System", "Efficiency": "<2 kWh per mile" },
    description: "Heavy-duty electric transport with central driver seating for optimal visibility, active traction control, and massive fuel savings."
  },
  {
    id: "prod-ev-8",
    name: "Electric Delivery Van",
    category: "Electric Vehicles",
    price: 62500,
    isReservation: true,
    deposit: 1000,
    rating: 4.7,
    reviews: 112,
    image: "assets/images/vehicles/electric-van.png",
    variants: ["Short Wheelbase 350 cu ft", "Long Wheelbase 500 cu ft"],
    specs: { "Range": "250 miles", "Payload": "4,200 lbs", "Charging": "150kW DC Fast", "Software": "GoalVest Fleet Telematics" },
    description: "Commercial zero-emission fleet delivery vehicle purpose-engineered for multi-stop logistics, safety, and lowest operating cost."
  },
  {
    id: "prod-ev-9",
    name: "Performance Electric Coupe",
    category: "Electric Vehicles",
    price: 115000,
    isReservation: true,
    deposit: 2500,
    rating: 4.9,
    reviews: 67,
    image: "assets/images/vehicles/perf-coupe.png",
    variants: ["Carbon Cyber Grey", "Apex Sapphire Blue", "Racing Emerald"],
    specs: { "0-60 mph": "2.1 s", "Top Speed": "195 mph", "Range": "360 miles", "Brakes": "Carbon Ceramic Matrix" },
    description: "Track-focused dual-motor GT coupe featuring active aerodynamics, carbon-fiber tub chassis, and torque vectoring."
  },

  // Humanoid Robots
  {
    id: "prod-bot-1",
    name: "Optimus",
    category: "Humanoid Robots",
    price: 25000,
    isReservation: true,
    deposit: 1000,
    rating: 4.9,
    reviews: 184,
    image: "assets/images/robots/optimus.png",
    variants: ["White Minimalist Shell", "Cyber Titanium Finish"],
    specs: { "Degrees of Freedom": "28 Structural DoF", "Hands": "11-DoF Tactile Sensors", "Battery": "2.3 kWh Pack", "Compute": "FSD Hardware 4" },
    description: "General purpose, bi-pedal autonomous humanoid robot capable of performing unsafe, repetitive, or tedious tasks with human dexterity."
  },
  {
    id: "prod-bot-2",
    name: "Optimus Pro",
    category: "Humanoid Robots",
    price: 38000,
    isReservation: true,
    deposit: 2000,
    rating: 5.0,
    reviews: 92,
    image: "assets/images/robots/optimus-pro.png",
    variants: ["Industrial Matte Armor", "Cleanroom Spec Anti-Static"],
    specs: { "Payload": "45 kg Continuous Carry", "Runtime": "16 Hours Operational", "DoF": "34 Industrial Actuators", "Sensors": "360 Surround Vision" },
    description: "Heavy-duty commercial humanoid engineered for automated warehousing, precision assembly lines, and factory transport."
  },
  {
    id: "prod-bot-3",
    name: "Optimus Mini",
    category: "Humanoid Robots",
    price: 12500,
    isReservation: true,
    deposit: 500,
    rating: 4.8,
    reviews: 210,
    image: "assets/images/robots/optimus-mini.png",
    variants: ["Arctic White", "Space Grey"],
    specs: { "Height": "4.2 feet", "Weight": "38 kg", "AI Assistant": "Local Voice Model", "Safety": "Soft Compliant Joints" },
    description: "Compact domestic assistant robot for household chores, package handling, elder companion support, and automated home patrol."
  },

  // Wearables
  {
    id: "prod-wear-1",
    name: "Kinetic Watch One",
    category: "Wearables",
    price: 399,
    isReservation: false,
    deposit: 0,
    rating: 4.8,
    reviews: 430,
    image: "assets/images/wearables/watch-one.png",
    variants: ["Space Black Titanium", "Silver Frost", "Midnight Blue Band"],
    specs: { "Case": "44mm Aerospace Titanium", "Display": "LTPO OLED 2000 nits", "Battery": "7-Day Endurance", "Sensors": "ECG, SpO2, Skin Temp" },
    description: "Precision biometric timepiece featuring real-time GoalVest portfolio tracking, haptic wealth notifications, and cellular connectivity."
  },
  {
    id: "prod-wear-2",
    name: "Kinetic Watch Ultra",
    category: "Wearables",
    price: 799,
    isReservation: false,
    deposit: 0,
    rating: 4.9,
    reviews: 310,
    image: "assets/images/wearables/watch-ultra.png",
    variants: ["Natural Titanium Orange Loop", "DLC Stealth Black Trail"],
    specs: { "Case": "49mm Grade 5 Titanium", "Water": "100m Dive Certified", "GPS": "Dual-Frequency L1/L5", "Emergency": "Satellite SOS Integration" },
    description: "Engineered for extreme endurance and tactical wealth management. Dual-frequency precision GPS, siren speaker, and sapphire crystal."
  },
  {
    id: "prod-wear-3",
    name: "Kinetic Watch SE",
    category: "Wearables",
    price: 249,
    isReservation: false,
    deposit: 0,
    rating: 4.7,
    reviews: 520,
    image: "assets/images/wearables/watch-se.png",
    variants: ["Starlight Aluminum", "Midnight", "Silver"],
    specs: { "Case": "40mm Recycled Aluminum", "Battery": "48-Hour Regular Use", "Fitness": "Heart Rate & Sleep Tracking", "Water": "50m Water Resistance" },
    description: "The essential daily fitness and financial companion. Quick contactless GoalVest wallet payments and sleek modern profile."
  },

  // Apparel
  {
    id: "prod-app-1",
    name: "Logo Tee",
    category: "Apparel",
    price: 45,
    isReservation: false,
    deposit: 0,
    rating: 4.8,
    reviews: 340,
    image: "assets/images/apparel/logo-tee.png",
    variants: ["Size S", "Size M", "Size L", "Size XL", "Size XXL"],
    specs: { "Material": "100% Organic Combed Cotton", "Weight": "280 GSM Heavyweight", "Cut": "Relaxed Tailored Fit", "Care": "Pre-shrunk Cold Wash" },
    description: "Minimalist GoalVest insignia printed in high-density metallic silicone on heavyweight organic combed cotton."
  },
  {
    id: "prod-app-2",
    name: "Hoodie",
    category: "Apparel",
    price: 98,
    isReservation: false,
    deposit: 0,
    rating: 4.9,
    reviews: 290,
    image: "assets/images/apparel/hoodie.png",
    variants: ["Size S", "Size M", "Size L", "Size XL"],
    specs: { "Material": "450 GSM French Terry Cotton", "Hardware": "Custom Matte Alloy Eyelets", "Fit": "Oversized Drop-Shoulder", "Color": "Stealth Black" },
    description: "Premium French Terry heavyweight pullover engineered with concealed zip stash pockets and fleece-lined double hood."
  },
  {
    id: "prod-app-3",
    name: "Cap",
    category: "Apparel",
    price: 35,
    isReservation: false,
    deposit: 0,
    rating: 4.7,
    reviews: 180,
    image: "assets/images/apparel/cap.png",
    variants: ["Matte Black", "Graphite Grey", "Forest Green"],
    specs: { "Material": "Recycled Tech Ripstop", "Closure": "Magnetic Fidlock Buckle", "Protection": "UPF 50+ Sun Guard", "Weight": "72 grams" },
    description: "Water-repellent performance structured cap featuring magnetic rear closure clasp and tonal micro-embroidered GoalVest crest."
  },
  {
    id: "prod-app-4",
    name: "Jacket",
    category: "Apparel",
    price: 185,
    isReservation: false,
    deposit: 0,
    rating: 4.9,
    reviews: 165,
    image: "assets/images/apparel/jacket.png",
    variants: ["Size S", "Size M", "Size L", "Size XL"],
    specs: { "Fabric": "3-Layer eVent Waterproof Membrane", "Seams": "Fully Taped & Sealed", "Pockets": "RFID Shielded Interior", "Rating": "20,000mm Hydrostatic" },
    description: "Technical all-weather commuter jacket built with breathable waterproof laminate, laser-cut ventilation, and RFID privacy shielding."
  },

  // Emerging Tech
  {
    id: "prod-tech-1",
    name: "Home Battery",
    category: "Emerging Tech",
    price: 7200,
    isReservation: false,
    deposit: 0,
    rating: 4.9,
    reviews: 210,
    image: "assets/images/energy/home-battery.png",
    variants: ["13.5 kWh Standard", "27 kWh Dual Pack"],
    specs: { "Capacity": "13.5 kWh Usable", "Power": "7kW Continuous / 10kW Peak", "Efficiency": "90% Round-trip", "Warranty": "10-Year Full Replacement" },
    description: "Compact home storage battery that integrates with solar systems or grid power for whole-home 24/7 power backup and time-of-use cost optimization."
  },
  {
    id: "prod-tech-2",
    name: "Solar Roof Panel",
    category: "Emerging Tech",
    price: 14500,
    isReservation: false,
    deposit: 0,
    rating: 4.8,
    reviews: 95,
    image: "assets/images/energy/solar-roof.png",
    variants: ["10 kW Array Kit", "15 kW Array Kit", "20 kW Array Kit"],
    specs: { "Cell Type": "High-Efficiency Monocrystalline", "Glass": "Architectural Tempered Tile", "Wind Rating": "Class F (130 mph)", "Fire Rating": "Class A" },
    description: "Architectural solar glass tiles that replace traditional shingles while generating maximum clean electricity from dawn to dusk."
  },
  {
    id: "prod-tech-3",
    name: "Survey Drone",
    category: "Emerging Tech",
    price: 4800,
    isReservation: false,
    deposit: 0,
    rating: 4.8,
    reviews: 64,
    image: "assets/images/energy/survey-drone.png",
    variants: ["Standard Mapping Kit", "Thermal + LiDAR Enterprise"],
    specs: { "Sensor": "45MP Full-Frame & LiDAR", "Flight Time": "55 Minutes", "Range": "15 km Transmission", "Obstacle": "Omnidirectional Radar" },
    description: "Autonomous commercial aerial drone designed for real estate surveying, construction monitoring, and agricultural land assessment."
  },
  {
    id: "prod-tech-4",
    name: "DC Fast EV Charger",
    category: "Emerging Tech",
    price: 18900,
    isReservation: false,
    deposit: 0,
    rating: 4.9,
    reviews: 42,
    image: "assets/images/energy/dc-charger.png",
    variants: ["250kW Single Port", "350kW Dual Port"],
    specs: { "Max Output": "250 kW Continuous", "Connectors": "Dual NACS & CCS Combo", "Cooling": "Liquid Cooled Cable", "Display": "15-inch Touchscreen" },
    description: "Commercial ultra-fast charging dispenser supporting up to 200 miles of range in 15 minutes with GoalVest payment terminals."
  },
  {
    id: "prod-tech-5",
    name: "Home Wall Connector",
    category: "Emerging Tech",
    price: 475,
    isReservation: false,
    deposit: 0,
    rating: 4.9,
    reviews: 820,
    image: "assets/images/energy/wall-connector.png",
    variants: ["Matte Black 24ft Cable", "Gloss White 18ft Cable"],
    specs: { "Amperage": "Up to 48A (11.5 kW)", "Voltage": "208-240V Single Phase", "Wi-Fi": "Auto-Firmware Updates", "Rating": "NEMA 3R Indoor/Outdoor" },
    description: "The fastest, most convenient way to charge any electric vehicle at home. Connects seamlessly with the GoalVest smart energy manager."
  },
  {
    id: "prod-tech-6",
    name: "Portable Solar Generator",
    category: "Emerging Tech",
    price: 1899,
    isReservation: false,
    deposit: 0,
    rating: 4.8,
    reviews: 175,
    image: "assets/images/energy/solar-generator.png",
    variants: ["3 kWh Unit Only", "3 kWh + 400W Solar Panel"],
    specs: { "Capacity": "3,072 Wh LiFePO4", "AC Output": "3,000W Pure Sine Wave", "Recharge": "0-80% in 55 mins", "Cycle Life": "3,500+ to 80%" },
    description: "Heavy-duty off-grid power generator engineered for off-grid cabins, mobile workshops, emergency backup, and field computing."
  },
  {
    id: "prod-tech-7",
    name: "Solar Inverter Converter",
    category: "Emerging Tech",
    price: 2150,
    isReservation: false,
    deposit: 0,
    rating: 4.7,
    reviews: 88,
    image: "assets/images/energy/solar-inverter.png",
    variants: ["7.6 kW Inverter", "10 kW Dual-MPPT Inverter"],
    specs: { "Efficiency": "98.5% CEC Rated", "MPPT Trackers": "Dual Independent", "Rapid Shutdown": "Integrated SunSpec RSD", "Warranty": "15-Year Standard" },
    description: "Hybrid solar DC-to-AC power converter with direct battery coupling, smart grid export management, and microsecond surge protection."
  },
  {
    id: "prod-tech-8",
    name: "Inference Cluster",
    category: "Emerging Tech",
    price: 42000,
    isReservation: true,
    deposit: 3000,
    rating: 5.0,
    reviews: 38,
    image: "assets/images/energy/inference-cluster.png",
    variants: ["4U Rack Mount Node", "Desk Tower Acoustic Silent"],
    specs: { "Compute": "8x 192GB Unified Neural Cores", "Memory": "1.5 TB Ultra-Bandwidth", "Interconnect": "800 Gbps RoCE v2", "Power": "3.2 kW Liquid Cold-Plate" },
    description: "High-density private AI inference compute server designed for running local frontier large language and autonomous robotics vision models."
  }
];

// Daily Advice Database
const DAILY_ADVICE = [
  {
    category: "Investing",
    title: "Dollar-Cost Averaging into Innovation",
    icon: "trending-up",
    readTime: "3 min read",
    snippet: "Historically, regular automated contributions eliminate emotional market timing and compound equity outperformance across volatile tech and energy cycles."
  },
  {
    category: "Budgeting",
    title: "The Zero-Waste Wealth Rule",
    icon: "pie-chart",
    readTime: "4 min read",
    snippet: "Allocate every dollar a distinct role before the month begins: 50% core assets & survival, 30% goal velocity, and 20% tactical reserve."
  },
  {
    category: "Lifestyle Discipline",
    title: "The 72-Hour Purchase Friction Test",
    icon: "shield",
    readTime: "2 min read",
    snippet: "Before purchasing non-essential luxury items above $500, enforce an enforced 72-hour cooling period. 68% of impulse decisions dissolve naturally."
  },
  {
    category: "Long-Term Wealth",
    title: "Asymmetric Upside of High-Conviction Real Assets",
    icon: "zap",
    readTime: "5 min read",
    snippet: "Pairing cash-flowing REITs with structural frontier technologies produces an inflation-proof wealth engine with high downside protection."
  },
  {
    category: "Emergency Funds",
    title: "Liquid Vault Calibration",
    icon: "lock",
    readTime: "3 min read",
    snippet: "Always maintain 6 months of mandatory operational runway in high-yield cash equivalents before allocating capital to speculative venture horizons."
  },
  {
    category: "Asset Allocation",
    title: "The Multi-Asset Matrix",
    icon: "layers",
    readTime: "4 min read",
    snippet: "Balancing global equities, infrastructure debt, tangible properties, and scarce digital assets shields net worth against monetary debasement."
  },
  {
    category: "Smart Purchase",
    title: "Total Cost of Ownership vs Upfront Price",
    icon: "tag",
    readTime: "3 min read",
    snippet: "Electric vehicles and modular energy storage carry lower maintenance and fuel overhead, frequently generating positive net present value within 4 years."
  }
];

// Investment Portfolio Holdings
const DEFAULT_PORTFOLIO_HOLDINGS = [
  { id: "h1", assetClass: "US Equity", name: "Tesla (TSLA) & Tech Titans Basket", symbol: "TSLA+QQQ", value: 68400, costBasis: 52100, gainLoss: 16300, ytdReturn: "+31.28%", expenseRatio: "0.15%" },
  { id: "h2", assetClass: "US Equity", name: "NVIDIA Corp (NVDA) Compute", symbol: "NVDA", value: 34200, costBasis: 24500, gainLoss: 9700, ytdReturn: "+39.59%", expenseRatio: "0.00%" },
  { id: "h3", assetClass: "International Equity", name: "TSMC & European Semi Leaders", symbol: "TSM+ASML", value: 24500, costBasis: 21800, gainLoss: 2700, ytdReturn: "+12.38%", expenseRatio: "0.22%" },
  { id: "h4", assetClass: "Real Estate", name: "Apex Innovation REIT Holdings", symbol: "APEX-REIT", value: 28900, costBasis: 26500, gainLoss: 2400, ytdReturn: "+9.05%", expenseRatio: "0.35%" },
  { id: "h5", assetClass: "Fixed Income", name: "Treasury Yield 5.2% Ladder", symbol: "US-TREAS", value: 16400, costBasis: 16100, gainLoss: 300, ytdReturn: "+5.18%", expenseRatio: "0.05%" },
  { id: "h6", assetClass: "Commodities", name: "Physical Copper & Battery Metals ETF", symbol: "BATT-MET", value: 8200, costBasis: 7600, gainLoss: 600, ytdReturn: "+7.89%", expenseRatio: "0.45%" },
  { id: "h7", assetClass: "Cash", name: "GoalVest High-Yield Liquid Vault", symbol: "USD-VAULT", value: 5000, costBasis: 5000, gainLoss: 0, ytdReturn: "+4.95%", expenseRatio: "0.00%" }
];

// Deposit Methods managed by Admin
const DEFAULT_DEPOSIT_METHODS = [
  { id: "dep-1", name: "Bank Wire Transfer (Fedwire / SWIFT)", instructions: "Routing: 021000021, Account: 9840291402, Beneficiary: GoalVest Treasury LLC, Ref: Your Username", active: true },
  { id: "dep-2", name: "Crypto Deposit (USDT / USDC ERC-20)", instructions: "Deposit Address: 0x71C8360f992A67156972274488A01aC4419F30d4 (Ethereum / Arbitrum)", active: true },
  { id: "dep-3", name: "Instant ACH Transfer", instructions: "GoalVest Direct Clearing: Instant verification with Plaid / Micro-deposits.", active: true }
];

// Local Storage Manager with Backend REST API Synchronization
class DataStore {
  constructor() {
    this.init();
    this.syncFromBackend();
  }

  async syncFromBackend() {
    try {
      const res = await fetch('/api/db');
      if (res.ok) {
        const data = await res.json();
        if (data.users && (!localStorage.getItem("gv_users") || JSON.parse(localStorage.getItem("gv_users")).length === 0)) {
          this.saveUsers(data.users);
        }
        if (data.paymentRequests && !localStorage.getItem("gv_payment_requests")) {
          this.savePaymentRequests(data.paymentRequests);
        }
        if (data.announcements && !localStorage.getItem("gv_announcements")) {
          this.saveAnnouncements(data.announcements);
        }
      }
    } catch (e) {
      // Offline fallback
    }
  }

  async syncToBackend() {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          users: this.getUsers(),
          paymentRequests: this.getPaymentRequests(),
          announcements: this.getAnnouncements(),
          chats: this.getChats(),
          orders: this.getOrders(),
          activity: this.getActivity(),
          depositMethods: this.getDepositMethods()
        })
      });
    } catch (e) {
      // Offline or static mode
    }
  }

  init() {
    if (!localStorage.getItem("gv_users")) {
      localStorage.setItem("gv_users", JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem("gv_deposit_methods")) {
      localStorage.setItem("gv_deposit_methods", JSON.stringify(DEFAULT_DEPOSIT_METHODS));
    }
    if (!localStorage.getItem("gv_payment_requests")) {
      localStorage.setItem("gv_payment_requests", JSON.stringify([]));
    }
    if (!localStorage.getItem("gv_announcements")) {
      localStorage.setItem("gv_announcements", JSON.stringify([
        {
          id: "anc-1",
          title: "GoalVest Global Wealth & Asset Infrastructure Live",
          body: "Our portfolio intelligence engine, multi-tier wealth architecture, automated contributions, and physical hardware reservations are officially operational. Open your first goal and begin building.",
          audience: "All users",
          level: "Important",
          author: "Admin",
          createdDate: "2026-10-24 10:00"
        }
      ]));
    }
    if (!localStorage.getItem("gv_chats")) {
      localStorage.setItem("gv_chats", JSON.stringify([]));
    }
    if (!localStorage.getItem("gv_orders")) {
      localStorage.setItem("gv_orders", JSON.stringify([]));
    }
    if (!localStorage.getItem("gv_activity")) {
      localStorage.setItem("gv_activity", JSON.stringify([]));
    }
    if (!localStorage.getItem("gv_saved_properties")) {
      localStorage.setItem("gv_saved_properties", JSON.stringify([]));
    }
  }

  getUsers() {
    return JSON.parse(localStorage.getItem("gv_users") || "[]");
  }
  saveUsers(users) {
    localStorage.setItem("gv_users", JSON.stringify(users));
    this.syncToBackend();
  }
  getUser(username) {
    const users = this.getUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }
  updateUser(user) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.username.toLowerCase() === user.username.toLowerCase());
    if (idx !== -1) {
      users[idx] = user;
      this.saveUsers(users);
      // Synchronize active session if current user updated
      if (AppState.currentUser && AppState.currentUser.username.toLowerCase() === user.username.toLowerCase()) {
        AppState.currentUser = user;
      }
    }
  }

  getDepositMethods() {
    return JSON.parse(localStorage.getItem("gv_deposit_methods") || "[]");
  }
  saveDepositMethods(methods) {
    localStorage.setItem("gv_deposit_methods", JSON.stringify(methods));
    this.syncToBackend();
  }

  getPaymentRequests() {
    return JSON.parse(localStorage.getItem("gv_payment_requests") || "[]");
  }
  savePaymentRequests(reqs) {
    localStorage.setItem("gv_payment_requests", JSON.stringify(reqs));
    this.syncToBackend();
  }

  getAnnouncements() {
    return JSON.parse(localStorage.getItem("gv_announcements") || "[]");
  }
  saveAnnouncements(ancs) {
    localStorage.setItem("gv_announcements", JSON.stringify(ancs));
    this.syncToBackend();
  }

  getChats() {
    return JSON.parse(localStorage.getItem("gv_chats") || "[]");
  }
  saveChats(chats) {
    localStorage.setItem("gv_chats", JSON.stringify(chats));
    this.syncToBackend();
  }

  getOrders() {
    return JSON.parse(localStorage.getItem("gv_orders") || "[]");
  }
  saveOrders(orders) {
    localStorage.setItem("gv_orders", JSON.stringify(orders));
    this.syncToBackend();
  }

  getActivity() {
    return JSON.parse(localStorage.getItem("gv_activity") || "[]");
  }
  addActivity(item) {
    const acts = this.getActivity();
    acts.unshift(item);
    localStorage.setItem("gv_activity", JSON.stringify(acts));
    this.syncToBackend();
  }

  getSavedProperties() {
    return JSON.parse(localStorage.getItem("gv_saved_properties") || "[]");
  }
  toggleSaveProperty(id) {
    let saved = this.getSavedProperties();
    if (saved.includes(id)) {
      saved = saved.filter(x => x !== id);
    } else {
      saved.push(id);
    }
    localStorage.setItem("gv_saved_properties", JSON.stringify(saved));
    return saved;
  }
}

// Real-Time Deterministic & Live Tick Pricing Engine
class PricingEngine {
  constructor() {
    this.tick = 0;
    this.realTimeCache = {};
    this.initLiveTickListener();
  }

  initLiveTickListener() {
    // Generate organic market micro-volatility every 2 seconds
    setInterval(() => {
      this.tick++;
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('gv-market-tick', { detail: { tick: this.tick } }));
      }
    }, 2000);
  }

  // Micro-fluctuation generator with realistic market drift
  getModifier(seedOffset = 0) {
    const timeFactor = (Date.now() / 4000) + seedOffset;
    // Harmonic oscillation mimicking live exchange order-book spread
    const primary = Math.sin(timeFactor) * 0.012;
    const secondary = Math.cos(timeFactor * 1.618) * 0.006;
    return 1 + (primary + secondary);
  }

  getStocks() {
    return STOCKS_DB.map((stock, i) => {
      const mod = this.getModifier(i * 1.37);
      const currentPrice = Number((stock.basePrice * mod).toFixed(2));
      const changePct = Number(((mod - 1) * 100).toFixed(2));
      const sparkline = [];
      for (let p = 0; p < 7; p++) {
        sparkline.push(Number((stock.basePrice * (1 + Math.sin(p + i + this.tick * 0.1) * 0.018)).toFixed(2)));
      }
      sparkline.push(currentPrice);
      return {
        ...stock,
        currentPrice,
        changePct,
        sparkline
      };
    });
  }

  getCrypto() {
    return CRYPTO_DB.map((c, i) => {
      const mod = this.getModifier(i * 2.33);
      const currentPrice = Number((c.basePrice * mod).toFixed(c.basePrice < 1 ? 5 : 2));
      const changePct = Number(((mod - 1) * 100).toFixed(2));
      const sparkline = [];
      for (let p = 0; p < 7; p++) {
        sparkline.push(Number((c.basePrice * (1 + Math.cos(p + i + this.tick * 0.1) * 0.025)).toFixed(c.basePrice < 1 ? 5 : 2)));
      }
      sparkline.push(currentPrice);
      return {
        ...c,
        currentPrice,
        changePct,
        sparkline
      };
    });
  }

  getProperties() {
    return PROPERTIES_DB.map((p, i) => {
      return {
        ...p,
        currentPrice: p.price
      };
    });
  }

  getShopProducts() {
    return SHOP_PRODUCTS_DB;
  }
}

// Social Media Content Broadcast Library (Curated Frequent Content Stream)
const SOCIAL_POSTS_DB = [
  {
    id: "sp-1",
    channel: "X / Telegram VIP",
    category: "Market Alpha",
    badge: "badge-green",
    date: "Just Now",
    headline: "Autonomous Mobility & Compute Equities Outperform 🚀",
    content: "TSLA holding key trend support as Full Self-Driving hardware & Optimus lines ramp up. Combined tech market weighting stands at 34.2% on our live heatmap. Are your goal contributions automated for Q4?",
    tags: ["#GoalVest", "#Tesla", "#AICompute", "#WealthVelocity"],
    stat: "+14.8% YTD Alpha",
    shareText: "TSLA holding key trend support as autonomous tech accelerates. Track tier portfolios and S&P tech heatmaps on https://goalvest.dev 🚀"
  },
  {
    id: "sp-2",
    channel: "Instagram / Threads",
    category: "Wealth Discipline",
    badge: "badge-cyan",
    date: "25 mins ago",
    headline: "The 72-Hour Purchase Friction Rule ⏱️",
    content: "Before dropping $1,000+ on non-essential lifestyle impulse purchases, enforce a mandatory 72-hour cooling period. 68% of impulse desires dissolve naturally. Put that capital into your Builder or Growth goal tier instead.",
    tags: ["#FinancialDiscipline", "#GoalVestMindset", "#Compounding", "#Fintech"],
    stat: "68% Friction Save",
    shareText: "The 72-Hour Rule saves 68% of impulse capital. Turn frivolous expenses into productive assets on https://goalvest.dev ⏱️"
  },
  {
    id: "sp-3",
    channel: "Telegram VIP Exclusive",
    category: "REIT Intel",
    badge: "badge-purple",
    date: "1 hour ago",
    headline: "Cash-Flowing Real Estate: Apex Innovation Tech REIT 🏙️",
    content: "Fractional exposure to class-A commercial tech campuses across Austin & Silicon Valley. Paying out an estimated 8.4% dividend yield with quarterly automated distributions. Zero landlord headaches, 100% liquid fractional shares.",
    tags: ["#RealEstateREIT", "#PassiveIncome", "#Dividends", "#GoalVest"],
    stat: "8.4% Dividend APY",
    shareText: "8.4% APY quarterly payouts from top Austin & Silicon Valley tech campuses through GoalVest REITs. Check it out: https://goalvest.dev 🏙️"
  },
  {
    id: "sp-4",
    channel: "X / Threads",
    category: "Digital Assets",
    badge: "badge-amber",
    date: "2 hours ago",
    headline: "Bitcoin Dominance vs Layer-1 DeFi Velocity ⚡",
    content: "BTC global dominance holds at 55.8% as institutions accumulate. Meanwhile, high-throughput Layer-1s like Solana and Layer-2 rollups Arbitrum/Optimism continue driving record TVL. Manage your blended equities and crypto in one single dashboard.",
    tags: ["#Bitcoin", "#CryptoTrading", "#Solana", "#DeFi"],
    stat: "$2.42T Market Cap",
    shareText: "BTC dominance at 55.8% with high Layer-1 velocity. Trade and balance crypto alongside US equities on https://goalvest.dev ⚡"
  },
  {
    id: "sp-5",
    channel: "Instagram / X",
    category: "Frontier Hardware",
    badge: "badge-blue",
    date: "3 hours ago",
    headline: "Model S Plaid & Cybertruck Tier Allocations ⚡",
    content: "From 0-60 in 1.99s to cold-rolled stainless steel utility, our GoalVest Marketplace connects goal plans directly to reservation deposits. Set a target date, fund monthly, and pick up your vehicle debt-free.",
    tags: ["#Cybertruck", "#TeslaModelS", "#CleanEnergy", "#FutureTech"],
    stat: "1,020 HP Delivered",
    shareText: "Plan your Cybertruck or Model S Plaid purchase with automated goal tiers and reservation deposits on https://goalvest.dev ⚡"
  },
  {
    id: "sp-6",
    channel: "Telegram Support / All Channels",
    category: "Platform Update",
    badge: "badge-green",
    date: "4 hours ago",
    headline: "Instant User-to-User Transfers & Wire Authentication Live 🛡️",
    content: "Our zero-fee peer-to-peer wallet transfer engine is running 24/7. Send instant liquidity to any registered @username worldwide. All bank wires and crypto deposits are authenticated with top-tier security standards.",
    tags: ["#GoalVestWallets", "#InstantTransfer", "#FintechSecurity"],
    stat: "0.00% Platform Fee",
    shareText: "Instant zero-fee peer transfers and authenticated multi-asset wallets are live on https://goalvest.dev 🛡️"
  },
  {
    id: "sp-7",
    channel: "X / Twitter",
    category: "Market Alpha",
    badge: "badge-green",
    date: "5 hours ago",
    headline: "Semiconductor CapEx & AI Supercluster Buildout 🤖",
    content: "Hyperscalers have committed over $210B in annualized AI infrastructure. NVDA, AMD, and ASML hold steady margins as next-gen wafer packaging expands. Position your long-term Builder & Growth goal tiers for structural tailwinds.",
    tags: ["#Semiconductors", "#NVIDIA", "#GoalVestAlpha", "#TechInvesting"],
    stat: "$210B Annual CapEx",
    shareText: "Hyperscaler AI infrastructure commitments top $210B. Tap into structural tech growth directly via GoalVest: https://goalvest.dev 🤖"
  },
  {
    id: "sp-8",
    channel: "Instagram / Threads",
    category: "Wealth Discipline",
    badge: "badge-cyan",
    date: "6 hours ago",
    headline: "Automate First, Budget What Remains 💎",
    content: "The fundamental flaw in traditional budgeting is saving whatever is left over at month-end. Flip the script: route your GoalVest monthly contribution the exact hour income clears, then live freely on the rest.",
    tags: ["#WealthBuilding", "#PayYourselfFirst", "#FinancialFreedom", "#GoalVest"],
    stat: "3.4x Savings Rate",
    shareText: "Automate your investments the moment income clears. Build disciplined compounding with GoalVest: https://goalvest.dev 💎"
  },
  {
    id: "sp-9",
    channel: "Telegram VIP Exclusive",
    category: "REIT Intel",
    badge: "badge-purple",
    date: "7 hours ago",
    headline: "Metropolitan Multi-Family REIT Portfolio Update 🏢",
    content: "Our 2,400-unit transit-oriented residential portfolio maintains 96.8% physical occupancy with 7.2% dividend yields. Real assets provide durable quarterly cash flows that hedge monetary inflation.",
    tags: ["#RealEstate", "#PassiveYield", "#REITs", "#GoalVestVIP"],
    stat: "96.8% Tenancy",
    shareText: "2,400 transit units with 96.8% occupancy paying 7.2% dividend yields on GoalVest REITs: https://goalvest.dev 🏢"
  },
  {
    id: "sp-10",
    channel: "X / Threads",
    category: "Digital Assets",
    badge: "badge-amber",
    date: "8 hours ago",
    headline: "Cold-Vault Multisig & Proof-of-Solvency Standards 🔒",
    content: "GoalVest operates on 100% full-reserve architecture with institutional multisig custody. No unhedged rehypothecation, no hidden yield games. Your crypto, equities, and cash reserves are verifiably segregated 24/7.",
    tags: ["#CryptoSecurity", "#ColdStorage", "#ProofOfReserves", "#GoalVest"],
    stat: "100% Full Reserve",
    shareText: "100% full-reserve institutional custody for multi-asset portfolios. Experience institutional safety: https://goalvest.dev 🔒"
  },
  {
    id: "sp-11",
    channel: "Instagram / X",
    category: "Frontier Hardware",
    badge: "badge-blue",
    date: "10 hours ago",
    headline: "Tesla Optimus Gen 3 & Autonomous Warehousing 🦾",
    content: "Humanoid robotics are transitioning from laboratory prototypes to pilot assembly lines. Our Marketplace lets premium tier members allocate reservation deposits toward next-generation automated hardware.",
    tags: ["#Optimus", "#TeslaRobotics", "#Automation", "#Marketplace"],
    stat: "Gen 3 Hand Dexterity",
    shareText: "Tesla Optimus robotics reservations and clean hardware allocations live on GoalVest Marketplace: https://goalvest.dev 🦾"
  },
  {
    id: "sp-12",
    channel: "Telegram Support / All Channels",
    category: "Platform Update",
    badge: "badge-green",
    date: "12 hours ago",
    headline: "PWA Offline Mode & Fast Native Mobile Store Builds 📱",
    content: "GoalVest is officially certified for Apple iOS App Store Universal Links and Google Play Store TWA manifests. Add GoalVest to your mobile home screen with instant offline caching and zero install friction.",
    tags: ["#AppStore", "#GooglePlay", "#PWA", "#GoalVestMobile"],
    stat: "60 FPS Native",
    shareText: "Install GoalVest on iOS & Android with offline-first PWA caching and zero friction: https://goalvest.dev 📱"
  }
];

// Global Singletons
window.gvStore = new DataStore();
window.gvPricing = new PricingEngine();
window.gvSocialPosts = SOCIAL_POSTS_DB;
