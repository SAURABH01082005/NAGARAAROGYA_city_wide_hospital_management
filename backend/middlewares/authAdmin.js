import jwt from 'jsonwebtoken'


//admin authentication middleware
const authAdmin = async (req,res,next)=>{
    try{
        const {atoken} = req.headers
        if(!atoken){
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        const {adminId} = jwt.verify(atoken,process.env.JWT_SECRET_ADMIN)
        if(adminId !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        next();

    }catch(err){
        console.log(err)
        res.json({success:false,message:err.message})
    }
}

export default authAdmin