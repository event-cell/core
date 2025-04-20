import { trpc } from '../../../client/src/utils/trpc.js';

/**
 * Fetches the list of event directories from the server
 * @returns Promise that resolves to an array of date strings
 */
export async function fetchEventDirectories(): Promise<string[]> {
  try {
    const directories = await trpc.events.directories.query();
    return directories;
  } catch (error) {
    console.error('Failed to fetch event directories:', error);
    // Return mock data for development
    return [
      '2024-03-15',
      '2024-02-20',
      '2024-01-10',
      '2023-12-05',
      '2023-11-15',
      '2023-10-20',
      '2023-09-10',
      '2023-08-05',
      '2023-07-15',
      '2023-06-20',
    ];
  }
} 