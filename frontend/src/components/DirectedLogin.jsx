import React, { useEffect, useState } from 'react'
import {assets} from '../assets/assets'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function DirectedLogin(props) {
    const {itemId,hospitalId} = useParams()
    const [form , setForm] = useState({email:"",password:""})

    const onChangeHandler = (event)=>{
        const {name,value} = event.target
        setForm((pre)=>({...pre,[name]:value}))


    }

    const onSubmitHandler = async (e)=>{
        e.preventDefault()
        console.log("subbmitted",itemId)
        const login = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/patient/login`,{email:form.email,password:form.password})
        if(!login.data.success){
            return toast.error(login.data.message)
        }
        const {data} = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/patient/register-patient-new-appointment-by-another-hospital`,{itemId,hospitalId})
        if(!data.success){
            return toast.error(data.message)
        }
        return toast.success(data.message)

    }

    useEffect(()=>{
        localStorage.clear()

    },[])
  return (
    <div className=" relative " >
        <img className="w-[100%] " src={assets.cityHospitalImg} alt="" />
         <form className='fixed top-[20%] left-1/2 -translate-x-1/2 w-[500px] max-w-[90%] z-50"> '>
                    <div className='flex flex-col gap-4 w-full bg-[var(--color-card)] p-0 rounded-xl text-white text-sm items-center py-4.5 opacity-80 '>
                        <p className='text-2xl font-semibold text-center mb-4'><span className='text-[#5D84F9]'>{props.value}</span> "Login"</p>
                       
                        <div className='w-[88%] flex flex-col items-center'>
                            <div className='w-full'>
                                <p className='mb-2 text-[#E5E5E5]'>Email</p>
                                <input onChange={(e) => onChangeHandler(e)} value={form.email} name ="email" className='border border-[#444] bg-[#1E1E1E] rounded w-full p-2.5 mt-1 text-white placeholder-gray-500 focus:outline-none focus:border-[#5D84F9] mb-2' type="email" placeholder="Enter your email" required />
                            </div>
                            <div className='w-full'>
                                <p className='mb-2 text-[#E5E5E5]'>Password</p>
                                <input onChange={(e) =>  onChangeHandler(e)} value={form.password} name="password" className='border border-[#444] bg-[#1E1E1E] rounded w-full p-2.5 mt-1 text-white placeholder-gray-500 focus:outline-none focus:border-[#5D84F9] mb-2' type="password" placeholder="Enter your password" required />
                            </div>
                        </div>
                        <button className='bg-[#5D84F9] text-white w-[88%] py-2.5 rounded-md text-base cursor-pointer font-medium mt-2 hover:bg-[#4a73e0] transition' onClick={onSubmitHandler}>
                            {"Login"}
                        </button>
                        
                    </div>
                </form>
    </div>
  )
}

export default DirectedLogin