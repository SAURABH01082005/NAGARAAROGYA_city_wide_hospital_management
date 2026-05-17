import express from "express";
import {completeAppointment,getBedQueue,bedQueue, getAllHospitalBeds,register, login, getDoctorDetail, getAppointments, addReport, getReport, verifyEmail, resendOTP } from "../contollers/doctorController";
import authDoctor from "../middlewares/authDoctor";

const doctorRoute = express.Router();


doctorRoute.post("/register", register)
doctorRoute.post("/register/email-verify", verifyEmail)
doctorRoute.post("/register/resend-otp", resendOTP)
doctorRoute.post("/login", login)
doctorRoute.get("/get-doctordetails", authDoctor, getDoctorDetail)
doctorRoute.post("/get-appointments", authDoctor, getAppointments)
doctorRoute.post("/add-report", authDoctor, addReport)
doctorRoute.post("/get-report", authDoctor, getReport)
doctorRoute.get("/get-all-hospital-beds", authDoctor, getAllHospitalBeds)
doctorRoute.post("/bed-queue",authDoctor,bedQueue)
doctorRoute.get("/get-bed-queue",authDoctor,getBedQueue)
doctorRoute.post("/complete-appointment",authDoctor,completeAppointment)



export default doctorRoute