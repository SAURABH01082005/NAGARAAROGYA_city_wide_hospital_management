import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AppContextProvider from './contexts/AppContext.jsx';
import PatientContextProvider from './contexts/PatientContext.jsx'
import DoctorContextProvider from './contexts/DoctorContext.jsx'
import AdminContextProvider from './contexts/AdminContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <AdminContextProvider>
          <DoctorContextProvider>
            <PatientContextProvider>
              <App />

            </PatientContextProvider>
          </DoctorContextProvider>
        </AdminContextProvider>
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>
)
