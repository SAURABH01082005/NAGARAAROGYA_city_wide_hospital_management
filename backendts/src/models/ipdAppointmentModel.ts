import mongoose, { Schema, model, models, Model, Types } from "mongoose"

interface IipdAppointment {
    appointmentRef: Types.ObjectId,
    hospitalRef: string,
    patientRef: Types.ObjectId,
    isCompleted: boolean,
}

const ipdAppointmentSchema = new Schema<IipdAppointment>({

    appointmentRef: {
        type: Schema.Types.ObjectId,
        required: true

    },
    hospitalRef: {
        type: String,
        required: true

    },
    patientRef: {
        type: Schema.Types.ObjectId,
        ref: "patientsregisteredtogovernment",
    },


    isCompleted: {
        type: Boolean, default: false,
    },

}, { minimize: false, timestamps: true })


const ipdAppointmentModel: Model<IipdAppointment> = models.ipdAppointmentModel || model<IipdAppointment>("ipdAppointment", ipdAppointmentSchema)

export default ipdAppointmentModel