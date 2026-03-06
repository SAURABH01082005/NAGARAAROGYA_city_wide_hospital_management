// components/AddHospitalForm.js
import { useState } from 'react';
import { Hospital, Mail, Lock, Link as LinkIcon, Building } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AddHospital() {
  const [formData, setFormData] = useState({
    hospitalId: '',
    name: '',
    email: '',
    password: '',
    url: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const {data} = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/add-hospital`, formData, {headers:{atoken:localStorage.getItem("atoken")}})
    if(!data.success){
       return  toast.error(data.message || "Failed to add hospital");
    }
    toast.success(data.message || "Hospital added successfully");

    formData.hospitalId = '';
    formData.name = '';
    formData.email = '';
    formData.password = '';
    formData.url = '';
    // console.log('Submitting hospital:', formData);
    setIsLoading(false);
  };

  return (
    <div 
      className="mx-auto bg-[#1E1E1E] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      style={{ 
        width: '1000px', 
        height: '600px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header - smaller padding */}
      <div className="px-10 pt-7 pb-5 bg-gradient-to-b from-[#1E1E1E] to-[#252525] border-b border-gray-800">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-[#5D84F9]/10 rounded-lg">
            <Building className="w-6 h-6 text-[#5D84F9]" />
          </div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Add New Hospital
          </h2>
        </div>
        <p className="text-gray-400 text-sm">
          Enter hospital details to register in the system
        </p>
      </div>

      {/* Scrollable form area */}
      <div className="flex-1 overflow-y-auto px-10 py-6">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl mx-auto">
          {/* Hospital ID */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Hospital className="w-4 h-4 text-[#5D84F9]" />
              Hospital ID
            </label>
            <input
              name="hospitalId"
              type="text"
              required
              value={formData.hospitalId}
              onChange={handleChange}
              placeholder="HOSP-2025-001"
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#5D84F9]/60 focus:ring-1 focus:ring-[#5D84F9]/30 transition-all duration-200 text-sm"
            />
          </div>

          {/* Hospital Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#5D84F9]" />
              Hospital Name
            </label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="City General Hospital"
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#5D84F9]/60 focus:ring-1 focus:ring-[#5D84F9]/30 transition-all duration-200 text-sm"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#5D84F9]" />
              Hospital Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@hospital.org"
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#5D84F9]/60 focus:ring-1 focus:ring-[#5D84F9]/30 transition-all duration-200 text-sm"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#5D84F9]" />
              Hospital Password
            </label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#5D84F9]/60 focus:ring-1 focus:ring-[#5D84F9]/30 transition-all duration-200 text-sm"
            />
            <p className="text-xs text-gray-500">
              Min. 8 characters • Will be sent to admin email
            </p>
          </div>

          {/* Website URL */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-[#5D84F9]" />
              Hospital URL
            </label>
            <input
              name="url"
              type="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://www.hospitalname.org"
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#5D84F9]/60 focus:ring-1 focus:ring-[#5D84F9]/30 transition-all duration-200 text-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 px-6 rounded-lg font-medium text-white
                bg-[#5D84F9] hover:bg-[#4d73e9] active:bg-[#3d62d9]
                transition-all duration-200 flex items-center justify-center gap-2
                shadow-lg shadow-[#5D84F9]/20 hover:shadow-[#5D84F9]/30
                disabled:opacity-60 disabled:cursor-not-allowed
                disabled:shadow-none text-sm
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Creating...</span>
                </>
              ) : (
                'Add Hospital'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}