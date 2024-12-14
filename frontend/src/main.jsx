import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ContextProvider from './context/context.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { registerLicense } from '@syncfusion/ej2-base'

registerLicense(import.meta.env.VITE_API_KEY);

createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <App />
  </ContextProvider>
)
