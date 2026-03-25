import jwt from 'jsonwebtoken'
import patientModel from '../models/patientModel.js';
import bcrypt from 'bcryptjs';
import hospitalModel from '../models/hospitalModel.js';
import axios from 'axios';
import validator from 'validator';

const register = async (req, res) => {
    try {
        const { hospitalId, hospitalRegEmail, hospitalRegPassword, email, password } = req.body
        if (!hospitalId || !hospitalRegEmail || !hospitalRegPassword || !email || !password) {
            return res.json({ success: false, message: "All fields are required" })
        }
        if (!validator.isEmail(email) || !validator.isEmail(hospitalRegEmail)) {
            return res.json({ success: false, message: "Invalid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" })
        }

        //check hospital exsits
        const hospitalData = await hospitalModel.findOne({ hospitalId: hospitalId })
        if (!hospitalData) {
            return res.json({ success: false, message: "Hospital not found" })
        }

        //getting userDetails from hospital data
        const { data } = await axios.post(hospitalData.url + "/patient-credentials", { email: hospitalRegEmail, password: hospitalRegPassword }, {
            headers: { gtoken: jwt.sign(hospitalData.email + hospitalData.password, process.env.JWT_SECRET_GOVERNMENT) }
        })
        

        if (!data.success) {
            return res.json({ success: false, message: data.message })
        }

        //password hashing
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        
        const patientDetail = {
            email: email,
            password: hashedPassword,
            name: data.data.patientDetail.name,
            image:data.data.patientDetail.image,
            dob: new Date(data.data.patientDetail.dob),
            address: data.data.patientDetail.address

        }
        const appointment = [{
            detail:data.data.detail,
            reference:[],
            isCompleted:false,

        }]

        //checkinng if user already present:
        const alreadyPatient = await patientModel.find({"patientDetail.email":email,"patientDetail.password":hashedPassword})
        if(alreadyPatient.length > 0){
            const setCredentials  =await patientModel.findOneAndUpdate({"patientDetail.email":email},{patientDetail})
           return res.json({ success: false, message: "Updated Profile Successfully" })

        }

          const appointments = {
            uniqueGovAppointmentId: data.patientData.reference[0].patientId + data.patientData.reference[0].hospitalId,
            reference: data.patientData.reference

        }

        // return console.log("patientData is ",data.patientData)


        const setCredentials = await patientModel.create({ patientDetails, appointments })

        // console.log("patientData after findOneAndUpdate",patientData)
        const ptoken = jwt.sign({ patientId: setCredentials._id }, process.env.JWT_SECRET_PATIENT)
        res.json({ success: true, message: "Patient email and password registered successfully", ptoken })




    } catch (error) {
        console.error('Error during registration:', error);
        res.json({ success: false, message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required for login" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }
        const data = await patientModel.findOne({ 'patientDetails.email': email });
        if (!data) {
            return res.json({ success: false, message: "Invalid credentials for Patient" });
        }


        //decrypting hassed password form database


        const isMatch = await bcrypt.compare(password, data.patientDetails.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials for Patient" });
        }

        const ptoken = jwt.sign({ patientId: data._id }, process.env.JWT_SECRET_PATIENT);
        // console.log("your patient id is ",data._id)
        res.status(200).json({ success: true, ptoken, message: "Login successful for Patient" });
    } catch (error) {
        console.error('Error during login:', error);
        res.json({ success: false, message: error.message });
    }
}



const getPatientDetails = async (req, res) => {
    try {
        const patientId= req.patientId
        const data = await patientModel.findById(patientId)
        // console.log("patient id here is : ",patientId)
        if(!data){
            return res.json({ success: false, message: "Patient Not found in system" })
        }
        res.json({success:true,data})


    } catch (error) {
        console.error('Error generating profile:', error);
        res.json({ success: false, message: error.message })
    }
}





const getReport = async (req, res) => {
    try {

    } catch (error) {
        console.error('Error generating report:', error);
        res.json({ success: false, message: error.message })
    }
}

export { getReport, getPatientDetails, login, register }