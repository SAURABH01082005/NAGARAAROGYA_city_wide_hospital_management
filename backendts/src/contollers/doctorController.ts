import doctorModel from "../models/doctorModel";
import hospitalModel from "../models/hospitalModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import axios from "axios";
import patientModel from "../models/patientModel";
import { type IResponse } from "../interface/interface";
import ipdAppointmentModel from "../models/ipdAppointmentModel";
import type { Request, Response } from "express";
import reportModel from "../models/reportModel";
import referenceModel from "../models/referenceModel";
import { sendInfoConfirmationEmail, sendVerificationEamil } from '../contollers/email/emailController'
import pendingDoctorModel from "../models/pendingDoctorModel";
import bedQueueModel from "../models/bedQueue";



interface Ireport {
    doctorId: string,
    hospitalId: string,
    symptom: string,
    prescription: string,
    additionalNote: string,
    additionalTests: string,
    nextVisitSchedule: Date,
    date: Date,
}



const register = async (req: Request, res: Response) => {
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

        const hospitalData = await hospitalModel.findOne({ hospitalId: hospitalId }).select("+password")
        if (!hospitalData) {
            return res.json({ success: false, message: "Hospital not found" } as IResponse)
        }

        //getting userDetails from hospital data
        const { data } = await axios.post(hospitalData.url + "/doctor-credentials", { email: hospitalRegEmail, password: hospitalRegPassword }, {
            headers: { gtoken: jwt.sign(hospitalData.email + hospitalData.password, process.env.JWT_SECRET_GOVERNMENT as string) }
        })
        // console.log("got response from hospital server !",data)

        if (!data.success) {
            return res.json({ success: false, message: "Failed to fetch doctor details from hospital" + data.message } as IResponse)
        }

        //data.doctorDetail
        //hashing user password on nagarAarogya server
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const doctorDetail = {
            email: email,
            password: hashedPassword,
            name: data.data.doctorDetails.name,
            docId: data.data.doctorDetails.docId,
            hospitalId: hospitalId,
            speciality: data.data.doctorDetails.speciality,
            degree: data.data.doctorDetails.degree,
            image: data.data.doctorDetails.image,
        }

        const alreadyDoctor = await doctorModel.findOne({ "doctorDetail.email": email }).select("+doctorDetail.password")

        if (alreadyDoctor) {
            const isMatch = await bcrypt.compare(password, alreadyDoctor.doctorDetail.password)
            if (!isMatch) {
                return res.json({ success: false, message: "Wrong Credentials" } as IResponse)
            }
            const setCredentials = await doctorModel.findByIdAndUpdate(alreadyDoctor._id, { doctorDetail }, { new: true })
            if (setCredentials) {
                const dtoken = jwt.sign({ doctorId: setCredentials._id }, process.env.JWT_SECRET_DOCTOR as string)
                return res.json({ success: true, data: dtoken, message: "Updated Profile Successfully", isAlreadyDoctor: true } as IResponse)
            } else {
                return res.json({ success: false, message: "unable to update in mongo" } as IResponse)
            }
        }

        const verficationToken = Math.floor(Math.random() * 1000000)
        const pendingData = await pendingDoctorModel.create({ doctorDetail, verficationToken })

        if (!pendingData) {
            return res.json({ success: false, message: "unable to push intermediate data in mongo" } as IResponse)
        }

        sendVerificationEamil(email, String(verficationToken))
        console.log("verification token of doctor is ", verficationToken)

        res.json({ success: true, message: "email has been sent successfully", data: pendingData._id } as IResponse)




    } catch (error: any) {
        console.error('Error during registration:', error);
        res.json({ success: false, message: error.message } as IResponse)
    }
}




const login = async (req: Request, res: Response) => {
    console.log("login is called")
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required for login" } as IResponse);
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" } as IResponse);
        }

        const data = await doctorModel.findOne({ 'doctorDetail.email': email }).select("+doctorDetail.password");


        if (!data) {
            return res.json({ success: false, message: "Invalid credentials for Doctor" } as IResponse);
        }


        //decrypting hassed password form database


        const isMatch = await bcrypt.compare(password, data.doctorDetail.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials for Patient" } as IResponse);
        }
        const dtoken = jwt.sign({ doctorId: data._id }, process.env.JWT_SECRET_DOCTOR as string);
        res.status(200).json({ success: true, data: dtoken, message: "Login successful for Doctor" } as IResponse);
    } catch (error: any) {
        console.error('Error during login:', error);
        res.json({ success: false, message: error.message + "from login backend" } as IResponse);
    }
}


const getDoctorDetail = async (req: Request, res: Response) => {
    try {
        const doctorId = req.params.doctorId
        const data = await doctorModel.findById(doctorId)
        // console.log("doctor id here is : ",doctorId)
        if (!data) {
            return res.json({ success: false, message: "Doctor Not found in system" } as IResponse)
        }
        res.json({ success: true, data } as IResponse)


    } catch (error: any) {
        console.error('Error generating profile:', error);
        res.json({ success: false, message: error.message } as IResponse)
    }
}



const getAppointments = async (req: Request, res: Response) => {
    try {
        const { doctorData } = req.body;
        // console.log("doctor data here is : ", doctorData)
        // console.log("req.body is : ", req.body)
        if (!doctorData) {
            return res.json({ success: false, message: "Doctor Data not found in system" } as IResponse)
        }
        const data = await ipdAppointmentModel.find({ hospitalRef: doctorData.doctorDetail.hospitalId }).populate('patientRef');
        res.json({ success: true, data: data } as IResponse)
    } catch (error: any) {
        res.json({ success: false, message: error.message } as IResponse)
    }
}


const addReport = async (req: Request, res: Response) => {

    try {
        const { appointmentId, report, doctorData }: { appointmentId: string, report: Ireport, doctorData: any } = req.body
        console.log("doctorData is : ", doctorData)

        if (!appointmentId || !report.symptom || !report.prescription || !report.additionalNote || !report.additionalTests || !report.nextVisitSchedule || !report.date) {
            return res.json({ success: false, message: "All fields are required" } as IResponse)
        }
        const reportData = await reportModel.create(report)
        if (!reportData) {
            return res.json({ success: false, message: "Failed to create report" } as IResponse)
        }

        const patientData = await patientModel.findOne(
            { "appointment._id": appointmentId },
            { "appointment.$": 1, "patientDetail": 1 }
        );
        if (!patientData) {
            return res.json({ success: false, message: "patientData not found in system" } as IResponse)
        }
        patientData?.appointment[0]?.referenceData?.sort((a: any, b: any) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
        })
        const referenceId = patientData?.appointment[0]?.referenceData[0]?.reference
        const refData = await referenceModel.findOneAndUpdate(
            { _id: referenceId },
            { $push: { report: reportData._id } },
            { new: true }
        );
        if (!refData) {
            return res.json({ success: false, message: "Failed to update reference" } as IResponse)
        }
        // console.log("reference id : ", referenceId)
        console.log("patientData is : ", patientData)
        // console.log("reference data is : ", refData)
        sendInfoConfirmationEmail(patientData.patientDetail.email, `Your report is added on nagarAarogay by doctor ${doctorData.doctorDetail.name} and hospital ${doctorData.doctorDetail.hospitalId}`);


        return res.json({ success: true, message: "Report added successfully" } as IResponse)
    } catch (error: any) {
        res.json({ success: false, message: error.message } as IResponse)
    }
}

const getReport = async (req: Request, res: Response) => {
    console.log("getReport is called")
    try {
        const { appointmentId } = req.body
        console.log("appointmentId is :", appointmentId)

        if (!appointmentId) {
            return res.json({ success: false, message: "Appointment ID is required" } as IResponse)
        }
        const patientData = await patientModel.findOne({ "appointment._id": appointmentId }, { "appointment.$": 1 })
        console.log("patientData is :", patientData)
        if (!patientData) {
            return res.json({ success: false, message: "patientData not found in system" } as IResponse)
        }
        patientData?.appointment[0]?.referenceData?.sort((a: any, b: any) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
        })
        const referenceId = patientData?.appointment[0]?.referenceData?.[0]?.reference
        const refData = await referenceModel.findById(referenceId).populate("report")
        if (!refData) {
            return res.json({ success: false, message: "Reference not found in system" } as IResponse)
        }
        console.log("refData.report is :", refData.report)


        res.json({ success: true, data: refData.report } as IResponse)
    } catch (error: any) {
        res.json({ success: false, message: error.message } as IResponse)
    }
}



const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { otp, itemId } = req.body
        const user = await pendingDoctorModel.findById(itemId).select("+doctorDetail.password")

        if (!user || user.verficationToken !== Number(otp)) {
            return res.json({ success: false, message: "Invalid or Expired Code" } as IResponse)
        }

        const doctorDetail = user.doctorDetail;
        const setCredentials = await doctorModel.create({ doctorDetail })

        await user.deleteOne()

        const dtoken = jwt.sign({ doctorId: setCredentials._id }, process.env.JWT_SECRET_DOCTOR as string)
        res.json({ success: true, message: "Doctor email and password registered successfully", data: dtoken } as IResponse)

    } catch (error: any) {
        console.error(error)
        return res.json({ success: false, message: "internal server error" } as IResponse)
    }
}

const resendOTP = async (req: Request, res: Response) => {
    try {
        const { itemId } = req.body
        const data = await pendingDoctorModel.findById(itemId)
        if (!data)
            return res.json({ success: false, message: "Expired or Invalid OTP" } as IResponse)

        const verficationToken = Math.floor(Math.random() * 1000000)
        data.verficationToken = verficationToken
        await data.save()

        sendVerificationEamil(data.doctorDetail.email, String(verficationToken))

        return res.json({ success: true, message: "New OTP sent" } as IResponse)
    } catch (error: any) {
        return res.json({ success: false, message: error.message } as IResponse)
    }
}

const getAllHospitalBeds = async (req: Request, res: Response) => {
    //getting all hospitals
    try {
        const hospitals = await hospitalModel.find({}).select("+password")

        let hospitalBedsData = await Promise.all(hospitals.map(async (hospital) => {
            try {
                // console.log("fetting this link",hospital.url + "/get-all-beds"," PASSWORD IS ",hospital.password)
                console.log("hospital data is : ", hospital)
                const { data } = await axios.get(hospital.url + "/get-all-beds", { headers: { gtoken: jwt.sign(hospital.email + hospital.password, process.env.JWT_SECRET_GOVERNMENT as string) } })
                console.log(` data for hospital ${hospital.hospitalId}:`, data);
                if (data.success) {
                    return { hospitalId: hospital.hospitalId, hospitalName: hospital.name, beds: data.beds }
                } else {
                    return null
                }
            } catch (error: any) {
                console.error(`Error fetching beds for hospital ${hospital.hospitalId}:`);
                // return { hospitalId: hospital.hospitalId, hospitalName: hospital.name, beds: [] }
            }
            return null
            
        }))

        
        hospitalBedsData=hospitalBedsData.filter((item)=>{
            return item !== null  
        })
       
        console.log("hospitalBedsData is : ", hospitalBedsData)
        res.json({ success: true, data: hospitalBedsData } as IResponse)


    } catch (error: any) {
        return res.json({ success: false, message: error.message } as IResponse)
    }
}

const bedQueue = async (req: Request, res: Response) => {
    const {bedType,hospitalId,NApatientEmail,NAdoctorEmail,bedScore} = req.body
    try {
        const data = await bedQueueModel.create({
            bedType: bedType,
            hospitalId: hospitalId,
            NApatientEmail: NApatientEmail,
            NAdoctorEmail: NAdoctorEmail,
            bedScore: bedScore
        })
        if(!data){
            return res.json({ success: false, message: "Failed to add to bed queue" } as IResponse)
        }
        res.json({ success: true, message: "Added to bed queue" } as IResponse)
    } catch (error: any) {
        return res.json({ success: false, message: error.message } as IResponse)
    }
}

const getBedQueue = async (req: Request, res: Response) => {
    const hospitalId = (req.body?.hospitalId || req.query.hospitalId) as string | undefined
    try{
        if(!hospitalId){
             const data = await bedQueueModel.find({})
             if(!data){
                return res.json({ success: false, message: "Failed to get bed queue" } as IResponse)
             }
            return res.json({ success: true, message: "All Hospial Data", data: data } as IResponse)
        }
    }catch(error:any){
        return res.json({ success: false, message: error.message } as IResponse)
    }
    try {
        const data = await bedQueueModel.find({ hospitalId: hospitalId })
        if(!data){
            return res.json({ success: false, message: "Failed to get bed queue" } as IResponse)
        }
        res.json({ success: true, data: data } as IResponse)
    } catch (error: any) {
        return res.json({ success: false, message: error.message } as IResponse)
    }
}


const completeAppointment = async (req: Request, res: Response) => {
    const { appointmentRef, patientEmail, doctorEmail, hospitalId } = req.body
    try {
        if (!appointmentRef) {
            return res.json({ success: false, message: "Appointment ID is required" } as IResponse)
        }
        const appointmentData = await ipdAppointmentModel.findOne({appointmentRef})
        if (!appointmentData) {
            return res.json({ success: false, message: "IPDAppointment not found" } as IResponse)
        }
        appointmentData.isCompleted = true
        await appointmentData.save()
        const patientModelData = await patientModel.findOneAndUpdate({ "appointment._id": appointmentRef }, { $set: { "appointment.$.isCompleted": true } })
        if(!patientModelData){
            return res.json({ success: false, message: "Failed to update patient appointment data" } as IResponse)
        }
            sendInfoConfirmationEmail(patientEmail, `Your appointment with reference ${appointmentRef} is marked as completed by doctor ${doctorEmail} from hospital ${hospitalId}. Thank you for using NagarAarogya.`);
        res.json({ success: true, message: "Appointment completed" } as IResponse)
    } catch (error: any) {
        return res.json({ success: false, message: error.message } as IResponse)
    }
}


export {completeAppointment,getBedQueue,bedQueue, getAllHospitalBeds, login, register, getDoctorDetail, getAppointments, addReport, getReport, verifyEmail, resendOTP }
