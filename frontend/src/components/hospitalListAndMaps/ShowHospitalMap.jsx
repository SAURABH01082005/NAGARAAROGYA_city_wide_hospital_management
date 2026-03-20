import { useState, useEffect, useContext } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { PatientContext } from '../../contexts/PatientContext';

export default function ShowHospitalMap() {

  const {addressAndDetailsArray,setAddressAndDetailsArray,addressTimeDateAndDetailsArray,setAddressTimeDateAndDetailsArray} = useContext(PatientContext)
  const [userPosition, setUserPosition] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [distances, setDistances] = useState({}); // { destName: { distanceKm, duration } }
  const [status, setStatus] = useState('pending');
  const [errorMessage, setErrorMessage] = useState(null);
  const [hasFittedBounds, setHasFittedBounds] = useState(false);

  const map = useMap();
  const geocodingLibrary = useMapsLibrary('geocoding');
  const routesLibrary = useMapsLibrary('routes'); // for Distance Matrix

  // const addressAndDetailsArray = props.addressAndDetailsArray
  console.log(addressAndDetailsArray ,"*****************************")
  // const addressAndDetailsArray = addressAndDetailsArray

  // const addressAndDetailsArray = [
  //   { name: 'Destination A', address: '28, Yashwant Vidyalaya Rd, section 30 A, Krishna Nagar, Ulhasnagar, Maharashtra 421004' },
    // { name: 'Destination B', address: 'New Star Bekary, Shop No 2, F Cabin Rd, Katemanivali, Kalyan E, Mumbai, Kalyan, Maharashtra 421306' },
  //   { name: 'Destination C', address: 'Yashodhan Bungalow, 64HG+5M5, Atmaram Nagar, Lokgram, Kalyan, Maharashtra 421306' },
  // ];

  // Get user location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMessage('Geolocation not supported.');
      return;
    }

    setStatus('pending');
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPosition({ lat: latitude, lng: longitude });
        setStatus('success');
      },
      (err) => {
        setStatus('error');
        let msg = 'Could not get location.';
        if (err.code === 1) msg = 'Permission denied.';
        if (err.code === 2) msg = 'Position unavailable.';
        if (err.code === 3) msg = 'Timeout.';
        setErrorMessage(msg + ' Using Mumbai fallback.');
        setUserPosition({ lat: 19.0760, lng: 72.8777 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  // Geocode destinations
  useEffect(() => {
    if (!geocodingLibrary) return;

    const geocoder = new geocodingLibrary.Geocoder();

    const promises = addressAndDetailsArray?.map((dest) =>
      new Promise((resolve) => {
        geocoder.geocode({ address: dest.address, region: 'IN' }, (results, status) => {
          if (status === geocodingLibrary.GeocoderStatus.OK && results?.[0]?.geometry?.location) {
            const loc = results[0].geometry.location;
            resolve({
              name: dest.name,
              address: dest.address,
              position: { lat: loc.lat(), lng: loc.lng() },
            });
          } else {
            console.warn(`Geocode failed for ${dest.name}: ${status}`);
            resolve(null);
          }
        });
      })
    );

    Promise.all(promises).then((resolved) => {
      setDestinations(resolved.filter(Boolean));
    });
  }, [geocodingLibrary]);

  // Calculate road distances using Distance Matrix Service
  useEffect(() => {
    // require google.maps to be loaded as well so enums exist
    if (!routesLibrary || !map || !userPosition || destinations.length === 0 || !window.google?.maps) return;

    const service = new routesLibrary.DistanceMatrixService();

    const origins = [userPosition];
    const destinationsPos = destinations.map(d => d.position);
    console.log("destinations is :",destinations)

    // use google.maps enums directly (routesLibrary may not expose UnitSystem)
    const request = {
      origins,
      destinations: destinationsPos,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    };

    service.getDistanceMatrix(request, (response, status) => {
      if (status === 'OK' && response) {
        const newDistances = {};
        const row = response.rows[0]; // since only one origin (user)

        destinations.forEach((dest, index) => {
          const element = row.elements[index];
          if (element.status === 'OK') {
            const distanceKm = (element.distance.value / 1000).toFixed(1); // meters → km
            const durationMin = element.duration.text; // e.g. "15 mins"
            newDistances[dest.name] = { distanceKm, duration: durationMin };
          } else {
            newDistances[dest.name] = { distanceKm: 'N/A', duration: 'N/A' };
          }
        });

        setDistances(newDistances);
        console.log("distance is : ",distances)
      } else {
        console.warn('Distance Matrix failed:', status);
      }
    });
  }, [routesLibrary, map, userPosition, destinations]);

  // Auto-fit bounds (user + destinations when they first appear)
useEffect(() => {
  if (!map || !userPosition || destinations.length === 0 || hasFittedBounds) return;

  const bounds = new google.maps.LatLngBounds();
  bounds.extend(userPosition);
  destinations.forEach(d => bounds.extend(d.position));
  map.fitBounds(bounds, { padding: 50 });
  setHasFittedBounds(true);
}, [map, userPosition, destinations, hasFittedBounds]);

  // Calculate road distances using Distance Matrix Service
// Calculate road distances using Distance Matrix Service
// Calculate road distances using Distance Matrix Service
useEffect(() => {
  if (!routesLibrary || !map || !userPosition || destinations.length === 0) return;
  console.log('google.maps exists?', !!google.maps);
console.log('TravelMode.DRIVING exists?', !!google.maps?.TravelMode?.DRIVING);
console.log('UnitSystem.METRIC exists?', !!google.maps?.UnitSystem?.METRIC);
console.log('DistanceMatrixStatus.OK exists?', !!google.maps?.DistanceMatrixStatus?.OK);

  // Use global google.maps for enums/constants
  const service = new routesLibrary.DistanceMatrixService();

  const origins = [userPosition];
  const destinationsPos = destinations.map(d => d.position);

  const request = {
    origins,
    destinations: destinationsPos,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  };

  service.getDistanceMatrix(request, (response, status) => {
    if (status === google.maps.DistanceMatrixStatus.OK && response) {
      const newDistances = {};
      const row = response.rows[0]; // user is the only origin

      destinations.forEach((dest, index) => {
        const element = row.elements[index];
        if (element.status === google.maps.DistanceMatrixElementStatus.OK) {
          const distanceKm = (element.distance.value / 1000).toFixed(1); // meters → km
          const durationText = element.duration.text; // e.g. "18 mins"
          newDistances[dest.name] = { distanceKm, duration: durationText };
        } else {
          newDistances[dest.name] = { distanceKm: 'N/A', duration: 'N/A' };
        }
      });

      setDistances(newDistances);
    } else {
      console.warn('Distance Matrix failed with status:', status);
      // Optional: set error state for UI
    }
  });
}, [routesLibrary, map, userPosition, destinations]);

function calTimeandDistance(){

  const k=destinations.map((dest,index)=>{
     const distInfo = distances[dest.name];
    //  distInfo ? `${distInfo.distanceKm} km (${distInfo.duration}
    return {...addressAndDetailsArray[index],distanceKm:distInfo?.distanceKm,durationMin:distInfo?.duration}

  })
  // setAddressAndDetailsArray(k)
  k.sort((a,b)=>a.distanceKm-b.distanceKm);
  setAddressTimeDateAndDetailsArray(k)
  
  console.log("sorting based on distance is :",k)
}

useEffect(()=>{

  calTimeandDistance()
  
},[destinations,distances])

  return (
    <>
      <Map
        defaultCenter={{ lat: 19.2, lng: 73.15 }}
        defaultZoom={11}
        mapId="DEMO_MAP_ID"
        gestureHandling="greedy"
        zoomControl={true}
        minZoom={9}
        maxZoom={17}
        clickableIcons={false}
        fullscreenControl={false}
        streetViewControl={false}
      >
        {/* User */}
        {userPosition && (
          <AdvancedMarker position={userPosition} title="You are here">
            <Pin background={'#FF0000'} glyphColor={'#fff'} borderColor={'#000'} />
          </AdvancedMarker>
        )}

        {/* Destinations with road distance in title */}
        {destinations.map((dest) => {
          const distInfo = distances[dest.name];
          const titleExtra = distInfo
            ? `\nRoad: ${distInfo.distanceKm} km (${distInfo.duration})`
            : '\nCalculating road distance...';

          return (
            <AdvancedMarker
              key={dest.name}
              position={dest.position}
              title={`${dest.name}\n${dest.address}${titleExtra}`}
            >
              <Pin
                background={'#34A853'}
                glyphColor={'#fff'}
                borderColor={'#1E8E3E'}
              />
            </AdvancedMarker>
          );
        })}
      </Map>

      {/* Status + distances list */}
      {/* <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'white',
          padding: '12px 16px',
          borderRadius: 8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
          zIndex: 10,
          maxWidth: 320,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        {status === 'pending' && <p>Locating you...</p>}
        {status === 'success' && (
          <>
            <p style={{ margin: 0, fontWeight: 'bold' }}>
              Your location + {destinations.length} destinations
            </p>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, fontSize: '0.95em' }}>
             
              {destinations.map(dest => {
                const distInfo = distances[dest.name];
                console.log("destinations*************************",destinations)
                console.log("disInfo*************************",distInfo)
                return (
                  <li key={dest.name}>
                    {dest.name}: {distInfo ? `${distInfo.distanceKm} km (${distInfo.duration})` : 'calculating...'}
                  </li>
                );
              })}
            </ul>
          </>
        )}
        {status === 'error' && (
          <>
            <p style={{ color: '#c62828', margin: '0 0 8px' }}>{errorMessage}</p>
            <button
              onClick={getUserLocation}
              style={{
                padding: '8px 16px',
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Retry Location
            </button>
          </>
        )}
      </div> */}
    </>
  );
}