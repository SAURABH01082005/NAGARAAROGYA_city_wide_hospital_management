
import { useState,createContext, useEffect } from "react";
import { assets } from "../assets/assets";


export const AppContext = createContext();



const AppContextProvider = (props) => {
    const [user, setUser] = useState(localStorage.getItem("user") ? localStorage.getItem("user"): "Unauthorized");
    const [userDetails,setUserDetails] = useState()

    


    const value = {
        user,
        setUser,userDetails,setUserDetails
    }


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}
export default AppContextProvider;