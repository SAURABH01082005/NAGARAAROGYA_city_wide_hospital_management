// components/HospitalList.js
import { useEffect, useState } from 'react';
import { Building, Mail, Globe, Eye, Edit, Trash2, Search } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function HospitalList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hospitals, setHospitals] = useState([]);



  const getHospitals = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/hospitals`, { headers: { atoken: localStorage.getItem("atoken") } });
      if (!data.success) {
        return toast.error(data.message || "Failed to fetch hospitals");
      }
      console.log("Hospitals fetched successfully:", data.data);
      const filter = await filterActive(data.data)
      console.log("filer is ", filter)
      return filter;

    } catch (error) {
      toast.error("Error fetching hospitals: " + error.message);
      console.error('Error fetching hospitals:', error);
    }
  }

  const filterActive = async (hospitals) => {
    const result = await Promise.all( hospitals.map(async element => {
      try{
        const { data } = await axios.get(`${element.url}/`)
        
        return { ...element, status: 'Active' }
      
      }catch(err){
        return { ...element, status: "InActive" }
        
      }
    }))
    return result


  }
  const deleteHsopitalHandler = async (hospitalId)=>{
    try{
      const {data} = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/admin/delete-hospital`,{hospitalId} ,{ headers: { atoken: localStorage.getItem("atoken") } });
      if(data.success){
        const temp = hospitals.filter((element)=> (element.hospitalId!==hospitalId))
        setHospitals(temp)
        return  toast.success(data.message|| "Successfully deleted")
      }

      return toast.error(data.message)


    }catch(err){
         toast.error("Error in deleting hospital " + error.message);
      console.error('Error in deletign hospital', error);
        
      }
  }


  useEffect(() => {
    const loadData = async ()=>{

      setHospitals( await getHospitals())
    }
    loadData();

  }, [])

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.hospitalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="mx-auto bg-[#1E1E1E] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      style={{
        width: '1000px',
        height: '600px'
      }}
    >
      {/* Header */}
      <div className="px-10 pt-7 pb-5 bg-gradient-to-b from-[#1E1E1E] to-[#252525] border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#5D84F9]/10 rounded-lg">
              <Building className="w-6 h-6 text-[#5D84F9]" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">
                Hospitals in System
              </h2>
              <p className="text-gray-400 text-sm mt-0.5">
                {filteredHospitals.length} registered medical facilities
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, ID or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#5D84F9]/60 focus:ring-1 focus:ring-[#5D84F9]/30 transition-all duration-200 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table / List Area */}
      <div className="flex-1 overflow-y-auto px-10 py-6">
        {filteredHospitals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Building className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg">No hospitals found</p>
            <p className="text-sm mt-2">Try adjusting your search</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-gray-900/70 border-b border-gray-800 sticky top-0">
                <tr>
                  <th className="px-6 py-4 font-medium">Hospital</th>
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Website</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredHospitals.map((hospital) => (
                  <tr
                    key={hospital.hospitalId}
                    className="hover:bg-gray-800/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      {hospital.name}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {hospital.hospitalId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#5D84F9]/70" />
                        {hospital.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {hospital.url ? (
                        <a
                          href={hospital.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[#5D84F9] hover:text-[#4d73e9] transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          Visit
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex px-2.5 py-1 text-xs font-medium rounded-full
                        ${hospital.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''}
                        ${hospital.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : ''}
                        ${hospital.status === 'Inactive' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
                      `}>
                        {hospital.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="p-1.5 text-gray-400 hover:text-[#5D84F9] transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" onClick={()=>deleteHsopitalHandler(hospital.hospitalId)} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer - optional summary */}
      <div className="px-10 py-4 border-t border-gray-800 bg-gray-900/30 text-sm text-gray-400 flex justify-between items-center">
        <span>Showing {filteredHospitals.length} of {hospitals.length} hospitals</span>
        <span className="text-[#5D84F9]">Last updated: March 5, 2026</span>
      </div>
    </div>
  );
}