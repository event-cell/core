import React from 'react';

export const PersonalHistorySection: React.FC = () => {
  return (
    <section className="personal-history-section">
      <h2>Personal History</h2>
      <p>View your personal timing history across all events</p>
      <a href="personal-history.html" className="personal-history-button">
        View Personal History
      </a>
    </section>
  );
}; 