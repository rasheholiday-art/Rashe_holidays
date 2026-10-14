import sedanImg from "@/assets/vehicles/sedan.png";
import taveraImg from "@/assets/vehicles/tavera.png";
import crystaImg from "@/assets/vehicles/crysta.png";
import hycrossImg from "@/assets/vehicles/hycross.png";
import tempoImg from "@/assets/vehicles/tempo-traveller.png";
import urbaniaImg from "@/assets/vehicles/urbania.png";

import ootyImg from "@/assets/destinations/ooty.jpg";
import coonoorImg from "@/assets/destinations/coonoor.jpg";
import pykaraImg from "@/assets/destinations/pykara.jpg";
import mudumalaiImg from "@/assets/destinations/mudumalai.png";
import ootyCoonoorImg from "@/assets/destinations/ooty-coonoor.jpg";
import coimbatoreImg from "@/assets/destinations/coimbatore.png";
import bangaloreImg from "@/assets/destinations/bangalore.jpg";
import cochinImg from "@/assets/destinations/cochin.png";
import calicutImg from "@/assets/destinations/calicut.jpg";
import trichyImg from "@/assets/destinations/trichy.jpg";

export const company = {
  name: "Rashe Holidays",
  // Production origin — used for canonical URLs, Open Graph, sitemap and structured data.
  siteUrl: "https://rasheholidays.com",
  tagline: "Premium Travels & Transportation · Ooty",
  phone: "+91 97869 63659",
  phoneHref: "tel:+919786963659",
  emergency: "+91 97869 63659",
  emergencyHref: "tel:+919786963659",
  whatsapp: "919786963659",
  email: "rasheholiday@gmail.com",
  address: "12, Commercial Road, Near Charring Cross, Ooty, The Nilgiris, Tamil Nadu 643001",
  // Same address as above, split for structured data. Keep both in sync.
  postalAddress: {
    streetAddress: "12, Commercial Road, Near Charring Cross",
    addressLocality: "Ooty",
    addressRegion: "Tamil Nadu",
    postalCode: "643001",
    addressCountry: "IN",
  },
  mapEmbed: "https://www.google.com/maps?q=Charring+Cross,+Ooty,+Tamil+Nadu&output=embed",
  hours: "Open 24 hours · 7 days a week",
};

export const whatsappUrl = (text = "Hi! I'd like to plan a trip with Rashe Holidays.") =>
  `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;

export type CategoryId = "4-seater" | "7-seater" | "9-seater" | "12-seater" | "16-seater";

export interface Pricing {
  oneWayPerKm: number;
  roundTripPerKm: number;
  perDay: number;
  minKmPerDay: number;
  driverAllowance: number;
}

export interface Vehicle {
  slug: string;
  name: string;
  shortName: string;
  category: CategoryId;
  categoryLabel: string;
  type: string;
  seats: number;
  luggage: "Compact" | "Medium" | "Large" | "Extra Large";
  rating: number;
  reviews: number;
  available: boolean;
  tagline: string;
  description: string;
  features: string[];
  whyChoose: string[];
  suitableFor: string[];
  images: string[];
  pricing: Pricing;
  featured?: boolean;
}

export const categories: {
  id: CategoryId;
  label: string;
  title: string;
  seats: number;
  blurb: string;
  pricing: Pricing;
}[] = [
    {
      id: "4-seater",
      label: "4 Seater Sedan",
      title: "Sedan (4 Seater)",
      seats: 4,
      blurb:
        "Comfortable and nimble sedan, perfect for couples, solo travelers, small families, and airport transfers.",
      pricing: {
        oneWayPerKm: 14,
        roundTripPerKm: 12,
        perDay: 3000,
        minKmPerDay: 250,
        driverAllowance: 700,
      },
    },
    {
      id: "7-seater",
      label: "7 Seater (Crysta / HyCross)",
      title: "7 Seater Premium MPV",
      seats: 7,
      blurb:
        "Supreme comfort and space with Toyota Innova Crysta & Innova HyCross for family vacations and long ghat journeys.",
      pricing: {
        oneWayPerKm: 22,
        roundTripPerKm: 19,
        perDay: 5000,
        minKmPerDay: 250,
        driverAllowance: 1000,
      },
    },
    {
      id: "9-seater",
      label: "9 Seater Tavera",
      title: "Tavera (9 Seater)",
      seats: 9,
      blurb:
        "The proven hill warrior with generous room for 9 passengers, high ground clearance, and luggage space.",
      pricing: {
        oneWayPerKm: 24,
        roundTripPerKm: 20,
        perDay: 5000,
        minKmPerDay: 250,
        driverAllowance: 800,
      },
    },
    {
      id: "12-seater",
      label: "12 Seater Tempo Traveller",
      title: "Tempo Traveller (12 Seater)",
      seats: 12,
      blurb:
        "High-roof comfort with push-back seats and dedicated luggage carrier for extended group outings.",
      pricing: {
        oneWayPerKm: 32,
        roundTripPerKm: 27,
        perDay: 7000,
        minKmPerDay: 250,
        driverAllowance: 1000,
      },
    },
    {
      id: "16-seater",
      label: "16 Seater Urbania",
      title: "Urbania (16 Seater)",
      seats: 16,
      blurb:
        "Next-generation luxury group travel with panoramic windows, individual AC vents, and plush reclining seats.",
      pricing: {
        oneWayPerKm: 48,
        roundTripPerKm: 40,
        perDay: 10000,
        minKmPerDay: 250,
        driverAllowance: 1000,
      },
    },
  ];

export const categoryById = (id: CategoryId) =>
  categories.find((c) => c.id === id) ?? categories[0];

export const vehicles: Vehicle[] = [
  {
    slug: "sedan",
    name: "Sedan (4 Seater)",
    shortName: "Sedan",
    category: "4-seater",
    categoryLabel: "4 Seater Sedan",
    type: "4-Seater Sedan",
    seats: 4,
    luggage: "Medium",
    rating: 4.8,
    reviews: 324,
    available: true,
    featured: true,
    tagline: "Comfortable and nimble for scenic Nilgiri curves and airport runs",
    description:
      "Enjoy a smooth, effortless journey in our comfortable 4-seater sedans. Spotless interiors, prompt hill-certified chauffeur, and generous boot space for small family vacations and airport transfers.",
    features: [
      "Seating Capacity: 4 Passengers",
      "Air Conditioned Cabin",
      "Comfortable Legroom",
      "Boot Space for 2-3 Bags",
      "Ideal for Couples & Small Families",
      "Airport & Railway Transfers",
      "Smooth Ghat Road Ride",
    ],
    whyChoose: [
      "Agile and smooth on winding ghat curves",
      "Economical per-km and fixed package fares",
      "Spotless, sanitized interiors on every trip",
      "Experienced local Nilgiris chauffeur",
      "Boot space for two large suitcases",
    ],
    suitableFor: ["Couples", "Small Families", "Airport Drops"],
    images: [sedanImg],
    pricing: categoryById("4-seater").pricing,
  },
  {
    slug: "tavera",
    name: "Tavera (9 Seater)",
    shortName: "Tavera",
    category: "9-seater",
    categoryLabel: "9 Seater MPV",
    type: "9-Seater MPV",
    seats: 9,
    luggage: "Large",
    rating: 4.7,
    reviews: 218,
    available: true,
    featured: true,
    tagline: "The proven Nilgiri hill warrior for large families and tourist groups",
    description:
      "The Chevrolet Tavera remains the most trusted utility vehicle in the Western Ghats. Rugged suspension, roomy 9-seat capacity, and powerful torque for steep climbs across Ooty, Coonoor, and Mudumalai.",
    features: [
      "Seating Capacity: Up to 9 Passengers",
      "Powerful Hill-Climb Engine",
      "Dual AC Vents",
      "Generous Luggage & Roof Carrier",
      "Comfortable Family Seating",
      "Local Sightseeing Specialist",
      "High Ground Clearance",
    ],
    whyChoose: [
      "Handles steep ghat hairpins effortlessly",
      "Accommodates up to 9 adults comfortably",
      "Budget-friendly group travel per person",
      "High ground clearance for rugged terrain",
      "Room for luggage and personal belongings",
    ],
    suitableFor: ["Large Families", "Friends Groups", "Sightseeing"],
    images: [taveraImg],
    pricing: categoryById("9-seater").pricing,
  },
  {
    slug: "crysta",
    name: "Innova Crysta (7 Seater)",
    shortName: "Innova Crysta",
    category: "7-seater",
    categoryLabel: "7 Seater Premium",
    type: "7-Seater Premium MPV",
    seats: 7,
    luggage: "Large",
    rating: 4.9,
    reviews: 486,
    available: true,
    featured: true,
    tagline: "The undisputed king of comfortable long-distance highway & hill travel",
    description:
      "Travel in supreme comfort with the Toyota Innova Crysta. Renowned for plush captain seating, low NVH levels, and unmatched road stability across ghats and outstation highways.",
    features: [
      "Seating Capacity: 7 Passengers",
      "Captain Seats with Armrests",
      "Powerful Dual Air Conditioning",
      "Ample Luggage Bay",
      "Superior Highway & Hill Ride",
      "USB Charging Ports",
      "Unmatched Passenger Safety",
    ],
    whyChoose: [
      "Top safety rating with reliable braking",
      "Extraordinary comfort for seniors and kids",
      "Spacious boot for big luggage trolley bags",
      "Silent, refined cabin for peaceful travel",
      "Mastery of Nilgiri mountain ghats",
    ],
    suitableFor: ["Family Holidays", "Corporate Travel", "Airport Transfers"],
    images: [crystaImg],
    pricing: {
      oneWayPerKm: 22,
      roundTripPerKm: 19,
      perDay: 5000,
      minKmPerDay: 250,
      driverAllowance: 1000,
    },
  },
  {
    slug: "hycross",
    name: "Innova HyCross (7 Seater)",
    shortName: "Innova HyCross",
    category: "7-seater",
    categoryLabel: "7 Seater Hybrid",
    type: "7-Seater Luxury Hybrid",
    seats: 7,
    luggage: "Large",
    rating: 4.9,
    reviews: 312,
    available: true,
    featured: true,
    tagline: "Next-gen hybrid luxury with ultra-quiet gliding ride quality",
    description:
      "Experience modern luxury in the Toyota Innova HyCross. Ultra-quiet electric hybrid propulsion, panoramic glass ambiance, and executive lounge comfort across the Nilgiris.",
    features: [
      "Seating Capacity: 7 Passengers",
      "Ultra-Quiet Hybrid Powertrain",
      "Lounge-Style Reclining Seats",
      "Independent Climate Control",
      "Ambient Cabin Lighting",
      "Large Boot & Modern Tech",
      "Silky Smooth Acceleration",
    ],
    whyChoose: [
      "Whisper-quiet electric drive on ghats",
      "Top-tier executive comfort and styling",
      "Smooth ride with minimal body roll",
      "State-of-the-art safety & convenience",
      "Spacious legroom across all three rows",
    ],
    suitableFor: ["Luxury Tours", "VIP Transfers", "Executive Travel"],
    images: [hycrossImg],
    pricing: {
      oneWayPerKm: 24,
      roundTripPerKm: 20,
      perDay: 5500,
      minKmPerDay: 250,
      driverAllowance: 1000,
    },
  },
  {
    slug: "tempo-traveller",
    name: "Tempo Traveller (12 Seater)",
    shortName: "Tempo Traveller",
    category: "12-seater",
    categoryLabel: "12 Seater Minibus",
    type: "12-Seater Group Van",
    seats: 12,
    luggage: "Extra Large",
    rating: 4.8,
    reviews: 245,
    available: true,
    featured: true,
    tagline: "Travel together without convoys — spacious 12-seater pushback coach",
    description:
      "Tailored for joint family vacations, corporate offsites, and tourist teams. Wide aisle, pushback seats, and dedicated high-capacity AC keep everyone comfortable and together.",
    features: [
      "Seating Capacity: 12 Passengers",
      "Pushback Reclining Seats",
      "Individual AC Vents & Reading Lights",
      "Dedicated High-Capacity Luggage Bay",
      "High Ceiling with Easy Walk-In",
      "Music System & Mic Available",
      "Experienced Hill Coach Driver",
    ],
    whyChoose: [
      "Keep entire group together in one vehicle",
      "Generous legroom for long interstate tours",
      "Roof rack + rear luggage storage",
      "Professional hill-coach certified driver",
      "Economical per-seat travel",
    ],
    suitableFor: ["Family Reunions", "Corporate Groups", "Pilgrimage Tours"],
    images: [tempoImg],
    pricing: categoryById("12-seater").pricing,
  },
  {
    slug: "urbania",
    name: "Urbania (16 Seater)",
    shortName: "Urbania",
    category: "16-seater",
    categoryLabel: "16 Seater Luxury Van",
    type: "16-Seater Luxury Van",
    seats: 16,
    luggage: "Extra Large",
    rating: 4.9,
    reviews: 189,
    available: true,
    featured: true,
    tagline: "State-of-the-art European comfort with panoramic views for 16 passengers",
    description:
      "The pinnacle of modern group transportation. The Force Urbania combines world-class styling, independent front suspension, aerodynamic design, and opulent luxury for 16 passengers.",
    features: [
      "Seating Capacity: 16 Passengers",
      "Executive Luxury Reclining Seats",
      "Panoramic UV Cut Windows",
      "Independent Soft-Ride Suspension",
      "Tri-Zone Powerful AC System",
      "Huge Luggage Bay",
      "European Monocoque Safety",
    ],
    whyChoose: [
      "Unmatched European styling and ride quality",
      "Supremely quiet and vibration-free ride",
      "Breathtaking mountain views through panoramic glass",
      "The premier choice for VIP groups & destination weddings",
      "Individual USB ports and LED reading lamps",
    ],
    suitableFor: ["VIP Delegations", "Wedding Groups", "Premium Tours"],
    images: [urbaniaImg],
    pricing: categoryById("16-seater").pricing,
  },
];

export const vehicleBySlug = (slug: string) => vehicles.find((v) => v.slug === slug);
export const vehiclesByCategory = (id: CategoryId) => vehicles.filter((v) => v.category === id);

export interface Destination {
  slug: string;
  name: string;
  type: "sightseeing" | "transfer";
  typeLabel: "Sightseeing" | "Airport / Railway Transfer";
  startPlace: string;
  image: string;
  kmFromOoty: number;
  hours: string;
  blurb: string;
  highlights: string[];
  fixedPrices: Record<string, number>;
}

export const destinations: Destination[] = [
  // SIGHTSEEING
  {
    slug: "ooty",
    name: "Ooty",
    type: "sightseeing",
    typeLabel: "Sightseeing",
    startPlace: "Ooty",
    image: ootyImg,
    kmFromOoty: 0,
    hours: "Full Day",
    blurb:
      "Botanical Gardens, Doddabetta Peak, Rose Garden, Tea Museum, and Ooty Boat House lake — explore the Queen of Hills.",
    highlights: [
      "Government Botanical Garden",
      "Doddabetta Peak Viewpoint",
      "Ooty Boat House & Lake",
      "Tea Factory & Museum",
      "Government Rose Garden",
    ],
    fixedPrices: {
      sedan: 2000,
      tavera: 2500,
      crysta: 4000,
      hycross: 5000,
      "tempo-traveller": 4000,
      urbania: 7000,
    },
  },
  {
    slug: "coonoor",
    name: "Coonoor",
    type: "sightseeing",
    typeLabel: "Sightseeing",
    startPlace: "Ooty",
    image: coonoorImg,
    kmFromOoty: 19,
    hours: "Full Day",
    blurb:
      "Sim's Park, Lamb's Rock, Dolphin's Nose, tea gardens, and picturesque Nilgiri Mountain Railway views.",
    highlights: [
      "Sim's Park & Botanical Trees",
      "Lamb's Rock Coimbatore Plains View",
      "Dolphin's Nose & Catherine Falls View",
      "Highfield Tea Factory Walk",
      "Toy Train Heritage Stations",
    ],
    fixedPrices: {
      sedan: 2500,
      tavera: 3000,
      crysta: 4500,
      hycross: 5500,
      "tempo-traveller": 5000,
      urbania: 8500,
    },
  },
  {
    slug: "pykara",
    name: "Pykara",
    type: "sightseeing",
    typeLabel: "Sightseeing",
    startPlace: "Ooty",
    image: pykaraImg,
    kmFromOoty: 23,
    hours: "Half / Full Day",
    blurb:
      "Pykara Lake boating, majestic Pykara Waterfalls, Pine Forest, and the picturesque 9th Mile shooting meadows.",
    highlights: [
      "Pykara Lake Boating",
      "Pykara Cascading Waterfalls",
      "Wenlock Downs (9th Mile)",
      "Dense Pine Forest Strolls",
      "Kamraj Sagar Dam Catchment",
    ],
    fixedPrices: {
      sedan: 2500,
      tavera: 3000,
      crysta: 4500,
      hycross: 5500,
      "tempo-traveller": 5000,
      urbania: 8500,
    },
  },
  {
    slug: "mudumalai",
    name: "Pykara & Mudumalai",
    type: "sightseeing",
    typeLabel: "Sightseeing",
    startPlace: "Ooty",
    image: mudumalaiImg,
    kmFromOoty: 40,
    hours: "Full Day",
    blurb:
      "Mudumalai National Park & Tiger Reserve safari, Theppakadu Elephant Camp, and Kalhatty 36 Hairpin Ghat descent.",
    highlights: [
      "Tiger Reserve Forest Safari",
      "Theppakadu Asian Elephant Camp",
      "Kalhatty 36 Hairpin Bends",
      "Moyar River & Forest Canopy",
      "Spotted Deer, Gaur & Wild Elephant Spotting",
    ],
    fixedPrices: {
      sedan: 3500,
      tavera: 4500,
      crysta: 6000,
      hycross: 7000,
      "tempo-traveller": 7500,
      urbania: 10000,
    },
  },
  {
    slug: "ooty-coonoor",
    name: "Ooty & Coonoor",
    type: "sightseeing",
    typeLabel: "Sightseeing",
    startPlace: "Ooty",
    image: ootyCoonoorImg,
    kmFromOoty: 35,
    hours: "Combined Full Day",
    blurb:
      "The ultimate Nilgiri combo tour covering key Ooty highlights in the morning and Coonoor viewpoints in the afternoon.",
    highlights: [
      "Doddabetta Peak & Telescope House",
      "Ooty Botanical Gardens",
      "Sim's Park & Tea Plantations",
      "Dolphin's Nose Viewpoint",
      "Nilgiri Essential Oils & Homemade Chocolates",
    ],
    fixedPrices: {
      sedan: 3000,
      tavera: 4500,
      crysta: 5000,
      hycross: 6000,
      "tempo-traveller": 7500,
      urbania: 9500,
    },
  },

  // AIRPORT OR RAILWAY TRANSFERS
  {
    slug: "coimbatore-airport",
    name: "Coimbatore Airport",
    type: "transfer",
    typeLabel: "Airport / Railway Transfer",
    startPlace: "Ooty",
    image: coimbatoreImg,
    kmFromOoty: 96,
    hours: "2.5 – 3 hrs",
    blurb:
      "Direct highway and scenic Mettupalayam ghat transfer between Ooty and Coimbatore International Airport (CJB).",
    highlights: [
      "Scenic Mettupalayam Ghat Descent",
      "Punctual Flight-Scheduled Pickup",
      "Real-Time Flight Delay Monitoring",
      "Luggage Assistance & Chilled Water",
    ],
    fixedPrices: {
      sedan: 3000,
      tavera: 4500,
      crysta: 6500,
      hycross: 7000,
      "tempo-traveller": 8000,
      urbania: 14000,
    },
  },
  {
    slug: "bangalore-airport",
    name: "Bangalore Airport",
    type: "transfer",
    typeLabel: "Airport / Railway Transfer",
    startPlace: "Ooty",
    image: bangaloreImg,
    kmFromOoty: 310,
    hours: "6.5 – 7.5 hrs",
    blurb:
      "Interstate direct transit between Ooty and Kempegowda International Airport (BLR) via Mysore expressway.",
    highlights: [
      "Smooth Bangalore-Mysore Expressway",
      "Bandipur Forest Corridor Crossing",
      "Doorstep Terminal Pickup & Drop",
      "Comfortable Highway Rest Stops",
    ],
    fixedPrices: {
      sedan: 10000,
      tavera: 15000,
      crysta: 17000,
      hycross: 18000,
      "tempo-traveller": 24000,
      urbania: 35000,
    },
  },
  {
    slug: "cochin-airport",
    name: "Cochin Airport",
    type: "transfer",
    typeLabel: "Airport / Railway Transfer",
    startPlace: "Ooty",
    image: cochinImg,
    kmFromOoty: 250,
    hours: "6 – 6.5 hrs",
    blurb:
      "Comfortable transit connecting Ooty and Cochin International Airport (COK) via Palakkad and Thrissur.",
    highlights: [
      "Scenic Kerala Foothills",
      "Palakkad Gap Highway Crossing",
      "24/7 Timed Airport Drop",
      "Professional Interstate Chauffeur",
    ],
    fixedPrices: {
      sedan: 9500,
      tavera: 13000,
      crysta: 13000,
      hycross: 15000,
      "tempo-traveller": 22000,
      urbania: 20000,
    },
  },
  {
    slug: "calicut-airport",
    name: "Calicut Airport",
    type: "transfer",
    typeLabel: "Airport / Railway Transfer",
    startPlace: "Ooty",
    image: calicutImg,
    kmFromOoty: 155,
    hours: "4 – 4.5 hrs",
    blurb:
      "Swift ghat and teak-corridor drop connecting Ooty with Calicut / Kozhikode Airport (CCJ) via Nilambur.",
    highlights: [
      "Teak Plantation Scenic Corridor",
      "Nadugani Ghat Route",
      "Punctual Morning & Night Flights",
      "Door-to-Terminal Drop",
    ],
    fixedPrices: {
      sedan: 5500,
      tavera: 8000,
      crysta: 9000,
      hycross: 10000,
      "tempo-traveller": 12000,
      urbania: 16000,
    },
  },
  {
    slug: "trichy-airport",
    name: "Trichy Airport",
    type: "transfer",
    typeLabel: "Airport / Railway Transfer",
    startPlace: "Ooty",
    image: trichyImg,
    kmFromOoty: 290,
    hours: "6 – 6.5 hrs",
    blurb:
      "Comfortable outstation transfer to Tiruchirappalli International Airport (TRZ) via Karur and Kangeyam.",
    highlights: [
      "Smooth Central Tamil Nadu Highway",
      "Reliable Flight Punctuality",
      "Door-to-Terminal Service",
      "Driver Allowance Included",
    ],
    fixedPrices: {
      sedan: 9500,
      tavera: 13000,
      crysta: 13000,
      hycross: 15000,
      "tempo-traveller": 22000,
      urbania: 20000,
    },
  },
];

export const destinationBySlug = (slug: string) => destinations.find((d) => d.slug === slug);

export const popularLocations = [
  "Ooty",
  "Coonoor",
  "Pykara",
  "Mudumalai",
  "Ooty & Coonoor",
  "Coimbatore Airport",
  "Bangalore Airport",
  "Cochin Airport",
  "Calicut Airport",
  "Trichy Airport",
  "Coimbatore",
  "Mysore",
  "Bangalore",
  "Wayanad",
  "Coorg",
  "Munnar",
  "Kodaikanal",
  "Kotagiri",
  "Mettupalayam",
];

export const locations = [
  // Primary Sightseeing & Hubs
  "Ooty",
  "Coonoor",
  "Pykara",
  "Mudumalai",
  "Ooty & Coonoor",
  "Coimbatore Airport",
  "Bangalore Airport",
  "Cochin Airport",
  "Calicut Airport",
  "Trichy Airport",

  // Nilgiris Towns & Sightseeing
  "Kotagiri",
  "Mettupalayam",
  "Pykara Lake",
  "Pykara Waterfalls",
  "Avalanche Lake",
  "Emerald Lake",
  "Doddabetta Peak",
  "Mudumalai Tiger Reserve",
  "Bandipur Safari Gate",
  "Gudalur",
  "Glenmorgan",
  "Lovedale",
  "Wellington",
  "Kalhatty Falls",
  "Needle Rock Viewpoint",
  "Kodanad Viewpoint",

  // Transit Hubs & Cities
  "Coimbatore",
  "Mysore",
  "Bangalore",
  "Calicut",
  "Kochi",
  "Chennai",
  "Trichy",
  "Madurai",
  "Salem",
  "Erode",
  "Tiruppur",
  "Wayanad",
  "Coorg",
  "Munnar",
  "Kodaikanal",
];

export const distanceFromOoty: Record<string, number> = {
  // Sightseeing & Local
  Ooty: 0,
  Coonoor: 19,
  Pykara: 23,
  "Pykara Lake": 21,
  "Pykara Waterfalls": 23,
  Mudumalai: 40,
  "Mudumalai Tiger Reserve": 40,
  "Ooty & Coonoor": 35,
  "Doddabetta Peak": 10,
  "Kalhatty Falls": 14,
  Lovedale: 6,
  Wellington: 16,
  "Emerald Lake": 20,
  "Avalanche Lake": 26,
  Glenmorgan: 28,
  Kotagiri: 30,
  "Kundah Dam": 32,
  "Needle Rock Viewpoint": 42,
  "Kodanad Viewpoint": 45,
  Gudalur: 50,
  Mettupalayam: 50,
  "Bandipur Safari Gate": 52,

  // Airports
  "Coimbatore Airport": 96,
  "Calicut Airport": 155,
  "Cochin Airport": 250,
  "Trichy Airport": 290,
  "Bangalore Airport": 310,

  // Cities
  Coimbatore: 86,
  Mysore: 125,
  Wayanad: 135,
  Calicut: 165,
  Coorg: 240,
  Munnar: 250,
  Bangalore: 275,
  Trichy: 290,
  Kochi: 280,
  Madurai: 315,
  Salem: 220,
  Erode: 155,
  Tiruppur: 135,
  Chennai: 550,
  Kodaikanal: 260,
};

export const locationCoordinates: Record<string, [number, number]> = {
  Ooty: [76.6953, 11.4102],
  Coonoor: [76.7959, 11.353],
  Pykara: [76.6025, 11.454],
  Mudumalai: [76.5744, 11.5833],
  "Ooty & Coonoor": [76.75, 11.38],
  "Coimbatore Airport": [77.0434, 11.03],
  "Bangalore Airport": [77.7066, 13.1986],
  "Cochin Airport": [76.4019, 10.1518],
  "Calicut Airport": [75.9553, 11.1369],
  "Trichy Airport": [78.7107, 10.7654],
  Coimbatore: [76.9558, 11.0168],
  Mysore: [76.6394, 12.2958],
  Bangalore: [77.5946, 12.9716],
  Chennai: [80.2707, 13.0827],
  Kochi: [76.2673, 9.9312],
  Kotagiri: [76.8667, 11.4333],
  Mettupalayam: [76.95, 11.3],
};

export function estimateDistance(from: string, to: string): number | null {
  const normFrom = from.trim();
  const normTo = to.trim();
  const a = distanceFromOoty[normFrom];
  const b = distanceFromOoty[normTo];
  if (a === undefined || b === undefined) return null;
  if (normFrom.toLowerCase() === normTo.toLowerCase()) return 80;
  if (normFrom.toLowerCase() === "ooty" || normTo.toLowerCase() === "ooty") return Math.max(a, b);
  return Math.abs(a - b) + 40;
}

export function estimateFare(opts: {
  category: CategoryId;
  vehicle?: string | undefined;
  tripType: "one-way" | "round-trip";
  from: string;
  to: string;
  days?: number | undefined;
  waitingDays?: number | undefined;
  customKm?: number | undefined;
}) {
  const vehicleObj = opts.vehicle ? vehicleBySlug(opts.vehicle) : undefined;
  const p = vehicleObj ? vehicleObj.pricing : categoryById(opts.category).pricing;
  const dist = opts.customKm ?? estimateDistance(opts.from, opts.to);
  if (dist === null) return null;

  const totalDays = Math.max(1, opts.days ?? 1);
  const waitingDays =
    opts.tripType === "round-trip" && totalDays > 2
      ? Math.min(Math.max(0, opts.waitingDays ?? 0), totalDays - 1)
      : 0;
  const travelDays = Math.max(1, totalDays - waitingDays);

  if (opts.tripType === "one-way") {
    const km = Math.max(dist, 100);
    return {
      km,
      low: km * p.oneWayPerKm,
      high: km * p.oneWayPerKm + p.driverAllowance,
      days: 1,
      waitingDays: 0,
      travelDays: 1,
      tollNote: "Tolls are not included and billed at actuals as they vary state to state",
    };
  }

  // Round trip calculation
  const km = Math.max(dist * 2, p.minKmPerDay * travelDays);
  // Fuel running cost for active travel days + daily driver allowance for entire tour (travel + waiting)
  const base = km * p.roundTripPerKm + p.driverAllowance * totalDays;

  return {
    km,
    low: base,
    high: Math.round(base * 1.15),
    days: totalDays,
    waitingDays,
    travelDays,
    tollNote: "Tolls are not included and billed at actuals as they vary state to state",
  };
}

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export const testimonials = [
  {
    name: "Priya Raghavan",
    location: "Chennai",
    rating: 5,
    text: "Our family trip from Ooty to Coonoor was extremely comfortable. The Crysta was immaculate, spacious, and the driver navigated the hairpin ghats with immense skill.",
    initials: "PR",
  },
  {
    name: "Arjun Menon",
    location: "Kochi",
    rating: 5,
    text: "Booked the 12-seater Tempo Traveller for our office retreat in Ooty. Punctual airport pickup at Coimbatore, smooth ride through the ghats, and total transparency.",
    initials: "AM",
  },
  {
    name: "Sarah Williams",
    location: "London",
    rating: 5,
    text: "We used Rashe Holidays for four days across Ooty, Pykara and Mudumalai. Honest pricing, courteous driver, and the car was always ready on time.",
    initials: "SW",
  },
  {
    name: "Karthik & Divya",
    location: "Bangalore",
    rating: 5,
    text: "Airport pickup at Coimbatore was punctual even at 5 am. The sedan was spotless, clean driving down the ghats, and prompt WhatsApp updates throughout.",
    initials: "KD",
  },
];

export const faqs = [
  {
    q: "What is the difference between One Way and Round Trip?",
    a: "A One Way trip drops you at your destination and the journey ends there — you pay for one direction only. A Round Trip takes you to your destination and brings you back to your pickup point, and can span multiple days with the vehicle staying with you.",
  },
  {
    q: "Are toll, parking, and permit charges included?",
    a: "No. Toll, parking, state permit and forest entry charges are NOT included in the base fare as they vary from state to state and checkpost to checkpost. These are billed at actuals during the journey.",
  },
  {
    q: "How are destinations other than the fixed packages calculated?",
    a: "For custom trips and destinations outside our fixed sightseeing and airport packages, fares are calculated on a transparent per-kilometre basis according to your chosen vehicle. One-way trips are billed on actual distance, while round trips and multi-day outstation tours are calculated on total running distance plus daily driver allowance. Tolls and state permits are billed at actuals.",
  },
  {
    q: "How will I receive booking confirmation?",
    a: "Once you submit a request, our travel desk calls or messages you on WhatsApp within 30 minutes to confirm vehicle availability, driver details, and your exact itinerary.",
  },
];

export const stats = [
  { value: "12,000+", target: 12000, suffix: "+", separator: ",", label: "Happy Customers" },
  { value: "25,000+", target: 25000, suffix: "+", separator: ",", label: "Successful Trips" },
  { value: "14+", target: 14, suffix: "+", separator: "", label: "Years Experience" },
  { value: "6", target: 6, suffix: "", separator: "", label: "Fleet Vehicles" },
];
