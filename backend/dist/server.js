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
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const devRoutes_1 = __importDefault(require("./routes/devRoutes"));
const productsSeed_1 = require("./seed/productsSeed");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
// ✅ 1) body parser 먼저
app.use(express_1.default.json());
// ✅ 2) cookie-session 세팅 (json 다음이어도 OK, routes 전에만 있으면 됨)
if (!process.env.COOKIE_PRIMARY_KEY || !process.env.COOKIE_SECONDARY_KEY) {
    throw new Error("Missing cookie keys!");
}
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: [process.env.COOKIE_PRIMARY_KEY, process.env.COOKIE_SECONDARY_KEY],
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: false,
}));
// ✅ 3) routes는 마지막에 등록
app.use("/api/dev", devRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/cart", cartRoutes_1.default);
mongoose_1.default
    .connect(process.env.DATABASE_URL)
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("✅ MongoDB connected");
    yield (0, productsSeed_1.seedProductsIfEmpty)();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
}))
    .catch((err) => console.error("❌ MongoDB error:", err));
