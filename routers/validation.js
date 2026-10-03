import express from "express";
import mailauth from "../middleware/mailauth.js"
import {verifyusersigin,verifyusersignup} from "../controllers/authcontrol.js"
let auth=express.Router();

auth.post("/login",verifyusersigin);
auth.post("/mailauth",mailauth);

auth.post("/signup",verifyusersignup);

export default auth
