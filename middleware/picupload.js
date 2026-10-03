import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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

export const picupload = async (req, res, next) => {
  try {
    const username = req.body.Name;

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

    next();

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      msg: "Error uploading files"
    });
  }
};