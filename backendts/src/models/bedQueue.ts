import mongoose, { Schema, model, models, Model, Types } from "mongoose"
import axios from "axios"
import hospitalModel from "./hospitalModel";
import jwt from "jsonwebtoken";
import {sendInfoConfirmationEmail} from '../contollers/email/emailController'

interface IbedQueue {
    bedType:string,
    hospitalId:string,
    NApatientEmail:string,
    NAdoctorEmail:string,
    bedScore:number
}

const bedQueueSchema = new Schema<IbedQueue>({

    bedType: {
        type: String,
        required: true
    },
    hospitalId: {
        type: String,
        required: true
    },
    bedScore: {
        type: Number,
        required: true
    },
    
    NApatientEmail: {
        type: String,
        required: true
    },
    NAdoctorEmail: {
        type: String,
        required: true
    }
},{ minimize: false, timestamps: true })

const bedQueueModel: Model<IbedQueue> = models.bedQueueModel || model<IbedQueue>("bedQueue", bedQueueSchema)

bedQueueSchema.pre('save', async function (next) {
    //adding data to hospital bedqueue
    try{
        const hospital = await hospitalModel.findOne({hospitalId:this.hospitalId}).select("+password")
    if(hospital == null){
        throw new Error("Hospital not found for bed queue")
    }
    const {data} =await axios.post(`${hospital.url}/add-to-bed-queue`, {
        bedType: this.bedType,
        NApatientEmail: this.NApatientEmail,
        NAdoctorEmail: this.NAdoctorEmail,
        bedScore: this.bedScore
    }, { headers: { gtoken: jwt.sign(hospital.email + hospital.password, process.env.JWT_SECRET_GOVERNMENT as string) } })
    if(!data.success){
         throw new Error("Failed to add to hospital bed queue")
    }
    return
        
    }catch(error:any){
        throw error
    }
})

bedQueueSchema.post('save', async function (doc, next) {
    //send email to patient and doctor about bed queue status
    try{
        await sendInfoConfirmationEmail(doc.NApatientEmail, `Bed Queue Status, Your request to join the bed queue has been received. Reques is made by doctor email ${doc.NAdoctorEmail}. We will notify you once a bed is available.   `)
        await sendInfoConfirmationEmail(doc.NAdoctorEmail, `Bed Queue Status, A new patient email ${doc.NApatientEmail} has requested a bed in your hospital.`)
    }catch(error:any){
        console.log("Error in post save hook of bedQueueSchema")
    }
})
export default bedQueueModel