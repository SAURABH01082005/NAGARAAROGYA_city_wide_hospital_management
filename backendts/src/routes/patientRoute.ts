import express from 'express';

import { getReport, getPatientDetails, login, register, } from '../contollers/patientController';
import authPatient from '../middlewares/authPatient';

const patientRoute=express.Router();

patientRoute.post("/register",register)
patientRoute.post("/login",login)
patientRoute.get("/get-patientdetails",authPatient,getPatientDetails)


export default patientRoute