import express from "express";
import { login,addHospital ,getHospitals,deleteHospital,getAdminDetails} from "../contollers/adminController";
import authAdmin from "../middlewares/authAdmin";

const adminRoute = express.Router();

adminRoute.post("/login",login)
adminRoute.post("/add-hospital",authAdmin,addHospital)
adminRoute.get("/hospitals",authAdmin,getHospitals)
adminRoute.post("/delete-hospital",authAdmin,deleteHospital)
adminRoute.get("/get-admindetails",authAdmin,getAdminDetails)

export default adminRoute