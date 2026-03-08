import axios from 'axios'
import hospitalModel from '../models/hospitalModel.js'
import jwt from 'jsonwebtoken'

const  getSpecialitiesAndAddress = async (req,res)=>{
    try{
        // let ans=[]
        const {speciality} = req.body
        const data = await axios.get(`${process.env.BACKEND_URL}/api/general/get-hospitals`)
       
        if(!data.data.success){

            return res.json({success:false,message:data.data.message})
        }
        // console.log(data.data)
        const ans = await Promise.all(data.data.data.map(async (hospitalData,index)=>{
            try{
               
            const {data} =  await axios.get(hospitalData.url + "/specialities-available-and-address",  {
            headers: { gtoken: jwt.sign(hospitalData.email + hospitalData.password, process.env.JWT_SECRET_GOVERNMENT) }})

            if(!data.success){
                return res.json({success:false,message:data.message})
            }
            // console.log(data.data," ->  ",speciality)
            if(data.data.specialities.some((s)=>s.toLowerCase()==speciality.toLowerCase()))
                return {name:hospitalData.name,id:hospitalData.hospitalId,address:data.data.hospitalAddress,appointmentPage : data.data.appointmentPage}
            }catch(err){
                // console.log(hospitalData.url + "/specialities-available-and-address" , " is  inactive")
                
            }



        }))
        const ans2 = ans.filter(Boolean)//trick*************************************************** and don't use reduce for async mapping
        // console.log("ans is ",ans2)
        res.json({success:true,data:ans2}) //data is an array of {spiciality and address}



    }catch (error) {
        console.error('Error generating profile:', );
        res.json({ success: false, message: error.message+"hello" })
    }
}

const getHospitals = async (req, res) => {
    try {
        const hospitals = await hospitalModel.find({});
        res.json({ success: true, data: hospitals, message: "Hospitals retrieved successfully" });
    } catch (error) {
        console.error('Error during retrieving hospitals:', error);
        res.json({ success: false, message: error.message });
    }
}



export {getSpecialitiesAndAddress,getHospitals}