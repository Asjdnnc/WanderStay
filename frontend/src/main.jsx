import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://majorproject-0elt.onrender.com' : '');
if (BACKEND_URL) {
  axios.defaults.baseURL = BACKEND_URL;
}
axios.defaults.withCredentials = true;


createRoot(document.getElementById('root')).render(

  <StrictMode>
    <App />
  </StrictMode>,
)
