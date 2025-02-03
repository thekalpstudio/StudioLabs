import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateDaysLeft(deadline: number): number {
  return Math.ceil((deadline * 1000 - Date.now()) / (1000 * 60 * 60 * 24));
}
