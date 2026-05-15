import express from 'express';

import { getReport, getPatientDetails, login, register, verifyEmail, resendOTP, addAppointment, getAppointments } from '../contollers/patientController';
import authPatient from '../middlewares/authPatient';
import { Request, Response } from 'express';
const patientRoute = express.Router();

patientRoute.post("/register", register)
patientRoute.post("/register-patient-new-appointment-by-another-hospital", authPatient, addAppointment)
patientRoute.post("/register/email-verify", verifyEmail)
patientRoute.post("/register/resend-otp", resendOTP)
patientRoute.post("/login", login)
patientRoute.post("/get-appointments", authPatient, getAppointments)
patientRoute.post("/get-report", authPatient, getReport)
// Temporary Test Route

patientRoute.get("/get-patientdetails", authPatient, getPatientDetails)


export default patientRoute