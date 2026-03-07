import express from 'express';

import { getReport, getPatientDetails, login, register } from '../contollers/patientController.js';
import authPatient from '../middlewares/authPatient.js';

const patientRoute=express.Router();

patientRoute.post("/register",register)
patientRoute.post("/login",login)
patientRoute.get("/get-patientdetails",authPatient,getPatientDetails)


export default patientRoute