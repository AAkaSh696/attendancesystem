import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import db from "../models/registration.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// Upload file to Cloudinary
const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(file.buffer);
  });
};


// Upload profile picture + Aadhaar picture during registration
export const picupload = async (req, res, next) => {
  try {
    const username = req.body.Name;

    if (!req.files?.pic?.[0]) {
      return res.status(400).json({
        msg: "Profile picture is required"
      });
    }

    if (!req.files?.picAadhar?.[0]) {
      return res.status(400).json({
        msg: "Aadhaar picture is required"
      });
    }

    const picResult = await uploadToCloudinary(
      req.files.pic[0],
      `students/${username}/pic`
    );

    const aadharResult = await uploadToCloudinary(
      req.files.picAadhar[0],
      `students/${username}/aadhar`
    );

    req.body.url = picResult.secure_url;
    req.body.urlAadhar = aadharResult.secure_url;

    req.body.picpublicid = picResult.public_id;
    req.body.picAadharid = aadharResult.public_id;

    next();

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      msg: "Error uploading files"
    });
  }
};


// Update Profile Picture
export const picupdate = async (req, res) => {
  try {
    let { token } = req.body;

    if (!token) {
      return res.status(401).json({
        msg: "Token is required"
      });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    const userId = data.userId;

    if (!userId) {
      return res.status(401).json({
        msg: "User not authenticated"
      });
    }

    if (!req.files?.pic?.[0]) {
      return res.status(400).json({
        msg: "Profile picture is required"
      });
    }

    const userdata = await db.findOne({
      referenceid: userId
    });

    if (!userdata) {
      return res.status(404).json({
        msg: "User data not found"
      });
    }

    // Delete old profile picture
    if (userdata.picpublicid) {
      await cloudinary.uploader.destroy(userdata.picpublicid);
    }

    // Upload new profile picture
    const picResult = await uploadToCloudinary(
      req.files.pic[0],
      `students/${userdata.Name}/pic`
    );

    // Update database
    await db.updateOne(
      { referenceid: userId },
      {
        $set: {
          url: picResult.secure_url,
          picpublicid: picResult.public_id
        }
      }
    );

    return res.status(200).json({
      msg: "Profile picture updated successfully"
    });

  } catch (error) {
    console.error(error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        msg: "Invalid or expired token"
      });
    }

    return res.status(500).json({
      msg: "Error updating profile picture"
    });
  }
};


// Update Aadhaar Picture
export const Aadharpicupdate = async (req, res) => {
  try {
    let { token } = req.body;

    if (!token) {
      return res.status(401).json({
        msg: "Token is required"
      });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    const userId = data.userId;

    if (!userId) {
      return res.status(401).json({
        msg: "User not authenticated"
      });
    }

    if (!req.files?.picAadhar?.[0]) {
      return res.status(400).json({
        msg: "Aadhaar picture is required"
      });
    }

    const userdata = await db.findOne({
      referenceid: userId
    });

    if (!userdata) {
      return res.status(404).json({
        msg: "User data not found"
      });
    }

    // Delete old Aadhaar picture
    if (userdata.picAadharid) {
      await cloudinary.uploader.destroy(userdata.picAadharid);
    }

    // Upload new Aadhaar picture
    const aadharResult = await uploadToCloudinary(
      req.files.picAadhar[0],
      `students/${userdata.Name}/aadhar`
    );

    // Update database
    await db.updateOne(
      { referenceid: userId },
      {
        $set: {
          urlAadhar: aadharResult.secure_url,
          picAadharid: aadharResult.public_id
        }
      }
    );

    return res.status(200).json({
      msg: "Aadhaar picture updated successfully"
    });

  } catch (error) {
    console.error(error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        msg: "Invalid or expired token"
      });
    }

    return res.status(500).json({
      msg: "Error updating Aadhaar picture"
    });
  }
};