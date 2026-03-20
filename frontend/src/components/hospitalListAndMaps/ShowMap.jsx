import React from 'react'
import ShowHospitalMap from './ShowHospitalMap';
import { APIProvider, Map } from '@vis.gl/react-google-maps';



function ShowMap() {


  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  
  if (!apiKey) {
    return <div style={{ padding: '2rem', color: 'red' }}>Missing API key in .env</div>;
  }

  return (
    <div className="w-[800px] h-[750px] bg-gray-900/70 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-xl shadow-black/40 p-2 md:p-6">
      <APIProvider apiKey={apiKey} region="IN" language="en">
        <ShowHospitalMap  >

        </ShowHospitalMap>
      </APIProvider>
    </div>
  );

}


export default ShowMap