import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
const AdminContext = createContext();

const AdminContextProvider = (props)=>{
    const [aToken, setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):"");
    const [adminData,setAdminData] = useState();

     const getAdminDetails = async ()=>{
        const {data} = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/get-admindetails`,{headers:{atoken:aToken}})
         console.log("data is :" ,data)
         setAdminData(data.data)
    }
    

    const value = {
        aToken,
        setAToken,getAdminDetails,adminData
    }

    useEffect(()=>{
        if(aToken)
        getAdminDetails()
    else
        setAdminData()
    },[aToken])
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;
export {AdminContext};