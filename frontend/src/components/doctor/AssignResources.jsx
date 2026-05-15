import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { DoctorContext } from '../../contexts/DoctorContext';

function AssignResources() {

  const { dToken } = useContext(DoctorContext)
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState([]);

  // Tab State
  const [activeTab, setActiveTab] = useState('main');
  const [openTabs, setOpenTabs] = useState([]);

  // Form State
  const [reportFormData, setReportFormData] = useState({
    symptom: "",
    prescription: "",
    additionalNote: "",
    additionalTests: "",
    nextVisitSchedule: ""
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setReportFormData(prev => ({ ...prev, [name]: value }));
  }

  // Helper function to calculate age from DOB
  const calculateAge = (dobString) => {
    if (!dobString) return "N/A";
    const dob = new Date(dobString);
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

  const [hospitals, setHospitals] = useState([]);
  const [bedLoading, setBedLoading] = useState(true);
  const [bedError, setBedError] = useState(null);

  const bedTypeMeta = {
    "ICU":  { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    "Ward": { icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9-4 9 4M3 7h18" },
  };

  const filteredHospitalList = hospitals.filter((hospital) => {
    if (!searchTerm) return true;
    return hospital.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getBedState = async () => {
    setBedLoading(true);
    setBedError(null);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/general/bed-state`);
      if (data.success) {
        setHospitals(data.data);
      } else {
        setBedError(data.message || "Failed to load bed state");
      }
    } catch (err) {
      console.error(err);
      setBedError(err.message || "Unable to reach backend");
    } finally {
      setBedLoading(false);
    }
  }

  useEffect(() => {
    getBedState()
  }, [])

  // Tab Handlers
  const handleViewHospital = (hospital) => {
    const tabId = 'view_' + hospital.id;
    // If tab already exists, switch to it
    const existingTab = openTabs.find(tab => tab.id === tabId);
    if (existingTab) {
      setActiveTab(tabId);
      return;
    }

    // Check max tabs limit
    if (openTabs.length >= 2) {
      alert("You can only open a maximum of 2 tabs at a time. Please close one first.");
      return;
    }

    // Open new tab
    const newTab = {
      id: tabId,
      type: 'view',
      title: hospital.name,
      data: hospital
    };

    setOpenTabs([...openTabs, newTab]);
    setActiveTab(tabId);
  }

  const handleAddReport = (appointment) => {
    const tabId = 'add_' + appointment._id;
    // If tab already exists, switch to it
    const existingTab = openTabs.find(tab => tab.id === tabId);
    if (existingTab) {
      setActiveTab(tabId);
      return;
    }

    // Check max tabs limit
    if (openTabs.length >= 2) {
      alert("You can only open a maximum of 2 tabs at a time. Please close one first.");
      return;
    }

    // Open new tab
    const newTab = {
      id: tabId,
      type: 'add_report',
      title: 'Add Report: ' + (appointment.patientRef?.patientDetail?.name?.split(' ')[0] || 'Patient'),
      data: appointment
    };

    setOpenTabs([...openTabs, newTab]);
    setActiveTab(tabId);
  }

  const handleSubmitReport = async (e, appointmentData) => {
    e.preventDefault();

    //    doctorId: string,
    // hospitalId: string,
    // symptom: string,
    // prescription: string,
    // additionalNote: string,
    // additionalTests: string,
    // nextVisitSchedule: Date,
    // date: Date,
    console.log("appointmentData is : ", appointmentData)
    const reportData = {
      doctorId: appointmentData.detail?.docId || "temp_doc_id",
      hospitalId: appointmentData.hospitalRef || "temp_hosp_id",
      symptom: reportFormData.symptom,
      prescription: reportFormData.prescription,
      additionalNote: reportFormData.additionalNote || "no additional note",
      additionalTests: reportFormData.additionalTests || "no additional tests",
      nextVisitSchedule: new Date(reportFormData.nextVisitSchedule),
      date: new Date()
    };
    console.log("reportData is ", reportData)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/doctor/add-report`,
        {
          appointmentId: appointmentData.appointmentRef,
          report: reportData
        },
        { headers: { dtoken: dToken } }
      );

      if (response.data.success) {
        alert("Report submitted successfully!");
        setReportFormData({
          symptom: "",
          prescription: "",
          additionalNote: "",
          additionalTests: "",
          nextVisitSchedule: ""
        });
        handleCloseTab(e, activeTab);
      } else {
        alert("Failed: " + response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting report");
    }
  }

  const handleCloseTab = (e, tabId) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(newTabs);
    // If we closed the active tab, fallback to main
    if (activeTab === tabId) {
      setActiveTab('main');
    }
  }

  const renderTabContent = () => {
    if (activeTab === 'main') {
      return (
        <>
          {/* Search Bar Container */}
          <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6 mb-10">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  id="search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                  type="text"
                  placeholder="Search Hospital..."
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

          {/* Table Container */}
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8 lg:p-10">
            <div className='text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll no-scrollbar'>
              <div className='max-sm:hidden grid grid-cols-[0.5fr_2.5fr_1fr_1fr] gap-1 py-4 px-6 border border-gray-700 rounded-2xl bg-[#1C2635] text-gray-300 font-semibold mb-4 text-lg'>
                <p>#</p>
                <p>Hospital</p>
                <p>Available Beds</p>
                <p>Action</p>
              </div>

              {bedLoading ? (
                <div className="text-center py-20 text-gray-400">
                  <svg className="animate-spin w-10 h-10 mx-auto mb-3 text-[var(--color-secondary)]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <p className="text-lg font-medium">Loading bed state...</p>
                </div>
              ) : bedError ? (
                <div className="text-center py-20 text-red-400">
                  <svg className="w-12 h-12 mx-auto mb-3 text-red-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-lg font-medium">Could not load bed data</p>
                  <p className="text-sm text-gray-500 mt-1">{bedError}</p>
                  <button onClick={getBedState} className="mt-4 px-4 py-2 rounded-lg bg-[var(--color-secondary)]/20 hover:bg-[var(--color-secondary)] text-[var(--color-secondary)] hover:text-white border border-[var(--color-secondary)]/50 text-sm font-semibold transition-all">
                    Retry
                  </button>
                </div>
              ) : filteredHospitalList.length > 0 ? (
                <div className='flex flex-col justify-evenly min-h-[60vh]'>
                  {filteredHospitalList.map((item, index) => (
                    <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-lg sm:grid grid-cols-[0.5fr_2.5fr_1fr_1fr] gap-1 items-center text-gray-400 py-5 px-6 border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors rounded-lg' key={item.id}>
                      <p className='max-sm:hidden text-lg'>{index + 1}</p>

                      <p className='text-gray-200 font-medium text-lg'>{item.name}</p>

                      <p className='text-gray-300 text-lg'>{item.availableBeds}</p>

                      <div>
                        <button
                          onClick={() => handleViewHospital(item)}
                          className='bg-[var(--color-secondary)]/20 hover:bg-[var(--color-secondary)] text-[var(--color-secondary)] hover:text-white border border-[var(--color-secondary)]/50 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-black/20'>
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  <p className="text-lg font-medium">No hospitals found</p>
                </div>
              )}
            </div>
          </div>
        </>
      )
    }

    // Render Patient Specific View
    const activeTabObj = openTabs.find(tab => tab.id === activeTab);
    if (!activeTabObj) return null;
    const activeTabData = activeTabObj.data;

    if (activeTabObj.type === 'add_report') {
      return (
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8 lg:p-10 min-h-[60vh] animate-fadeIn">
          <div className="flex items-center gap-4 mb-8 border-b border-gray-800/50 pb-6">
            <div className="p-3 bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-100">Create Medical Report</h3>
              <p className="text-gray-400 text-sm">For {activeTabData.patientRef?.patientDetail?.name || 'Unknown Patient'}</p>
            </div>
          </div>

          <form className="max-w-4xl space-y-6" onSubmit={(e) => handleSubmitReport(e, activeTabData)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Diagnosis / Symptoms <span className="text-red-400">*</span></label>
                <textarea
                  name="symptom"
                  value={reportFormData.symptom}
                  onChange={handleFormChange}
                  rows="3"
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl p-4 focus:ring-1 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] transition-colors outline-none resize-none"
                  placeholder="Enter patient symptoms..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Prescription <span className="text-red-400">*</span></label>
                <textarea
                  name="prescription"
                  value={reportFormData.prescription}
                  onChange={handleFormChange}
                  rows="3"
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl p-4 focus:ring-1 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] transition-colors outline-none resize-none"
                  placeholder="Enter medication details..."
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Additional Note</label>
                <textarea
                  name="additionalNote"
                  value={reportFormData.additionalNote}
                  onChange={handleFormChange}
                  rows="2"
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl p-4 focus:ring-1 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] transition-colors outline-none resize-none"
                  placeholder="Any dietary or lifestyle advice..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Additional Tests</label>
                <textarea
                  name="additionalTests"
                  value={reportFormData.additionalTests}
                  onChange={handleFormChange}
                  rows="2"
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl p-4 focus:ring-1 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] transition-colors outline-none resize-none"
                  placeholder="Recommended lab tests or diagnostics..."
                ></textarea>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Next Visit Schedule <span className="text-red-400">*</span></label>
              <input
                type="date"
                name="nextVisitSchedule"
                value={reportFormData.nextVisitSchedule}
                onChange={handleFormChange}
                required
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl p-4 focus:ring-1 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] transition-colors outline-none"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-800/50">
              <button
                type="button"
                onClick={(e) => handleCloseTab(e, activeTab)}
                className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors font-medium">
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[var(--color-secondary)] hover:bg-blue-600 text-white transition-colors font-medium shadow-lg shadow-black/20">
                Submit Report
              </button>
            </div>
          </form>
        </div>
      );
    }

    // Render Hospital Bed-Types View
    return (
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8 lg:p-10 min-h-[60vh] animate-fadeIn">
        <div className="flex items-center gap-4 mb-8 border-b border-gray-800/50 pb-6">
          <div className="p-3 bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 12v6a2 2 0 002 2h14a2 2 0 002-2v-6M3 12V8a2 2 0 012-2h4l2-2h2l2 2h4a2 2 0 012 2v4" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-100">{activeTabData.name}</h3>
            <p className="text-gray-400 text-sm">
              {activeTabData.availableBeds} total beds available · Bed type breakdown
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {activeTabData.bedTypes.map((bed) => {
            const ratio = bed.total > 0 ? (bed.available / bed.total) : 0;
            const barColor = ratio > 0.5 ? 'bg-green-500' : ratio > 0.25 ? 'bg-yellow-500' : 'bg-red-500';
            const textColor = ratio > 0.5 ? 'text-green-400' : ratio > 0.25 ? 'text-yellow-400' : 'text-red-400';
            const iconPath = bedTypeMeta[bed.name]?.icon || "";
            return (
              <div key={bed.name} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-5 hover:bg-gray-800/60 hover:border-[var(--color-secondary)]/40 transition-all shadow-inner">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />
                      </svg>
                    </div>
                    <h4 className="text-base font-semibold text-gray-100">{bed.name}</h4>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${ratio > 0.5 ? 'border-green-500/50 bg-green-500/10' : ratio > 0.25 ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-red-500/50 bg-red-500/10'} ${textColor}`}>
                    {ratio > 0.5 ? 'Open' : ratio > 0.25 ? 'Limited' : 'Critical'}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-gray-100">{bed.available}</span>
                  <span className="text-gray-500 text-sm">/ {bed.total} available</span>
                </div>

                <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                  <div className={`${barColor} h-full rounded-full transition-all`} style={{ width: `${ratio * 100}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-primary)] text-white min-h-screen py-4 px-5 md:px-8 h-[700px] overflow-y-scroll no-scrollbar lg:w-full">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between mb-6 items-end">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              BED ALLOCATION
            </h2>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b border-gray-800 mb-8 overflow-x-auto no-scrollbar pt-2">
          <button
            onClick={() => setActiveTab('main')}
            className={`px-6 py-3 font-semibold text-sm transition-all relative ${activeTab === 'main' ? 'text-[var(--color-secondary)] bg-gray-900/80 rounded-t-xl border border-b-0 border-gray-800' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30 rounded-t-xl'}`}
          >
            All Hospitals
            {activeTab === 'main' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-secondary)] rounded-t-md"></span>
            )}
          </button>

          {openTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center gap-3 px-6 py-3 font-semibold text-sm transition-all relative ${activeTab === tab.id ? 'text-[var(--color-secondary)] bg-gray-900/80 rounded-t-xl border border-b-0 border-gray-800' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30 rounded-t-xl'}`}
            >
              <span>{tab.title}</span>
              <div
                onClick={(e) => handleCloseTab(e, tab.id)}
                className={`p-1 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors ${activeTab === tab.id ? 'text-[var(--color-secondary)]' : 'text-gray-500 group-hover:text-gray-300'}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </div>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-secondary)] rounded-t-md"></span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        {renderTabContent()}

      </div>
    </div>
  )
}

export default AssignResources
