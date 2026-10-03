import clientPromise from "../middleware/redis.js";
import dbauth  from "../models/authentication.js";
import jwt from "jsonwebtoken"

export const verifyusersignup = async (req, res) => {

    try {
        const client = await clientPromise;
        const { username, password, otp } = req.body;
        if(!username || !otp || !password){
             return res.status(402).json({
                msg: "please enter all the field "
            });
        }
        const vrfotp = await client.get(username);
        if (!vrfotp || vrfotp !== String(otp)) {
            return res.status(402).json({
                msg: "invalid otp attempt"
            });
        }
        await client.del(username);
        const mongodata = await dbauth.findOne({
            username: username
        });

        if (mongodata) {
            return res.status(409).json({
                msg: "user already exists"
            });
        }

        const data = {
            username,
            password
        };

        await dbauth.insertOne(data);

        return res.status(201).json({
            msg: "user registered successfully"
        });


    } catch (err) {

        console.error(err);

        return res.status(500).json({
            msg: "error in signing up, please try later"
        });
    }
};
export const verifyusersigin = async (req, res) => {
    try {

        const { username, password, otp } = req.body;

        if (!username || !otp || !password) {
            return res.status(400).json({
                msg: "please enter all the fields"
            });
        }

        const vrfotp = await client.get(username);

        if (!vrfotp || vrfotp !== String(otp)) {
            return res.status(401).json({
                msg: "invalid otp attempt"
            });
        }

        await client.del(username);

        const mongodata = await dbauth.findOne({
            username: username,
            password: password
        });

        if (!mongodata) {
            return res.status(401).json({
                msg: "invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                userId: mongodata._id,
                username: mongodata.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        return res.status(200).json({
            msg: "success",
            token: token
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            msg: "error while signing in, please try later"
        });
    }
};