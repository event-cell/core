import React, { useState } from 'react';
import { EventLink } from './EventLink.js';
import { EventMetadata } from '../utils/metadataUtils.js';

interface YearSectionProps {
  year: string;
  dates: string[];
  metadataMap: Record<string, EventMetadata | null>;
}

export const YearSection: React.FC<YearSectionProps> = ({ year, dates, metadataMap }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="year-section">
      <div 
        className="year-header" 
        data-year={year} 
        data-expanded={isExpanded}
        onClick={toggleExpand}
      >
        <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{year}</span>
        <span className="toggle-icon">{isExpanded ? '▼' : '▲'}</span>
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