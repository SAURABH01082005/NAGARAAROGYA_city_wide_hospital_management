import mongoose,{Schema,model,models,Document,Model} from "mongoose";

interface Idoctor extends Document {
    doctorDetail:{//which should be equal to appointment
        email:string,
        password:string,
        hospitalId:string,
        docId:string,
        speciality:string,
        degree:string,
        name:string,
        image:string
    },
    

}
const doctorSchema = new Schema<Idoctor>({
    doctorDetail:{//which should be equal to appointment
        email:{
            type:String,unique:true,
        },
        password:{
            type:String,required:true,select:false
        },
        name:{
            type:String,required:true,  
        },
        image:{
            type:String,required:true
        },
        docId:{
            type:String,required:true
        },
        hospitalId:{
            type:String,required:true
        },
        speciality:{
            type:String,required:true,
        },
        degree:{
            type:String,required:true,
        }
       
    },
    
},{minimize:false})

const doctorModel:Model<Idoctor> = mongoose.models.doctorModel || mongoose.model<Idoctor>("doctors",doctorSchema)

export default doctorModel;

