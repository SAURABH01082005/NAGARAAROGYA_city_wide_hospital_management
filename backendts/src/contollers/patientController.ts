import jwt from 'jsonwebtoken'
import patientModel from '../models/patientModel';
import bcrypt from 'bcryptjs';
import hospitalModel from '../models/hospitalModel';
import axios from 'axios';
import validator from 'validator';
import type { Request, Response, NextFunction } from 'express'
import { type IResponse } from '../interface/interface';

const register = async (req: Request, res: Response) => {
 
    interface IPatientCredentials {
        success: boolean,
        message?: string,
        data?: {
            patientDetail: {
                name: string,
                image: string,
                dob: Date,
                address: {
                    line1: string,
                    line2: string,
                },
            },
            detail: {
                hospitalId: string,
                appointmentId: string,
                userId: string,
                docId: string,
            },
        }
    }
    try {
        const { hospitalId, hospitalRegEmail, hospitalRegPassword, email, password } = req.body
        if (!hospitalId || !hospitalRegEmail || !hospitalRegPassword || !email || !password) {
            return res.json({ success: false, message: "All fields are required" } as IResponse)
        }
        if (!validator.isEmail(email) || !validator.isEmail(hospitalRegEmail)) {
            return res.json({ success: false, message: "Invalid email" } as IResponse)
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" } as IResponse)
        }

        //check hospital exsits
        const hospitalData = await hospitalModel.findOne({ hospitalId: hospitalId }).select("+password")
        if (!hospitalData) {
            return res.json({ success: false, message: "Hospital not found" } as IResponse)
        }

        //getting userDetails from hospital data
        const { data } = await axios.post<IPatientCredentials>(hospitalData.url + "/patient-credentials", { email: hospitalRegEmail, password: hospitalRegPassword }, {
            headers: { gtoken: jwt.sign(hospitalData.email + hospitalData.password, process.env.JWT_SECRET_GOVERNMENT as string) }
        })


        if (!data.success || !data.data) {
            return res.json({ success: false, message: data.message } as IResponse)
        }

        //password hashing
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        const patientDetail = {
            email: email,
            password: hashedPassword,
            name: data.data.patientDetail.name,
            image: data.data.patientDetail.image,
            dob: new Date(data.data.patientDetail.dob),
            address: data.data.patientDetail.address
        }
        const appointment = [{
            detail: data.data.detail,
            reference: [],
            isCompleted: false,

        }]

        //checkinng if user already present:
        
        const alreadyPatient = await patientModel.findOne({ "patientDetail.email": email}).select("+password")
        
        if (alreadyPatient) {
            const isMatch = bcrypt.compare(password,alreadyPatient.patientDetail.password)
            const setCredentials = await patientModel.findByIdAndUpdate(alreadyPatient._id, { patientDetail })
            //setting ptoken
            if(setCredentials){
                  
                const ptoken = jwt.sign({ patientId: setCredentials._id }, process.env.JWT_SECRET_PATIENT as string)
                return res.json({ success: true,data:ptoken, message: "Updated Profile Successfully" } as IResponse)
            }
        }


        //new patient registration
        const setCredentials = await patientModel.create({ patientDetail, appointment })
        
        //setting ptoken
        const ptoken = jwt.sign({ patientId: setCredentials._id }, process.env.JWT_SECRET_PATIENT as string)
        res.json({ success: true, message: "Patient email and password registered successfully",data: ptoken }as IResponse)


    } catch (error: any) {
        console.error('Error during registration:');
        res.json({ success: false, message: error.message+"from patient controller" }as IResponse)
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required for login" }as IResponse);
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" }as IResponse);
        }
        const data = await patientModel.findOne({ 'patientDetail.email': email }).select("+password");
        if (!data) {
            return res.json({ success: false, message: "Invalid credentials for Patient" } as IResponse);
        }


        //decrypting hassed password form database


        const isMatch = await bcrypt.compare(password, data.patientDetail.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials for Patient" });
        }

        const ptoken = jwt.sign({ patientId: data._id }, process.env.JWT_SECRET_PATIENT as string);
        // console.log("your patient id is ",data._id)
        res.status(200).json({ success: true, data:ptoken, message: "Login successful for Patient" });
    } catch (error: any) {
        console.error('Error during login:', error);
        res.json({ success: false, message: error.message } as IResponse);
    }
}



const getPatientDetails = async (req: Request, res: Response) => {
    try {
        const patientId = req.params.patientId
        const data = await patientModel.findById(patientId).select("-patientDetail.password")
        // console.log("patient id here is : ",patientId)
        if (!data) {
            return res.json({ success: false, message: "Patient Not found in system" } as IResponse)
        }
        res.json({ success: true, data:data } as IResponse)


    } catch (error: any) {
        console.error('Error generating profile:', error);
        res.json({ success: false, message: error.message } as IResponse)
    }
}





const getReport = async (req: Request, res: Response) => {
    try {

    } catch (error: any) {
        console.error('Error generating report:', error);
        res.json({ success: false, message: error.message } as IResponse)
    }
}

export { getReport, getPatientDetails, login, register }