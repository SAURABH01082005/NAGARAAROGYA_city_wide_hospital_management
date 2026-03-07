import axios from 'axios'

const  getSpecialitiesAndAddress = async (req,res)=>{
    try{
        // let ans=[]
        const {speciality} = req.body
        const data = await axios.get(`${process.env.BACKEND_URL}/general/get-hospitals`)
        console.log("*********************testing*************************",process.env.BACKEND_URL)
        if(!data.data.success){

            return res.json({success:false,message:data.data.message})
        }
        console.log(data.data)
        const ans = await Promise.all(data.data.data.map(async (hospitalData,index)=>{
            const {data} =  await axios.post(hospitalData.url + "/specialities-available-and-address", { speciality }, {
            headers: { gtoken: jwt.sign(hospitalData.email + hospitalData.password, process.env.JWT_SECRET_GOVERNMENT) }})
            if(!data.success){
                return res.json({success:false,message:data.message})
            }
            if(data.data.speciality.some((s)=>s.toLowerCase()==speciality.toLowerCase()))
                return data.data



        }))
        res.json({success:true,data:ans}) //data is an array of {spiciality and address}



    }catch (error) {
        console.error('Error generating profile:', );
        res.json({ success: false, message: error.message+"hello" })
    }
}

const getHospitals = async (req, res) => {
    console.log("this is getHospitals")
    try {
        const hospitals = await hospitalModel.find({});
        res.json({ success: true, data: hospitals, message: "Hospitals retrieved successfully" });
    } catch (error) {
        console.error('Error during retrieving hospitals:', error);
        res.json({ success: false, message: error.message });
    }
}



export {getSpecialitiesAndAddress,getHospitals}