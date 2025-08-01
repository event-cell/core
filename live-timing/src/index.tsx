import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.js'
import './styles.css'

// Create root element if it doesn't exist
const createRootElement = () => {
  const rootElement = document.getElementById('root')
  if (rootElement) return rootElement

  const newRootElement = document.createElement('div')
  newRootElement.id = 'root'
  document.body.appendChild(newRootElement)
  return newRootElement
}

// Render the app
const rootElement = createRootElement()
const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
