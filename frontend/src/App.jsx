import { useState } from 'react'
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import AdminDashboard from './components/admin/AdminDashboard'
import AddHospital from './components/admin/AddHospital'
import HospitalList from './components/admin/HospitalList.jsx'
import PatientDashboard from './components/patient/PatientDashboard'
import Reports from './components/patient/Reports'
import Profile from './components/patient/Profile'
import DoctorDashboard from './components/doctor/DoctorDashboard'
import Appointments from './components/doctor/Appointments.jsx'
import AssignResources from './components/doctor/AssignResources'
import AddPatient from './components/doctor/AddPatient'
import PatientReport from './components/doctor/PatientReport.jsx'
import PatientUploadReport from './components/doctor/PatientUploadReport.jsx'
import Home from './components/Home'
import Footer from './components/Footer.jsx';
import { ToastContainer } from 'react-toastify'
import IsLogin from './components/IsLogin.jsx'
import NotFoundPage from './components/NotFoundPage.jsx'
import ShowSpecialityList from './components/hospitalListAndMaps/ShowSpecialityList.jsx'
import ShowMapAndHospitalList from './components/hospitalListAndMaps/ShowMapAndHospitalList.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <ToastContainer />

      <div className='flex items-start'>


        <Routes>
          <Route path='/' element={<Home />} />

          <Route element={<IsLogin />}>

            {/* admin dashboard */}
            <Route path='/admin'>
            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path='add-hospital' element={<AddHospital />} />
            <Route path='hospital-list' element={<HospitalList />} />
            </Route>

            {/* patient routes */}
            <Route path='/patient'>
            <Route path='dashboard' element={<PatientDashboard />} />
            <Route path='reports' element={<Reports />} />
            <Route path='profile' element={<Profile />} />
            <Route path='appointment'  >
              <Route path='list' element={<ShowSpecialityList />} />
              <Route path=':appointment-type/hospital-list' element={<ShowMapAndHospitalList />} />
            </Route>
            </Route>

            {/* doctor routes */}
            <Route path='/doctor'>
              <Route path='dashboard' element={<DoctorDashboard />} />
              {/* <Route path='/reports' element={<PatientReport />} /> */}
              <Route path='appointments' >
                <Route path='' element={<Appointments />} />
                <Route path='ptient-report' element={<PatientReport />} />
                <Route path='patient-upload-report' element={<PatientUploadReport />} />
              </Route>
              <Route path='assign-resources' element={<AssignResources />} />
              <Route path='add-patient' element={<AddPatient />} />
            </Route>
          </Route>



          <Route path="*" element={<NotFoundPage />} />



        </Routes>
      </div>

      <Footer />


    </>
  )
}


export default App
