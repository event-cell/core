import React from 'react';

export const PersonalHistory: React.FC = () => {
  return (
    <div className="personal-history">
      <h2>Personal History</h2>
      <p>View your personal timing history across all events.</p>
      <a href="/personal-history.html" className="personal-history-button">
        View Personal History
      </a>
    </div>
  );
}; 