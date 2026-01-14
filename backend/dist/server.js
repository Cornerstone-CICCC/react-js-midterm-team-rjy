"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create server
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}));
if (!process.env.COOKIE_PRIMARY_KEY || !process.env.COOKIE_SECONDARY_KEY) {
    throw new Error("Missing cookie keys!");
}
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: [process.env.COOKIE_PRIMARY_KEY, process.env.COOKIE_SECONDARY_KEY],
    maxAge: 25 * 60 * 1000,
    sameSite: "lax",
    secure: false,
}));
app.use(express_1.default.json());
// =======================
// Routes (Products + Cart)
// =======================
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
app.use("/api/products", productRoutes_1.default);
app.use("/api/cart", cartRoutes_1.default);
// =======================
// Socket + Server
// =======================
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
// =======================
// MongoDB Connection
// =======================
const MONGO_URI = process.env.DATABASE_URL;
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error("MongoDB connection error:", error);
});
