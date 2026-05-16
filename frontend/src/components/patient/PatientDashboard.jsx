import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { PatientContext } from '../../contexts/PatientContext';

function PatientDashboard() {
  const { pToken, patientData } = useContext(PatientContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAppointments = async () => {
    try {
      if (!patientData || !patientData._id) return;
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/patient/get-appointments`,
        { patientId: patientData._id },
        { headers: { ptoken: pToken } }
      );
      if (data.success) {
        setAppointments(data.data.reverse());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pToken && patientData?._id) {
      getAppointments();
    } else if (!pToken) {
      setLoading(false);
    }
  }, [pToken, patientData]);

  // Summaries
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(app => app.isCompleted).length;
  const pendingAppointments = totalAppointments - completedAppointments;

  // Latest 5 appointments
  const latestAppointments = appointments.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[var(--color-primary)] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-secondary)]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-primary)] text-white min-h-screen py-4 px-5 md:px-8 h-[700px] overflow-y-scroll no-scrollbar lg:w-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Patient Dashboard</h2>
          <p className="text-gray-400">Welcome back, {patientData?.name || 'Patient'}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl shadow-black/40 hover:border-[var(--color-secondary)]/50 transition-colors flex items-center gap-5">
            <div className="p-4 bg-blue-500/10 rounded-xl">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Appointments</p>
              <h3 className="text-3xl font-bold text-gray-100">{totalAppointments}</h3>
            </div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl shadow-black/40 hover:border-yellow-500/50 transition-colors flex items-center gap-5">
            <div className="p-4 bg-yellow-500/10 rounded-xl">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Pending Appointments</p>
              <h3 className="text-3xl font-bold text-gray-100">{pendingAppointments}</h3>
            </div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl shadow-black/40 hover:border-green-500/50 transition-colors flex items-center gap-5">
            <div className="p-4 bg-green-500/10 rounded-xl">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Completed Appointments</p>
              <h3 className="text-3xl font-bold text-gray-100">{completedAppointments}</h3>
            </div>
          </div>
        </div>

        {/* Latest Appointments */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Recent Appointments
            </h3>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-[0.5fr_2.5fr_2.5fr_1fr] gap-4 py-3 px-6 border border-gray-700 rounded-xl bg-[#1C2635] text-gray-300 font-semibold mb-3">
                <p>#</p>
                <p>Doctor & Hospital</p>
                <p>Date</p>
                <p>Status</p>
              </div>

              {latestAppointments.length > 0 ? latestAppointments.map((item, index) => (
                <div className="grid grid-cols-[0.5fr_2.5fr_2.5fr_1fr] gap-4 items-center text-gray-400 py-4 px-6 border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors rounded-lg" key={item._id || index}>
                  <p>{index + 1}</p>
                  
                  <div>
                    <p className="text-gray-200 font-medium text-sm truncate" title={item.detail?.docId}>{item.detail?.docId || 'Unknown Doctor'}</p>
                    <p className="text-xs text-gray-500 truncate" title={item.detail?.hospitalId}>{item.detail?.hospitalId || 'Unknown Hospital'}</p>
                  </div>

                  <p className="text-sm text-gray-300">
                    {item.date ? new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                  </p>

                  <div>
                    <p className={`text-[10px] uppercase tracking-wider font-bold inline border px-2.5 py-1 rounded-full ${item.isCompleted ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'}`}>
                      {item.isCompleted ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-gray-500">
                  <p>No recent appointments found</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PatientDashboard;