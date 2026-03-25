import React, { use, useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Login from "./Login";
import { AppContext } from "../contexts/AppContext";

const Home = () => {

  
  const {user,setUser} = useContext(AppContext);
  const [value,setValue] = useState(false);

  const handleRoleClick = (role) => {
    setValue(role);
  
    
  };

 

  return (
    <>
     
      <div className="text-center h-[80vh] py-[250px] px-5 bg-[#1E1E1E] m-auto">
        <h1 className="text-4xl text-[#f9f9f9]">Welcome to the Hospital Management System</h1>
        <p className="text-[#f5f5f5] mt-2.5 mb-10 text-lg">Select your role to continue:</p>

        <div className="flex justify-center gap-10 flex-wrap">
          <div className="w-[280px] bg-[#2a2a2a] rounded-2xl shadow-lg p-6 text-center transition duration-300 border-t-4 border-[#28a745] hover:shadow-2xl hover:-translate-y-2">
            <h2 className="mb-2.5 text-[#cecccc]">Patient</h2>
            <p className="text-sm text-[#666] mb-5">Book appointments, view prescriptions, and track health records.</p>
            { user === "Patient" ? (
              <NavLink to="/patient/dashboard" className="bg-[#5D84F9] text-white border-0 px-6 py-2.5 rounded cursor-pointer transition inline-block no-underline hover:bg-[#4a73e0]">
                Go to Dashboard
              </NavLink>
            ) : (
              <button 
                className="bg-[#5D84F9] text-white border-0 px-6 py-2.5 rounded cursor-pointer transition inline-block hover:bg-[#4a73e0]" 
                onClick={() => handleRoleClick("Patient")}
              >
                Login
              </button>
            )}
          </div>

          <div className="w-[280px] bg-[#2a2a2a] rounded-2xl shadow-lg p-6 text-center transition duration-300 border-t-4 border-[#17a2b8] hover:shadow-2xl hover:-translate-y-2">
            <h2 className="mb-2.5 text-[#cecccc]">Doctor</h2>
            <p className="text-sm text-[#666] mb-5">Manage patients, view schedules, and update medical records.</p>
            { user === "Doctor" ? (
              <NavLink to="/doctor/dashboard" className="bg-[#5D84F9] text-white border-0 px-6 py-2.5 rounded cursor-pointer transition inline-block no-underline hover:bg-[#4a73e0]">
                Go to Dashboard
              </NavLink>
            ) : (
              <button 
                className="bg-[#5D84F9] text-white border-0 px-6 py-2.5 rounded cursor-pointer transition inline-block hover:bg-[#4a73e0]" 
                onClick={() => handleRoleClick("Doctor")}
              >
                Login
              </button>
            )}
          </div>

          <div className="w-[280px] bg-[#2a2a2a] rounded-2xl shadow-lg p-6 text-center transition duration-300 border-t-4 border-[#ffc107] hover:shadow-2xl hover:-translate-y-2">
            <h2 className="mb-2.5 text-[#cecccc]">Admin</h2>
            <p className="text-sm text-[#666] mb-5">Control hospital data, manage users, and oversee operations.</p>
            { user === "Admin" ? (
              <NavLink to="/admin/dashboard" className="bg-[#5D84F9] text-white border-0 px-6 py-2.5 rounded cursor-pointer transition inline-block no-underline hover:bg-[#4a73e0]">
                Go to Dashboard
              </NavLink>
            ) : (
              <button 
                className="bg-[#5D84F9] text-white border-0 px-6 py-2.5 rounded cursor-pointer transition inline-block hover:bg-[#4a73e0]" 
                onClick={() => handleRoleClick("Admin")}
              >
                Login
              </button>
            )}
          </div>
        </div>

        
      </div>

      {/* Login Modal */}
      {value && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-2xl max-w-md w-full mx-4 relative shadow-xl overflow-hidden ">
            <button onClick={() => setValue(false)}  className="absolute top-5 right-5 text-[#E5E5E5] text-2xl hover:text-white transition z-10"
            >
              ✕
            </button>
            <div className="p-4">
              <Login value={value} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
