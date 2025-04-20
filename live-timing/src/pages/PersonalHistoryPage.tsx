import React from 'react';
import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';

export const PersonalHistoryPage: React.FC = () => {
  return (
    <div className="personal-history-page">
      <Header />
      <main>
        <h1>Personal Timing History</h1>
        <div className="description">
          View your complete timing history across all events
        </div>
        <div className="content-section">
          <div className="current-event">
            <h2>Coming Soon</h2>
            <p>Your personal timing history will be available here soon. This page will show:</p>
            <ul>
              <li>All your past event results</li>
              <li>Performance trends over time</li>
              <li>Personal bests and achievements</li>
              <li>Detailed timing breakdowns</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}; 