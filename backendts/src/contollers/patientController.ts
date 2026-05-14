import jwt from 'jsonwebtoken'
import patientModel from '../models/patientModel';
import bcrypt from 'bcryptjs';
import hospitalModel from '../models/hospitalModel';
import axios from 'axios';
import validator from 'validator';
import type { Request, Response, NextFunction } from 'express'
import { type IResponse } from '../interface/interface';
import pendingPatientModel from '../models/pendingPatientModel';
import { sendWelcomeEmail, sendVerificationEamil } from '../contollers/email/emailController'

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

        const alreadyPatient = await patientModel.findOne({ "patientDetail.email": email }).select("+patientDetail.password")
        console.log("is alreadypatient", password, alreadyPatient?.patientDetail.password)

        if (alreadyPatient) {
            const isMatch = bcrypt.compare(password, alreadyPatient.patientDetail.password)
            if (!isMatch) {
                return res.json({ success: false, message: "Wrong Credentials" })
            }
            const setCredentials = await patientModel.findByIdAndUpdate(alreadyPatient._id, { patientDetail })
            //setting ptoken
            if (setCredentials) {

                const ptoken = jwt.sign({ patientId: setCredentials._id }, process.env.JWT_SECRET_PATIENT as string)
                return res.json({ success: true, data: ptoken, message: "Updated Profile Successfully", isAlreadyPatient: true } as IResponse)
            }
            else {
                return res.json(({ success: false, message: "unable to update in mongo" }))
            }
        }

        console.log("register function is called")
        //new patient registration
        const verficationToken = Math.floor(Math.random() * 1000000)
        const setCredentials = await pendingPatientModel.create({ patientDetail, appointment, verficationToken })

        // //setting ptoken
        // const ptoken = jwt.sign({ patientId: setCredentials._id }, process.env.JWT_SECRET_PATIENT as string)
        if (!setCredentials) {
            return res.json({ success: false, message: "unable to to push intermediate data in mongo" } as IResponse)
        }
        sendVerificationEamil(email, String(verficationToken))
        console.log("otp is sent by register")
        res.json({ success: true, message: "email has been sent successfully", data: setCredentials._id } as IResponse)


    } catch (error: any) {
        console.error('Error during registration:');
        res.json({ success: false, message: error.message + "from patient controller" } as IResponse)
    }
}

const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { otp, itemId } = req.body
        const user = await pendingPatientModel.findById(itemId).select("+patientDetail.password")
        console.log("verify email function", otp, itemId)
        if (!user || user.verficationToken !== Number(otp)) {
            console.log("user", user)
            return res.json({ success: false, message: "Inavlid or Expired Code" } as IResponse)

        }


        const data: any = { patientDetail: user.patientDetail, appointment: user.appointment }
        const setCredentials = await patientModel.create(data)

        await user.deleteOne()
        //setting ptoken
        const ptoken = jwt.sign({ patientId: setCredentials._id }, process.env.JWT_SECRET_PATIENT as string)
        res.json({ success: true, message: "Patient email and password registered successfully", data: ptoken } as IResponse)

        // await senWelcomeEmail(user.patientDetail.email, user.patientDetail.name)
        // return res.status(200).json({ success: true, message: "Email Verifed Successfully" })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "internal server error" })
    }
}

const resendOTP = async (req: Request, res: Response) => {
    const { itemId } = req.body
    const data = await pendingPatientModel.findById(itemId)
    if (!data)
        return res.json({ success: false, message: "Expired or Invalid OTP" })
    const verficationToken = Math.floor(Math.random() * 1000000)
    data.verficationToken = verficationToken
    await data.save()

    sendVerificationEamil(data.patientDetail.email, String(verficationToken))

    return res.json({ success: true, message: "New OTP sent" })
}

const login = async (req: Request, res: Response) => {
    console.log("login function is called")
    try {
        const { email, password } = req.body;
        console.log(email, password)
        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required for login" } as IResponse);
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" } as IResponse);
        }
        const data = await patientModel.findOne({ 'patientDetail.email': email }).select("+patientDetail.password");
        if (!data) {
            return res.json({ success: false, message: "Invalid credentials for Patient" } as IResponse);
        }

        sendWelcomeEmail(email, data.patientDetail.name)


        //decrypting hassed password form database


        const isMatch = await bcrypt.compare(password, data.patientDetail.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials for Patient" });
        }

        const ptoken = jwt.sign({ patientId: data._id }, process.env.JWT_SECRET_PATIENT as string);
        // console.log("your patient id is ",data._id)
        res.status(200).json({ success: true, data: ptoken, message: "Login successful for Patient" });
    } catch (error: any) {
        console.error('Error during login:', error);
        res.json({ success: false, message: error.message + "archit" } as IResponse);
    }
}



const getPatientDetails = async (req: Request, res: Response) => {
    try {
        const patientId = req.params.patientId
        const data = await patientModel.findById(patientId)
        // console.log("patient id here is : ",patientId)
        if (!data) {
            return res.json({ success: false, message: "Patient Not found in system" } as IResponse)
        }
        res.json({ success: true, data: data } as IResponse)


    } catch (error: any) {
        console.error('Error generating profile:', error);
        res.json({ success: false, message: error.message } as IResponse)
    }
}





const getReport = async (req: Request, res: Response) => {
    try {
        // Placeholder for future implementation
        res.json({ success: false, message: "Not implemented yet" } as IResponse);
    } catch (error: any) {
        console.error('Error generating report:', error);
        res.json({ success: false, message: error.message } as IResponse)
    }
}


const addAppointment = async (req: Request, res: Response) => {
    const { itemId, hospitalId } = req.body
    const hospitalData = await hospitalModel.find({ hospitalId }).select("+password")
    if (!hospitalData) {

    }
    // const url = hospitalData.url

    // const patientDataHos = await axios.post(`${url}/`)

    // const data  = await patientModel.findByIdAndUpdate(req.params.patientId,{$push:{appointment:}})


}
export { getReport, getPatientDetails, login, register, verifyEmail, resendOTP, addAppointment }