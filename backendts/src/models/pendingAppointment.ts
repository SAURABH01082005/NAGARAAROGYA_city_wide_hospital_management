// import mongoose, { Schema, model, models, Model, Types } from "mongoose";


// interface Iappointment {
//     detail: {
//         hospitalId: string,
//         appointmentId: string,
//         userId: string,
//         docId: string,
//     },
//     reference: Types.ObjectId[],
//     isCompleted: boolean,
//     date: {
//         type: Date,
//     },
//     expiresAt: Date,
// }



// const appointmentSchema = new Schema<Iappointment>({

//     detail: {
//         type: {
//             hospitalId: { type: String, required: true },
//             appointmentId: { type: String, required: true },
//             userId: { type: String, required: true },
//             docId: { type: String, required: true }
//         },
//         required: true

//     },
//     reference: {
//         type: [
//             {
//                 type: [Object],
//                 ref: "reference"

//             }
//         ]
//     },

//     isCompleted: {
//         type: Boolean, default: false,
//     },
//     date: {
//         type: Date, default: Date.now
//     },
//     expiresAt: {
//         type: Date
//     }
// }, { minimize: false })

// appointmentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// const pendingAppointmentModel: Model<Iappointment> = models.pendingAppointmentModel || model<Iappointment>("pendingAppointmentModel", appointmentSchema)

// export default pendingAppointmentModel