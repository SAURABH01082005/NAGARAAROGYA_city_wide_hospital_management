import express from "express";
import { register, login, getDoctorDetail, getAppointments, addReport, getReport } from "../contollers/doctorController";
import authDoctor from "../middlewares/authDoctor";

const doctorRoute = express.Router();


doctorRoute.post("/register", register)
doctorRoute.post("/login", login)
doctorRoute.get("/get-doctordetails", authDoctor, getDoctorDetail)
doctorRoute.post("/get-appointments", authDoctor, getAppointments)
doctorRoute.post("/add-report", authDoctor, addReport)
doctorRoute.post("/get-report", authDoctor, getReport)


export default doctorRoute