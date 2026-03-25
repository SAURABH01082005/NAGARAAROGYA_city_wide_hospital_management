import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";


const PatientContext = createContext();


const PatientContextProvider = (props) => {
    const [pToken, setPToken] = useState(localStorage.getItem('pToken') ? localStorage.getItem('pToken') : "");
    const [patientData, setPatientData] = useState({})
    const [addressAndDetailsArray, setAddressAndDetailsArray] = useState([])
    const [addressTimeDateAndDetailsArray, setAddressTimeDateAndDetailsArray] = useState([])
    const [speciality, setSpeciality] = useState()
    

    const getPatientDetails = async () => {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/patient/get-patientdetails`, { headers: { ptoken: pToken } })
        // console.log("data is :", data)
        // console.log("ptoken ", pToken)
         setPatientData(data.data)
        // console.log("data.data is ",data.data)
        // console.log("patient data is ",patientData)


    }

    const getHospitalsAddress = async () => {
        try {

            const { data } = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/general/specialities-available-and-address`, { speciality: speciality })
            console.log("********************testing data is *************", data)
            setAddressAndDetailsArray(data.data)

        } catch (err) {
            toast.error(err.message)

        }
    }

    useEffect(() => {
        if (speciality){
            setAddressAndDetailsArray()
            getHospitalsAddress()
        }
    }, [speciality])

    useEffect(() => {
        if (pToken)
            getPatientDetails();
        else
            setPatientData()


    }, [pToken])


    const value = {
        pToken,
        setPToken, patientData, getPatientDetails, getHospitalsAddress, addressAndDetailsArray, setAddressAndDetailsArray,
        speciality,setSpeciality,addressTimeDateAndDetailsArray,setAddressTimeDateAndDetailsArray,
       

    }
    return (
        <PatientContext.Provider value={value}>
            {props.children}
        </PatientContext.Provider>
    )
}

export default PatientContextProvider;
export { PatientContext };