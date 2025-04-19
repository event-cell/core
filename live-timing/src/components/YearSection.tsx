import React, { useState, useEffect } from 'react';
import { EventLink } from './EventLink';
import { EventMetadata } from '../utils/metadataUtils';

interface YearSectionProps {
  year: string;
  dates: string[];
  metadataMap: Record<string, EventMetadata | null>;
}

export const YearSection: React.FC<YearSectionProps> = ({ year, dates, metadataMap }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Add event listener for click events after component mounts
  useEffect(() => {
    const yearHeader = document.querySelector(`.year-header[data-year="${year}"]`);
    if (yearHeader) {
      yearHeader.addEventListener('click', toggleExpand);
    }
    
    return () => {
      if (yearHeader) {
        yearHeader.removeEventListener('click', toggleExpand);
      }
    };
  }, [year]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="year-section">
      <div className="year-header" data-year={year} onClick={toggleExpand}>
        <span>{year}</span>
        <span className="toggle-icon">{isExpanded ? '▲' : '▼'}</span>
      </div>
      <div className={`year-content ${isExpanded ? 'active' : ''}`}>
        {dates.map(dateStr => (
          <EventLink 
            key={dateStr} 
            dateStr={dateStr} 
            metadata={metadataMap[dateStr] || null} 
          />
        ))}
      </div>
    </div>
  );
}; 