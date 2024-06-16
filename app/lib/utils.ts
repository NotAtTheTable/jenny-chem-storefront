import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isMobileViewport = (): boolean => {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
};