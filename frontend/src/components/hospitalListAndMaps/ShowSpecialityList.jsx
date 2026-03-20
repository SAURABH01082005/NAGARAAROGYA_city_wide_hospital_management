import React ,{useState,useContext} from 'react'
import { PatientContext } from '../../contexts/PatientContext.jsx';
import { doctorSpecialities } from "../../generalData/doctorSpecialities.js";
import { doctorSpecialityAssets } from "../../assets/specialityofdoctor/assets.js"
import { NavLink } from 'react-router-dom';


function ShowSpecialityList(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const { setSpeciality } = useContext(PatientContext)



  // Filter specialties based on search (case-insensitive)
  const filteredSpecialities = doctorSpecialities.filter((speciality) =>
    speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (

    <div className="bg-[var(--color-primary)] text-white min-h-screen py-10 px-5 md:px-8 h-[700px] overflow-y-scroll no-scrollbar lg:w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          Our OPD Specialities
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
                placeholder="e.g. Paediatrics, Neurology, Dermatology..."
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

        {/* Specialties Container */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/70 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8 lg:p-10">


          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {filteredSpecialities.map((specialty) => (
              <NavLink
                key={specialty}
                className="flex flex-col items-center group "//hover:scale-125 transition-all duration-300
                to = {`../${specialty}/hospital-list`}
                onClick={() => setSpeciality(specialty)}
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-[var(--color-secondary)]/30 group-hover:border-[var(--color-secondary)] transition-all duration-300 shadow-lg shadow-black/40 bg-gray-800 flex items-center justify-center ring-1 ring-gray-700/50 group-hover:ring-[var(--color-secondary)]/40 ">
                  {/* {console.log(`${specialty.toLowerCase().replace(/\s+/g, "")}Icon`)} */}
                  <img
                    src={doctorSpecialityAssets[`${specialty.toLowerCase()}Icon`] || doctorSpecialityAssets['defaultIcon']}

                    alt={specialty}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-4 text-base md:text-lg font-medium text-center leading-tight group-hover:text-[var(--color-secondary)] transition-colors duration-200">
                  {specialty}
                </h3>
              </NavLink>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ShowSpecialityList