import jwt from 'jsonwebtoken'
import type {Request,Response,NextFunction} from "express"
import {type IResponse } from '../interface/interface'

//admin authentication middleware
const authAdmin = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {atoken} = req.headers
        if(!atoken){
            return res.json({success:false,message:"Not Authorized Login Again"} as IResponse)
        }
        const {adminId } = jwt.verify(atoken as string,process.env.JWT_SECRET_ADMIN as string) as {adminId:string}
        // console.log("adminId is ",adminId)
        // console.log("adminId from env is  ", process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)
        if(adminId !== process.env.ADMIN_EMAIL as string + process.env.ADMIN_PASSWORD as string){
            return res.json({success:false,message:"Not Authorized Login Again"} as IResponse)
        }
        next();

    }catch(err:any){
        console.log(err)
        res.json({success:false,message:err.message} as IResponse)
    }
}

export default authAdmin