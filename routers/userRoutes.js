import {picupload} from "../middleware/picupload.js"
import express from "express"
import multer from "multer";
import {userdata} from "../controllers/userdata.js"
const storage = multer.memoryStorage();
const upload = multer({ storage });
let userRoutes=express.Router();
userRoutes.post("/",upload.fields([
    { name: "pic", maxCount: 1 },
    { name: "picAadhar", maxCount: 1 }
]),picupload,userdata);
export default userRoutes
