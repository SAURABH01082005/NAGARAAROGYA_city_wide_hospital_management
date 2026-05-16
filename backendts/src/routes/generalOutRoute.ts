import express from 'express'

import {deletePatientFromBedQueue, getSpecialitiesAndAddress,getHospitals,registerPatientNewAppointmentByAnotherHospital } from '../contollers/generalController';
import authNagarAarogya from '../middlewares/authNagarAarogya';

const generalOutRoute = express.Router();



generalOutRoute.post("/register-patient-new-appointment-by-another-hospital",registerPatientNewAppointmentByAnotherHospital)
generalOutRoute.post("/delete-patient-from-bed-queue",authNagarAarogya,deletePatientFromBedQueue)

export default generalOutRoute