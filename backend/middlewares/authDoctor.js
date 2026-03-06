import jwt from 'jsonwebtoken'

const authDoctor = (req, res, next) => {
    try {
        const { dtoken } = req.headers
        if (!dtoken) {
            return res.json({ success: false, message: "Not Authorized Login Again" })
        }
        const { doctorId } = jwt.verify(dtoken, process.env.JWT_SECRET_DOCTOR)
        req.doctorId = doctorId
        next();
    }catch(err){
        console.log(err)
        res.json({success:false,message:err.message})
    }
    }





export default authDoctor