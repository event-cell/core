import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header.js';
import { CurrentEvent } from '../components/CurrentEvent.js';
import { EventList } from '../components/EventList.js';
import { Footer } from '../components/Footer.js';
import { PersonalHistorySection } from '../components/PersonalHistorySection.js';
import { getEventDirectories, getMetadataMap } from '../data.js';

interface IndexPageProps {
  initialEventDirectories?: string[];
  initialMetadataMap?: Record<string, any>;
}

export const IndexPage: React.FC<IndexPageProps> = ({ 
  initialEventDirectories = [], 
  initialMetadataMap = {} 
}) => {
  const [eventDirectories, setEventDirectories] = useState<string[]>(initialEventDirectories);
  const [metadataMap, setMetadataMap] = useState<Record<string, any>>(initialMetadataMap);

  useEffect(() => {
    // If no initial data is provided, try to load it from the global variable
    if (eventDirectories.length === 0) {
      const loadData = async () => {
        const directories = await getEventDirectories();
        const metadata = await getMetadataMap();
        
        if (directories.length > 0) {
          setEventDirectories(directories);
          setMetadataMap(metadata);
        }
      };
      
      loadData();
    }
  }, []);

  return (
    <>
      <Header />
      <CurrentEvent />
      <PersonalHistorySection />
      <EventList 
        initialEventDirectories={eventDirectories}
        initialMetadataMap={metadataMap}
      />
      <Footer />
    </>
  );
}; 