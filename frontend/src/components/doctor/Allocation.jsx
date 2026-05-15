import React, { useContext, useMemo, useState } from 'react'
import { DoctorContext } from '../../contexts/DoctorContext'

// Mirrors bed_allocation2.py — heuristic criticality classification
// until the FastAPI /admit endpoint returns the model's prediction.
const CONDITION_CRITICALITY = {
  "Stroke":                "Critical",
  "Heart Attack":          "Critical",
  "Cancer":                "Critical",
  "Appendicitis":          "Critical",
  "Heart Disease":         "High",
  "Respiratory Infection": "High",
  "Prostate Cancer":       "High",
  "Childbirth":            "Medium",
  "Diabetes":              "Medium",
  "Fractured Leg":         "Medium",
  "Hypertension":          "Medium",
  "Kidney Stones":         "Medium",
  "Allergic Reaction":     "Low",
  "Fractured Arm":         "Low",
  "Osteoarthritis":        "Low",
};

const CRITICALITY_WEIGHTS = { Critical: 100, High: 70, Medium: 40, Low: 10 };

// Same risk keywords as bed_allocation2.py: get_deterioration_risk
const HIGH_RISK_KEYWORDS = ["ventilator", "bypass", "open heart", "c-section", "stroke"];
const MEDIUM_RISK_KEYWORDS = ["stent", "surgery", "ureteroscopy"];

const getRisk = (condition = "", procedure = "") => {
  const text = (condition + " " + procedure).toLowerCase();
  if (HIGH_RISK_KEYWORDS.some(k => text.includes(k))) return "high";
  if (MEDIUM_RISK_KEYWORDS.some(k => text.includes(k))) return "medium";
  return "low";
};

const RISK_WEIGHTS = { high: 30, medium: 15, low: 0 };

const computeScore = (intake) => {
  const criticality = CONDITION_CRITICALITY[intake.condition] || "Medium";
  const risk = getRisk(intake.condition, intake.procedure);
  let score = CRITICALITY_WEIGHTS[criticality] + RISK_WEIGHTS[risk];
  score += Math.min((intake.waitingTime || 0) / 5, 20);
  if (intake.age < 12 || intake.age > 75) score += 5;
  return { criticality, risk, score: Math.round(score * 100) / 100 };
};

const CRITICALITY_STYLE = {
  Critical: "border-red-500/50 text-red-400 bg-red-500/10",
  High:     "border-orange-500/50 text-orange-400 bg-orange-500/10",
  Medium:   "border-yellow-500/50 text-yellow-400 bg-yellow-500/10",
  Low:      "border-green-500/50 text-green-400 bg-green-500/10",
};

function Allocation() {
  const { intakePatients } = useContext(DoctorContext);
  const [searchTerm, setSearchTerm] = useState("");

  const queue = useMemo(() => {
    return (intakePatients || [])
      .map((p) => ({ ...p, triage: computeScore(p.intake) }))
      .sort((a, b) => b.triage.score - a.triage.score);
  }, [intakePatients]);

  const filteredQueue = queue.filter((p) => {
    if (!searchTerm) return true;
    return p.intake.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="bg-[var(--color-primary)] text-white min-h-screen py-4 px-5 md:px-8 h-[700px] overflow-y-scroll no-scrollbar lg:w-full">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between mb-6 items-end">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              ALLOCATION
            </h2>
          </div>
        </div>

        {/* Tab Navigation (single tab to match other doctor screens) */}
        <div className="flex space-x-1 border-b border-gray-800 mb-8 overflow-x-auto no-scrollbar pt-2">
          <button className="px-6 py-3 font-semibold text-sm transition-all relative text-[var(--color-secondary)] bg-gray-900/80 rounded-t-xl border border-b-0 border-gray-800">
            Triage Queue
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-secondary)] rounded-t-md"></span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6 mb-10">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Patient Name..."
                className="w-full bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 rounded-xl pl-5 pr-12 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-base"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)] hover:text-blue-300 transition-colors" aria-label="Search">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Queue Table */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8 lg:p-10">
          <div className='text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll no-scrollbar'>
            <div className='max-sm:hidden grid grid-cols-[0.5fr_0.7fr_2fr_0.7fr_1.8fr_1fr_1fr_0.8fr] gap-2 py-3 px-6 border border-gray-700 rounded-2xl bg-[#1C2635] text-gray-300 font-semibold mb-4'>
              <p>#</p>
              <p>Position</p>
              <p>Patient</p>
              <p>Age</p>
              <p>Condition</p>
              <p>Waiting</p>
              <p>Criticality</p>
              <p>Score</p>
            </div>

            {filteredQueue.length > 0 ? filteredQueue.map((p, index) => {
              const { criticality, risk, score } = p.triage;
              const pillClass = CRITICALITY_STYLE[criticality] || CRITICALITY_STYLE.Medium;
              return (
                <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_0.7fr_2fr_0.7fr_1.8fr_1fr_1fr_0.8fr] gap-2 items-center text-gray-400 py-4 px-6 border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors rounded-lg mb-1' key={p._id}>
                  <p className='max-sm:hidden'>{index + 1}</p>

                  <p className='font-bold text-lg text-gray-100'>#{index + 1}</p>

                  <div className='flex items-center gap-3'>
                    <div className="w-9 h-9 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-300 font-bold">{p.intake.name?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <p className='text-gray-200 font-medium'>{p.intake.name}</p>
                      <p className='text-xs text-gray-500'>{p.intake.gender}</p>
                    </div>
                  </div>

                  <p className='text-gray-300'>{p.intake.age}</p>

                  <div className="truncate" title={p.intake.condition}>
                    <p className='text-gray-200 font-medium'>{p.intake.condition}</p>
                    <p className='text-xs text-gray-500 truncate'>Risk: {risk}</p>
                  </div>

                  <p className='text-gray-300'>{p.intake.waitingTime} min</p>

                  <div>
                    <span className={`text-[10px] uppercase tracking-wider font-bold inline border px-2.5 py-1 rounded-full ${pillClass}`}>
                      {criticality}
                    </span>
                  </div>

                  <p className='text-gray-100 font-bold text-lg'>{score}</p>
                </div>
              );
            }) : (
              <div className="text-center py-20 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium">Queue is empty</p>
                <p className="text-sm text-gray-600 mt-1">New patients added from the Dashboard intake form will appear here, ranked by criticality.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Allocation
