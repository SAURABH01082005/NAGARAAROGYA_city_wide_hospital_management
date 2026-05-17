import React, { useState, useMemo, useContext, useEffect } from 'react'
import axios from 'axios'
import { DoctorContext } from '../../contexts/DoctorContext'
import { toast } from 'react-toastify'

function AssignResources() {
  const [searchTerm, setSearchTerm] = useState("")
  const { dToken, doctorData, getDoctorDetails } = useContext(DoctorContext)
  const [hospitalBedData, setHospitalBedData] = useState([])
  const [expandedBeds, setExpandedBeds] = useState({})
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
const [selectedHospitalId, setSelectedHospitalId] = useState(null);
const [selectedBedType, setSelectedBedType] = useState(null);

const [formData, setFormData] = useState({
  patientEmail: '',
  age: '',
  gender: 'Male',
  condition: '',
  procedure: ''
});

  const getAllHospitalBeds = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/doctor/get-all-hospital-beds`, {
        headers: { dtoken: dToken }
      })
      if (!data.success) {
        toast.error("Failed to fetch hospital beds data: " + data.message)
        return
      }
      setHospitalBedData(data.data)
    } catch (error) {
      console.error("Error fetching hospital beds data:", error)
      toast.error("Failed to fetch hospital beds data. Please try again later.")
    }
  }

  useEffect(() => {
    getAllHospitalBeds()
    getDoctorDetails()
  }, [])

  // Doctor's own hospital ID
  const doctorHospitalId = doctorData?.doctorDetail?.hospitalId

  // Filtered + Doctor's hospital on top
  const filteredCards = useMemo(() => {
    if (!hospitalBedData.length) return []

    let result = hospitalBedData

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = hospitalBedData
        .map(hospital => {
          const filteredBeds = hospital.beds.filter(bedType =>
            bedType._id.toLowerCase().includes(searchLower) ||
            hospital.hospitalName.toLowerCase().includes(searchLower)
          )
          return { ...hospital, beds: filteredBeds }
        })
        .filter(hospital => hospital.beds.length > 0)
    }

    // Put doctor's hospital on top
    if (doctorHospitalId) {
      const doctorHospitalIndex = result.findIndex(h => h.hospitalId === doctorHospitalId)
      if (doctorHospitalIndex > 0) {
        const doctorHospital = result.splice(doctorHospitalIndex, 1)[0]
        result.unshift(doctorHospital)
      }
    }

    return result
  }, [hospitalBedData, searchTerm, doctorHospitalId])

  const toggleBedList = (hospitalId, bedTypeId) => {
    const key = `${hospitalId}-${bedTypeId}`
    setExpandedBeds(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const getOccupancyPercentage = (available, total) => {
    if (total === 0) return 100
    return Math.round(((total - available) / total) * 100)
  }

  const getStatusColor = (percentage) => {
    if (percentage <= 30) return 'bg-green-500'
    if (percentage <= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStatusBg = (available, total) => {
    const percentage = (available / total) * 100
    if (percentage >= 60) return 'bg-green-500/20 text-green-400 border-green-500/50'
    if (percentage >= 30) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
    return 'bg-red-500/20 text-red-400 border-red-500/50'
  }

  const getAvgWaitTime = (bedType) => {
    return bedType.minTime ? `${bedType.minTime} min` : "0 sec"
  }

  const handleRequestBed = (hospitalId, bedTypeId) => {
    setSelectedHospitalId(hospitalId);
    setSelectedBedType(bedTypeId);
    setFormData({ patientEmail: '', age: '', gender: 'Male', condition: '', procedure: '' }); // Reset form
    setShowRequestModal(true);
  }

  const handleFormSubmit = async () => {
    const age = Number(formData.age)
    const patientEmail = formData.patientEmail.trim()
    const condition = formData.condition.trim()
    const procedure = formData.procedure.trim()
    const doctorEmail = doctorData?.doctorDetail?.email
    const mlBaseUrl = (import.meta.env.VITE_APP_ML_URL || "http://127.0.0.1:5555").replace(/\/$/, "")

    if (!selectedHospitalId || !selectedBedType) {
      toast.error("Please select a hospital bed first")
      return
    }
    if (!patientEmail) {
      toast.error("Patient email is required")
      return
    }
    if (!doctorEmail) {
      toast.error("Doctor profile is still loading. Please try again.")
      return
    }
    if (formData.age === '' || !Number.isFinite(age) || age < 0 || age > 120) {
      toast.error("Enter a valid patient age")
      return
    }
    if (!condition) {
      toast.error("Condition / diagnosis is required")
      return
    }

    try {
      setIsSubmitting(true)

      const { data: mlData } = await axios.post(`${mlBaseUrl}/api/bed/allocate`, {
        age,
        gender: formData.gender,
        condition,
        procedure,
        waiting_time: 0,
        hospitalId: selectedHospitalId,
        bedType: selectedBedType
      })

      const bedScore = Number(mlData?.score)
      if (!Number.isFinite(bedScore)) {
        throw new Error("ML did not return a valid bed score")
      }

      console.log("ML bed score:", bedScore, mlData)

      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/doctor/bed-queue`,
        {
          bedType: selectedBedType,
          hospitalId: selectedHospitalId,
          NApatientEmail: patientEmail,
          NAdoctorEmail: doctorEmail,
          bedScore
        },
        { headers: { dtoken: dToken } }
      )

      if (!data.success) {
        toast.error(data.message || "Failed to add patient to bed queue")
        return
      }

      toast.success(`Bed request submitted. ML bed score: ${bedScore}`)
      setShowRequestModal(false)
      setFormData({ patientEmail: '', age: '', gender: 'Male', condition: '', procedure: '' })
      await getAllHospitalBeds()
    } catch (error) {
      console.error("Error submitting bed request:", error)
      toast.error(error.response?.data?.message || error.response?.data?.error || error.message || "Failed to submit bed request")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="bg-[var(--color-primary)] text-white min-h-screen py-4 px-5 md:px-8 h-[700px] overflow-y-scroll no-scrollbar lg:w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-6 items-end">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Assign Hospital Resources
            </h2>
            <p className="text-gray-400 text-sm mt-2">Request beds from hospitals</p>
          </div>
        </div>

        {/* Doctor's Hospital Highlight */}
        {doctorHospitalId && (
          <div className="mb-6 p-4 bg-emerald-900/30 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="font-medium text-emerald-400">
              Your Hospital: <span className="text-white">{doctorHospitalId}</span>
            </span>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6 mb-10">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                type="text"
                placeholder="Search hospital or bed type..."
                className="w-full bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 rounded-xl pl-5 pr-12 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8">
          {filteredCards.length > 0 ? (
            <div className="space-y-12">
              {filteredCards.map((hospital) => {
                const isMyHospital = hospital.hospitalId === doctorHospitalId

                return (
                  <div key={hospital.hospitalId}>
                    {/* Hospital Header */}
                    <div className="mb-6 flex items-center gap-4">
                      <div>
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                          {hospital.hospitalName}
                          {isMyHospital && (
                            <span className="text-xs font-semibold px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-lg">
                              MY HOSPITAL
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-400 text-sm">{hospital.hospitalId}</p>
                      </div>
                    </div>

                    {/* Bed Type Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {hospital.beds.map((bedType) => {
                        const occupancy = getOccupancyPercentage(bedType.availalbe, bedType.total)
                        const isExpanded = expandedBeds[`${hospital.hospitalId}-${bedType._id}`]

                        return (
                          <div
                            key={bedType._id}
                            className="bg-gray-800/80 border border-gray-700/80 rounded-2xl p-6 flex flex-col h-[420px] hover:border-[var(--color-secondary)]/50 transition-all"
                          >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <span className="uppercase text-xs tracking-widest font-semibold text-gray-400">
                                  {bedType._id.replace(/_/g, ' ').toUpperCase()}
                                </span>
                                <div className="text-4xl font-bold mt-2">
                                  {bedType.availalbe} <span className="text-lg font-normal text-gray-400">/ {bedType.total}</span>
                                </div>
                              </div>

                              <div className={`px-4 py-1.5 rounded-xl text-sm font-bold border ${getStatusBg(bedType.availalbe, bedType.total)}`}>
                                {occupancy}%
                              </div>
                            </div>

                            {/* Occupancy Progress Bar */}
                            <div className="mb-6">
                              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                                <span>Available</span>
                                <span>Occupied</span>
                              </div>
                              <div className="w-full bg-gray-900 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className={`h-2.5 rounded-full transition-all duration-500 ${getStatusColor(occupancy)}`}
                                  style={{ width: `${occupancy}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Average Wait Time */}
                            <div className="mb-6">
                              <span className="text-xs text-gray-400 block">Avg. Waiting Time</span>
                              <span className="text-lg font-semibold text-[var(--color-secondary)]">
                                {getAvgWaitTime(bedType)}
                              </span>
                            </div>

                            {/* View Beds Dropdown */}
                            <button
                              onClick={() => toggleBedList(hospital.hospitalId, bedType._id)}
                              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-4 transition-colors"
                            >
                              <span>{isExpanded ? 'Hide' : 'View'} Individual Beds</span>
                              <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                            </button>

                            {/* Expandable Bed List */}
                            {isExpanded && (
                              <div className="bg-gray-900/50 rounded-xl p-3 max-h-28 overflow-y-auto mb-6 text-sm font-mono space-y-1">
                                {bedType.beds.map((bed) => (
                                  <div key={bed.bedId} className="flex justify-between">
                                    <span>{bed.bedId}</span>
                                    <span className={bed.available ? 'text-green-400' : 'text-red-400'}>
                                      {bed.available ? 'Available' : 'Occupied'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Request Button */}
                            <button
                              onClick={() => handleRequestBed(hospital.hospitalId,bedType._id)}
                              disabled={bedType.availalbe === 0}
                              className="mt-auto w-full py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-secondary)] hover:bg-blue-600 active:scale-[0.98]"
                            >
                              {bedType.availalbe > 0 ? 'Request Bed' : 'No Beds Available'}
                            </button>
                          </div>
                        )
                      })}
                    </div>

                    <hr className="border-gray-700/70 mt-12" />
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-24 text-gray-400">
              No matching hospitals or bed types found.
            </div>
          )}
        </div>
      </div>
      {/* Request Bed Modal */}
{showRequestModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-md shadow-2xl">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-gray-700 px-6 py-5">
        <div>
          <h3 className="text-2xl font-bold text-white">Request Bed</h3>
          <p className="text-gray-400 text-sm mt-1">
            Hospital: <span className="text-[var(--color-secondary)]">{selectedHospitalId}</span>
          </p>
        </div>
        <button
          onClick={() => setShowRequestModal(false)}
          className="text-gray-400 hover:text-white text-3xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Form */}
    
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Patient Email</label>
          <input
            type="email"
            value={formData.patientEmail}
            onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-secondary)]"
            placeholder="patient@example.com"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Patient Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-secondary)]"
            placeholder="Enter age"
            min="0"
            max="120"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-secondary)]"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Condition / Diagnosis</label>
          <textarea
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white h-13 resize-y focus:outline-none focus:border-[var(--color-secondary)]"
            placeholder="eg. Heart Attack, Severe Pneumonia, etc."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Procedure Required</label>
          <textarea
            value={formData.procedure}
            onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white h-13 resize-y focus:outline-none focus:border-[var(--color-secondary)]"
            placeholder="e.g. Angioplasty, Intubation, etc."
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-3 border-t border-gray-700 p-6">
        <button
          onClick={() => {
            setShowRequestModal(false);
          }}
          disabled={isSubmitting}
          className="flex-1 py-3.5 rounded-2xl font-semibold border border-gray-700 hover:bg-gray-800 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleFormSubmit}
          disabled={isSubmitting}
          className="flex-1 py-3.5 rounded-2xl font-semibold bg-[var(--color-secondary)] hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default AssignResources
