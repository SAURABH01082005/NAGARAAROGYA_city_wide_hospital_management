import axios from 'axios'
import hospitalModel from '../models/hospitalModel'
import jwt from 'jsonwebtoken'

import type { Request, Response } from 'express'
import type { IResponse } from '../interface/interface'

const getSpecialitiesAndAddress = async (req: Request, res: Response) => {
  
   interface Ihospital {
    hospitalId: string,
    name: string,
    email: string,
    password: string,
    url: string

}
    try {
        // let ans=[]
        const { speciality } = req.body
        const data = await axios.get(`${process.env.BACKEND_URL}/api/general/get-hospitals`)

        if (!data.data.success) {

            return res.json({ success: false, message: data.data.message }as IResponse)
        }
       
        const ans = await Promise.all(data.data.data.map(async (hospitalData:Ihospital, index:number) => {
            try {
               

                const { data } = await axios.get(hospitalData.url + "/specialities-available-and-address", {
                    headers: { gtoken: jwt.sign(hospitalData.email + hospitalData.password, process.env.JWT_SECRET_GOVERNMENT as string) }
                })

                if (!data.success) {
                    return res.json({ success: false, message: data.message } as IResponse)
                }
                // console.log(data.data," ->  ",speciality)
                if (data.data.specialities.some((s:string) => s.toLowerCase() == speciality.toLowerCase()))
                    return { name: hospitalData.name, id: hospitalData.hospitalId, address: data.data.hospitalAddress, appointmentPage: data.data.appointmentPage }
            } catch (err) {
                // console.log(hospitalData.url + "/specialities-available-and-address" , " is  inactive")

            }



        }))
        const ans2 = ans.filter(Boolean)//trick*************************************************** and don't use reduce for async mapping
        // console.log("ans is ",ans2)
        res.json({ success: true, data: ans2 } as IResponse) //data is an array of {spiciality and address}



    } catch (error: any) {
        console.error('Error getSpecialitesAndAddress:',);
        res.json({ success: false, message: error.message + "hello" }as IResponse)
    }
}

const getHospitals = async (req: Request, res: Response) => {
    try {
        const hospitals = await hospitalModel.find({}).select("+password")
       
        res.json({ success: true, data: hospitals, message: "Hospitals retrieved successfully" } as IResponse);
    } catch (error: any) {
        console.error('Error during retrieving hospitals:', error);
        res.json({ success: false, message: error.message } as IResponse);
    }
}



export { getSpecialitiesAndAddress, getHospitals }