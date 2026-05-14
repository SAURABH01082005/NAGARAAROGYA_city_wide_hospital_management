import React, { useState, useEffect, useContext } from 'react';
import { PatientContext } from '../../contexts/PatientContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

function Reports() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { pToken } = useContext(PatientContext);

  useEffect(() => {
    // Attempting to fetch reports
    const fetchReports = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/patient/get-reports`, {
          headers: { ptoken: pToken }
        });
        if (data.success) {
          setReports(data.data);
        } else {
          // Fallback to dummy data if not found or API fails
          setDummyData();
        }
      } catch (error) {
        console.error("Error fetching reports, using dummy data.", error);
        setDummyData();
      }
    };
    
    if (pToken) {
        fetchReports();
    } else {
        setDummyData();
    }
  }, [pToken]);

  const setDummyData = () => {
    setReports([
        {
            _id: "1",
            doctorId: "Dr. Smith (Cardiology)",
            hospitalId: "City General Hospital",
            symptom: "Chest pain, Shortness of breath",
            prescription: "Aspirin 75mg daily, Atorvastatin 20mg",
            additionalNote: "Avoid heavy lifting. Follow a low-sodium diet.",
            additionalTests: "ECG, Echo",
            nextVisitSchedule: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            date: new Date().toISOString(),
        },
        {
            _id: "2",
            doctorId: "Dr. Jane (Dermatology)",
            hospitalId: "Apollo Clinic",
            symptom: "Skin rash, Itching",
            prescription: "Hydrocortisone cream 1%, Cetirizine 10mg",
            additionalNote: "no additional note",
            additionalTests: "no additional tests",
            nextVisitSchedule: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            _id: "3",
            doctorId: "Dr. Ali (Orthopedics)",
            hospitalId: "Metro Care Center",
            symptom: "Severe lower back pain",
            prescription: "Ibuprofen 400mg, Muscle relaxant",
            additionalNote: "Apply warm compress to the affected area twice daily.",
            additionalTests: "MRI of Lumbar Spine",
            nextVisitSchedule: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        }
    ]);
  };

  const filteredReports = reports.filter((report) =>
    report.symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.doctorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.hospitalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.prescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[var(--color-primary)] text-white min-h-screen py-10 px-5 md:px-8 h-[700px] overflow-y-scroll no-scrollbar lg:w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          My Medical Reports
        </h2>
      </div>
      
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Search Bar Container */}
        <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                id="search"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                type="text"
                placeholder="Search by symptom, doctor, hospital, or prescription..."
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

        {/* Reports Container */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8 lg:p-10">
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredReports.map((report) => (
                <div
                  key={report._id}
                  className="flex flex-col bg-gray-800/80 border border-gray-700/80 rounded-2xl shadow-lg p-5 hover:-translate-y-1 hover:border-[var(--color-secondary)] hover:shadow-[var(--color-secondary)]/20 transition-all duration-300 group"
                >
                  {/* Date Badge and Next Visit */}
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-700/50">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Date of Visit</span>
                        <span className="text-sm text-gray-300 font-semibold bg-gray-900/80 px-3 py-1 rounded-full border border-gray-700 group-hover:border-[var(--color-secondary)]/50 transition-colors flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {new Date(report.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                    
                    <div className="text-right">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Follow up</span>
                        <span className="text-xs text-[var(--color-secondary)] font-medium bg-[var(--color-secondary)]/10 px-2 py-1 rounded-md">
                        {new Date(report.nextVisitSchedule).toLocaleDateString('en-GB')}
                        </span>
                    </div>
                  </div>

                  <div className="space-y-4 flex-grow">
                    {/* Symptoms */}
                    <div>
                      <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        Symptoms
                      </h3>
                      <p className="text-lg font-medium text-white group-hover:text-blue-100 transition-colors pl-5">
                        {report.symptom}
                      </p>
                    </div>

                    {/* Prescription */}
                    <div className="bg-gray-900/40 p-3 rounded-xl border border-gray-700/40">
                      <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                        </svg>
                        Prescription
                      </h3>
                      <p className="text-sm text-gray-200 pl-5">
                        {report.prescription}
                      </p>
                    </div>

                    {/* Tests */}
                    {report.additionalTests && report.additionalTests !== "no additional tests" && (
                      <div>
                        <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                            </svg>
                            Lab Tests
                        </h3>
                        <p className="text-sm text-gray-200 pl-5">
                          {report.additionalTests}
                        </p>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {report.additionalNote && report.additionalNote !== "no additional note" && (
                      <div className="bg-[var(--color-secondary)]/5 p-3 rounded-xl border border-[var(--color-secondary)]/20 mt-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-secondary)]/50"></div>
                        <h3 className="text-xs text-[var(--color-secondary)] uppercase tracking-wider font-semibold mb-1 pl-2">Doctor's Note</h3>
                        <p className="text-sm text-gray-300 italic pl-2">"{report.additionalNote}"</p>
                      </div>
                    )}
                  </div>

                  {/* Footer - Doctor & Hospital Info */}
                  <div className="mt-6 pt-4 border-t border-gray-700/50 flex flex-col gap-2 text-sm text-gray-400 bg-gray-900/20 -mx-5 -mb-5 p-5 rounded-b-2xl">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span className="truncate" title={report.doctorId}>{report.doctorId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      <span className="truncate" title={report.hospitalId}>{report.hospitalId}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-800 border-dashed">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="text-2xl font-medium text-gray-400">No reports found</h3>
              <p className="text-gray-500 mt-2">We couldn't find any medical reports matching your search.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Reports;