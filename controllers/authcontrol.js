import clientPromise from "../middleware/redis.js";
import dbauth from "../models/authentication.js";
import jwt from "jsonwebtoken";

export const verifyusersignup = async (req, res) => {
    try {
        const client = await clientPromise;

        const { username, password, otp, type } = req.body;

        if (type === "admin") {
            return res.status(403).json({
                msg: "Admin registration is not allowed"
            });
        }

        if (!username || !otp || !password) {
            return res.status(400).json({
                msg: "Please enter all the fields"
            });
        }

        const vrfotp = await client.get(username);

        if (!vrfotp || vrfotp !== String(otp)) {
            return res.status(401).json({
                msg: "Invalid OTP attempt"
            });
        }

        await client.del(username);

        const mongodata = await dbauth.findOne({
            username: username
        });

        if (mongodata) {
            return res.status(409).json({
                msg: "User already exists"
            });
        }

        const data = {
            username: username,
            password: password,
            type: "user"
        };

        await dbauth.insertOne(data);

        return res.status(201).json({
            msg: "User registered successfully"
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            msg: "Error in signing up, please try later"
        });
    }
};


export const verifyusersigin = async (req, res) => {
    try {
        const client = await clientPromise;

        const { username, password, otp ,type} = req.body;

        if (!username || !otp || !password) {
            return res.status(400).json({
                msg: "Please enter all the fields"
            });
        }

        const vrfotp = await client.get(username);

        if (!vrfotp || vrfotp !== String(otp)) {
            return res.status(401).json({
                msg: "Invalid OTP attempt"
            });
        }

        await client.del(username);

        const mongodata = await dbauth.findOne({
            username: username,
            password: password,
            type:type

        });

        if (!mongodata) {
            return res.status(401).json({
                msg: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                userId: mongodata._id,
                username: mongodata.username,
                type: mongodata.type
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        return res.status(200).json({
            msg: "Success",
            token: token
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            msg: "Error while signing in, please try later"
        });
    }
};