import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';


import axios from 'axios'
import { toast } from 'react-toastify'
import { PatientContext } from '../contexts/PatientContext'
import { AdminContext } from '../contexts/AdminContext'
import { DoctorContext } from '../contexts/DoctorContext'
import OTPValidation from './OtpValidation';


function Login(props) {
    const navigate = useNavigate()
    const { user, setUser, userDetails, setUserDetails } = useContext(AppContext)
    const { pToken, setPToken, getPatientDetails, patientData } = useContext(PatientContext)
    const { aToken, setAToken, getAdminDetails, adminData } = useContext(AdminContext)
    const { dToken, setDToken, doctorData, getDoctorDetails } = useContext(DoctorContext)

    // const { user, setUser } = useContext(AppContext);
    const [type, setType] = useState("Login")
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [hospitalRegEmail, setHospitalRegEmail] = useState("");
    const [hospitalRegPassword, setHospitalRegPassword] = useState("");
    const [hospitalId, setHospitalId] = useState("");
    const [itemId, setItemId] = useState("")
    const [otp, setOtp] = useState(false)


    const storageHandler =  (myData) => {
        switch (props.value) {
            case "Patient":
                setPToken(myData.data)
                localStorage.setItem("pToken", myData.data)
                console.log("patient token stored in localStorage:", myData.data);
                break;
            case "Doctor":
                setDToken(myData.data)
                localStorage.setItem("dToken", myData.data)
                console.log("doctor token stored in localStorage:", myData.data);
                break;
            case "Admin":
                setAToken(myData.data)
                localStorage.setItem("aToken", myData.data)
                console.log("admin token stored in localStorage:", myData.data);
                break;
        }
        setUser(props.value)
        localStorage.setItem("user", props.value);

        navigate(`/${props.value?.toLowerCase()}/dashboard`)
    }



    const onVerify = async (otp) => {
        console.log({ otp, itemId })
        const isVerify = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/${props.value?.toLowerCase()}/register/email-verify`, { otp, itemId })
        console.log("isverify is ",isVerify.data)
        if (!isVerify.data.success) {
           return toast.error(isVerify.data.message)
        }
        toast.success(isVerify.data.message)
        storageHandler(isVerify.data)

    }

    const onResend = async () => {
        console.log("onResend is called!")
        const data = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/${props.value?.toLowerCase()}/register/resend-otp`, { itemId })
        if (!data.data.success) {
            return toast.error(data.data.message)
        }
        return toast.success(data.data.message)

    }


    const onSubmitHandler = async (event) => {

        event.preventDefault();
        if (type === "Register") {

            try {
                const { data } = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/${props.value?.toLowerCase()}/register`, { email, password, hospitalRegEmail, hospitalRegPassword, hospitalId })
                console.log("*********************testing*********************", data)
                if (!data.success) {
                    return toast.error(data.message + "from login function frontend" || "Login failed");
                }
                if (data.isAlreadyPatient) {
                    const myData = data
                    storageHandler(myData)

                }
                const itemId = data.data
                setItemId(itemId)
                toast.success(data.message || "Give OTP");
                setOtp(true)


            } catch (error) {
                console.error('Error during login:', error);
                return toast.error(error.message + "from login function frontend" || "An error occurred during login");
            }
            return
        }




        try {
            console.log(email, password)
            console.log(`${import.meta.env.VITE_APP_BACKEND_URL}/api/${props.value?.toLowerCase()}/login`)
           
            const { data } = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/${props.value?.toLowerCase()}/login`, { email, password })
            console.log("*********************testing*********************", data)
            if (!data.success) {
                return toast.error(data.message + "archit from login function frontend" || "Login failed");
            }


            let myData = data;
            toast.success(data.message || "Login successful");
            storageHandler(myData)


        } catch (error) {
            console.error('Error during login:', error);
            return toast.error(error.message + "from login function frontend" || "An error occurred during login");
        }


    }




    return (
        <>
            {otp
                ? <OTPValidation  email={email} onResend={onResend} onVerify={onVerify} />
                :
                <form className='w-full'>
                    <div className='flex flex-col gap-4 w-full bg-[var(--color-card)] p-0 rounded-xl text-white text-sm items-center '>
                        <p className='text-2xl font-semibold text-center mb-4'><span className='text-[#5D84F9]'>{props.value}</span> {type}</p>
                        {type == 'Register' && (
                            <>
                                <p>Associated Hospital Credentials</p>
                                <div className='w-[400px] border border-[var(--color-primary-border)] p-4 rounded-2xl' >
                                    <div className='w-full'>
                                        <p className='mb-2 text-[#E5E5E5]'> Hospital ID</p>
                                        <input onChange={(e) => setHospitalId(e.target.value)} value={hospitalId} className='border border-[#444] bg-[#1E1E1E] rounded w-full p-2.5 mt-1 text-white placeholder-gray-500 focus:outline-none focus:border-[#5D84F9] mb-2' type="email" placeholder="Enter your email" required />
                                    </div>
                                    <div className='w-full'>
                                        <p className='mb-2 text-[#E5E5E5]'>  Email</p>
                                        <input onChange={(e) => setHospitalRegEmail(e.target.value)} value={hospitalRegEmail} className='border border-[#444] bg-[#1E1E1E] rounded w-full p-2.5 mt-1 text-white placeholder-gray-500 focus:outline-none focus:border-[#5D84F9] mb-2' type="email" placeholder="Enter your email" required />
                                    </div>
                                    <div className='w-full'>
                                        <p className='mb-2 text-[#E5E5E5]'>  Password</p>
                                        <input onChange={(e) => setHospitalRegPassword(e.target.value)} value={hospitalRegPassword} className='border border-[#444] bg-[#1E1E1E] rounded w-full p-2.5 mt-1 text-white placeholder-gray-500 focus:outline-none focus:border-[#5D84F9] mb-2' type="password" placeholder="Enter your password" required />
                                    </div>
                                </div>
                            </>
                        )
                        }
                        <div className='w-[88%] flex flex-col items-center'>
                            <div className='w-full'>
                                <p className='mb-2 text-[#E5E5E5]'>Email</p>
                                <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#444] bg-[#1E1E1E] rounded w-full p-2.5 mt-1 text-white placeholder-gray-500 focus:outline-none focus:border-[#5D84F9] mb-2' type="email" placeholder="Enter your email" required />
                            </div>
                            <div className='w-full'>
                                <p className='mb-2 text-[#E5E5E5]'>Password</p>
                                <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#444] bg-[#1E1E1E] rounded w-full p-2.5 mt-1 text-white placeholder-gray-500 focus:outline-none focus:border-[#5D84F9] mb-2' type="password" placeholder="Enter your password" required />
                            </div>
                        </div>
                        <button className='bg-[#5D84F9] text-white w-[88%] py-2.5 rounded-md text-base cursor-pointer font-medium mt-2 hover:bg-[#4a73e0] transition' onClick={onSubmitHandler}>
                            {type}
                        </button>
                        <div className='text-center text-[#E5E5E5] text-sm'>
                            {
                                type === 'Register'
                                    ? <p>{props.value?.value} Login? <span className='text-[#5D84F9] underline cursor-pointer hover:text-[#4a73e0] transition' onClick={() => setType("Login")}>Click here</span></p>
                                    : <p>{props.value?.value} Register? <span className='text-[#5D84F9] underline cursor-pointer hover:text-[#4a73e0] transition' onClick={() => setType("Register")}>Click here</span></p>
                            }
                        </div>
                    </div>
                </form>
            }
        </>
    )
}

export default Login