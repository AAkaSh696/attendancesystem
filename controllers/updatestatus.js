import db from "../models/registration.js";
import jwt from "jsonwebtoken";

export const updatedata = async (req, res) => {

    try {

        const {
            RollNo,
            email,
            MobileNo,
            Name,
            branch,
            batch,
            url,
            urlAadhar,
            token
        } = req.body;


        // ==========================================
        // CHECK TOKEN
        // ==========================================

        if (!token) {

            return res.status(401).json({
                msg: "Authentication token is required"
            });
        }


        // ==========================================
        // VERIFY JWT
        // ==========================================

        const data =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // ==========================================
        // CHECK ADMIN
        // ==========================================

        if (data.type !== "admin") {

            return res.status(403).json({
                msg: "Admin access required"
            });
        }


        // ==========================================
        // CHECK IDENTIFICATION DATA
        // ==========================================

        if (
            !RollNo &&
            !email &&
            !MobileNo
        ) {

            return res.status(400).json({
                msg: "Roll No, email or mobile number is required"
            });
        }


        // ==========================================
        // FIND STUDENT
        // ==========================================

        let student = null;


        // ------------------------------------------
        // FIRST PRIORITY: ROLL NO
        // ------------------------------------------

        if (RollNo) {

            student =
                await db.findOne({
                    RollNO: RollNo
                });
        }


        // ------------------------------------------
        // SECOND PRIORITY: EMAIL
        // ------------------------------------------

        if (!student && email) {

            student =
                await db.findOne({
                    email: email
                });
        }


        // ------------------------------------------
        // THIRD PRIORITY: MOBILE NUMBER
        // ------------------------------------------

        if (!student && MobileNo) {

            student =
                await db.findOne({
                    MobileNo: MobileNo
                });
        }


        // ==========================================
        // STUDENT NOT FOUND
        // ==========================================

        if (!student) {

            return res.status(404).json({
                msg: "Student not found"
            });
        }


        // ==========================================
        // CHECK ALREADY VERIFIED
        // ==========================================

        if (student.verified === true) {

            return res.status(409).json({
                msg: "Student has already been verified",
                data: student
            });
        }


        // ==========================================
        // UPDATE STUDENT
        // ==========================================

        student.verified = true;

        // Admin who verified the student
        student.verifiedBy = data.userId;

        // Verification timestamp
        student.verifiedAt = new Date();


        // ==========================================
        // OPTIONAL DATA UPDATE
        // ==========================================

        /*
         * These fields are updated only if they
         * were received from the request.
         *
         * The student is still identified using
         * existing database data.
         */

        if (Name) {
            student.Name = Name;
        }

        if (branch) {
            student.branch = branch;
        }

        if (batch) {
            student.batch = batch;
        }

        if (email) {
            student.email = email;
        }

        if (MobileNo) {
            student.MobileNo = MobileNo;
        }

        if (url) {
            student.url = url;
        }

        if (urlAadhar) {
            student.urlAadhar = urlAadhar;
        }


        // ==========================================
        // SAVE
        // ==========================================

        const updated =
            await student.save();


        // ==========================================
        // SUCCESS
        // ==========================================

        return res.status(200).json({

            msg:
                "Student verified successfully",

            data:
                updated

        });


    } catch (err) {

        console.error(
            "Update student error:",
            err
        );


        // ==========================================
        // JWT ERRORS
        // ==========================================

        if (
            err.name === "JsonWebTokenError"
        ) {

            return res.status(401).json({
                msg: "Invalid authentication token"
            });
        }


        if (
            err.name === "TokenExpiredError"
        ) {

            return res.status(401).json({
                msg: "Authentication token has expired"
            });
        }


        // ==========================================
        // GENERAL ERROR
        // ==========================================

        return res.status(500).json({
            msg: "Error while updating student"
        });
    }
};