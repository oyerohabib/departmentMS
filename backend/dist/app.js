"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const material_routes_1 = __importDefault(require("./routes/material.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.get("/", (_req, res) => {
    res.json({
        message: "Welcome to Campus connect Backend API",
    });
});
// Middleware — allow localhost and 127.0.0.1 (Playwright uses 127.0.0.1)
const allowedOrigins = [
    /^http:\/\/localhost:\d+$/,
    /^http:\/\/127\.0\.0\.1:\d+$/,
    process.env.FRONTEND_URL || "https://department-ms.vercel.app",
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        const isAllowed = allowedOrigins.some((allowedOrigin) => allowedOrigin instanceof RegExp
            ? allowedOrigin.test(origin)
            : allowedOrigin === origin);
        if (isAllowed) {
            return callback(null, true);
        }
        // Do not pass an Error here — that becomes a 500; deny cleanly instead
        return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static("uploads"));
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/courses", course_routes_1.default);
app.use("/api/materials", material_routes_1.default);
// Database connection
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map