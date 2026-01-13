import express from "express";
import { createServer } from "http";
import cors from "cors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
import adminRouter from "./routes/adminProduct.routes";
dotenv.config();

// Create server
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:4321",
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
    keys: [process.env.COOKIE_PRIMARY_KEY!, process.env.COOKIE_SECONDARY_KEY!],
    maxAge: 25 * 60 * 1000,
    sameSite: "lax",
    secure: false,
  })
);

app.use(express.json());

// Routes
app.use('/admin', adminRouter)

// Create HTTP server
const server = createServer(app);

// Connect to MongoDB and start server
const MONGO_URI = process.env.DATABASE_URL!;
mongoose
  .connect(MONGO_URI, { dbName: "shopping_app" })
  .then(() => {
    console.log("Connected to MongoDB database");

    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
