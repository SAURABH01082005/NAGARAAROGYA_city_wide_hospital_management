import doctorModel from "../models/doctorModel";
import hospitalModel from "../models/hospitalModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import axios from "axios";
import patientModel from "../models/patientModel";
import { type IResponse } from "../interface/interface";

import type { Request,Response } from "express";

const register = async (req:Request, res:Response) => {
    try {
        const { hospitalId,hospitalRegEmail,hospitalRegPassword, email, password } = req.body
        if (!hospitalId || !hospitalRegEmail || !hospitalRegPassword || !email || !password) {
            return res.json({ success: false, message: "All fields are required" } as IResponse)
        }
        if (!validator.isEmail(email) || !validator.isEmail(hospitalRegEmail)) {
            return res.json({ success: false, message: "Invalid email" } as IResponse)
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" } as IResponse)
        }

        const hospitalData = await hospitalModel.findOne({ hospitalId: hospitalId })
        if(!hospitalData){
            return res.json({ success: false, message: "Hospital not found"  }as IResponse)
        }

        //getting userDetails from hospital data
        const {data} = await axios.post(hospitalData.url + "/doctor-credentials",{email:hospitalRegEmail,password:hospitalRegPassword}, { 
            headers: { gtoken: jwt.sign(hospitalData.email + hospitalData.password, process.env.JWT_SECRET_GOVERNMENT as string) } 
        })
        // console.log("got response from hospital server !",data)

        if(!data.success){
            return res.json({ success: false, message: "Failed to fetch user details from hospital" } as IResponse)
        }
        const uniqueGovDoctorId = data.uniqueGovDoctorId

        //data.doctorDetail
        //hashing user password on nagarAarogya server
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const doctorDetail = {
            name:data.doctorDetail.name,
            email:email,
            password:hashedPassword,
            image:data.doctorDetail.image,
            uniqueGovDoctorId:data.doctorDetail.uniqueGovDoctorId
        }

        const doctorData = await doctorModel.create({doctorDetail})
        const dtoken = jwt.sign({doctorId:doctorData._id}, process.env.JWT_SECRET_DOCTOR as string)
        res.json({ success: true, message: "Doctor email and password registered successfully", data:dtoken } as IResponse)

        


    } catch (error:any) {
        console.error('Error during registration:', error);
        res.json({ success: false, message: error.message } as IResponse)
    }
}

const login = async (req:Request, res:Response) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.json({ success: false, message: "Email and password are required for login" } as IResponse);
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" } as IResponse);
        }
        const data = await doctorModel.findOne({ 'doctorDetail.email': email });
        if (!data) {
            return res.status(401).json({ success: false, message: "Invalid credentials for Doctor" } as IResponse);
        }


        //decrypting hassed password form database

        
        const isMatch = await bcrypt.compare(password, data.doctorDetail.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials for Patient" } as IResponse);
        }
        const dtoken = jwt.sign({ doctorId: data._id }, process.env.JWT_SECRET_DOCTOR as string);
        res.status(200).json({ success: true,data: dtoken, message: "Login successful for Doctor" } as IResponse);
    } catch (error:any) {
        console.error('Error during login:', error);
        res.json({ success: false, message: error.message } as IResponse);
    }
}


const getDoctorDetail = async (req:Request, res:Response) => {
    try {
        const doctorId= req.params.doctorId
        const data = await doctorModel.findById(doctorId)
        // console.log("doctor id here is : ",doctorId)
        if(!data){
            return res.json({ success: false, message: "Doctor Not found in system" }as IResponse)
        }
        res.json({success:true,data} as IResponse)


    } catch (error:any) {
        console.error('Error generating profile:', error);
        res.json({ success: false, message: error.message } as IResponse)
    }
}

const getAppointments = async (req:Request, res:Response)=>{
    try{
        const data = await patientModel.find({})
    res.json({success:true,data:data} as IResponse)
    }catch(error:any){
        res.json({success:false,message:error.message} as IResponse)
    }

}




export {login , register,getDoctorDetail,getAppointments}