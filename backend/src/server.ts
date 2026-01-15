import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import devRoutes from "./routes/devRoutes";
import { seedProductsIfEmpty } from "./seed/productsSeed";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ 1) body parser 먼저
app.use(express.json());

// ✅ 2) cookie-session 세팅 (json 다음이어도 OK, routes 전에만 있으면 됨)
if (!process.env.COOKIE_PRIMARY_KEY || !process.env.COOKIE_SECONDARY_KEY) {
  throw new Error("Missing cookie keys!");
}

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_PRIMARY_KEY, process.env.COOKIE_SECONDARY_KEY],
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: false,
  })
);

// ✅ 3) routes는 마지막에 등록
app.use("/api/dev", devRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

mongoose
  .connect(process.env.DATABASE_URL as string)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await seedProductsIfEmpty();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
