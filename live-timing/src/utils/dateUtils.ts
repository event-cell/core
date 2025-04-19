import dayjs from 'dayjs';

/**
 * Formats a date string (YYYY-MM-DD) to a more readable format (Month Day, Year)
 * @param dateStr Date string in YYYY-MM-DD format
 * @returns Formatted date string
 */
export const formatDate = (dateStr: string): string => {
  return dayjs(dateStr).format('MMMM D, YYYY');
};

/**
 * Extracts the year from a date string
 * @param dateStr Date string in YYYY-MM-DD format
 * @returns Year as a string
 */
export const getYear = (dateStr: string): string => {
  return dateStr.substring(0, 4);
};

/**
 * Groups date strings by year
 * @param dates Array of date strings in YYYY-MM-DD format
 * @returns Object with years as keys and arrays of date strings as values
 */
export const groupDatesByYear = (dates: string[]): Record<string, string[]> => {
  const groupedDates: Record<string, string[]> = {};
  
  dates.forEach(date => {
    const year = getYear(date);
    if (!groupedDates[year]) {
      groupedDates[year] = [];
    }
    groupedDates[year].push(date);
  });
  
  return groupedDates;
};

/**
 * Sorts date strings in descending order (newest first)
 * @param dates Array of date strings in YYYY-MM-DD format
 * @returns Sorted array of date strings
 */
export const sortDatesDescending = (dates: string[]): string[] => {
  return [...dates].sort().reverse();
}; 