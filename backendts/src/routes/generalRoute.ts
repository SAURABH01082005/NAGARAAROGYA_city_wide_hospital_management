import express from 'express'

import { getSpecialitiesAndAddress,getHospitals,registerPatientNewAppointmentByAnotherHospital } from '../contollers/generalController';
import { getAllHospitalBeds, getBedQueue } from '../contollers/doctorController';
import authNagarAarogya from '../middlewares/authNagarAarogya';

const generalRoute = express.Router();


generalRoute.get("/get-hospitals",getHospitals)//not in use i think
generalRoute.post("/specialities-available-and-address",getSpecialitiesAndAddress)//not in use i think
generalRoute.post("/register-patient-new-appointment-by-another-hospital",registerPatientNewAppointmentByAnotherHospital)//not in use i think
generalRoute.get("/get-all-hospital-beds", authNagarAarogya, getAllHospitalBeds)
generalRoute.get("/get-bed-queue",authNagarAarogya,getBedQueue)

export default generalRoute