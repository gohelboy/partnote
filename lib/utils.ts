import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


const USER_COLORS = [
  "#DC2626",
  "#D97706",
  "#059669",
  "#7C3AED",
  "#DB2777"
]

export const connectionIdColor = (connectionId: number): string => {
  return USER_COLORS[connectionId % USER_COLORS.length];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
