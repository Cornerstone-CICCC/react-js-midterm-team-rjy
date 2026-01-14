import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import dotenv from "dotenv";

dotenv.config();

// Create server
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true,
  })
);

if (!process.env.COOKIE_PRIMARY_KEY || !process.env.COOKIE_SECONDARY_KEY) {
  throw new Error("Missing cookie keys!");
}

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_PRIMARY_KEY, process.env.COOKIE_SECONDARY_KEY],
    maxAge: 25 * 60 * 1000,
    sameSite: "lax",
    secure: false,
  })
);

app.use(express.json());

// =======================
// Routes (Products + Cart)
// =======================
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// =======================
// Socket + Server
// =======================
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// =======================
// MongoDB Connection
// =======================
const MONGO_URI = process.env.DATABASE_URL as string;

mongoose
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
