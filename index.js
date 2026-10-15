import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");
import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import userRouter from "./routers/userRoutes.js";
import adminrouter from "./routers/admindashboard.js";
import auth from "./routers/validation.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 5001;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:8084",
  process.env.CORS_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Health check for the server/load balancer
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Root endpoint for basic testing
app.get("/", (req, res) => {
  res.status(200).send("Backend is working");
});

// Application routes
app.use("/users", auth);
app.use("/registration", userRouter);
app.use("/admin", adminrouter);

// Start only after MongoDB connects successfully
async function startServer() {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not configured");
    }

    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Application startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
