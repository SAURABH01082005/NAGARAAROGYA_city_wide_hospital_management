import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { DoctorContext } from '../../contexts/DoctorContext';

function Appointments() {

  const {dToken} = useContext(DoctorContext)
  const [searchTerm,setSearchTerm] = useState("");
  // const [filteredPatientList,setFilteredPatientList] = useState()
  const [appointments,setAppointments] = useState([]);

    const filteredPatientList = appointments
  //   .filter((paitent) =>
  //   patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   hospital.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const getAppointments = async()=>{
    const {data} = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/doctor/get-appointments`,{headers:{dtoken:dToken}})
    setAppointments(data.data);
    // console.log("***********testing appiontments is ",appointments)


    
  }

  useEffect( ()=>{
    getAppointments()
  }
    // console.log("helo")
  , [])




  return (
    <div className="bg-[var(--color-primary)] text-white min-h-screen py-4 px-5 md:px-8 h-[700px] overflow-y-scroll no-scrollbar lg:w-full">
      
      <div className="max-w-7xl mx-auto ">
       <div className="flex justify-between mb-2.5">
         <div className="text-center mb-10 ">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          Appointments
        </h2>

      </div>


        {/* Search Bar Container */}
        <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6">
          <div className="max-w-2xl mx-auto">

            <div className="relative">
              <input
                id="search"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                type="text"
                placeholder="e.g. Paediatrics, Neurology, Dermatology..."
                className="w-full bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 rounded-xl pl-5 pr-12 py-4 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-lg"
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)] hover:text-blue-300 transition-colors"
                aria-label="Search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
       </div>

        {/* Specialties Container */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8 lg:p-10">


          <div className='bg-[--color-container-dark]   text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll no-scrollbar'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-[--color-container-item-board-border] rounded-2xl bg-[#1C2635]'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {
          [...filteredPatientList].map((item, index) => (
            <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={item._id}>
              <p className='max-sm:hidden '>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={""} alt="" /> <p>{""}</p>
              </div>
              <div>
                <p className='text-xs inline border border-primary px-2 rounded-full'>
                  {item.payment ? 'Online' : 'CASH'}
                </p>
              </div>
              <p className='max-sm:hidden'>{""}</p>
              <p>{""}, {""}</p>
              <p>{""}{""}</p>
              {
                <div className='flex gap-4'><p className='text-green-500 text-xs font-medium'>Completed</p> <img  className='h-[20px] cursor-pointer hover:scale-125 hover:bg-primary border-0 rounded transition-transform' src={"assets.addmit_icon"} alt="" /></div>
                   

              }



            </div>
          ))
        }
      </div>
        </div>

      </div>
    </div>
  )
}

export default Appointments