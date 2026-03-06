import express from "express";
import { register, login ,getDoctorDetails} from "../contollers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRoute = express.Router();


doctorRoute.post("/register", register)
doctorRoute.post("/login", login)
doctorRoute.get("/get-doctordetails",authDoctor,getDoctorDetails)


export default doctorRoute