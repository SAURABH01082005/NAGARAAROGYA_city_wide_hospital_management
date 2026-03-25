import React, { useContext } from 'react'
import { AdminContext } from '../contexts/AdminContext'
import { NavLink } from 'react-router-dom'
import { assetsAdmin } from '../assets/assets_admin/assets'
import { DoctorContext } from '../contexts/DoctorContext'
import { AppContext } from '../contexts/AppContext'
import { PatientContext } from '../contexts/PatientContext'

function Sidebar() {

    const { user,navSelect,setNavSelect } = useContext(AppContext);
    const changeSelectHandler=(name)=>{
        localStorage.setItem("navselect",name)
        setNavSelect(name)
    }
   
    return (
        <div className='min-h-screen bg-[var(--color-card)] border-r border-[var(--color-primary-border)]'>
            {/******************************admin******************************  */}
            {
                user === "Admin" && <ul className='text-white mt-5'>
                    <NavLink onClick={()=>changeSelectHandler("dashboard")} className={({ isActive }) => ` flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${ navSelect==="dashboard" ? 'bg-[var(--color-secondary)] border-0 rounded-full border-r-4 border-primary' : ''}`} to={'/admin/dashboard'}>
                        <img src={assetsAdmin.home_icon} alt="" />
                        <p className='hidden md:block'>Dashboard</p>
                    </NavLink>

                    <NavLink onClick={()=>changeSelectHandler("addHospital")} className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${ navSelect==="addHospital" ? 'bg-[var(--color-secondary)] border-0 rounded-full border-r-4 border-primary' : ''}`} to={'/admin/add-hospital'}>
                        <img src={assetsAdmin.add_icon} alt="" />
                        <p className='hidden md:block'>Add Hopital</p>
                    </NavLink>
                    <NavLink onClick={()=>changeSelectHandler("hospitalList")} className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${ navSelect==="hospitalList" ? 'bg-[var(--color-secondary)] border-0 rounded-full border-r-4 border-primary' : ''}`} to={'/admin/hospital-list'}>
                        <img src={assetsAdmin.people_icon} alt="" />
                        <p className='hidden md:block'>Hospial List</p>
                    </NavLink>
                </ul>
            }

            {/******************************Doctor******************************  */}

            {
                user === "Doctor" && <ul className='text-white mt-5'>
                    <NavLink onClick={()=>changeSelectHandler("dashboard")} className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${ navSelect==="dashboard" ? 'bg-[var(--color-secondary)] border-0 rounded-full border-r-4 border-primary' : ''}`} to={'/doctor/dashboard'}>
                        <img src={assetsAdmin.home_icon} alt="" />
                        <p className='hidden md:block'>Dashboard</p>
                    </NavLink>
                    <NavLink onClick={()=>changeSelectHandler("appointments")}   className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${ navSelect==="appointments"  ? 'bg-[var(--color-secondary)] border-0 rounded-full  border-r-4 border-primary' : ''}`} to={'/doctor/appointments'}>
                        <img src={assetsAdmin.appointment_icon} alt="" />
                        <p className='hidden md:block'>Appointments</p>
                    </NavLink>

                    <NavLink onClick={()=>changeSelectHandler("assignResources")}  className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${ navSelect==="assignResources" ? 'bg-[var(--color-secondary)] border-0 rounded-full  border-r-4 border-primary' : ''}`} to={'doctor/assign-resources'}>
                        <img src={assetsAdmin.people_icon} alt="" />
                        <p className='hidden md:block'>Assign Resources</p>
                    </NavLink>
                  
                </ul>
            }

            {/******************************Patient******************************  */}
            {
                user === "Patient" && <ul className='text-white mt-5 '>
                    <NavLink onClick={()=>changeSelectHandler("dashboard")}  className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${ navSelect==="dashboard" ? 'bg-[var(--color-secondary)]  border-0 rounded-full border-r-4 border-primary ' : ''} `} to={'/patient/dashboard'}>
                        <img src={assetsAdmin.home_icon} alt="" />
                        <p className='hidden md:block'>Dashboard</p>
                    </NavLink>
                    <NavLink onClick={()=>changeSelectHandler("appointment")}  className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${ navSelect==="appointment" ? 'bg-[var(--color-secondary)] border-0 rounded-full  border-r-4 border-primary' : ''}`} to={'/patient/appointment/list'}>
                        <img src={assetsAdmin.appointment_icon} alt="" />
                        <p className='hidden md:block'>Appointment (OPD)</p>
                    </NavLink>

                    <NavLink onClick={()=>changeSelectHandler("patientReports")}  className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${ navSelect==="patientReports" ? 'bg-[var(--color-secondary)] border-0 rounded-full  border-r-4 border-primary' : ''}`} to={'/patient/reports'}>
                        <img src={assetsAdmin.people_icon} alt="" />
                        <p className='hidden md:block'>Patient Reports</p>
                    </NavLink>
                    <NavLink onClick={()=>changeSelectHandler("profile")}  className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${ navSelect==="profile" ? 'bg-[var(--color-secondary)] border-0 rounded-full  border-r-4 border-primary' : ''}`} to={'/patient/profile'}>
                        <img src={assetsAdmin.people_icon} alt="" />
                        <p className='hidden md:block'>Profile</p>
                    </NavLink>
                </ul>
            }
            {
                user === "Unauthorized" && <div className='text-white mt-5 px-3 py-3.5 md:px-9 md:min-w-72 '>
                    Please login to access the dashboard
                </div>
            }
        </div>
    )
}

export default Sidebar