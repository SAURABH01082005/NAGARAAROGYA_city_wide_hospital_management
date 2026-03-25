import express from 'express'

import { getSpecialitiesAndAddress,getHospitals } from '../contollers/generalController';

const generalRoute = express.Router();


generalRoute.get("/get-hospitals",getHospitals)
generalRoute.post("/specialities-available-and-address",getSpecialitiesAndAddress)

export default generalRoute