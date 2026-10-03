import {picupload,picupdate,Aadharpicupdate} from "../middleware/picupload.js"
import express from "express"
import multer from "multer";
import {userdata,dataupdate} from "../controllers/userdata.js"
const storage = multer.memoryStorage();
const upload = multer({ storage });
let userRoutes=express.Router();
userRoutes.post("/",upload.fields([
    { name: "pic", maxCount: 1 },
    { name: "picAadhar", maxCount: 1 }
]),picupload,userdata);
userRoutes.post("/update",dataupdate);
userRoutes.post("/imageupdate",upload.fields([{name:"pic",maxCount:1}]),picupdate)
userRoutes.post("/Aadharimageupdate",upload.fields([{name:"picAadhar",maxCount:1}]),Aadharpicupdate)
export default userRoutes
