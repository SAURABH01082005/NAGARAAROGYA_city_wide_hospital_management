
import jwt from "jsonwebtoken";
import hospitalModel from "../models/hospitalModel";
import validator from "validator";
import type {Request,Response} from 'express'
import {type IResponse } from "../interface/interface";

const login = async (req:Request, res:Response) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required for login" } as IResponse);
        }
        if (email !== process.env.ADMIN_EMAIL as string || password !== process.env.ADMIN_PASSWORD as string) {
            return res.status(401).json({ success: false, message: "Invalid credentials for Admin" } as IResponse);
        }
        const atoken  = jwt.sign({ adminId: email+password }, process.env.JWT_SECRET_ADMIN as string);
        res.status(200).json({ success: true, data:atoken, message: "Login successful for Admin" } as IResponse);
    } catch (error:any) {
        console.error('Error during login:', error);
        res.json({ success: false, message: error.message } as IResponse);
    }
}

const addHospital = async (req:Request, res:Response) => {
    try{
    const { hospitalId, name, email, password, url } = req.body;
    if (!hospitalId || !name || !email || !password || !url) {
        return res.json({ success: false, message: "All fields are required to add a hospital" } as IResponse);
    }
    if(!validator.isEmail(email) ){
        return res.json({ success: false, message: "Invalid email format" } as IResponse);
    }
    if(!validator.isURL(url,{ require_tld: false }) ){
        return res.json({ success: false, message: "Invalid URL format" } as IResponse);
    }
    
    const data = await hospitalModel.create({ hospitalId, name, email, password, url });
    res.json({ success: true, data, message: "Hospital added successfully" } as IResponse);

    }catch(error:any){
        console.error('Error during adding hospital:', error);
        res.json({ success: false, message: error.message } as IResponse);
    }
}


const getHospitals = async (req:Request, res:Response) => {
    try {
        const hospitals = await hospitalModel.find({});
        res.json({ success: true, data: hospitals, message: "Hospitals retrieved successfully" } as IResponse);
    } catch (error:any) {
        console.error('Error during retrieving hospitals:', error);
        res.json({ success: false, message: error.message }  as IResponse);
    }
}

const deleteHospital = async (req:Request,res:Response)=>{
    try{
        const {hospitalId} = req.body
        const data = await hospitalModel.deleteOne({hospitalId})
        if(data.deletedCount)
        {
           return res.json({ success: true, data: hospitalId, message: "Hospitals deleted successfully" } as IResponse); 
        }else{
           return res.json({ success: false,  message: "Hospitals not found for Deletion" } as IResponse); 
        }

    }catch(error:any){
        console.error('Error during deleting hospitals:', error);
        res.json({ success: false, message: error.message } as IResponse);

    }
}

//want to delete this 
const getAdminDetails = (req:Request,res:Response)=>{
    const data ={
        name:process.env.ADMIN_EMAIL,
    }
    res.json({success:true,data} as IResponse)

}





export { login, addHospital, getHospitals ,deleteHospital,getAdminDetails}