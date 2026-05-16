import React, { useState, useMemo,useContext, useEffect } from 'react'
import hospitalsData from '../../../../ML/hospitals.json'
import axios from 'axios'
import { DoctorContext } from '../../contexts/DoctorContext'
import { toast } from 'react-toastify'



function AssignResources() {
  const [searchTerm, setSearchTerm] = useState("")
  const {dToken} = useContext(DoctorContext)
  const [hospitalBedsData, setHospitalBedsData] = useState([])

  const filteredHospitals = useMemo(() => {
    if (!searchTerm) return hospitalsData.hospitals
    
    const searchLower = searchTerm.toLowerCase()
    return hospitalsData.hospitals.filter(hospital => 
      hospital.id.toLowerCase().includes(searchLower) || 
      hospital.name.toLowerCase().includes(searchLower) ||
      hospital.location.toLowerCase().includes(searchLower)
    )
  }, [searchTerm])

  const getAllHospitalBeds = async () => {
    try {
      const {data} = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/doctor/get-all-hospital-beds`, { headers: { dtoken: dToken } })
      if (!data.success) {
        toast.error("Failed to fetch hospital beds data. Please try again later. Error: " + data.message)
        return
      }
      console.log("hospital beds data from backend is : ", data.data)
      setHospitalBedsData(data.data)
    } catch (error) {
      console.error("Error fetching hospital beds data:", error)
      toast.error("Failed to fetch hospital beds data. Please try again later.")
    }
  }
  useEffect(() => {
    getAllHospitalBeds()
  }, [])

  const getBedStatusColor = (available, total) => {
    const percentage = (available / total) * 100
    if (percentage >= 50) return 'bg-green-500/20 text-green-400 border-green-500/50'
    if (percentage >= 25) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
    return 'bg-red-500/20 text-red-400 border-red-500/50'
  }

  const getOccupancyPercentage = (available, total) => {
    return Math.round(((total - available) / total) * 100)
  }

  return (
    <div className="bg-[var(--color-primary)] text-white min-h-screen py-4 px-5 md:px-8 h-[700px] overflow-y-scroll no-scrollbar lg:w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-6 items-end">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Hospital Resources
            </h2>
            <p className="text-gray-400 text-sm mt-2">Monitor bed availability across all hospitals</p>
          </div>
        </div>

        <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6 mb-10">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                id="search"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                type="text"
                placeholder="Search by hospital ID, name, or location..."
                className="w-full bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 rounded-xl pl-5 pr-12 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-base"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)] hover:text-blue-300 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8 lg:p-10">
          {filteredHospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredHospitals.map((hospital) => (
                <div key={hospital.id} className="bg-gray-800/80 border border-gray-700/80 rounded-2xl shadow-lg p-6 hover:border-[var(--color-secondary)]/50 transition-all group">
                  {/* Header Section */}
                  <div className="flex justify-between items-start mb-5 pb-4 border-b border-gray-700/50">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-100 truncate" title={hospital.name}>{hospital.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{hospital.id}</span>
                        <span className="text-xs text-gray-400">• {hospital.location}</span>
                      </div>
                    </div>
                    {hospital.emergency && (
                      <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg">
                        Emergency
                      </span>
                    )}
                  </div>

                  {/* Overall Beds Status */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">Total Beds</span>
                        <span className="text-2xl font-bold text-gray-100">{hospital.availableBeds}/{hospital.totalBeds}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">Occupancy</span>
                        <span className={`text-lg font-bold px-3 py-1 rounded-lg border ${getBedStatusColor(hospital.availableBeds, hospital.totalBeds)}`}>
                          {getOccupancyPercentage(hospital.availableBeds, hospital.totalBeds)}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[var(--color-secondary)] to-blue-400 transition-all duration-500"
                        style={{ width: `${getOccupancyPercentage(hospital.availableBeds, hospital.totalBeds)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* ICU Section */}
                  <div className="mb-4 p-4 bg-gray-900/40 border border-gray-700/40 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">ICU Beds</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-200">{hospital.icu.available}/{hospital.icu.total}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded border ${getBedStatusColor(hospital.icu.available, hospital.icu.total)}`}>
                        {Math.round(((hospital.icu.total - hospital.icu.available) / hospital.icu.total) * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Ward Section */}
                  <div className="mb-6 p-4 bg-gray-900/40 border border-gray-700/40 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Ward Beds</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-200">{hospital.ward.available}/{hospital.ward.total}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded border ${getBedStatusColor(hospital.ward.available, hospital.ward.total)}`}>
                        {Math.round(((hospital.ward.total - hospital.ward.available) / hospital.ward.total) * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-700/50">
                    <div className="bg-gray-900/50 p-3 rounded-lg">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1">Avg Wait Time</span>
                      <span className="text-sm font-semibold text-[var(--color-secondary)]">{hospital.avgWaitTime} min</span>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded-lg">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1">Queue Length</span>
                      <span className="text-sm font-semibold text-[var(--color-secondary)]">{hospital.queueLength}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-800 border-dashed">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="text-2xl font-medium text-gray-400">No hospitals found</h3>
              <p className="text-gray-500 mt-2">Try searching with a different hospital ID, name, or location.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AssignResources