
import jwt from "jsonwebtoken";
import hospitalModel from "../models/hospitalModel.js";
import validator from "validator";

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required for login" });
        }
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, message: "Invalid credentials for Admin" });
        }
        const atoken  = jwt.sign({ adminId: email+password }, process.env.JWT_SECRET_ADMIN);
        res.status(200).json({ success: true, atoken, message: "Login successful for Admin" });
    } catch (error) {
        console.error('Error during login:', error);
        res.json({ success: false, message: error.message });
    }
}

const addHospital = async (req, res) => {
    try{
    const { hospitalId, name, email, password, url } = req.body;
    if (!hospitalId || !name || !email || !password || !url) {
        return res.json({ success: false, message: "All fields are required to add a hospital" });
    }
    if(!validator.isEmail(email) ){
        return res.json({ success: false, message: "Invalid email format" });
    }
    if(!validator.isURL(url,{ require_tld: false }) ){
        return res.json({ success: false, message: "Invalid URL format" });
    }
    
    const data = await hospitalModel.create({ hospitalId, name, email, password, url });
    res.json({ success: true, data, message: "Hospital added successfully" });

    }catch(error){
        console.error('Error during adding hospital:', error);
        res.json({ success: false, message: error.message });
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

const deleteHospital = async (req,res)=>{
    try{
        const {hospitalId} = req.body
        const data = await hospitalModel.deleteOne({hospitalId})
        if(data.deletedCount)
        {
           return res.json({ success: true, data: hospitalId, message: "Hospitals deleted successfully" }); 
        }else{
           return res.json({ success: false,  message: "Hospitals not found for Deletion" }); 
        }

    }catch(error){
        console.error('Error during deleting hospitals:', error);
        res.json({ success: false, message: error.message });

    }
}

//want to delete this 
const getAdminDetails = (req,res)=>{
    const data ={
        name:process.env.ADMIN_EMAIL,
    }
    res.json({success:true,data})

}





export { login, addHospital, getHospitals ,deleteHospital,getAdminDetails}