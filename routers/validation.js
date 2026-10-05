import express from "express";
import mailauth from "../middleware/mailauth.js"
import {verifyusersigin,verifyusersignup} from "../controllers/authcontrol.js"
import { tokenauth } from "../middleware/tokenauth.js";
let auth=express.Router();
auth.post("/login",verifyusersigin);
auth.post("/mailauth",mailauth);
auth.post("/tokenauth",tokenauth);
auth.post("/signup",verifyusersignup);
export default auth
