import jwt from 'jsonwebtoken'
import type {Response,Request,NextFunction} from 'express'
import { type IResponse } from '../interface/interface'

//nagaArogya  authentication middleware
const authNagarAarogya = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        // console.log("authGovernment middleware called")
        const {gtoken} = req.headers
        if(!gtoken){
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        const token_decode = jwt.verify(gtoken as string,process.env.JWT_SECRET_GOVERNMENT as string)
        if(token_decode !== `${process.env.NAGARAAROGYA_EMAIL}${process.env.NAGARAAROGYA_PASSWORD}` as string){
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        console.log("NagarAarogya Authentication Successful")
        
        next();

    }catch(err:any){
        console.log(err)
        res.json({success:false,message:err.message})
    }
}

export default authNagarAarogya