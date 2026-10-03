import mongoose from "mongoose";

const schema = new mongoose.Schema({
    
    Name: {
        type: String,
        required: true
    },
    Refernceid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Authentication"
    },

    batch: {
        type: String,
        enum: ["2027", "2028", "2029", "2030", "outsider"],
        required: true
    },

    Aadhar: {
        type: String,
        required: true,
        unique: true,
        match: /^\d{12}$/
    },

    RollNO: {
        type: String,
        unique: true,
        required: function () {
            return this.batch !== "outsider";
        }
    },

    branch: {
        type: String,
        enum: ["cse", "ece", "biotech", "mechanical", "civil", "eco", "AI/ML"],
        required: function () {
            return this.batch !== "outsider";
        }
    },

    MobileNo: {
        type: String,
        required: true,
        unique: true,
        match: /^\d{10}$/
    },
    url:{
        type:String,
    },
    urlAadhar:{
        type:String
    }

}, { timestamps: true });

const db = mongoose.model("userData", schema);

export default db;