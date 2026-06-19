import { Clock, Film, Heart, Home, Tv, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

export const mainNavItems: NavItem[] = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/tv", icon: Tv, label: "TV" },
  { href: "/movies", icon: Film, label: "Movies" },
  { href: "/history", icon: Clock, label: "History" },
  { href: "/favorites", icon: Heart, label: "Saved" },
];
