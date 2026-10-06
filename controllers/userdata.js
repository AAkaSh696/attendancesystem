import db from "../models/registration.js";
import jwt from "jsonwebtoken";


// Register User Data
export const userdata = async (req, res) => {
  try {
    let {
      Name,
      token,
      batch,
      Aadhar,
      RollNO,
      branch,
      MobileNo,
      url,
      urlAadhar,
      picpublicid,
      picAadharid
    } = req.body;

    if (!token) {
      return res.status(401).json({
        msg: "Token is required"
      });
    }

    const data = jwt.verify(
       token,
      process.env.JWT_SECRET
    );

    if (!data.userId) {
      return res.status(401).json({
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
      Refernceid: id,
      picpublicid,
      picAadharid
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
        data:dbres
      });
    }

  } catch (err) {
    console.error(err);

    if (
      err.name === "JsonWebTokenError" ||
      err.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        msg: "Invalid or expired token"
      });
    }

    return res.status(500).json({
      msg: "error while registering"
    });
  }
};


// Update User Data
// Update User Data
export const dataupdate = async (req, res) => {
  try {
    const {
      token,
      Name,
      batch,
      Aadhar,
      RollNO,
      branch,
      MobileNo
    } = req.body;

    if (!token) {
      return res.status(401).json({
        msg: "Token is required"
      });
    }

    const data = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!data.userId) {
      return res.status(401).json({
        msg: "User not authenticated"
      });
    }

    const updatedata = await db.updateOne(
      {
        Refernceid: data.userId
      },
      {
        $set: {
          Name,
          batch,
          Aadhar,
          RollNO,
          branch,
          MobileNo,

          // Any profile update requires
          // verification again
          verified: false,
          verifiedBy: null,
          verifiedAt: null
        }
      }
    );

    if (updatedata.matchedCount === 0) {
      return res.status(404).json({
        msg: "User data not found"
      });
    }

    return res.status(200).json({
      msg: "Data updated successfully. Verification is required again.",
      result: updatedata
    });

  } catch (err) {
    console.error("UPDATE USER DATA ERROR:", err);

    if (
      err.name === "JsonWebTokenError" ||
      err.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        msg: "Invalid or expired token"
      });
    }

    return res.status(500).json({
      msg: "Error updating data"
    });
  }
};
export const getuserdata = async (req, res) => {
    try {
        const token = req.body.token;

        const data = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const userdata = await db.findOne({
            Refernceid: data.userId
        });

        if (!userdata) {
            return res.status(404).json({
                msg: "User data not found"
            });
        }

        return res.status(200).json({
            msg: "Data fetched successfully",
            data: userdata
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            msg: "Error while fetching user data"
        });
    }
};