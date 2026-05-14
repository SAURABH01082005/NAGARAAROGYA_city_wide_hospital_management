import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { DoctorContext } from '../../contexts/DoctorContext';

function Appointments() {

  const {dToken} = useContext(DoctorContext)
  const [searchTerm,setSearchTerm] = useState("");
  const [appointments,setAppointments] = useState([]);

  // Helper function to calculate age from DOB
  const calculateAge = (dobString) => {
    if (!dobString) return "N/A";
    const dob = new Date(dobString);
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

  const filteredPatientList = appointments.filter((appointment) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const patientName = appointment.patientRef?.patientDetail?.name || "";
    return patientName.toLowerCase().includes(searchLower);
  });

  const getAppointments = async()=>{
    try {
      const {data} = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/doctor/get-appointments`,{headers:{dtoken:dToken}})
      if(data.success) {
        setAppointments(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect( ()=>{
    getAppointments()
  }, [])

  return (
    <div className="bg-[var(--color-primary)] text-white min-h-screen py-4 px-5 md:px-8 h-[700px] overflow-y-scroll no-scrollbar lg:w-full">
      
      <div className="max-w-7xl mx-auto ">
       <div className="flex justify-between mb-2.5 items-end">
         <div className="text-center mb-10 ">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          IPD Appointments
        </h2>
      </div>

        {/* Search Bar Container */}
        <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6 mb-10">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                id="search"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                type="text"
                placeholder="Search Patient Name..."
                className="w-full bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 rounded-xl pl-5 pr-12 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-base"
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)] hover:text-blue-300 transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
       </div>

        {/* Table Container */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8 lg:p-10">

          <div className='text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll no-scrollbar'>
            <div className='max-sm:hidden grid grid-cols-[0.5fr_2.5fr_1fr_2fr_1fr_1fr] gap-1 py-3 px-6 border border-gray-700 rounded-2xl bg-[#1C2635] text-gray-300 font-semibold mb-4'>
              <p>#</p>
              <p>Patient</p>
              <p>Age</p>
              <p>Date & Time</p>
              <p>Status</p>
              <p>Action</p>
            </div>

            {
              filteredPatientList.length > 0 ? filteredPatientList.map((item, index) => (
                <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2.5fr_1fr_2fr_1fr_1fr] gap-1 items-center text-gray-400 py-3 px-6 border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors rounded-lg mb-1' key={item._id || index}>
                  <p className='max-sm:hidden'>{index + 1}</p>
                  
                  <div className='flex items-center gap-3'>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 border border-gray-600 flex-shrink-0 flex items-center justify-center">
                      {item.patientRef?.patientDetail?.image ? (
                        <img src={item.patientRef.patientDetail.image} alt="Patient" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 font-bold">{item.patientRef?.patientDetail?.name?.charAt(0) || '?'}</span>
                      )}
                    </div>
                    <p className='text-gray-200 font-medium text-sm'>{item.patientRef?.patientDetail?.name || 'Unknown Patient'}</p>
                  </div>
                  
                  <p className='text-gray-300 text-sm'>
                    {calculateAge(item.patientRef?.patientDetail?.dob)}
                  </p>
                  
                  <p className='text-sm text-gray-300'>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                  </p>
                  
                  <div>
                    <p className={`text-[10px] uppercase tracking-wider font-bold inline border px-2.5 py-1 rounded-full ${item.isCompleted ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'}`}>
                      {item.isCompleted ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                  
                  <div className='flex gap-4'>
                    <button className='bg-[var(--color-secondary)]/20 hover:bg-[var(--color-secondary)] text-[var(--color-secondary)] hover:text-white border border-[var(--color-secondary)]/50 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-lg shadow-black/20'>
                      View
                    </button>
                  </div>

                </div>
              )) : (
                <div className="text-center py-20 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  <p className="text-lg font-medium">No appointments found</p>
                </div>
              )
            }
          </div>
        </div>

      </div>
    </div>
  )
}

export default Appointments;