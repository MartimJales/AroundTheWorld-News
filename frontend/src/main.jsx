import './index.css'
import './leaflet.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import LayersContext from './contexts/LayersContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LayersContext>
      <App />
    </LayersContext>
  </React.StrictMode>,
)
