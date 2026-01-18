"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const dotenv_1 = __importDefault(require("dotenv"));
// 라우터 임포트
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const adminProduct_routes_1 = __importDefault(require("./routes/adminProduct.routes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes")); // 장바구니 라우터
dotenv_1.default.config();
const app = (0, express_1.default)();
// 1. Middleware 설정
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // 프론트엔드 주소
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
// 쿠키 세션 설정 (환경변수 체크)
if (!process.env.COOKIE_PRIMARY_KEY || !process.env.COOKIE_SECONDARY_KEY) {
    // 개발 환경에서 에러 방지를 위해 기본값 설정 혹은 경고
    console.warn("Missing cookie keys! Using default values for development.");
}
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: [
        process.env.COOKIE_PRIMARY_KEY || "fallback_primary_key",
        process.env.COOKIE_SECONDARY_KEY || "fallback_secondary_key",
    ],
    maxAge: 25 * 60 * 1000,
    sameSite: "lax",
    secure: false,
}));
app.use(express_1.default.json());
// 2. Routes 등록
app.use("/users", user_routes_1.default);
app.use("/admin", adminProduct_routes_1.default);
app.use("/api/cart", cartRoutes_1.default); // 장바구니 API 경로 등록
/**
 * 3. 상품 관련 임시 API (404 방지용)
 * Yuna가 데이터를 복구하기 전까지 프론트엔드에서 상품을 볼 수 있게 합니다.
 */
app.get("/api/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Product = mongoose_1.default.model("Product");
        const products = yield Product.find();
        res.json(products);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to load products" });
    }
}));
app.get("/api/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Product = mongoose_1.default.model("Product");
        const product = yield Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error" });
    }
}));
// HTTP 서버 생성
const server = (0, http_1.createServer)(app);
// 4. MongoDB 연결 및 서버 실행
const MONGO_URI = process.env.DATABASE_URL;
mongoose_1.default
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
exports.default = app;
