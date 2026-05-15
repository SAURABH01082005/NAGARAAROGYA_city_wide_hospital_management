import React, { useState, useEffect, useContext } from 'react';
import { PatientContext } from '../../contexts/PatientContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

function Reports() {
  const { pToken, patientData } = useContext(PatientContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState([]);

  // Tab State
  const [activeTab, setActiveTab] = useState('main');
  const [openTabs, setOpenTabs] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!patientData || !patientData._id) return;
        const { data } = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/patient/get-appointments`, { patientId: patientData._id }, {
          headers: { ptoken: pToken }
        });
        if (data.success) {
          setAppointments(data.data);
        }
      } catch (error) {
        console.error("Error fetching appointments.", error);
      }
    };

    if (pToken && patientData) {
      fetchAppointments();
    }
  }, [pToken, patientData]);

  const filteredAppointments = appointments.filter((appointment) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const docId = appointment.detail?.docId || "";
    const hospId = appointment.detail?.hospitalId || "";
    return docId.toLowerCase().includes(searchLower) || hospId.toLowerCase().includes(searchLower);
  });

  const handleViewAppointment = async (appointment) => {
    const tabId = 'view_' + appointment._id;
    const existingTab = openTabs.find(tab => tab.id === tabId);
    if (existingTab) {
      setActiveTab(tabId);
      return;
    }

    if (openTabs.length >= 2) {
      alert("You can only open a maximum of 2 tabs at a time. Please close one first.");
      return;
    }

    let fetchedReports = [];
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/patient/get-report`,
        { appointmentId: appointment._id },
        { headers: { ptoken: pToken } }
      );
      if (response.data.success) {
        fetchedReports = response.data.data || [];
        console.log("response.data is ", response.data)
        fetchedReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    }

    const newTab = {
      id: tabId,
      title: `Appt: ${appointment.detail?.docId || 'Doctor'}`,
      data: appointment,
      reports: fetchedReports
    };

    setOpenTabs([...openTabs, newTab]);
    setActiveTab(tabId);
  }

  const handleCloseTab = (e, tabId) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(tab => tab.id !== tabId);
    setOpenTabs(newTabs);
    if (activeTab === tabId) {
      setActiveTab('main');
    }
  }

  const renderTabContent = () => {
    if (activeTab === 'main') {
      return (
        <>
          <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6 mb-10">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  id="search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                  type="text"
                  placeholder="Search by doctor or hospital..."
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
            {filteredAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAppointments.map((item, index) => (
                  <div key={item._id || index} className="bg-gray-800/80 border border-gray-700/80 rounded-2xl shadow-lg p-5 hover:border-[var(--color-secondary)] transition-all group flex flex-col">
                    <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-700/50">
                      <div>
                        <h3 className="font-bold text-lg text-gray-200 truncate" title={item.detail?.docId}>{item.detail?.docId || 'Unknown Doctor'}</h3>
                        <p className="text-sm text-gray-400 truncate" title={item.detail?.hospitalId}>{item.detail?.hospitalId || 'Unknown Hospital'}</p>
                      </div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md shrink-0 ml-2 ${item.isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {item.isCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </div>

                    <div className="mb-6">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Date of Appointment</span>
                      <span className="text-sm text-gray-300 font-medium">
                        {item.date ? new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-700/50 flex justify-end">
                      <button
                        onClick={() => handleViewAppointment(item)}
                        className='bg-[var(--color-secondary)]/20 hover:bg-[var(--color-secondary)] text-[var(--color-secondary)] hover:text-white border border-[var(--color-secondary)]/50 px-4 py-2 rounded-lg text-sm font-semibold transition-all w-full'>
                        View Reports
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-800 border-dashed">
                <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 className="text-2xl font-medium text-gray-400">No appointments found</h3>
                <p className="text-gray-500 mt-2">You don't have any appointments matching your search.</p>
              </div>
            )}
          </div>
        </>
      )
    }

    const activeTabObj = openTabs.find(tab => tab.id === activeTab);
    if (!activeTabObj) return null;

    return (
      <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8 lg:p-10 min-h-[60vh] animate-fadeIn">
        <div className="flex justify-between items-start mb-8 border-b border-gray-800/50 pb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-100">Doctor: {activeTabObj.data.detail?.docId || 'Unknown'}</h3>
            <p className="text-[var(--color-secondary)] text-sm font-medium">Hospital: {activeTabObj.data.detail?.hospitalId || 'Unknown'}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Appointment Date: <span className="text-gray-200">{activeTabObj.data.date ? new Date(activeTabObj.data.date).toLocaleDateString() : 'N/A'}</span></p>
          </div>
        </div>

        <h4 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Lab Reports & Diagnostics
        </h4>

        <div className="flex flex-col gap-12">
          {activeTabObj.reports && activeTabObj.reports.length > 0 ? (
            activeTabObj.reports.map((refData, refIdx) => (
              <div key={refIdx} className="w-full animate-fadeIn">
                {/* Horizontal Referral Divider */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 h-px bg-gray-700/70"></div>
                  <div className="flex flex-col items-center bg-gray-900/90 px-6 py-4 rounded-2xl border border-gray-700 shadow-[0_0_15px_rgba(0,0,0,0.5)] relative min-w-[320px]">
                    <div className="absolute -top-3 px-3 py-1 bg-gray-800 border border-gray-600 rounded-full text-[10px] text-gray-400 font-semibold tracking-wider shadow-sm">
                      {refData.reference?.date ? new Date(refData.reference.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date(refData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-200 font-medium mt-2 w-full justify-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">From</span>
                        <span className="text-[var(--color-secondary)] px-3 py-1.5 bg-[var(--color-secondary)]/10 rounded-lg max-w-[120px] truncate text-center" title={refData.reference?.hospitalId}>{refData.reference?.hospitalId || 'Unknown'}</span>
                      </div>
                      <svg className="w-6 h-6 text-gray-500 shrink-0 mt-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">To</span>
                        <span className="text-[var(--color-secondary)] px-3 py-1.5 bg-[var(--color-secondary)]/10 rounded-lg max-w-[120px] truncate text-center" title={refData.reference?.referToHospitalId}>{refData.reference?.referToHospitalId || 'Unknown'}</span>
                      </div>
                    </div>
                    {refData.reference?.reason && (
                      <div className="mt-4 px-4 py-2 bg-gray-800/80 rounded-lg w-full text-xs text-gray-400 flex items-start gap-2 border border-gray-700/50">
                        <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span className="break-words">Reason: <span className="text-gray-300 italic">"{refData.reference.reason}"</span></span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 h-px bg-gray-700/70"></div>
                </div>

                {/* Grid of Reports for this Reference */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {refData.reference?.report && refData.reference.report.length > 0 ? (
                    refData.reference.report.map((report, idx) => (
                      <div key={idx} className="flex flex-col bg-gray-800/80 border border-gray-700/80 rounded-2xl shadow-lg p-5 hover:-translate-y-1 hover:border-[var(--color-secondary)] hover:shadow-[var(--color-secondary)]/20 transition-all duration-300 group">
                        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-700/50">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Date of Visit</span>
                            <span className="text-sm text-gray-300 font-semibold bg-gray-900/80 px-3 py-1 rounded-full border border-gray-700 group-hover:border-[var(--color-secondary)]/50 transition-colors flex items-center gap-2">
                              <svg className="w-3.5 h-3.5 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              {report.date ? new Date(report.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Follow up</span>
                            <span className="text-xs text-[var(--color-secondary)] font-medium bg-[var(--color-secondary)]/10 px-2 py-1 rounded-md">
                              {report.nextVisitSchedule ? new Date(report.nextVisitSchedule).toLocaleDateString('en-GB') : 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4 flex-grow">
                          <div>
                            <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                              Symptoms
                            </h3>
                            <p className="text-lg font-medium text-white group-hover:text-blue-100 transition-colors pl-5">{report.symptom}</p>
                          </div>

                          <div className="bg-gray-900/40 p-3 rounded-xl border border-gray-700/40">
                            <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                              Prescription
                            </h3>
                            <p className="text-sm text-gray-200 pl-5">{report.prescription}</p>
                          </div>

                          {report.additionalTests && report.additionalTests !== "no additional tests" && (
                            <div>
                              <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                Lab Tests
                              </h3>
                              <p className="text-sm text-gray-200 pl-5">{report.additionalTests}</p>
                            </div>
                          )}

                          {report.additionalNote && report.additionalNote !== "no additional note" && (
                            <div className="bg-[var(--color-secondary)]/5 p-3 rounded-xl border border-[var(--color-secondary)]/20 mt-2 relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-secondary)]/50"></div>
                              <h3 className="text-xs text-[var(--color-secondary)] uppercase tracking-wider font-semibold mb-1 pl-2">Doctor's Note</h3>
                              <p className="text-sm text-gray-300 italic pl-2">"{report.additionalNote}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center bg-gray-800/20 border border-gray-700/30 rounded-2xl border-dashed">
                      <p className="text-sm text-gray-500 italic flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        No report records for this referral visit.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-8 flex flex-col items-center justify-center text-center text-gray-500 shadow-inner min-h-[200px] col-span-full w-full">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              <p>No reports or referrals found for this appointment.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-primary)] text-white min-h-screen py-4 px-5 md:px-8 h-[700px] overflow-y-scroll no-scrollbar lg:w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-6 items-end">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              My Appointments
            </h2>
          </div>
        </div>

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

        {renderTabContent()}

      </div>
    </div>
  )
}

export default Reports;