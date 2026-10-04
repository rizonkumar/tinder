import { Flame, Compass, Heart, CalendarDays, MessageCircle, User, Crown } from "lucide-react";

export const ROUTES = {
  landing: "/",
  auth: "/auth",
  swipe: "/swipe",
  explore: "/explore",
  matches: "/matches",
  dates: "/dates",
  chat: "/chat",
  gold: "/gold",
  profile: "/profile",
};

export const PRIMARY_NAV = [
  { label: "Swipe", to: ROUTES.swipe, icon: Flame, match: (path) => path === ROUTES.swipe },
  { label: "Explore", to: ROUTES.explore, icon: Compass, match: (path) => path === ROUTES.explore },
  { label: "Matches", to: ROUTES.matches, icon: Heart, match: (path) => path === ROUTES.matches },
  { label: "Dates", to: ROUTES.dates, icon: CalendarDays, match: (path) => path === ROUTES.dates },
  { label: "Chat", to: ROUTES.chat, icon: MessageCircle, match: (path) => path.startsWith(ROUTES.chat) },
];

export const ACCOUNT_MENU = [
  { label: "Profile", to: ROUTES.profile, icon: User },
  { label: "Swipe Gold", to: ROUTES.gold, icon: Crown },
];
