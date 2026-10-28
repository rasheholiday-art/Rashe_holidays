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
  // Proprietor's number, shown next to the main number (WhatsApp stays on the main one)
  phone2: "+91 91598 07168",
  phone2Href: "tel:+919159807168",
  owner: { name: "Omprakash Anand C N", role: "Proprietor", initials: "OA" },
  whatsapp: "919786963659",
  email: "rasheholiday@gmail.com",
  address: "Backside to eye foundation Southwick Ooty. 643001 Tamil Nādu India",
  // Same address as above, split for structured data. Keep both in sync.
  postalAddress: {
    streetAddress: "Backside to eye foundation Southwick",
    addressLocality: "Ooty",
    addressRegion: "Tamil Nadu",
    postalCode: "643001",
    addressCountry: "IN",
  },
  mapEmbed: "https://www.google.com/maps?q=The+Eye+Foundation+Southwick+Ooty+Tamil+Nadu&output=embed",
  hours: "Open 24 hours · 7 days a week",
};

export const whatsappUrl = (text = "Hi! I'd like to plan a trip with Rashe Holidays.") =>
  `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;

export type CategoryId = "4-seater" | "7-seater" | "9-seater" | "12-seater" | "16-seater";

export interface Vehicle {
  slug: string;
  name: string;
  shortName: string;
  category: CategoryId;
  categoryLabel: string;
  type: string;
  seats: number;
  luggage: "Compact" | "Medium" | "Large" | "Extra Large";
  available: boolean;
  tagline: string;
  description: string;
  features: string[];
  whyChoose: string[];
  suitableFor: string[];
  images: string[];
  featured?: boolean;
}

export const categories: {
  id: CategoryId;
  label: string;
  title: string;
  seats: number;
  blurb: string;
}[] = [
    {
      id: "4-seater",
      label: "4 Seater Sedan",
      title: "Sedan (4 Seater)",
      seats: 4,
      blurb:
        "Comfortable and nimble sedan, perfect for couples, solo travelers, small families, and airport transfers.",
    },
    {
      id: "7-seater",
      label: "7 Seater (Crysta / HyCross)",
      title: "7 Seater Premium MPV",
      seats: 7,
      blurb:
        "Supreme comfort and space with Toyota Innova Crysta & Innova HyCross for family vacations and long ghat journeys.",
    },
    {
      id: "9-seater",
      label: "9 Seater Tavera",
      title: "Tavera (9 Seater)",
      seats: 9,
      blurb:
        "The proven hill warrior with generous room for 9 passengers, high ground clearance, and luggage space.",
    },
    {
      id: "12-seater",
      label: "12 Seater Traveller",
      title: "Traveller (12 Seater)",
      seats: 12,
      blurb:
        "High-roof comfort with push-back seats and dedicated luggage carrier for extended group outings.",
    },
    {
      id: "16-seater",
      label: "16 Seater Urbania",
      title: "Urbania (16 Seater)",
      seats: 16,
      blurb:
        "Next-generation luxury group travel with panoramic windows, individual AC vents, and plush reclining seats.",
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
      "Easy to park at busy viewpoints and town centres",
      "Spotless, sanitized interiors on every trip",
      "Experienced local Nilgiris chauffeur",
      "Boot space for two large suitcases",
    ],
    suitableFor: ["Couples", "Small Families", "Airport Drops"],
    images: [sedanImg],
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
  },
  {
    slug: "tempo-traveller",
    name: "Traveller (12 Seater)",
    shortName: "Traveller",
    category: "12-seater",
    categoryLabel: "12 Seater Minibus",
    type: "12-Seater Group Van",
    seats: 12,
    luggage: "Extra Large",
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
    text: "Booked the 12-seater Traveller for our office retreat in Ooty. Punctual airport pickup at Coimbatore, smooth ride through the ghats, and total transparency.",
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
    q: "Do you offer airport pickups and drops?",
    a: "Yes. We run fixed pickup and drop routes between Ooty and Coimbatore, Bangalore, Cochin, Calicut and Trichy airports. Travelling to the city instead of the airport? Book it as a normal one-way or round trip.",
  },
  {
    q: "Do I need to pay in advance?",
    a: "No advance payment is needed to send a booking request. Our team first confirms the vehicle, driver and timings with you on call or WhatsApp.",
  },
  {
    q: "How will I receive booking confirmation?",
    a: "Once you submit a request, our travel desk calls or messages you on WhatsApp within 30 minutes to confirm vehicle availability, driver details, and your exact itinerary.",
  },
];

export const stats = [
  { value: "6,000+", target: 6000, suffix: "+", separator: ",", label: "Happy Customers" },
  { value: "12,000+", target: 12000, suffix: "+", separator: ",", label: "Successful Trips" },
  { value: "14+", target: 14, suffix: "+", separator: "", label: "Years Experience" },
  { value: "6", target: 6, suffix: "", separator: "", label: "Fleet Vehicles" },
];
