import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

import { AppProvider } from './context/AppContext'        // tuyo
import { AuthProvider } from './context/AuthContext'      // de DanielaDev
import { EventsProvider } from './context/EventContext'
import { SubscriptionsProvider } from "./context/SubscriptionsContext";  // feature de eventos (laurita-dev)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
  <AuthProvider>
    <AppProvider>
      <EventsProvider>
        <SubscriptionsProvider>
          <App />
        </SubscriptionsProvider>
      </EventsProvider>
    </AppProvider>
  </AuthProvider>
</BrowserRouter>
  </React.StrictMode>,
)
