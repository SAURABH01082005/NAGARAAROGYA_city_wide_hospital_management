import { useState } from 'react'
import './App.css'
import { Route,Routes ,useLocation} from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import AdminDashboard from './components/admin/AdminDashboard'
import AddHospital from './components/admin/AddHospital'
import HospitalList from './components/admin/HospitalList.jsx'
import PatientDashboard from './components/patient/PatientDashboard'
import Reports from './components/patient/Reports'
import Profile from './components/patient/Profile'
import Appointment from './components/patient/Appointment'
import DoctorDashboard from './components/doctor/DoctorDashboard'
import PatientReport from './components/doctor/PatientReport'
import AssignResources from './components/doctor/AssignResources'
import AddPatient from './components/doctor/AddPatient'
import Home from './components/Home'
import Login from './components/Login'
import Footer from './components/Footer.jsx';
import { ToastContainer } from 'react-toastify'
import IsLogin from './components/IsLogin.jsx'
import NotFoundPage from './components/NotFoundPage.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />
      <ToastContainer />
      
    <div className='flex items-start'>
      

    <Routes>
      <Route path='/' element={<Home />} />
      
      <Route element={<IsLogin/>}>
      
      {/* admin dashboard */}
      <Route path='/admin-dashboard' element={<AdminDashboard />} />
      <Route path='/add-hospital' element={<AddHospital />} />
      <Route path='/hospital-list' element={<HospitalList />} />

      {/* patient routes */}
      <Route path='/patient-dashboard' element={<PatientDashboard />} />
      <Route path='/patient-reports' element={<Reports />} />
      <Route path='/patient-profile' element={<Profile />} />
      <Route path='/appointment' element={<Appointment />} />

      {/* doctor routes */}
      
      <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
      <Route path='/reports' element={<PatientReport />} />
      <Route path='/assign-resources' element={<AssignResources />} />
      <Route path='/add-patient' element={<AddPatient />} />

      </Route>
      <Route path="*" element={<NotFoundPage/>}/>



    </Routes>
    </div>

    <Footer/>

     
    </>
  )
}

export default App
