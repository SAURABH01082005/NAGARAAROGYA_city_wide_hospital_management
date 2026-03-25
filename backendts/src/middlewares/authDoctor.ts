import jwt from 'jsonwebtoken'

import type {Response,Request,NextFunction} from 'express'
import { type IResponse } from '../interface/interface'

const authDoctor = (req:Request, res:Response, next:NextFunction) => {
    try {
        const { dtoken } = req.headers
        if (!dtoken) {
            return res.json({ success: false, message: "Not Authorized Login Again" } as IResponse)
        }
        const { doctorId } = jwt.verify(dtoken as string, process.env.JWT_SECRET_DOCTOR as string) as {doctorId:string}
        req.params.doctorId = doctorId
        next();
    }catch(err:any){
        console.log(err)
        res.json({success:false,message:err.message} as IResponse)
    }
    }





export default authDoctor