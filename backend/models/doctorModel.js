import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    doctorDetails:{//which should be equal to appointment
        email:{
            type:String,unique:true,
        },
        password:{
            type:String,
        },
        uniqueGovDoctorId:{
            type:String,required:true,
        },
        name:{
            type:String,required:true,  
        },
        image:{
            type:String,required:true
        }
    },

    reference:[{
        hospitalId:{
            type:String,required:true,
        },
        patientId:{
            type:String,required:true,  
        },
        date:{
            type:Date,required:true,default:Date.now,
        },
        reason:{
            type:String,required:true,
        }

    }]
    
},{})

const doctorModel = mongoose.models.doctorModel || mongoose.model("doctors",doctorSchema)

export default doctorModel;

