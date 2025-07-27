import React from 'react';

export const CurrentEvent: React.FC = () => {
  return (
    <div className="current-event">
      <h2>Current Event</h2>
      <a href="live-timing/display/" className="current-event-button">
        View Live Timing
      </a>
    </div>
  );
}; 