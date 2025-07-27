import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.js'

export { config } from './config.js'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
