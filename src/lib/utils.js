// src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge and combine class names
 * @param {...string} inputs - Class names to merge
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
  console.log('cn utility function called with inputs:', inputs);
  return twMerge(clsx(inputs));
}
