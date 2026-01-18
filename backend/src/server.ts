import express from "express";
import { createServer } from "http";
import cors from "cors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import dotenv from "dotenv";

// 라우터 임포트
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/adminProduct.routes";
import cartRouter from "./routes/cartRoutes"; // 장바구니 라우터

dotenv.config();

const app = express();

// 1. Middleware 설정
app.use(
  cors({
    origin: "http://localhost:5173", // 프론트엔드 주소
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// 쿠키 세션 설정 (환경변수 체크)
if (!process.env.COOKIE_PRIMARY_KEY || !process.env.COOKIE_SECONDARY_KEY) {
  // 개발 환경에서 에러 방지를 위해 기본값 설정 혹은 경고
  console.warn("Missing cookie keys! Using default values for development.");
}

app.use(
  cookieSession({
    name: "session",
    keys: [
      process.env.COOKIE_PRIMARY_KEY || "fallback_primary_key",
      process.env.COOKIE_SECONDARY_KEY || "fallback_secondary_key",
    ],
    maxAge: 25 * 60 * 1000,
    sameSite: "lax",
    secure: false,
  })
);

app.use(express.json());

// 2. Routes 등록
app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/api/cart", cartRouter); // 장바구니 API 경로 등록

/**
 * 3. 상품 관련 임시 API (404 방지용)
 * Yuna가 데이터를 복구하기 전까지 프론트엔드에서 상품을 볼 수 있게 합니다.
 */
app.get("/api/products", async (req, res) => {
  try {
    const Product = mongoose.model("Product");
    const products = await Product.find();
    res.json(products);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load products" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const Product = mongoose.model("Product");
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// HTTP 서버 생성
const server = createServer(app);

// 4. MongoDB 연결 및 서버 실행
const MONGO_URI = process.env.DATABASE_URL!;

mongoose
  .connect(MONGO_URI, { dbName: "shopping_app" })
  .then(() => {
    console.log("Connected to MongoDB database");

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

export default app;