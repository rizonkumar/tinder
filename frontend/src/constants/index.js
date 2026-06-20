import { Coffee, Utensils, Martini, Film, Footprints, Calendar } from "lucide-react";

export const INTEREST_OPTIONS = [
  "Travel",
  "Music",
  "Movies",
  "Food",
  "Fitness",
  "Gaming",
  "Coding",
  "Reading",
  "Yoga",
  "Photography",
  "Cooking",
  "Pets",
  "Bollywood",
  "Cricket",
  "Art",
  "Sports",
];

export const MOCK_LIKES = [
  {
    _id: "mock1",
    name: "Aadhya",
    age: 24,
    bio: "Tea enthusiast | Coding & coffee geek | Explorer",
    image: "/female/1.jpg",
    interests: ["Coding", "Travel", "Music"],
  },
  {
    _id: "mock2",
    name: "Saanvi",
    age: 22,
    bio: "Art curator • Weekend explorer • Dog lover",
    image: "/female/2.jpg",
    interests: ["Art", "Reading", "Yoga"],
  },
  {
    _id: "mock3",
    name: "Reyansh",
    age: 27,
    bio: "Fitness geek and food lover. Let's explore street food!",
    image: "/male/1.jpg",
    interests: ["Fitness", "Food", "Cricket"],
  },
];

// `surface` is a solid Geist surface class (no gradients). Consumers apply it
// directly instead of wrapping with `bg-gradient-to-*`.
export const EXPLORE_CATEGORIES = [
  {
    id: "Gaming",
    name: "Gamers",
    iconName: "Gamepad2",
    surface: "bg-gray-100 text-foreground",
  },
  {
    id: "Travel",
    name: "Travelers",
    iconName: "Plane",
    surface: "bg-gray-100 text-foreground",
  },
  {
    id: "Food",
    name: "Foodies",
    iconName: "Utensils",
    surface: "bg-gray-100 text-foreground",
  },
  {
    id: "Coding",
    name: "Coders",
    iconName: "Code2",
    surface: "bg-gray-100 text-foreground",
  },
  {
    id: "Music",
    name: "Music Lovers",
    iconName: "Music",
    surface: "bg-gray-100 text-foreground",
  },
  {
    id: "Fitness",
    name: "Fitness",
    iconName: "Dumbbell",
    surface: "bg-gray-100 text-foreground",
  },
  {
    id: "Reading",
    name: "Readers",
    iconName: "BookOpen",
    surface: "bg-gray-100 text-foreground",
  },
  {
    id: "Art",
    name: "Artists",
    iconName: "Palette",
    surface: "bg-gray-100 text-foreground",
  },
];

export const fallbackGifs = [
  { id: "1", title: "Love Bear", url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3N2c2t3N3UycDNwdDJ2N29oOTl0Mnl5aTRjcmhrdDQ2ZnE0MGY0NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/du3J3cXyzhj75IOgvA/giphy.gif" },
  { id: "2", title: "Cute Wave", url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpqZDR5OHg2aDZndHFpMXZ2cXR0NDl4cnZ5cjI1M2R4M294MXpxNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/VuoqO5g159T93G140C/giphy.gif" },
  { id: "3", title: "Cat Hug", url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmVwdThnaDB6cG51NWxnaGR5OHoycGJ5aG05OXN2bDVpYTQ2NXJ0ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/CKe3B7Bvx1sS4/giphy.gif" },
  { id: "4", title: "Wink Dog", url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJydHJid3N2czBpc3hrY2VyeDRkYWtucnpsMGNod2F6bnF1ZjZpbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/13CoXDiaCcC2EA/giphy.gif" },
  { id: "5", title: "Excited Dance", url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTZoZnQycXZ2OHY3cjQ0OXh2cjE5eWNjajZ6ZnpxOGdndXRtcHhqZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/blSTtZehjAZ8I/giphy.gif" },
  { id: "6", title: "Heart Pop", url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWp3ZnRnbXpxNm9nd2Jyd2NtdHA2cXR2ZzJ5djE5MTRxMXAxdGpxZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l41JWd1xzcx437nmw/giphy.gif" }
];

// `surface` is a solid Geist surface class (no gradients). Consumers apply it
// directly instead of wrapping with `bg-gradient-to-*`.
export const ACTIVITY_OPTIONS = {
  Coffee: {
    surface: "bg-gray-100 text-foreground",
    icon: Coffee,
    label: "Coffee Date",
    emoji: "☕"
  },
  Dinner: {
    surface: "bg-gray-100 text-foreground",
    icon: Utensils,
    label: "Dinner Date",
    emoji: "🍽️"
  },
  Drinks: {
    surface: "bg-gray-100 text-foreground",
    icon: Martini,
    label: "Drinks Date",
    emoji: "🍸"
  },
  Movie: {
    surface: "bg-gray-100 text-foreground",
    icon: Film,
    label: "Movie Night",
    emoji: "🎬"
  },
  Walk: {
    surface: "bg-gray-100 text-foreground",
    icon: Footprints,
    label: "Walk & Talk",
    emoji: "🌳"
  }
};

export const DEFAULT_ACTIVITY = {
  surface: "bg-gray-100 text-foreground",
  icon: Calendar,
  label: "Date Plan",
  emoji: "📅"
};

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const EMOJI_REACTIONS = ["❤️", "👍", "😂", "😮", "😢", "🔥"];

export const CALL_STATUSES = {
  MISSED: "missed",
  COMPLETED: "completed",
  REJECTED: "rejected",
};

export const DISAPPEARING_OPTIONS = [
  { label: "Off", seconds: 0 },
  { label: "1h", seconds: 60 * 60 },
  { label: "24h", seconds: 24 * 60 * 60 },
  { label: "7d", seconds: 7 * 24 * 60 * 60 },
];

