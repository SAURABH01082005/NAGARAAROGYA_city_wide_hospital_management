import jwt from 'jsonwebtoken'

const authPatient = (req, res, next) => {
    try {
        const { ptoken } = req.headers
        if (!ptoken) {
            return res.json({ success: false, message: "Not Authorized Login Again" })
        }
        const { patientId } = jwt.verify(ptoken, process.env.JWT_SECRET_PATIENT)
        req.patientId = patientId
        next();
    }catch(err){
        console.log(err)
        res.json({success:false,message:err.message})
    }
    }





export default authPatient