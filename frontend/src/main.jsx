import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Use VITE_API_BASE_URL if set, or empty string to use Vercel's same-origin proxy rewrite
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || '';
if (BACKEND_URL) {
  axios.defaults.baseURL = BACKEND_URL;
}
axios.defaults.withCredentials = true;



createRoot(document.getElementById('root')).render(

  <StrictMode>
    <App />
  </StrictMode>,
)
