import React, { useContext } from 'react';
import { PatientContext } from '../../contexts/PatientContext.jsx';

function Profile() {
  const { patientData } = useContext(PatientContext);

  if (!patientData || !patientData.patientDetail) {
    return (
      <div className="bg-[var(--color-primary)] text-white min-h-screen flex justify-center items-center h-[700px] lg:w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--color-secondary)]"></div>
      </div>
    );
  }

  const { patientDetail, appointment } = patientData;

  return (
    <div className="bg-[var(--color-primary)] text-white min-h-screen py-10 px-5 md:px-8 h-[700px] overflow-y-scroll no-scrollbar lg:w-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Profile Header Card */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-[var(--color-secondary)] to-blue-600 opacity-80"></div>
          
          <div className="px-8 pb-8 relative">
            {/* Profile Image */}
            <div className="absolute -top-16 border-4 border-gray-900 rounded-full bg-gray-800 overflow-hidden w-32 h-32 shadow-xl shadow-black/40">
              {patientDetail.image ? (
                <img src={patientDetail.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex justify-center items-center bg-gray-700 text-gray-400 text-4xl font-bold uppercase">
                  {patientDetail.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="pt-20">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{patientDetail.name}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                    <svg className="w-6 h-6 text-[var(--color-secondary)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                      <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Email</h3>
                      <p className="text-lg text-gray-200">{patientDetail.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                    <svg className="w-6 h-6 text-[var(--color-secondary)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                      <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Date of Birth</h3>
                      <p className="text-lg text-gray-200">
                        {new Date(patientDetail.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 h-full">
                    <svg className="w-6 h-6 text-[var(--color-secondary)] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <div>
                      <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Address</h3>
                      <p className="text-md text-gray-200 leading-relaxed">
                        {patientDetail.address?.line1}<br />
                        {patientDetail.address?.line2}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 pl-2 border-l-4 border-[var(--color-secondary)]">
            My Appointments
          </h2>
          
          {appointment && appointment.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {appointment.map((app, index) => (
                <div key={app._id || index} className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-xl shadow-black/30 p-6 flex flex-col hover:border-[var(--color-secondary)]/50 hover:shadow-[var(--color-secondary)]/10 transition-all duration-300">
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] flex items-center justify-center border border-[var(--color-secondary)]/30">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Appointment ID</p>
                        <p className="text-sm font-mono text-gray-300">{app.detail.appointmentId}</p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${app.isCompleted ? 'bg-green-900/30 text-green-400 border-green-800/50' : 'bg-yellow-900/30 text-yellow-400 border-yellow-800/50'}`}>
                      {app.isCompleted ? 'Completed' : 'Upcoming'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 flex-grow">
                    <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/30">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Doctor ID</p>
                      <p className="text-sm text-gray-200 truncate" title={app.detail.docId}>{app.detail.docId}</p>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/30">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Hospital ID</p>
                      <p className="text-sm text-gray-200 truncate" title={app.detail.hospitalId}>{app.detail.hospitalId}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-center text-sm">
                    <div className="flex items-center text-gray-400 gap-2">
                       <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"></path>
                       </svg>
                       {new Date(app.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-900/40 rounded-2xl border border-gray-800 border-dashed">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <h3 className="text-xl font-medium text-gray-400">No Appointments</h3>
              <p className="text-gray-500 mt-2">You don't have any appointments booked yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;