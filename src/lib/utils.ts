
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const languages = ["en", "ar", "fr"] as const;
export type Language = typeof languages[number];

export function getDirection(lang: Language) {
  return lang === "ar" ? "rtl" : "ltr";
}
