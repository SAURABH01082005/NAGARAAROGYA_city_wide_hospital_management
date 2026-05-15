import mongoose, { Schema, model, models, Document, Model } from "mongoose";

interface Idoctor extends Document {
    doctorDetail: {//which should be equal to appointment
        email: string,
        password: string,
        hospitalId: string,
        docId: string,
        speciality: string,
        degree: string,
        name: string,
        image: string
    },
    verficationToken: number,
    expiresAt: Date

}
const doctorSchema = new Schema<Idoctor>({
    doctorDetail: {//which should be equal to appointment
        email: {
            type: String, unique: true,
        },
        password: {
            type: String, required: true, select: false
        },
        name: {
            type: String, required: true,
        },
        image: {
            type: String, required: true
        },
        docId: {
            type: String, required: true
        },
        hospitalId: {
            type: String, required: true
        },
        speciality: {
            type: String, required: true,
        },
        degree: {
            type: String, required: true,
        }

    },
    verficationToken: {
        type: Number, required: true
    },
    expiresAt: {
        type: Date,
        default: () => Date.now() + 1000 * 60 * 60 * 1
    }

}, { minimize: false })

const pendingDoctorModel: Model<Idoctor> = mongoose.models.pendingDoctorModel || mongoose.model<Idoctor>("pendingdoctors", doctorSchema)

export default pendingDoctorModel;

