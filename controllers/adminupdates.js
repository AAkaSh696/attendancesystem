import db from "../models/adminupdates.js";
import datadb from "../models/registration.js"
import jwt from "jsonwebtoken";

export const createUpdate = async (req, res) => {
    try {
        const { token } = req.body;

        const {
            title,
            highlight,
            event,
            info,
            url,
            imageUrl,
            expiresAt
        } = req.body;

        if (!token || !title) {
            return res.status(400).json({
                msg: "Token and title are required"
            });
        }

        const data = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (data.type !== "admin") {
            return res.status(403).json({
                msg: "Admin access required"
            });
        }

        const newUpdate = await db.create({
            title,
            highlight,
            event,
            info,
            url,
            imageUrl,
            expiresAt,
            createdBy: data.userId
        });

        return res.status(201).json({
            msg: "Update created successfully",
            data: newUpdate
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            msg: "Error while creating update"
        });
    }
};


export const getUpdates = async (req, res) => {
    try {
        const updates = await db.find({
            isActive: true,
            $or: [
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ]
        })
        .sort({ publishedAt: -1 });

        return res.status(200).json({
            msg: "Updates fetched successfully",
            data: updates
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            msg: "Error while fetching updates"
        });
    }
};


export const updateAdminUpdate = async (req, res) => {
    try {
        const { token, id } = req.body;

        const {
            title,
            highlight,
            event,
            info,
            url,
            imageUrl,
            isActive,
            expiresAt
        } = req.body;

        const data = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (data.type !== "admin") {
            return res.status(403).json({
                msg: "Admin access required"
            });
        }

        const updated = await db.findByIdAndUpdate(
            id,
            {
                title,
                highlight,
                event,
                info,
                url,
                imageUrl,
                isActive,
                expiresAt,
                updatedBy: data.userId
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updated) {
            return res.status(404).json({
                msg: "Update not found"
            });
        }

        return res.status(200).json({
            msg: "Update updated successfully",
            data: updated
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            msg: "Error while updating"
        });
    }
};


export const deleteAdminUpdate = async (req, res) => {
    try {
        const { token, id } = req.body;

        const data = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (data.type !== "admin") {
            return res.status(403).json({
                msg: "Admin access required"
            });
        }

        const deleted = await db.findByIdAndUpdate(
            id,
            {
                isActive: false,
                updatedBy: data.userId
            },
            {
                new: true
            }
        );

        if (!deleted) {
            return res.status(404).json({
                msg: "Update not found"
            });
        }

        return res.status(200).json({
            msg: "Update deactivated successfully"
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            msg: "Error while deleting update"
        });
    }
};
export const getupdateddata = async (req, res) => {
    try {
        const data = await datadb.find({
            verified: false
        });

        return res.status(200).json({
            msg: "Data fetched successfully",
            data: data
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            msg: "Error occurred while fetching the data"
        });
    }
};
export const getverfieddata = async (req, res) => {
    try {

        const { token } = req.body;

        const tokendata = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const data = await datadb.find({
            verified: true,
            verifiedBy: tokendata.userId
        });

        return res.status(200).json({
            msg: "Verified data fetched successfully",
            data: data
        });

    } catch (err) {

        console.error(
            "GET VERIFIED DATA ERROR:",
            err
        );

        return res.status(500).json({
            msg: "Error while fetching verified data"
        });
    }
};
export const getunverifieddata = async (req, res) => {
    try {
        const { token } = req.body;

        const tokendata = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (tokendata.type !== "admin") {
            return res.status(403).json({
                msg: "Admin access required"
            });
        }

        const data = await db.find({
            verified: false
        });

        return res.status(200).json({
            msg: "Unverified data fetched successfully",
            data: data
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            msg: "Error while fetching unverified data"
        });
    }
};
// For your current project, the MOST important missing one is:

export const dashboardStats = async (req, res) => {
    try {
        const total = await datadb.countDocuments();

        const verified = await datadb.countDocuments({
            verified: true
        });

        const unverified = await datadb.countDocuments({
            verified: false
        });

        return res.status(200).json({
            msg: "Dashboard data fetched successfully",
            data: {
                total,
                verified,
                unverified
            }
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            msg: "Error while fetching dashboard data"
        });
    }
};
export const getuser = async (req, res) => {
    try {
        const { RollNo } = req.body;

        const data = await db.findOne({
            RollNO: RollNo
        });

        if (!data) {
            return res.status(404).json({
                msg: "Student not found"
            });
        }

        return res.status(200).json({
            msg: "Student data fetched successfully",
            data: data
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            msg: "Error while fetching student data"
        });
    }
};
// export const verify
