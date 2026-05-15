import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { DoctorContext } from '../../contexts/DoctorContext'

const GENDERS = ["Male", "Female"];

const CONDITIONS = [
  "Allergic Reaction",
  "Appendicitis",
  "Cancer",
  "Childbirth",
  "Diabetes",
  "Fractured Arm",
  "Fractured Leg",
  "Heart Attack",
  "Heart Disease",
  "Hypertension",
  "Kidney Stones",
  "Osteoarthritis",
  "Prostate Cancer",
  "Respiratory Infection",
  "Stroke",
];

const PROCEDURES = [
  "Angioplasty",
  "Antibiotics and Rest",
  "Appendectomy",
  "Cardiac Catheterization",
  "Cast and Physical Therapy",
  "CT Scan and Medication",
  "Delivery and Postnatal Care",
  "Epinephrine Injection",
  "Insulin Therapy",
  "Lithotripsy",
  "Medication and Counseling",
  "Physical Therapy and Pain Management",
  "Radiation Therapy",
  "Surgery and Chemotherapy",
  "X-Ray and Splint",
];

function DoctorDashboard() {
  const { addIntakePatient, intakePatients } = useContext(DoctorContext);

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    condition: "",
    procedure: "",
    waitingTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const patientNumber = (intakePatients?.length || 0) + 1;
    const intakeData = {
      name: `Patient ${patientNumber}`,
      age: Number(formData.age),
      gender: formData.gender,
      condition: formData.condition,
      procedure: formData.procedure,
      waitingTime: Number(formData.waitingTime),
    };
    addIntakePatient(intakeData);
    toast.success(`${intakeData.name} added to Appointments`);
    handleReset();
  };

  const handleReset = () => {
    setFormData({ age: "", gender: "", condition: "", procedure: "", waitingTime: "" });
  };

  return (
    <div className="bg-[var(--color-primary)] text-white min-h-screen py-4 px-5 md:px-8 h-[700px] overflow-y-scroll no-scrollbar lg:w-full">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between mb-6 items-end">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              PATIENT INTAKE
            </h2>
          </div>
        </div>

        {/* Tab Navigation (single tab, matches Appointments / Bed Allocation chrome) */}
        <div className="flex space-x-1 border-b border-gray-800 mb-8 overflow-x-auto no-scrollbar pt-2">
          <button
            className="px-6 py-3 font-semibold text-sm transition-all relative text-[var(--color-secondary)] bg-gray-900/80 rounded-t-xl border border-b-0 border-gray-800"
          >
            New Patient
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-secondary)] rounded-t-md"></span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8 lg:p-10 min-h-[60vh]">
          <div className="flex items-center gap-4 mb-8 border-b border-gray-800/50 pb-6">
            <div className="p-3 bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-100">New Patient Arrival</h3>
              <p className="text-gray-400 text-sm">Fill in the details below to triage and allocate a bed</p>
            </div>
          </div>

          <form className="max-w-4xl space-y-6" onSubmit={handleSubmit}>
            {/* Row 1: Age + Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Age <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  max="120"
                  required
                  placeholder="Enter age in years"
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl p-4 focus:ring-1 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] transition-colors outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender <span className="text-red-400">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl p-4 focus:ring-1 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] transition-colors outline-none"
                >
                  <option value="" disabled>Select gender</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Condition + Procedure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Condition <span className="text-red-400">*</span>
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl p-4 focus:ring-1 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] transition-colors outline-none"
                >
                  <option value="" disabled>Select condition</option>
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Procedure <span className="text-red-400">*</span>
                </label>
                <select
                  name="procedure"
                  value={formData.procedure}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl p-4 focus:ring-1 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] transition-colors outline-none"
                >
                  <option value="" disabled>Select procedure</option>
                  {PROCEDURES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Waiting time */}
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Waiting Time (minutes) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="waitingTime"
                value={formData.waitingTime}
                onChange={handleChange}
                min="0"
                required
                placeholder="e.g. 15"
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl p-4 focus:ring-1 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] transition-colors outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-800/50">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors font-medium">
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[var(--color-secondary)] hover:bg-blue-600 text-white transition-colors font-medium shadow-lg shadow-black/20">
                Submit
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default DoctorDashboard
