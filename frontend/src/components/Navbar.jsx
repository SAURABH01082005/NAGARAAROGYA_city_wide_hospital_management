import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext'
import { toast } from 'react-toastify'

import { assets } from '../assets/assets';
import { PatientContext } from '../contexts/PatientContext'
import { AdminContext } from '../contexts/AdminContext'
import { DoctorContext } from '../contexts/DoctorContext'

export default function Navbar() {
  const navigate = useNavigate();

  const { user, setUser, userDetails, setUserDetails } = useContext(AppContext)
  const { pToken, setPToken, getPatientDetails, patientData } = useContext(PatientContext)
  const { aToken, setAToken, getAdminDetails, adminData } = useContext(AdminContext)
  const { dToken, setDToken, doctorData, getDoctorDetails } = useContext(DoctorContext)


  // Replace with actual authentication logic



  const getData = async () => {
    let temp = { name: "name", image: assets.profilePic };
    switch (user) {
      case "Patient": temp = { name: patientData.patientDetail?.name, image: patientData.patientDetail?.image }
        break
      case "Doctor": temp = { name: doctorData?.doctorDetail?.name, image: doctorData?.doctorDetail?.image }
        break
      case "Admin": temp = { name: adminData.name, image: assets.adminData }
        break

    }
    setUserDetails(temp);
  }

  const handleLogout = () => {
    switch (user) {
      case "Patient": localStorage.removeItem("pToken")
        setPToken("")
        break
      case "Doctor": localStorage.removeItem("dToken")
        setDToken("")
        break
      case "Admin": localStorage.removeItem("aToken")
        setAToken("")
        break

    }

    localStorage.removeItem("user")
    setUser("Unauthorized")
    toast.success("Logout Successfully")
    navigate("/")


  };


  useEffect(() => {
    if(patientData || doctorData || adminData)

    getData()

  }, [patientData, doctorData, adminData])

  return (
    <header className="flex justify-between items-center bg-[#1E1E1E] text-white px-[25px] py-[15px] h-[60px] flex-shrink-0 shadow-md">
      <div className="logo cursor-pointer">
        <Link to="/" className="flex items-center no-underline transition hover:opacity-80">
          <img src={assets.nagarAarogya} alt="Nagar Arogya Logo" className="h-[50px]" />
        </Link>
      </div>
      <div className="flex items-center gap-[15px]">
        {user !== "Unauthorized" ? (
          <>
            <div className="w-[35px] h-[35px] bg-[#5D84F9] text-white rounded-full flex items-center justify-center font-semibold text-sm overflow-hidden">
              {true ? (
                <img src={userDetails?.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <></>
              )}
            </div>
            <span className="text-gray-300 text-sm font-semibold mr-1">{userDetails?.name}</span>
            <button onClick={handleLogout} className="bg-[#5D84F9] text-white border-0 px-4 py-2 rounded cursor-pointer transition hover:bg-[#4a73e0] text-sm font-medium inline-block no-underline">
              Logout
            </button>
          </>
        ) : (
          <>

          </>
        )}
      </div>
    </header>
  );
}
