import React from 'react'
import ReactDOM from 'react-dom/client'


import './css/main.css'
import { App } from './App'
import { AppProvider } from './context/AppProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)
