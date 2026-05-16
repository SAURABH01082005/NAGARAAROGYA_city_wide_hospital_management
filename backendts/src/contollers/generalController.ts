import axios from 'axios'
import hospitalModel from '../models/hospitalModel'
import jwt from 'jsonwebtoken'

import type { Request, Response } from 'express'
import type { IResponse } from '../interface/interface'
import patientModel from '../models/patientModel'
import ipdAppointmentModel from '../models/ipdAppointmentModel'
import referenceModel from '../models/referenceModel'
import { Types } from 'mongoose'
import { sendInfoConfirmationEmail } from '../contollers/email/emailController'
import generatePassword from 'generate-password';
import bcrypt from 'bcryptjs'
import bedQueueModel from '../models/bedQueue'


interface Iappointment {
    _id: Types.ObjectId,
    detail: {
        hospitalId: string,
        appointmentId: string,
        userId: string,
        docId: string,
    },
    referenceData: { reference: Types.ObjectId }[],
    isCompleted: false,
    date: Date
}

interface IreferenceModel {
    _id: Types.ObjectId,
    hospitalId: string;
    docId: string;
    referToHospitalId: string;
    report: Types.ObjectId[];
    reason: string;
    date: Date;
}


const getSpecialitiesAndAddress = async (req: Request, res: Response) => {

    interface Ihospital {
        hospitalId: string,
        name: string,
        email: string,
        password: string,
        url: string

    }
    try {
        // let ans=[]
        const { speciality } = req.body
        const data = await axios.get(`${process.env.BACKEND_URL}/api/general/get-hospitals`)

        if (!data.data.success) {

            return res.json({ success: false, message: data.data.message } as IResponse)
        }

        const ans = await Promise.all(data.data.data.map(async (hospitalData: Ihospital, index: number) => {
            try {


                const { data } = await axios.get(hospitalData.url + "/specialities-available-and-address", {
                    headers: { gtoken: jwt.sign(hospitalData.email + hospitalData.password, process.env.JWT_SECRET_GOVERNMENT as string) }
                })

                if (!data.success) {
                    return res.json({ success: false, message: data.message } as IResponse)
                }
                // console.log(data.data," ->  ",speciality)
                if (data.data.specialities.some((s: string) => s.toLowerCase() == speciality.toLowerCase()))
                    return { name: hospitalData.name, id: hospitalData.hospitalId, address: data.data.hospitalAddress, appointmentPage: data.data.appointmentPage }
            } catch (err) {
                // console.log(hospitalData.url + "/specialities-available-and-address" , " is  inactive")

            }



        }))
        const ans2 = ans.filter(Boolean)//trick*************************************************** and don't use reduce for async mapping
        // console.log("ans is ",ans2)
        res.json({ success: true, data: ans2 } as IResponse) //data is an array of {spiciality and address}



    } catch (error: any) {
        console.error('Error getSpecialitesAndAddress:',);
        res.json({ success: false, message: error.message + "hello" } as IResponse)
    }
}

const getHospitals = async (req: Request, res: Response) => {
    try {
        const hospitals = await hospitalModel.find({}).select("+password")

        res.json({ success: true, data: hospitals, message: "Hospitals retrieved successfully" } as IResponse);
    } catch (error: any) {
        console.error('Error during retrieving hospitals:', error);
        res.json({ success: false, message: error.message } as IResponse);
    }
}

const registerPatientNewAppointmentByAnotherHospital = async (req: Request, res: Response) => {
    const plainPassword = generatePassword.generate({
        length: 8,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true
    })
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(plainPassword, salt)
    const { detail, patientDetail, docName, hospitalName } = req.body
    const patientDetailWithPassword = {
        ...patientDetail, password: hashPassword
    }

    const reference: IreferenceModel = {
        _id: new Types.ObjectId(),
        hospitalId: detail.hospitalId,
        docId: detail.docId,
        referToHospitalId: detail.hospitalId,
        report: [],
        reason: "IPD ADMISSION",
        date: new Date()
    }
    const appointment: Iappointment = { _id: new Types.ObjectId(), detail, isCompleted: false, date: new Date(), referenceData: [{ reference: reference._id }] }

    console.log("appointment is this ", appointment, "\npatientDetail is this : ", patientDetail, "\ndocName is : ", docName)
    try {
        let data = await patientModel.findOne({ "patientDetail.email": patientDetail.email })
        const refdata = await referenceModel.create(reference)
        console.log("data is found : ", data)
        if (!refdata) {
            return res.json({ success: false, message: "Reference not created" } as IResponse)
        }
        if (!data) {
            data = await patientModel.create({ patientDetail: patientDetailWithPassword, appointment: [appointment] })
            if (!data) {
                return res.json({ success: false, message: "Appointment not created" } as IResponse)
            }
            await sendInfoConfirmationEmail(patientDetail.email, `Hello Mr./Ms. ${patientDetail.name} you are now registered to IPD in nagarAarogya system. Login to nagarAarogya by password : ${plainPassword}.Your addmission is done by doctor ${docName} in hospital ${hospitalName}`)

        } else {
            const insertedAppoint = await patientModel.updateOne({ "patientDetail.email": patientDetail.email }, { $push: { "appointment": appointment } })
            if (insertedAppoint.modifiedCount == 0) {
                return res.json({ success: false, message: "Appointment not created" } as IResponse)
            }
            await sendInfoConfirmationEmail(patientDetail.email, `Hello Mr./Ms. ${patientDetail.name} you are now registered to IPD in nagarAarogya system.Your addmission is done by doctor ${docName} in hospital ${hospitalName}`)

        }
        console.log("data is updated or created : ")


        const ipdQueue = await ipdAppointmentModel.create({ appointmentRef: appointment._id, hospitalRef: detail.hospitalId, patientRef: data._id as Types.ObjectId, isCompleted: false })
        if (!ipdQueue) {
            return res.json({ success: false, message: "Appointment not created" } as IResponse)
        }
    }
    catch (error: any) {
        console.error('Error during registering patient new appointment by another hospital:', error.message);
        return res.json({ success: false, message: error.message } as IResponse);
    }

    return res.json({ success: true, message: "Appointment created successfully" } as IResponse)
}


const deletePatientFromBedQueue = async (req: Request, res: Response) => {
    const { NApatientEmail, bedType } = req.body
    try {
        const data = await bedQueueModel.findOneAndDelete({ NApatientEmail, bedType })
        if (!data) {
            return res.json({ success: false, message: "Patient not found in bed queue" } as IResponse)
        }
        sendInfoConfirmationEmail(NApatientEmail, `Hello Mr./Ms. ${NApatientEmail} you have been removed from the bed queue for bed type ${bedType}. Please contact the hospital ${data.hospitalId} and doctor ${data.NAdoctorEmail} for more details.`)
        sendInfoConfirmationEmail(data.NAdoctorEmail, `Hello Doctor ${data.NAdoctorEmail} patient with email ${NApatientEmail} has been removed from the bed queue for bed type ${bedType} in your hospital. Please contact the hospital for more details.`)
        res.json({ success: true, message: "Patient removed from bed queue" } as IResponse)
    } catch (error: any) {
        return res.json({ success: false, message: error.message } as IResponse)
    }
}



export { deletePatientFromBedQueue,getSpecialitiesAndAddress, getHospitals, registerPatientNewAppointmentByAnotherHospital }