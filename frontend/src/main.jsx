import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './leaflet.css'
import DataFetcher from './contexts/DataFetcher.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataFetcher>
      <App />
    </DataFetcher>
  </React.StrictMode>,
)
