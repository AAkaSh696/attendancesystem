import db from "../models/registration.js";
import jwt from "jsonwebtoken";

export const userdata = async (req, res) => {
  try {
    let {
      Name,
      jwttoken,
      batch,
      Aadhar,
      RollNO,
      branch,
      MobileNo,
      url,
      urlAadhar
    } = req.body;
    let data=jwt.verify(jwttoken,process.env.JWT_SECRET);

    if (!data.userId) {
      return res.status(404).json({
        msg: "Authentication user not found"
      });
    }

    const id = data.userId;

    let fields = {
      Name,
      batch,
      Aadhar,
      RollNO,
      branch,
      MobileNo,
      url,
      urlAadhar,
      Refernceid: id
    };

    for (let key in fields) {
      if (!fields[key]) {
        return res.status(400).json({
          msg: `please fill the ${key}`
        });
      }
    }

    let dbres = await db.insertOne(fields);
    
    if (dbres) {
      return res.status(201).json({
        msg: "user registered successfully",

      });
    }

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      msg: "error while registering"
    });
  }
};