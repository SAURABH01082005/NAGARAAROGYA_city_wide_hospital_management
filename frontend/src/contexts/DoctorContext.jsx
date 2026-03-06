import axios from "axios";
import React, { createContext, useState ,useEffect} from "react";
import { assets } from "../assets/assets";


const DoctorContext = createContext();

const DoctorContextProvider = (props)=>{
    const [dToken, setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):"");
    const [doctorData,setDoctorData] = useState()

    const getDoctorDetails = async ()=>{
        const {data} = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/doctor/get-doctordetails`,{headers:{dtoken:dToken}})
         console.log("data is :" ,data)
         console.log("dtoken ",dToken)
         setDoctorData(data.data)
    }
    
    useEffect(()=>{
        if(dToken)
        getDoctorDetails()
        else 
            setDoctorData()
    },[dToken])

    const value = {
        dToken,setDToken,getDoctorDetails,doctorData,
    }
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}
export default DoctorContextProvider;
export {DoctorContext};