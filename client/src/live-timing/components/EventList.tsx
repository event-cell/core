import React, { useEffect, useState } from 'react';
import { YearSection } from './YearSection';
import { groupDatesByYear, sortDatesDescending } from '../utils/dateUtils';
import { EventMetadata, fetchEventsMetadata } from '../utils/metadataUtils';
import { fetchEventDirectories } from '../utils/apiUtils';

interface EventListProps {
  initialEventDirectories?: string[];
  initialMetadataMap?: Record<string, EventMetadata | null>;
}

export const EventList: React.FC<EventListProps> = ({ 
  initialEventDirectories = [], 
  initialMetadataMap = {} 
}) => {
  const [dates, setDates] = useState<string[]>(initialEventDirectories);
  const [metadataMap, setMetadataMap] = useState<Record<string, EventMetadata | null>>(initialMetadataMap);
  const [loading, setLoading] = useState(initialEventDirectories.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDates = async () => {
      // If we already have initial data, no need to fetch
      if (initialEventDirectories.length > 0) {
        return;
      }

      try {
        setLoading(true);
        
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          // We're in a server-side context (build phase)
          setLoading(false);
          return;
        }
        
        // Check if we have initial data from the window object
        if (typeof window !== 'undefined' && (window as any).__INITIAL_EVENT_DATA__) {
          const initialData = (window as any).__INITIAL_EVENT_DATA__;
          setDates(initialData.directories);
          setMetadataMap(initialData.metadataMap);
          setLoading(false);
          return;
        }
        
        // Fetch event directories from the server
        const eventDirectories = await fetchEventDirectories();
        const sortedDates = sortDatesDescending(eventDirectories);
        setDates(sortedDates);
        
        // Fetch metadata for all dates
        const metadata = await fetchEventsMetadata(sortedDates);
        setMetadataMap(metadata);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load events');
        setLoading(false);
        console.error('Error fetching dates:', err);
      }
    };

    fetchDates();
  }, [initialEventDirectories, initialMetadataMap]);

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (dates.length === 0) {
    return <div>No events found</div>;
  }

  const groupedDates = groupDatesByYear(dates);
  const years = Object.keys(groupedDates).sort().reverse();

  return (
    <>
      <h2>Historical Events</h2>
      {years.map(year => (
        <YearSection
          key={year}
          year={year}
          dates={groupedDates[year]}
          metadataMap={metadataMap}
        />
      ))}
    </>
  );
}; 