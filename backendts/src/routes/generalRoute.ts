import express from 'express'

import { getSpecialitiesAndAddress,getHospitals,getBedState,registerPatientNewAppointmentByAnotherHospital } from '../contollers/generalController';

const generalRoute = express.Router();


generalRoute.get("/get-hospitals",getHospitals)
generalRoute.get("/bed-state",getBedState)
generalRoute.post("/specialities-available-and-address",getSpecialitiesAndAddress)
generalRoute.post("/register-patient-new-appointment-by-another-hospital",registerPatientNewAppointmentByAnotherHospital)

export default generalRoute