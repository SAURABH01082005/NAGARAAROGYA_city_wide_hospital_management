import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import { AppContext } from '../contexts/AppContext.jsx'
import { AdminContext } from '../contexts/AdminContext.jsx'
import { PatientContext } from '../contexts/PatientContext.jsx'
import { DoctorContext } from '../contexts/DoctorContext.jsx'

function IsLogin() {

  const {user}= useContext(AppContext)
  const {aToken} = useContext(AdminContext)
  const {pToken} =useContext(PatientContext)
  const {dToken} = useContext(DoctorContext)

  switch(user){
    case 'Patient':
  }


  return (
    <>
    <Sidebar/>
    <Outlet/>
    </>
  )
}

export default IsLogin