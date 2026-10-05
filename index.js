import "dotenv/config"
import mongoose from "mongoose";
import userRouter from "../serverside/routers/userRoutes.js"
import adminrouter from "../serverside/routers/admindashboard.js"
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
app.use("/admin",adminrouter)
// app.use("/admin",AdminRoutes);
app.get("/", (req, res) => {
    res.send("Backend is workingknjknjk");
});
app.listen(5001, "0.0.0.0", () => {
    console.log("Server running on port 5000");
});

