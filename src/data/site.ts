import hycross1 from "@/assets/vehicles/hycross-4.jpg";
import hycross2 from "@/assets/vehicles/hycross-2.jpg";
import hycross3 from "@/assets/vehicles/hycross-3.jpg";
import hycross4 from "@/assets/vehicles/hycross-1.jpg";
import traveller1 from "@/assets/vehicles/traveller-1.jpg";
import traveller2 from "@/assets/vehicles/traveller-2.jpg";
import traveller3 from "@/assets/vehicles/traveller-3.jpg";
import etios from "@/assets/vehicles/etios.jpg";
import dzire from "@/assets/vehicles/dzire.jpg";
import aura from "@/assets/vehicles/aura.jpg";
import amaze from "@/assets/vehicles/amaze.jpg";
import glanza from "@/assets/vehicles/glanza.jpg";

import ooty from "@/assets/destinations/ooty.jpg";
import mysore from "@/assets/destinations/mysore.jpg";
import coimbatore from "@/assets/destinations/coimbatore.jpg";
import bangalore from "@/assets/destinations/bangalore.jpg";
import chennai from "@/assets/destinations/chennai.jpg";
import kerala from "@/assets/destinations/kerala.jpg";
import coorg from "@/assets/destinations/coorg.jpg";

export const company = {
  name: "Rashe Holidays",
  tagline: "Premium Travels & Transportation · Ooty",
  phone: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
  emergency: "+91 98765 00000",
  emergencyHref: "tel:+919876500000",
  whatsapp: "919876543210",
  email: "hello@rasheholidays.in",
  address: "12, Commercial Road, Near Charring Cross, Ooty, The Nilgiris, Tamil Nadu 643001",
  mapEmbed: "https://www.google.com/maps?q=Charring+Cross,+Ooty,+Tamil+Nadu&output=embed",
  hours: "Open 24 hours · 7 days a week",
};

export const whatsappUrl = (text = "Hi! I'd like to plan a trip with Rashe Holidays.") =>
  `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;

export type CategoryId = "4-seater" | "8-seater" | "19-seater";

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
    label: "4 Seater Car",
    title: "Comfortable 4-Seater Cars",
    seats: 4,
    blurb:
      "Perfect for couples, solo travelers and small families. Ideal for airport transfers, local travel, business trips and outstation journeys.",
    pricing: {
      oneWayPerKm: 14,
      roundTripPerKm: 12,
      perDay: 2800,
      minKmPerDay: 250,
      driverAllowance: 400,
    },
  },
  {
    id: "8-seater",
    label: "8 Seater Innova HyCross",
    title: "Toyota Innova HyCross",
    seats: 8,
    blurb:
      "Premium comfort and space for families, tourists and small groups on comfortable long-distance journeys.",
    pricing: {
      oneWayPerKm: 20,
      roundTripPerKm: 17,
      perDay: 4500,
      minKmPerDay: 250,
      driverAllowance: 500,
    },
  },
  {
    id: "19-seater",
    label: "19 Seater Traveller / Van",
    title: "19 Seater Traveller / Van",
    seats: 19,
    blurb:
      "Designed for group journeys, family tours, corporate trips and tourist groups — travel together in one vehicle.",
    pricing: {
      oneWayPerKm: 32,
      roundTripPerKm: 28,
      perDay: 8500,
      minKmPerDay: 250,
      driverAllowance: 700,
    },
  },
];

export const categoryById = (id: CategoryId) => categories.find((c) => c.id === id)!;

const carFeatures = [
  "Seating Capacity: 4 Passengers",
  "Comfortable Interiors",
  "Air Conditioned",
  "Ideal for Small Families",
  "Airport Transfers",
  "Local & Outstation Trips",
  "Budget Friendly Travel",
];

const carWhy = [
  "Easy on narrow hill roads and city traffic",
  "Efficient and budget friendly for long runs",
  "Clean, sanitised interiors on every trip",
  "Perfect for airport and railway station transfers",
  "Boot space for two large suitcases",
];

export const vehicles: Vehicle[] = [
  {
    slug: "toyota-innova-hycross",
    name: "Toyota Innova HyCross",
    shortName: "Innova HyCross",
    category: "8-seater",
    categoryLabel: "Premium MPV",
    type: "8-Seater Premium",
    seats: 8,
    luggage: "Large",
    rating: 4.9,
    reviews: 412,
    available: true,
    featured: true,
    tagline: "The premium 8-seater for families and long journeys",
    description:
      "Experience premium comfort and space with the Toyota Innova HyCross. Perfect for families, tourists and small groups looking for a comfortable long-distance journey.",
    features: [
      "Seating Capacity: Up to 8 Passengers",
      "Spacious Interiors",
      "Comfortable Long Distance Travel",
      "Powerful Air Conditioning",
      "Large Luggage Space",
      "Premium Seating",
      "Smooth Highway Performance",
    ],
    whyChoose: [
      "Comfortable captain-style seating",
      "Premium, quiet interiors",
      "Smooth hybrid ride on ghat roads",
      "Perfect for hill station travel",
      "Spacious luggage area",
    ],
    suitableFor: ["Family", "Tourism", "Business"],
    images: [hycross1, hycross2, hycross3, hycross4],
    pricing: categoryById("8-seater").pricing,
  },
  {
    slug: "19-seater-traveller",
    name: "19 Seater Traveller / Van",
    shortName: "19 Seater Traveller",
    category: "19-seater",
    categoryLabel: "Group Van",
    type: "19-Seater Group",
    seats: 19,
    luggage: "Extra Large",
    rating: 4.8,
    reviews: 236,
    available: true,
    featured: true,
    tagline: "One vehicle for the whole group",
    description:
      "Designed for group journeys, family tours, corporate trips and tourist groups. Enjoy comfortable and spacious travel together without worrying about multiple vehicles.",
    features: [
      "Seating Capacity: 19 Passengers",
      "Comfortable Group Travel",
      "Air Conditioned",
      "Spacious Seating",
      "Luggage Space",
      "Ideal for Tours",
      "Corporate & Family Trips",
    ],
    whyChoose: [
      "Pushback seats with generous legroom",
      "Powerful AC for the whole cabin",
      "Everyone travels together — no convoys",
      "Experienced hill-road drivers",
      "Roof carrier and rear luggage bay",
    ],
    suitableFor: ["Groups", "Corporate", "Tours"],
    images: [traveller1, traveller2, traveller3],
    pricing: categoryById("19-seater").pricing,
  },
  {
    slug: "toyota-etios",
    name: "Toyota Etios",
    shortName: "Etios",
    category: "4-seater",
    categoryLabel: "Sedan",
    type: "4-Seater Sedan",
    seats: 4,
    luggage: "Medium",
    rating: 4.7,
    reviews: 318,
    available: true,
    tagline: "The dependable outstation sedan",
    description:
      "A proven outstation favourite. The Toyota Etios offers a roomy cabin, a large boot and effortless comfort on long highway runs.",
    features: carFeatures,
    whyChoose: carWhy,
    suitableFor: ["Couples", "Business", "Airport"],
    images: [etios],
    pricing: categoryById("4-seater").pricing,
  },
  {
    slug: "maruti-suzuki-dzire",
    name: "Maruti Suzuki Dzire",
    shortName: "Dzire",
    category: "4-seater",
    categoryLabel: "Sedan",
    type: "4-Seater Sedan",
    seats: 4,
    luggage: "Medium",
    rating: 4.7,
    reviews: 289,
    available: true,
    tagline: "Efficient and comfortable for every trip",
    description:
      "India's most-loved compact sedan. The new Dzire brings a refined ride, excellent mileage and a comfortable rear seat for city and outstation trips.",
    features: carFeatures,
    whyChoose: carWhy,
    suitableFor: ["Couples", "Local", "Airport"],
    images: [dzire],
    pricing: categoryById("4-seater").pricing,
  },
  {
    slug: "hyundai-aura",
    name: "Hyundai Aura",
    shortName: "Aura",
    category: "4-seater",
    categoryLabel: "Sedan",
    type: "4-Seater Sedan",
    seats: 4,
    luggage: "Medium",
    rating: 4.6,
    reviews: 174,
    available: true,
    tagline: "Modern comfort with a quiet cabin",
    description:
      "The Hyundai Aura pairs a modern, feature-rich cabin with a smooth, quiet drive — ideal for business travellers and small families.",
    features: carFeatures,
    whyChoose: carWhy,
    suitableFor: ["Business", "Small Family", "Local"],
    images: [aura],
    pricing: categoryById("4-seater").pricing,
  },
  {
    slug: "honda-amaze",
    name: "Honda Amaze",
    shortName: "Amaze",
    category: "4-seater",
    categoryLabel: "Sedan",
    type: "4-Seater Sedan",
    seats: 4,
    luggage: "Medium",
    rating: 4.7,
    reviews: 201,
    available: false,
    tagline: "Refined ride, spacious rear seat",
    description:
      "The Honda Amaze offers a supple ride and one of the most spacious rear seats in its class — a comfortable choice for outstation journeys.",
    features: carFeatures,
    whyChoose: carWhy,
    suitableFor: ["Small Family", "Outstation", "Business"],
    images: [amaze],
    pricing: categoryById("4-seater").pricing,
  },
  {
    slug: "toyota-glanza",
    name: "Toyota Glanza",
    shortName: "Glanza",
    category: "4-seater",
    categoryLabel: "Hatchback",
    type: "4-Seater Hatchback",
    seats: 4,
    luggage: "Compact",
    rating: 4.6,
    reviews: 143,
    available: true,
    tagline: "Nimble and easy for local sightseeing",
    description:
      "A premium hatchback that's perfect for local Ooty sightseeing, short transfers and couples travelling light.",
    features: carFeatures,
    whyChoose: carWhy,
    suitableFor: ["Local", "Couples", "Sightseeing"],
    images: [glanza],
    pricing: categoryById("4-seater").pricing,
  },
];

export const vehicleBySlug = (slug: string) => vehicles.find((v) => v.slug === slug);
export const vehiclesByCategory = (id: CategoryId) => vehicles.filter((v) => v.category === id);

export interface Destination {
  slug: string;
  name: string;
  state: string;
  image: string;
  kmFromOoty: number;
  hours: string;
  blurb: string;
}

export const destinations: Destination[] = [
  {
    slug: "ooty",
    name: "Ooty",
    state: "Tamil Nadu",
    image: ooty,
    kmFromOoty: 0,
    hours: "Local",
    blurb: "Tea estates, Doddabetta and the toy train — explore the Queen of Hills.",
  },
  {
    slug: "mysore",
    name: "Mysore",
    state: "Karnataka",
    image: mysore,
    kmFromOoty: 125,
    hours: "3.5 hrs",
    blurb: "Palaces and gardens via Bandipur forest — the most loved day trip from Ooty.",
  },
  {
    slug: "coimbatore",
    name: "Coimbatore",
    state: "Tamil Nadu",
    image: coimbatore,
    kmFromOoty: 86,
    hours: "2.5 hrs",
    blurb: "Airport and railway transfers down the scenic Mettupalayam ghat.",
  },
  {
    slug: "bangalore",
    name: "Bangalore",
    state: "Karnataka",
    image: bangalore,
    kmFromOoty: 270,
    hours: "6.5 hrs",
    blurb: "Comfortable one-way and round trips to the Garden City.",
  },
  {
    slug: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    image: chennai,
    kmFromOoty: 555,
    hours: "10 hrs",
    blurb: "Long-distance comfort all the way to the Marina.",
  },
  {
    slug: "kerala",
    name: "Kerala",
    state: "Kerala",
    image: kerala,
    kmFromOoty: 250,
    hours: "6 hrs",
    blurb: "Backwaters, Munnar and Wayanad — multi-day tours across God's Own Country.",
  },
  {
    slug: "coorg",
    name: "Coorg",
    state: "Karnataka",
    image: coorg,
    kmFromOoty: 240,
    hours: "6 hrs",
    blurb: "Coffee estates and misty hills, perfect as a round trip.",
  },
];

export const popularLocations = [
  "Ooty",
  "Coonoor",
  "Kotagiri",
  "Mettupalayam",
  "Coimbatore",
  "Coimbatore Airport",
  "Mysore",
  "Bangalore",
  "Bangalore Airport",
  "Wayanad",
  "Coorg",
  "Munnar",
  "Kodaikanal",
  "Kochi",
  "Chennai",
  "Madurai",
  "Salem",
  "Tiruppur",
];

export const locations = [
  // Primary Hubs
  "Ooty",
  "Coonoor",
  "Kotagiri",
  "Mettupalayam",
  "Coimbatore",
  "Coimbatore Airport",
  "Mysore",
  "Bangalore",
  "Bangalore Airport",

  // Nilgiris Sightseeing & Towns
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
  "Upper Bhavani",
  "Kundah Dam",

  // Kerala
  "Wayanad",
  "Sulthan Bathery",
  "Kalpetta",
  "Vythiri",
  "Calicut",
  "Calicut Airport",
  "Palakkad",
  "Thrissur",
  "Munnar",
  "Kochi",
  "Cochin Airport",
  "Alappuzha (Alleppey)",
  "Kannur",
  "Trivandrum",

  // Tamil Nadu
  "Pollachi",
  "Tiruppur",
  "Erode",
  "Salem",
  "Palani",
  "Dindigul",
  "Kodaikanal",
  "Trichy",
  "Madurai",
  "Thanjavur",
  "Pondicherry",
  "Rameswaram",
  "Kanyakumari",
  "Chennai",

  // Karnataka
  "Kabini / Nagarhole",
  "Kushalnagar",
  "Coorg",
  "Coorg (Madikeri)",
  "Hassan",
  "Chikmagalur",
  "Mangalore",
  "Udupi",
];

/** Road distances from Ooty (km) based on official highway & Nilgiris cab benchmarks. */
export const distanceFromOoty: Record<string, number> = {
  // Nilgiris & Local Sightseeing
  Ooty: 0,
  "Doddabetta Peak": 10,
  "Kalhatty Falls": 14,
  Lovedale: 6,
  Wellington: 16,
  Coonoor: 19,
  "Emerald Lake": 20,
  "Pykara Lake": 21,
  "Pykara Waterfalls": 23,
  "Avalanche Lake": 26,
  Glenmorgan: 28,
  Kotagiri: 30,
  "Kundah Dam": 32,
  "Mudumalai Tiger Reserve": 40,
  "Needle Rock Viewpoint": 42,
  "Kodanad Viewpoint": 45,
  Gudalur: 50,
  Mettupalayam: 50,
  "Upper Bhavani": 50,
  "Bandipur Safari Gate": 52,

  // Transit Hubs & Airports
  Coimbatore: 86,
  "Coimbatore Airport": 96,
  "Mysore Airport": 115,
  "Calicut Airport": 155,
  "Cochin Airport": 250,
  "Bangalore Airport": 310,

  // Karnataka
  Mysore: 125,
  "Kabini / Nagarhole": 145,
  Kushalnagar: 205,
  Coorg: 240,
  "Coorg (Madikeri)": 240,
  Hassan: 240,
  Bangalore: 275,
  Chikmagalur: 295,
  Mangalore: 370,
  Udupi: 410,

  // Kerala
  "Sulthan Bathery": 115,
  Wayanad: 135,
  Kalpetta: 135,
  "Kalpetta (Wayanad)": 135,
  Palakkad: 135,
  Vythiri: 145,
  Calicut: 165,
  Thrissur: 205,
  Munnar: 250,
  Kochi: 280,
  "Alappuzha (Alleppey)": 330,
  Kannur: 220,
  Trivandrum: 480,

  // Tamil Nadu
  Pollachi: 130,
  Tiruppur: 135,
  Erode: 155,
  Palani: 195,
  Salem: 220,
  Dindigul: 240,
  Kodaikanal: 260,
  Trichy: 290,
  Madurai: 315,
  Thanjavur: 335,
  Kanyakumari: 545,
  Chennai: 550,
  Pondicherry: 490,
  Rameswaram: 485,
};

export const locationCoordinates: Record<string, [number, number]> = {
  Ooty: [76.6953, 11.4102],
  Coonoor: [76.7959, 11.353],
  Kotagiri: [76.8667, 11.4333],
  Mettupalayam: [76.95, 11.3],
  Coimbatore: [76.9558, 11.0168],
  "Coimbatore Airport": [77.0434, 11.03],
  Mysore: [76.6394, 12.2958],
  Bangalore: [77.5946, 12.9716],
  "Bangalore Airport": [77.7066, 13.1986],
  Chennai: [80.2707, 13.0827],
  Kochi: [76.2673, 9.9312],
  Munnar: [77.0595, 10.0889],
  Wayanad: [76.132, 11.6854],
  Coorg: [75.7382, 12.4244],
  Kodaikanal: [77.4892, 10.2381],
  Madurai: [78.1198, 9.9252],
  Salem: [78.146, 11.6643],
  Erode: [77.7172, 11.341],
  Tiruppur: [77.3411, 11.1085],
  Gudalur: [76.495, 11.505],
  "Pykara Lake": [76.6025, 11.454],
  "Avalanche Lake": [76.5925, 11.298],
  "Mudumalai Tiger Reserve": [76.5744, 11.5833],
  "Bandipur Safari Gate": [76.6265, 11.6664],
  Calicut: [75.7804, 11.2588],
  Palakkad: [76.6548, 10.7867],
  Thrissur: [76.2144, 10.5276],
  Pollachi: [77.0089, 10.658],
};

export function estimateDistance(from: string, to: string): number | null {
  const normFrom = from.trim();
  const normTo = to.trim();
  const a = distanceFromOoty[normFrom];
  const b = distanceFromOoty[normTo];
  if (a === undefined || b === undefined) return null;
  if (normFrom.toLowerCase() === normTo.toLowerCase()) return 80; // local sightseeing package
  if (normFrom.toLowerCase() === "ooty" || normTo.toLowerCase() === "ooty") return Math.max(a, b);
  return Math.abs(a - b) + 40; // both non-Ooty: rough triangulation
}

export function estimateFare(opts: {
  category: CategoryId;
  tripType: "one-way" | "round-trip";
  from: string;
  to: string;
  days?: number | undefined;
  customKm?: number | undefined;
}) {
  const p = categoryById(opts.category).pricing;
  const dist = opts.customKm ?? estimateDistance(opts.from, opts.to);
  if (dist === null) return null;
  const days = Math.max(1, opts.days ?? 1);
  if (opts.tripType === "one-way") {
    const km = Math.max(dist, 100);
    return { km, low: km * p.oneWayPerKm, high: km * p.oneWayPerKm + p.driverAllowance, days: 1 };
  }
  const km = Math.max(dist * 2, p.minKmPerDay * days);
  const base = km * p.roundTripPerKm + p.driverAllowance * days;
  return { km, low: base, high: Math.round(base * 1.15), days };
}

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export const testimonials = [
  {
    name: "Priya Raghavan",
    location: "Chennai",
    rating: 5,
    text: "Our family trip from Ooty to Mysore was extremely comfortable. The Innova was clean, spacious and the driver was very professional.",
    initials: "PR",
  },
  {
    name: "Arjun Menon",
    location: "Kochi",
    rating: 5,
    text: "Booked the 19-seater for our office outing. Punctual pickup, smooth ride through the ghats and the team handled every change of plan calmly.",
    initials: "AM",
  },
  {
    name: "Sarah Williams",
    location: "London",
    rating: 5,
    text: "We used Rashe Holidays for four days across Ooty, Coonoor and Coorg. Transparent pricing, no surprises, and the driver knew every viewpoint.",

    initials: "SW",
  },
  {
    name: "Karthik & Divya",
    location: "Bangalore",
    rating: 5,
    text: "Airport pickup at Coimbatore was on time even at 5 am. The Dzire was spotless and the WhatsApp updates were really reassuring.",
    initials: "KD",
  },
];

export const faqs = [
  {
    q: "What is the difference between One Way and Round Trip?",
    a: "A One Way trip drops you at your destination and the journey ends there — you pay for one direction only. A Round Trip takes you to your destination and brings you back to your pickup point, and can span multiple days with the vehicle staying with you.",
  },
  {
    q: "How is the trip price calculated?",
    a: "Prices are based on the vehicle category and total kilometres travelled, with a per-km rate for One Way and Round Trips and a per-day rate for Day Rentals (minimum 250 km/day). Driver allowance is added per day for multi-day trips.",
  },
  {
    q: "Can I book a vehicle for multiple days?",
    a: "Yes. Choose Round Trip and enter the number of days. The vehicle and driver stay with you for the full duration, ideal for touring Ooty, Coorg, Kerala and beyond.",
  },
  {
    q: "Are toll and parking charges included?",
    a: "Toll, parking, state permit and forest entry charges are billed at actuals and are not included in the base fare. We share an itemised estimate before your trip.",
  },
  {
    q: "Can I choose a specific vehicle?",
    a: "Absolutely. Select a preferred vehicle in the booking form — for example the Innova HyCross or a specific sedan — and we'll confirm availability for your dates.",
  },
  {
    q: "How many passengers can travel in each vehicle?",
    a: "Our 4-seater cars carry 4 passengers, the Toyota Innova HyCross carries up to 8, and the Traveller / Van carries 19 passengers with luggage.",
  },
  {
    q: "Can I book for sightseeing trips?",
    a: "Yes — local Ooty and Coonoor sightseeing packages, as well as multi-destination tours, are available. Mention your sightseeing plans in the special requirements field.",
  },
  {
    q: "How will I receive booking confirmation?",
    a: "Once you submit a request, our travel team calls or messages you on WhatsApp within 30 minutes to confirm availability, driver details and the final price.",
  },
];

export const stats = [
  { value: "12,000+", target: 12000, suffix: "+", separator: ",", label: "Happy Customers" },
  { value: "25,000+", target: 25000, suffix: "+", separator: ",", label: "Successful Trips" },
  { value: "14+", target: 14, suffix: "+", separator: "", label: "Years Experience" },
  { value: "3", target: 3, suffix: "", separator: "", label: "Vehicle Categories" },
];
