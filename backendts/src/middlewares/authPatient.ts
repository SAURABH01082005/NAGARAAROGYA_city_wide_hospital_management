import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { Request,Response,NextFunction } from 'express'
import type{ IResponse } from '../interface/interface'



const authPatient = (req:Request, res:Response, next:NextFunction) => {
    try {
        const data = req.headers
        if (!data.ptoken ) {
            return res.json({ success: false, message: "Not Authorized Login Again" } as IResponse)
        }
        const ptoken=  data.ptoken;
        const {patientId}:{patientId:string} = jwt.verify(ptoken as string, process.env.JWT_SECRET_PATIENT as string) as {patientId:string}
        
        req.params.patientId = patientId //id of database
        next();
    }catch(err:any){
        console.log(err)
        res.json({success:false,message:err.message} as IResponse)
    }
    }





export default authPatient