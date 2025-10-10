import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a Date object or DateValue to DD/MM/YYYY format
 * @param date - The Date object or DateValue to format
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatDateDDMMYYYY(date: Date | any): string {
  // Handle DateValue objects from @internationalized/date
  if (date && typeof date.toDate === 'function') {
    const nativeDate = date.toDate();
    const day = nativeDate.getDate().toString().padStart(2, '0');
    const month = (nativeDate.getMonth() + 1).toString().padStart(2, '0');
    const year = nativeDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  // Handle native Date objects
  if (date && typeof date.getDate === 'function') {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  // Handle string dates (fallback)
  if (typeof date === 'string') {
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }
  
  // Return empty string if date is invalid
  return '';
}
