import express from 'express'

import { getSpecialitiesAndAddress,getHospitals,registerPatientNewAppointmentByAnotherHospital } from '../contollers/generalController';

const generalOutRoute = express.Router();



generalOutRoute.post("/register-patient-new-appointment-by-another-hospital",registerPatientNewAppointmentByAnotherHospital)

export default generalOutRoute