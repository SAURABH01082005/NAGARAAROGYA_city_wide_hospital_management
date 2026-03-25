import express from "express";
import { register, login ,getDoctorDetail,getAppointments} from "../contollers/doctorController";
import authDoctor from "../middlewares/authDoctor";

const doctorRoute = express.Router();


doctorRoute.post("/register", register)
doctorRoute.post("/login", login)
doctorRoute.get("/get-doctordetails",authDoctor,getDoctorDetail)
doctorRoute.get("/get-appointments",authDoctor,getAppointments)


export default doctorRoute