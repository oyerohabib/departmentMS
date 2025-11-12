import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import courseRoutes from "./routes/course.routes";
import materialRoutes from "./routes/material.routes";

dotenv.config();

const app = express();

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to Campus connect Backend API",
  });
});

// Middleware
const allowedOrigins = [
  /^http:\/\/localhost:\d+$/,
  process.env.FRONTEND_URL || "https://department-ms.vercel.app",
];

app.use(
  cors({
    origin: (origin: string, callback: (arg0: Error, arg1: boolean) => any) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is allowed
      const isAllowed = allowedOrigins.some((allowedOrigin) =>
        allowedOrigin instanceof RegExp
          ? allowedOrigin.test(origin)
          : allowedOrigin === origin
      );

      if (isAllowed) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/materials", materialRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});

export default app;
