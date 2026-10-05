import mongoose from "mongoose";

const schema = new mongoose.Schema({
    
    username: {
        type: String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["admin","user"],
        required:true
    }
    

}, { timestamps: true });

const dbauth = mongoose.model("Authentication",schema);

export default dbauth;