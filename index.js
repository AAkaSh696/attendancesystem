import "dotenv/config"
import mongoose from "mongoose";
import userRouter from "../serverside/routers/userRoutes.js"
import bcrypt from "bcrypt"
import express, { urlencoded } from "express";
// import {userRoutes} from "./routers/userRoutes.js"
import auth from "./routers/validation.js"
let app=express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
mongoose.connect(process.env.MONGO_URL);
let db=mongoose.connection
db.once("open",()=>{
    console.log("database connected succesfully")
})
db.on("error",()=>{
   console.log("error")
})

app.use("/users",auth);
app.use("/registration",userRouter)
// app.use("/admin",AdminRoutes);
app.listen("3000",()=>{
    console.log("server started succesfully");
})

