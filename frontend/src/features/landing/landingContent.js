import {
  Compass,
  ShieldCheck,
  CalendarHeart,
  Sparkles,
  Crown,
  EyeOff,
  Heart,
  MessageCircle,
  UserRound,
} from "lucide-react";

export const LANDING_NAV = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Gold", href: "#gold" },
];

export const FEATURES = [
  {
    icon: Compass,
    title: "Explore by interest",
    text: "Pick a vibe like gaming, food or travel and only see people who are into the same thing.",
    span: "lg:col-span-4",
  },
  {
    icon: ShieldCheck,
    title: "Chats you can verify",
    text: "Compare a fingerprint with your match once and the conversation shows a verified badge from then on.",
    span: "lg:col-span-2",
  },
  {
    icon: CalendarHeart,
    title: "Plan the date together",
    text: "Vote on a venue and a time inside the chat. When you both agree, it lands on your Dates page with a countdown.",
    span: "lg:col-span-2",
  },
  {
    icon: Sparkles,
    title: "A wingman when you're stuck",
    text: "Get icebreakers and reply suggestions written from both profiles, in the tone you choose.",
    span: "lg:col-span-2",
  },
  {
    icon: MessageCircle,
    title: "Real conversations",
    text: "Voice notes, reactions, replies, GIFs, disappearing messages and voice or video calls, all in one thread.",
    span: "lg:col-span-2",
  },
];

export const STEPS = [
  {
    icon: UserRound,
    title: "Build a profile that sounds like you",
    text: "Add a photo, pick your interests and write a bio. If you're stuck, the wingman drafts three options.",
  },
  {
    icon: Heart,
    title: "Swipe, or go straight to a vibe",
    text: "Use the main feed, or open Explore and swipe only within an interest you care about.",
  },
  {
    icon: MessageCircle,
    title: "Match, chat, meet",
    text: "A match opens a chat. Plan the first date from the same screen when the conversation is going well.",
  },
];

export const GOLD_BENEFITS = [
  { icon: Heart, title: "See who liked you", text: "Skip the guessing. Like them back and it's an instant match." },
  { icon: EyeOff, title: "Browse incognito", text: "Only people you swipe right on can see your profile." },
  { icon: Crown, title: "Swipe statistics", text: "Your swipes, likes received and match rate, updated as you go." },
];

export const PREVIEW_PROFILE = {
  name: "Ananya",
  age: 26,
  bio: "Weekend trekker, weekday coder. Looking for someone to split a plate of momos with.",
  image: "/female/3.jpg",
  interests: ["Travel", "Coding", "Food"],
};

export const PREVIEW_MATCH = { name: "Rohan", image: "/male/4.jpg" };
