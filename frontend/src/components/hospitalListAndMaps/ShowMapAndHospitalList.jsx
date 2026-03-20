import React from 'react'
import { useContext } from 'react'
import { PatientContext } from '../../contexts/PatientContext.jsx'
import ShowHospitalList from './showHospitalList.jsx'
import ShowMap from './ShowMap.jsx'


function ShowMapAndHospitalList(props) {

  const { getHospitalsAddress, addressAndDetailsArray, setAddressAndDetailsArray ,speciality,setSpeciality} = useContext(PatientContext)


  // console.log(addressAndDetailsArray, "************in appointment ")

  return (
    
    <>{speciality && addressAndDetailsArray?.length 
      ? <>
      <ShowHospitalList/>

      <ShowMap />
      
      </>
      
      : <> <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6 m-auto">
          <div className="max-w-2xl mx-auto">
             <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              No Hospital Available for this OPD
            </h2>
            
          </div>
        </div>
</>
    }
    </>
  )
}


export default ShowMapAndHospitalList