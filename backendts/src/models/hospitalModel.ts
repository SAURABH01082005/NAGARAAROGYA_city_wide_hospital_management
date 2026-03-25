
import mongoose, { Schema, model, models,Model } from "mongoose";

interface Ihospital {
    hospitalId: string,
    name: string,
    email: string,
    password: string,
    url: string

}

const hospitalSchema = new Schema<Ihospital>({
    hospitalId: {
        type: String, required: true, unique: true

    },
    name: {
        type: String, required: true,
    },
    email: {
        type: String, required: true,
    },
    password: {
        type: String, required: true,
    },
    url: {
        type: String, required: true,
    }
})

const hospitalModel : Model<Ihospital> = models.hospitalModel || model<Ihospital>("hospitals", hospitalSchema)
export default hospitalModel;