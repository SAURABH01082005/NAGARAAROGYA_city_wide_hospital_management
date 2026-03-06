import mongoose from "mongoose";


const patientSchema = new mongoose.Schema({
    patientDetails: {//which should be equal to appointment
        email: {
            type: String, unique: true,
        },
        password: {
            type: String,
        },
        uniqueGovId: {
            type: String, required: true,
        },
        name: {
            type: String, required: true,
        },
        image: {
            type: String, required: true,
        },

        dob: {
            type: Date, required: true,
        },
        address: {
            line1: {
                type: String, required: true,
            },
            line2: {
                type: String, required: true,
            }
        },
    },

    appointments: [{
        uniqueGovAppointmentId: {
            type: String,
            required: true

        },
        reference: {
            type: [{
                hospitalId: {
                    type: String, required: true,
                },
                docId: {
                    type: String, required: true,
                },
                date: {
                    type: Date, required: true, default: Date.now,
                },
                reason: {
                    type: String, required: true,
                }

            }]
        },
        isCompleted: {
            type: Boolean, default: false,
        }
    }]

}, {})

const patientModel = mongoose.models.patientModel || mongoose.model("patientsregisteredbygovernment", patientSchema)

export default patientModel;

