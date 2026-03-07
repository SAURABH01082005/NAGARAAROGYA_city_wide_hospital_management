"use client";

import { useContext, useState } from "react";
import { PatientContext } from "../../contexts/PatientContext";

const hospitals = [
  {
    id: "HOSP-001",
    name: "Apollo Hospitals Navi Mumbai",
    address: "Parsik Hill Road, Sector 23, CBD Belapur, Navi Mumbai, Maharashtra 400614",
  },
  {
    id: "HOSP-002",
    name: "Kokilaben Dhirubhai Ambani Hospital",
    address: "Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai, Maharashtra 400053",
  },
  {
    id: "HOSP-003",
    name: "Lilavati Hospital and Research Centre",
    address: "A-791, Bandra Reclamation Rd, General Arunkumar Vaidya Nagar, Bandra West, Mumbai, Maharashtra 400050",
  },
  {
    id: "HOSP-004",
    name: "Fortis Hospital Mulund",
    address: "Mulund - Goregaon Link Rd, Nahur West, Industrial Area, Bhandup West, Mumbai, Maharashtra 400078",
  },
  {
    id: "HOSP-005",
    name: "Jaslok Hospital and Research Centre",
    address: "15, Dr. G. Deshmukh Marg, Pedder Road, Mumbai, Maharashtra 400026",
  },
  {
    id: "HOSP-006",
    name: "Nanavati Max Super Speciality Hospital",
    address: "LIC Colony, Suresh Colony, Vile Parle West, Mumbai, Maharashtra 400056",
  },
  // Add more hospitals as needed
];

export default function ShowHospitalList() {
    const {addressTimeDateAndDetailsArray,setAddressTimeDateAndDetailsArray} = useContext(PatientContext)
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHospitals = addressTimeDateAndDetailsArray.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[var(--color-primary)] text-white   px-5 md:px-8 w-[500px] h-[780px] overflow-y-scroll no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Search Bar – same style as before */}
        <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6">
          <div className="max-w-2xl mx-auto">
            <label htmlFor="search" className="block text-lg font-medium mb-3 text-center md:text-left">
              Search Hospitals
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Hospital name, ID or location..."
                className="w-full bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 rounded-xl pl-5 pr-12 py-4 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition-all text-lg"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Hospitals Grid */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8 lg:p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Our Network Hospitals
            </h2>
            <p className="mt-3 text-lg text-gray-400 max-w-3xl mx-auto">
              {searchTerm
                ? `Showing ${filteredHospitals.length} matching hospital${filteredHospitals.length !== 1 ? 's' : ''}`
                : "Trusted healthcare partners across Mumbai and surrounding areas"}
            </p>
          </div>

          {filteredHospitals.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-xl">
              No hospitals found matching "{searchTerm}". Try another search term.
            </div>
          ) : (
            <div className="">
              {filteredHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="bg-gray-800/70 border border-gray-700/60 rounded-2xl overflow-hidden shadow-xl shadow-black/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(93,132,249,0.15)] hover:border-[var(--color-secondary)]/40 group w-full mb-3.5"
                  style={{ width: '500px', height: '300px', maxWidth: '100%' }}
                >
                  <div className="h-full flex flex-col p-6 md:p-8">
                    {/* Hospital ID */}
                    <div className="text-sm font-mono text-[var(--color-secondary)] tracking-wide mb-2">
                      {hospital.id}
                    </div>

                    {/* Hospital Name */}
                    <h3 className="text-2xl md:text-2xl font-bold leading-tight group-hover:text-[var(--color-secondary)] transition-colors mb-4 line-clamp-2">
                      {hospital.name}
                    </h3>

                    {/* Address */}
                    <div className="flex-1 text-gray-300 text-base leading-relaxed line-clamp-4 md:line-clamp-5">
                      {hospital.address}
                    </div>
                   

                    {/* Optional footer / action */}
                    <div className="flex pt-4 border-t border-gray-700/50 justify-between">
                     <div className="flex-1 text-gray-300 text-base leading-relaxed line-clamp-4 md:line-clamp-5 ">
                      {hospital.distanceKm} {" km  |  "}{hospital.durationMin}
                    </div>
                      <span className="text-sm text-gray-400 group-hover:text-[var(--color-secondary)] transition-colors">
                        View Details →
                      </span>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}