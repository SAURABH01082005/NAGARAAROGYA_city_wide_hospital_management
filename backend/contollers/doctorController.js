import doctorModel from "../models/doctorModel.js";
import hospitalModel from "../models/hospitalModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import axios from "axios";

const register = async (req, res) => {
    try {
        const { hospitalId,hospitalRegEmail,hospitalRegPassword, email, password } = req.body
        if (!hospitalId || !hospitalRegEmail || !hospitalRegPassword || !email || !password) {
            return res.json({ success: false, message: "All fields are required" })
        }
        if (!validator.isEmail(email) || !validator.isEmail(hospitalRegEmail)) {
            return res.json({ success: false, message: "Invalid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" })
        }

        const hospitalData = await hospitalModel.findOne({ hospitalId: hospitalId })
        if(!hospitalData){
            return res.json({ success: false, message: "Hospital not found" })
        }

        //getting userDetails from hospital data
        const {data} = await axios.post(hospitalData.url + "/doctor-credentials",{email:hospitalRegEmail,password:hospitalRegPassword}, { 
            headers: { gtoken: jwt.sign(hospitalData.email + hospitalData.password, process.env.JWT_SECRET_GOVERNMENT) } 
        })
        // console.log("got response from hospital server !",data)

        if(!data.success){
            return res.json({ success: false, message: "Failed to fetch user details from hospital" })
        }
        const uniqueGovDoctorId = data.uniqueGovDoctorId

        //data.doctorDetails
        //hashing user password on nagarAarogya server
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const doctorDetails = {
            name:data.doctorDetails.name,
            email:email,
            password:hashedPassword,
            image:data.doctorDetails.image,
            uniqueGovDoctorId:data.doctorDetails.uniqueGovDoctorId
        }

        const doctorData = await doctorModel.create({doctorDetails})
        const dtoken = jwt.sign({doctorId:doctorData._id}, process.env.JWT_SECRET_DOCTOR)
        res.json({ success: true, message: "Doctor email and password registered successfully", dtoken })

        


    } catch (error) {
        console.error('Error during registration:', error);
        res.json({ success: false, message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.json({ success: false, message: "Email and password are required for login" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }
        const data = await doctorModel.findOne({ 'doctorDetails.email': email });
        if (!data) {
            return res.status(401).json({ success: false, message: "Invalid credentials for Doctor" });
        }


        //decrypting hassed password form database

        
        const isMatch = await bcrypt.compare(password, data.doctorDetails.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials for Patient" });
        }
        const dtoken = jwt.sign({ doctorId: data._id }, process.env.JWT_SECRET_DOCTOR);
        res.status(200).json({ success: true,  dtoken, message: "Login successful for Doctor" });
    } catch (error) {
        console.error('Error during login:', error);
        res.json({ success: false, message: error.message });
    }
}


const getDoctorDetails = async (req, res) => {
    try {
        const doctorId= req.doctorId
        const data = await doctorModel.findById(doctorId)
        // console.log("doctor id here is : ",doctorId)
        if(!data){
            return res.json({ success: false, message: "Doctor Not found in system" })
        }
        res.json({success:true,data})


    } catch (error) {
        console.error('Error generating profile:', error);
        res.json({ success: false, message: error.message })
    }
}


export {login , register,getDoctorDetails}