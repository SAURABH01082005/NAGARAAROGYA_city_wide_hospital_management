import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    doctorId: {
        type: String, required: true
    },
    hospitalId: {
        type: String, required: true,
    },
    date: {
        type: Date, required: true, default: Date.now
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
    additonalTests: {
        type: String, required: true, default: "no additional tests"
    },
    nextVisitSchedule: {
        type: Date, required: true,
    },
    date: {
        type: Date, required: true,
    },
}, { minimize: false })



const appointmentSchema = new mongoose.Schema({
    detail: {
        type: {
            hospitalId: { type: String, required: true },
            appointmentId: { type: String, required: true },
            userId: { type: String, required: true },
            docId: { type: String, required: true }
        },
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
            referToHospitalId: {
                type: String, required: true,
            },
            report: {
                type: [reportSchema],

            },
            reason: {
                type: String, required: true,
            },
            date: {
                type: Date, required: true,
            }

        }]
    },

    isCompleted: {
        type: Boolean, default: false,
    },
    date: {
        type: Date, default: Date.now()
    }
}, { minimize: false })


const patientSchema = new mongoose.Schema({
    patientDetail: {//which should be equal to appointment
        email: {
            type: String, unique: true,
        },
        password: {
            type: String,
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
            type: {
                line1: {
                    type: String, required: true,
                },
                line2: {
                    type: String, required: true,
                },
            },
            required: true
        },
    },

    appointments: {
        type: [appointmentSchema],
        required: true,
    }

}, { minimize: false })

const patientModel = mongoose.models.patientModel || mongoose.model("patientsregisteredtogovernment", patientSchema)

export default patientModel;

