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

export const EXPLORE_CATEGORIES = [
  {
    id: "Gaming",
    name: "Gamers",
    iconName: "Gamepad2",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    id: "Travel",
    name: "Travelers",
    iconName: "Plane",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "Food",
    name: "Foodies",
    iconName: "Utensils",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "Coding",
    name: "Coders",
    iconName: "Code2",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "Music",
    name: "Music Lovers",
    iconName: "Music",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "Fitness",
    name: "Fitness",
    iconName: "Dumbbell",
    gradient: "from-red-500 to-pink-600",
  },
  {
    id: "Reading",
    name: "Readers",
    iconName: "BookOpen",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    id: "Art",
    name: "Artists",
    iconName: "Palette",
    gradient: "from-violet-500 to-fuchsia-600",
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

export const ACTIVITY_OPTIONS = {
  Coffee: {
    bg: "from-amber-400 to-orange-500",
    icon: Coffee,
    label: "Coffee Date",
    emoji: "☕"
  },
  Dinner: {
    bg: "from-rose-400 to-pink-600",
    icon: Utensils,
    label: "Dinner Date",
    emoji: "🍽️"
  },
  Drinks: {
    bg: "from-indigo-500 to-purple-600",
    icon: Martini,
    label: "Drinks Date",
    emoji: "🍸"
  },
  Movie: {
    bg: "from-cyan-400 to-blue-600",
    icon: Film,
    label: "Movie Night",
    emoji: "🎬"
  },
  Walk: {
    bg: "from-emerald-400 to-teal-600",
    icon: Footprints,
    label: "Walk & Talk",
    emoji: "🌳"
  }
};

export const DEFAULT_ACTIVITY = {
  bg: "from-pink-400 to-rose-500",
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

