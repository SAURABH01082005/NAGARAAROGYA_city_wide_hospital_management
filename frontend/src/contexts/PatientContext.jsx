import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";


const PatientContext = createContext();


const PatientContextProvider = (props) => {
    const [pToken, setPToken] = useState(localStorage.getItem('pToken') ? localStorage.getItem('pToken') : "");
    const [patientData, setPatientData] = useState()

    const getPatientDetails = async () => {
        const { data } = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/patient/get-patientdetails`, { headers: { ptoken: pToken } })
        console.log("data is :", data)
        console.log("ptoken ", pToken)
        setPatientData(data.data)


    }

    useEffect(() => {
        if (pToken)
            getPatientDetails();
        else
            setPatientData()


    }, [pToken])


    const value = {
        pToken,
        setPToken, patientData, getPatientDetails
    }
    return (
        <PatientContext.Provider value={value}>
            {props.children}
        </PatientContext.Provider>
    )
}

export default PatientContextProvider;
export { PatientContext };