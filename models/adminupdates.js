import mongoose from "mongoose";

const col = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    highlight: {
        type: String,
        trim: true
    },

    event: {
        type: String,
        trim: true
    },

    info: {
        type: String
    },

    url: {
        type: String
    },

    imageUrl: {
        type: String
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Authentication",
        required: true
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Authentication",
        default: null
    },

    publishedAt: {
        type: Date,
        default: Date.now
    },

    expiresAt: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

const model = mongoose.model("admindatabase", col);

export default model;