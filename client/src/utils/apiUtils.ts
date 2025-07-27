export interface Competitor {
  id: string;
  name: string;
  number: string;
  class: string;
}

export interface CompetitorResult {
  id: string;
  competitorId: string;
  eventId: string;
  date: string;
  eventName: string;
  class: string;
  position: number;
  time: string;
  points: number;
}

export async function fetchCompetitors(eventId: string): Promise<Competitor[]> {
  try {
    const response = await fetch(`/api/events/${eventId}/competitors`);
    if (!response.ok) {
      throw new Error(`Failed to fetch competitors: ${response.statusText}`);
    }
    return await response.json() as Competitor[];
  } catch (error) {
    console.error('Error fetching competitors:', error);
    throw error;
  }
}

export async function fetchCompetitorResults(
  eventId: string,
  competitorIds: string[]
): Promise<CompetitorResult[]> {
  try {
    const response = await fetch(`/api/events/${eventId}/competitor-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ competitorIds }),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch competitor results: ${response.statusText}`);
    }
    return await response.json() as CompetitorResult[];
  } catch (error) {
    console.error('Error fetching competitor results:', error);
    throw error;
  }
} 