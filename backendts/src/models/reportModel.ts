import mongoose, { Schema, model, models,Model } from "mongoose";

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


const reportSchema = new Schema<Ireport>({
    doctorId: {
        type: String, required: true
    },
    hospitalId: {
        type: String, required: true,
    },
    symptom: {
        type: String, required: true,
    },
    prescription: {
        type: String, required: true,
    },
    additionalNote: {
        type: String, required: true, default: "no additional note"
    },
    additionalTests: {
        type: String, required: true, default: "no additional tests"
    },
    nextVisitSchedule: {
        type: Date, required: true,
    },
    date: {
        type: Date, required: true,
    },
}, { minimize: false })

const reportModel: Model<Ireport>= models.reportModel || model<Ireport>("Report",reportSchema)

export default reportModel