import express from "express";
import { login,addHospital ,getHospitals,deleteHospital,getAdminDetails} from "../contollers/adminController.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRoute = express.Router();

adminRoute.post("/login",login)
adminRoute.post("/add-hospital",authAdmin,addHospital)
adminRoute.get("/hospitals",authAdmin,getHospitals)
adminRoute.post("/delete-hospital",authAdmin,deleteHospital)
adminRoute.get("/get-admindetails",getAdminDetails)

export default adminRoute