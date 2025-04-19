import React from 'react';
import { Header } from '../components/Header';
import { CurrentEvent } from '../components/CurrentEvent';
import { EventList } from '../components/EventList';
import { Footer } from '../components/Footer';
import { PersonalHistorySection } from '../components/PersonalHistorySection';

interface IndexPageProps {
  initialEventDirectories?: string[];
  initialMetadataMap?: Record<string, any>;
}

export const IndexPage: React.FC<IndexPageProps> = ({ 
  initialEventDirectories = [], 
  initialMetadataMap = {} 
}) => {
  return (
    <>
      <Header />
      <CurrentEvent />
      <EventList 
        initialEventDirectories={initialEventDirectories}
        initialMetadataMap={initialMetadataMap}
      />
      <PersonalHistorySection />
      <Footer />
    </>
  );
}; 