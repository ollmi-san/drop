"use client";

import { create } from "zustand";

export type Weather = "sunny" | "cloudy" | "rainy" | "snowy" | "windy" | "warm" | "cold";
export type Occasion = "buero" | "date" | "freizeit" | "sport" | "party" | "shopping" | "uni" | "festlich";
export type Activity = "fahrrad" | "spaziergang" | "auto" | "ubahn" | "tanzen" | "essen" | "kino" | "park" | "stehend" | "sitzend";

export const WEATHER_OPTIONS = [
  { value: "sunny" as const,  label: "Sonnig",     emoji: "☀️", temp: 22 },
  { value: "cloudy" as const, label: "Bewölkt",    emoji: "☁️", temp: 16 },
  { value: "rainy" as const,  label: "Regnerisch", emoji: "🌧️", temp: 12 },
  { value: "snowy" as const,  label: "Schnee",     emoji: "❄️", temp: -2 },
  { value: "windy" as const,  label: "Windig",     emoji: "💨", temp: 14 },
  { value: "warm" as const,   label: "Warm",       emoji: "🌤️", temp: 26 },
  { value: "cold" as const,   label: "Kalt",       emoji: "🥶", temp: 4 },
];

export const OCCASION_OPTIONS = [
  { value: "buero" as const,    label: "Büro",      emoji: "💼" },
  { value: "date" as const,     label: "Date",      emoji: "💕" },
  { value: "freizeit" as const, label: "Freizeit",  emoji: "🌿" },
  { value: "sport" as const,    label: "Sport",     emoji: "🏃" },
  { value: "party" as const,    label: "Party",     emoji: "🎉" },
  { value: "shopping" as const, label: "Shopping",  emoji: "🛍️" },
  { value: "uni" as const,      label: "Uni/Schule",emoji: "🎓" },
  { value: "festlich" as const, label: "Festlich",  emoji: "🥂" },
];

export const ACTIVITY_OPTIONS = [
  { value: "fahrrad" as const,    label: "Fahrrad fahren",    emoji: "🚲" },
  { value: "spaziergang" as const,label: "Spaziergang",       emoji: "🚶" },
  { value: "auto" as const,       label: "Auto fahren",       emoji: "🚗" },
  { value: "ubahn" as const,      label: "U-Bahn",            emoji: "🚇" },
  { value: "tanzen" as const,     label: "Tanzen",            emoji: "💃" },
  { value: "essen" as const,      label: "Essen gehen",       emoji: "🍽️" },
  { value: "kino" as const,       label: "Kino",              emoji: "🎬" },
  { value: "park" as const,       label: "Im Park",           emoji: "🌳" },
  { value: "stehend" as const,    label: "Lange stehen",      emoji: "🧍" },
  { value: "sitzend" as const,    label: "Lange sitzen",      emoji: "💺" },
];

export type ActiveTab = "schrank" | "outfits" | "inspiration" | "stats";

interface Puppet {
  id: string;
  name: string;
  gender: "female" | "male";
}

interface AppStore {
  // Active tab in TopBar
  tab: ActiveTab;
  setTab: (t: ActiveTab) => void;

  // Avatar
  gender: "female" | "male";
  setGender: (g: "female" | "male") => void;

  // Puppets
  puppets: Puppet[];
  currentPuppetId: string;
  setCurrentPuppet: (id: string) => void;
  addPuppet: () => void;

  // Context
  weather: Weather;
  weatherTemp: number;
  refreshWeather: () => void;
  setWeather: (w: Weather) => void;

  occasion: Occasion;
  setOccasion: (o: Occasion) => void;

  activity: Activity;
  setActivity: (a: Activity) => void;

  // Bühne (Stage-Theme der Fashion Stage)
  stageId: string;
  setStage: (id: string) => void;

  // Mobile panel sheet (wardrobe / stylist drawer on small screens)
  mobilePanel: "wardrobe" | "stylist" | null;
  setMobilePanel: (p: "wardrobe" | "stylist" | null) => void;

  // Sound preference
  soundEnabled: boolean;
  toggleSound: () => void;

  // Tap feedback (last clicked side button)
  lastSideAction: { name: string; at: number } | null;
  triggerSideAction: (name: string) => void;
}

export const useApp = create<AppStore>((set) => ({
  tab: "schrank",
  setTab: (t) => set({ tab: t }),

  gender: "female",
  setGender: (g) => set({ gender: g }),

  puppets: [
    { id: "p1", name: "Puppe 1", gender: "female" },
    { id: "p2", name: "Puppe 2", gender: "male" },
  ],
  currentPuppetId: "p1",
  setCurrentPuppet: (id) =>
    set((state) => {
      const p = state.puppets.find((pp) => pp.id === id);
      return { currentPuppetId: id, gender: p?.gender ?? state.gender };
    }),
  addPuppet: () =>
    set((state) => {
      const id = `p${Date.now()}`;
      const next = [...state.puppets, { id, name: `Puppe ${state.puppets.length + 1}`, gender: "female" as const }];
      return { puppets: next, currentPuppetId: id };
    }),

  weather: "sunny",
  weatherTemp: 18,
  refreshWeather: () =>
    set(() => {
      const r = WEATHER_OPTIONS[Math.floor(Math.random() * WEATHER_OPTIONS.length)];
      return { weather: r.value, weatherTemp: r.temp + Math.floor(Math.random() * 5) - 2 };
    }),
  setWeather: (w) =>
    set(() => {
      const r = WEATHER_OPTIONS.find((x) => x.value === w)!;
      return { weather: w, weatherTemp: r.temp };
    }),

  occasion: "buero",
  setOccasion: (o) => set({ occasion: o }),

  activity: "fahrrad",
  setActivity: (a) => set({ activity: a }),

  stageId: "noble",
  setStage: (id) => set({ stageId: id }),

  mobilePanel: null,
  setMobilePanel: (p) => set({ mobilePanel: p }),

  soundEnabled: true,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

  lastSideAction: null,
  triggerSideAction: (name) =>
    set({ lastSideAction: { name, at: Date.now() } }),
}));
