
import {updatedata} from "../controllers/updatestatus.js"
import express from "express"
import {getunverifieddata,getverfieddata,dashboardStats,getuser} from "../controllers/adminupdates.js"
import {deleteAdminUpdate,updateAdminUpdate,createUpdate,getUpdates,getupdateddata} from "../controllers/adminupdates.js"
let userRoutes=express.Router();
userRoutes.post("/status",updatedata);
userRoutes.post("/getadminupdates",getUpdates);
userRoutes.post("/deleteadminupdate",deleteAdminUpdate);
userRoutes.post("/createupdate",createUpdate);
userRoutes.post("/updateadminupdate",updateAdminUpdate);
userRoutes.post("/getverificationdata",getupdateddata);
userRoutes.post("/adminverifieddata",getverfieddata);
userRoutes.post("/adminunverifieddata",getunverifieddata);
userRoutes.post("/dashboardstats",dashboardStats);
userRoutes.post("/search",getuser)
export default userRoutes