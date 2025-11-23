/**
 * Calculates the number of months remaining in the current year
 * Includes the current month in the count
 * @returns The number of months remaining (1-12)
 * @example
 * // If today is January 15th, returns 12
 * // If today is June 1st, returns 7
 * // If today is December 31st, returns 1
 */
export function getMonthsRemainingInYear(): number {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11 (0 = January, 11 = December)
  
  // Calculate months remaining: 12 - currentMonth
  // This includes the current month in the count
  return 12 - currentMonth;
}

/**
 * Calculates the number of months remaining in the current year from a specific date
 * @param date - Optional date to calculate from (defaults to today)
 * @returns The number of months remaining (1-12)
 */
export function getMonthsRemainingInYearFromDate(date?: Date): number {
  const targetDate = date || new Date();
  const currentMonth = targetDate.getMonth(); // 0-11
  
  return 12 - currentMonth;
}

