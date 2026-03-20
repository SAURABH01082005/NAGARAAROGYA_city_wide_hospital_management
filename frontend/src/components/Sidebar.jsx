import React, { useContext } from 'react'
import { AdminContext } from '../contexts/AdminContext'
import { NavLink } from 'react-router-dom'
import { assetsAdmin } from '../assets/assets_admin/assets'
import { DoctorContext } from '../contexts/DoctorContext'
import { AppContext } from '../contexts/AppContext'

function Sidebar() {

    const { user } = useContext(AppContext);
    return (
        <div className='min-h-screen bg-[var(--color-card)] border-r border-[var(--color-primary-border)]'>
            {/******************************admin******************************  */}
            {
                user === "Admin" && <ul className='text-white mt-5'>
                    <NavLink className={({ isActive }) => ` flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[var(--color-secondary)] border-0 rounded-full border-r-4 border-primary' : ''}`} to={'/admin-dashboard'}>
                        <img src={assetsAdmin.home_icon} alt="" />
                        <p className='hidden md:block'>Dashboard</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[var(--color-secondary)] border-0 rounded-full border-r-4 border-primary' : ''}`} to={'/add-hospital'}>
                        <img src={assetsAdmin.add_icon} alt="" />
                        <p className='hidden md:block'>Add Hopital</p>
                    </NavLink>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[var(--color-secondary)] border-0 rounded-full border-r-4 border-primary' : ''}`} to={'/hospital-list'}>
                        <img src={assetsAdmin.people_icon} alt="" />
                        <p className='hidden md:block'>Hospial List</p>
                    </NavLink>
                </ul>
            }

            {/******************************Doctor******************************  */}

            {
                user === "Doctor" && <ul className='text-white mt-5'>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[var(--color-secondary)] border-0 rounded-full border-r-4 border-primary' : ''}`} to={'/doctor-dashboard'}>
                        <img src={assetsAdmin.home_icon} alt="" />
                        <p className='hidden md:block'>Dashboard</p>
                    </NavLink>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[var(--color-secondary)] border-0 rounded-full  border-r-4 border-primary' : ''}`} to={'/add-patient'}>
                        <img src={assetsAdmin.appointment_icon} alt="" />
                        <p className='hidden md:block'>Add Paitent</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[var(--color-secondary)] border-0 rounded-full  border-r-4 border-primary' : ''}`} to={'/assign-resources'}>
                        <img src={assetsAdmin.people_icon} alt="" />
                        <p className='hidden md:block'>Assign Resources</p>
                    </NavLink>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[var(--color-secondary)] border-0 rounded-full  border-r-4 border-primary' : ''}`} to={'/reports'}>
                        <img src={assetsAdmin.people_icon} alt="" />
                        <p className='hidden md:block'>Patient Reports</p>
                    </NavLink>
                </ul>
            }

            {/******************************Patient******************************  */}
            {
                user === "Patient" && <ul className='text-white mt-5 '>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[var(--color-secondary)]  border-0 rounded-full border-r-4 border-primary ' : ''} `} to={'/patient-dashboard'}>
                        <img src={assetsAdmin.home_icon} alt="" />
                        <p className='hidden md:block'>Dashboard</p>
                    </NavLink>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[var(--color-secondary)] border-0 rounded-full  border-r-4 border-primary' : ''}`} to={'/appointment/list'}>
                        <img src={assetsAdmin.appointment_icon} alt="" />
                        <p className='hidden md:block'>Appointment (OPD)</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[var(--color-secondary)] border-0 rounded-full  border-r-4 border-primary' : ''}`} to={'/patient-reports'}>
                        <img src={assetsAdmin.people_icon} alt="" />
                        <p className='hidden md:block'>Patient Reports</p>
                    </NavLink>
                    <NavLink className={({ isActive }) => `flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[var(--color-secondary)] border-0 rounded-full  border-r-4 border-primary' : ''}`} to={'/patient-profile'}>
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