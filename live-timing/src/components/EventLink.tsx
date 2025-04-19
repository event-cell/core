import React from 'react';
import { formatDate } from '../utils/dateUtils';
import { EventMetadata } from '../utils/metadataUtils';

interface EventLinkProps {
  dateStr: string;
  metadata: EventMetadata | null;
}

export const EventLink: React.FC<EventLinkProps> = ({ dateStr, metadata }) => {
  const formattedDate = formatDate(dateStr);
  const eventName = metadata?.eventName || '';

  return (
    <a href={`${dateStr}/display/`} className="event-link">
      <div className="event-date">{formattedDate}</div>
      {eventName && <div className="event-name">{eventName}</div>}
    </a>
  );
}; 