import React from 'react';
import { createRoot } from 'react-dom/client';
import { PersonalHistoryPage } from './pages/PersonalHistoryPage.js';
import './styles.css';

// Create root element if it doesn't exist
const createRootElement = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) return rootElement;
  
  const newRootElement = document.createElement('div');
  newRootElement.id = 'root';
  document.body.appendChild(newRootElement);
  return newRootElement;
};

// Render the app
const rootElement = createRootElement();
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PersonalHistoryPage />
  </React.StrictMode>
); 