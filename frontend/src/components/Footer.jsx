import React from 'react'
import { assets } from '../assets/assets';

function Footer() {
  return (
    <div className='px-10 md:px-2.5 mx-auto bg-[#1E1E1E] '>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm ml-25'>
            {/* ----------left side------------ */}
            <div>
                <img src={assets.nagarAarogya} alt=""  className='mb-5 w-40'/>
                <p className='w-full md:w-2/3  text-[#E5E5E5] leading-6'>Powered by the Government of Delhi, nagarArogya unifies city hospitals under one digital system to enhance healthcare coordination, patient care, and service delivery across the capital.
                </p>   
            </div>
            {/* ----------center side------------ */}
            <div>
                <p className='text-xl font-medium mb-5 text-white'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-[#E5E5E5]'>
                    <li>Home</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li> Privacy Policy</li>
                </ul>

            </div>
            {/* ----------right side------------ */}

            <div>
                <p className='text-xl font-medium mb-5 text-white'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-[#E5E5E5]'>
                    <li>+91-93475398357</li>
                    <li>greatstack@mail.com</li>
                </ul>

            </div>
        </div>
        {/* -----------------------------copy right------------ */}
        <div className='p-[7px]'>
            <hr className='border-[#3d3d3d] mt-[10px] mx-auto w-4/5' />
            <p className=' my-3.5 text-sm text-center  text-[#E5E5E5]'>© 2026 Your Company Name. All rights reserved.</p>

        </div>
    </div>
  )
}

export default Footer