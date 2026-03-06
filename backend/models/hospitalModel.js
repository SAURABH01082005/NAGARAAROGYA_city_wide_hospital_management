import e from "cors";
import mongoose  from "mongoose";

const hospitalSchema = new mongoose.Schema({
    hospitalId:{
        type:String,required:true,unique:true

    },
    name:{
        type:String,required:true,
    },
    email:{
        type:String,required:true,
    },
    password:{
        type:String,required:true,
    },
    url:{
        type:String,required:true,
    }
})

const hospitalModel = mongoose.models.hospitalModel || mongoose.model("hospitals",hospitalSchema)
export default hospitalModel;