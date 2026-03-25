import mongoose, { Schema, model, models,Model ,Types} from "mongoose";


interface Iappointment {
    detail: {
        hospitalId: string,
        appointmentId: string,
        userId: string,
        docId: string,
    },
    reference: Types.ObjectId[],
    isCompleted: boolean,
    date: Date
}
interface Ipatient {
    
    patientDetail: {//which should be equal to appointment
        email: string,
        password: string,

        name: string,
        image: string,

        dob: Date,
        address: { line1: string, line2: string, },

    },

    appointment:Iappointment[]

}






const appointmentSchema = new Schema<Iappointment>({
    
    detail: {
        type: {
            hospitalId: { type: String, required: true },
            appointmentId: { type: String, required: true },
            userId: { type: String, required: true },
            docId: { type: String, required: true }
        },
        required: true

    },
    reference:{
        type:[
            {
                type:[Object],
                ref:"Reference"

            }
        ]
    },

    isCompleted: {
        type: Boolean, default: false,
    },
    date: {
        type: Date, default: Date.now
    }
}, { minimize: false })


const patientSchema = new Schema<Ipatient>({
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

    appointment: {
        type: [appointmentSchema],
        required: true,
    }

}, { minimize: false })


const patientModel: Model<Ipatient> = models.patientModel || model<Ipatient>("patientsregisteredtogovernment", patientSchema)

export default patientModel;

