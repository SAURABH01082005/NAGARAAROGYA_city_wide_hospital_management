import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { DoctorContext } from '../../contexts/DoctorContext';
import { toast } from 'react-toastify'


function Appointments() {

  const { dToken, doctorData, getDoctorDetails } = useContext(DoctorContext)
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

  const filteredPatientList = appointments.filter((appointment) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const patientName = appointment.patientRef?.patientDetail?.name || "";
    return patientName.toLowerCase().includes(searchLower);
  });

  const getAppointments = async () => {
    try {
      console.log("doctor data is ******************************** ", doctorData)
      const { data } = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/doctor/get-appointments`, { doctorData }, { headers: { dtoken: dToken } })
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (doctorData) {
      getAppointments()
    }
  }, [doctorData])



  // Tab Handlers
  const handleViewPatient = async (appointment) => {
    console.log("appointment item is : ", appointment)
    const tabId = 'view_' + appointment._id;
    // If tab already exists, switch to it
    const existingTab = openTabs.find(tab => tab.id === tabId);
    if (existingTab) {
      setActiveTab(tabId);
      return;
    }

    // Check max tabs limit
    if (openTabs.length >= 2) {
      // alert("You can only open a maximum of 2 tabs at a time. Please close one first.");
      toast.warning("You can only open a maximum of 2 tabs at a time. Please close one first.")
      return;
    }

    // Fetch reports
    let fetchedReports = [];
    try {
      console.log("appointment.appointmentRef is : ", appointment.appointmentRef)
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/doctor/get-report`, { appointmentId: appointment.appointmentRef },
        {
          headers: { dtoken: dToken },

        }
      );
      if (response.data.success) {
        fetchedReports = response.data.data || [];
        fetchedReports.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      console.log("response.data is : ", response.data)
    } catch (err) {
      console.error("Error fetching reports:", err);
    }

    // Open new tab
    const newTab = {
      id: tabId,
      type: 'view',
      title: appointment.patientRef?.patientDetail?.name || 'Unknown Patient',
      data: appointment,
      reports: fetchedReports
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
      // alert("You can only open a maximum of 2 tabs at a time. Please close one first.");
      toast.warn("You can only open a maximum of 2 tabs at a time. Please close one first.")
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
          report: reportData, doctorData
        },
        { headers: { dtoken: dToken } }
      );

      console.log("reponse.data is : ", response.data)
      if (response.data.success) {
        // alert("Report submitted successfully!:message is ", response.data.message);
        toast.success("Report submitted successfully!", response.data.message)
        setReportFormData({
          symptom: "",
          prescription: "",
          additionalNote: "",
          additionalTests: "",
          nextVisitSchedule: ""
        });
        handleCloseTab(e, activeTab);
      } else {
        // alert("Failed: " + response.data.message);
        toast.error("Failed: " + response.data.message)
      }
    } catch (err) {
      console.error(err);
      // alert("Error submitting report");
      toast.error("Error submitting report")
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

              {filteredPatientList.length > 0 ? filteredPatientList.map((item, index) => (
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
                    <button
                      onClick={() => handleViewPatient(item)}
                      className='bg-[var(--color-secondary)]/20 hover:bg-[var(--color-secondary)] text-[var(--color-secondary)] hover:text-white border border-[var(--color-secondary)]/50 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-lg shadow-black/20'>
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
              )}
            </div>
          </div>
        </>
      )
    }

    //copy function
    const copyToClipboard = (text, label = "Text") => {
      navigator.clipboard.writeText(text).then(() => {
        toast.success(`${label} copied successfully!`, {
          autoClose: 2000,
        });
      }).catch(() => {
        toast.error("Failed to copy");
      });
    };

    // Render Patient Specific View
    console.log("opendTabs is : ", openTabs)
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

    // Render View View
    return (
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8 lg:p-10 min-h-[60vh] animate-fadeIn">
        <div className="flex justify-between items-start mb-8 border-b border-gray-800/50 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 border-2 border-[var(--color-secondary)] flex items-center justify-center">
              {activeTabData.patientRef?.patientDetail?.image ? (
                <img src={activeTabData.patientRef.patientDetail.image} alt="Patient" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-300 font-bold text-xl">{activeTabData.patientRef?.patientDetail?.name?.charAt(0) || '?'}</span>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-100">
                {activeTabData.patientRef?.patientDetail?.name || 'Unknown Patient'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[var(--color-secondary)] text-sm font-medium">
                  {activeTabData.patientRef?.patientDetail?.email || 'Email not available'}
                </p>

                {/* Copy Button */}
                {activeTabData.patientRef?.patientDetail?.email && (
                  <button
                    onClick={() => copyToClipboard(activeTabData.patientRef.patientDetail.email, "Email")}
                    className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded hover:bg-gray-700"
                    title="Copy Email"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.25}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16v-4m4 4v4m4-8v8m4-4v-4m-16 0h.01M12 4v.01" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-1M16 4h2a2 2 0 012 2v1" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-3">
            <div className="text-right">
              <p className="text-gray-400 text-sm">Age: <span className="text-gray-200">{calculateAge(activeTabData.patientRef?.patientDetail?.dob)}</span></p>
              <p className="text-gray-400 text-sm">Admitted: <span className="text-gray-200">{new Date(activeTabData.createdAt).toLocaleDateString()}</span></p>
            </div>
            <button
              onClick={() => handleAddReport(activeTabData)}
              className="flex items-center gap-2 bg-[var(--color-secondary)] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-black/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Add Report
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        <h4 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Lab Reports & Diagnostics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTabObj.reports && activeTabObj.reports.length > 0 ? (
            activeTabObj.reports.map((report, idx) => (
              <div key={idx} className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 shadow-lg shadow-black/20 hover:border-[var(--color-secondary)]/50 transition-colors flex flex-col h-full">
                <div className="flex justify-between items-start mb-3 border-b border-gray-700/50 pb-2">
                  <h5 className="font-bold text-gray-200">Visit: {new Date(report.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</h5>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] rounded-md">Report</span>
                </div>
                <div className="space-y-3 text-sm flex-grow">
                  <div><span className="text-gray-400 block text-xs uppercase mb-0.5">Symptoms:</span> <span className="text-gray-300">{report.symptom}</span></div>
                  <div><span className="text-gray-400 block text-xs uppercase mb-0.5">Prescription:</span> <span className="text-gray-300">{report.prescription}</span></div>
                  {report.additionalNote && <div><span className="text-gray-400 block text-xs uppercase mb-0.5">Notes:</span> <span className="text-gray-300">{report.additionalNote}</span></div>}
                  {report.additionalTests && <div><span className="text-gray-400 block text-xs uppercase mb-0.5">Tests:</span> <span className="text-gray-300">{report.additionalTests}</span></div>}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-700/50">
                  <p><span className="text-gray-400 text-xs uppercase">Next Visit:</span> <span className="text-[var(--color-secondary)] font-medium ml-1">{new Date(report.nextVisitSchedule).toLocaleDateString()}</span></p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-8 flex flex-col items-center justify-center text-center text-gray-500 shadow-inner min-h-[200px] col-span-full">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              <p>No reports have been uploaded for this patient yet.</p>
            </div>
          )}
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
              IPD Appointments
            </h2>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b border-gray-800 mb-8 overflow-x-auto no-scrollbar pt-2">
          <button
            onClick={() => setActiveTab('main')}
            className={`px-6 py-3 font-semibold text-sm transition-all relative ${activeTab === 'main' ? 'text-[var(--color-secondary)] bg-gray-900/80 rounded-t-xl border border-b-0 border-gray-800' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30 rounded-t-xl'}`}
          >
            All Appointments
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

export default Appointments;