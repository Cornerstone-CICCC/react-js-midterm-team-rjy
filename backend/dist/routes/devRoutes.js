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
const express_1 = require("express");
const Product_model_1 = __importDefault(require("../models/Product.model"));
const productsSeed_1 = require("../seed/productsSeed");
const router = (0, express_1.Router)();
// ✅ 개발 환경에서만 허용
router.use((req, res, next) => {
    if (process.env.NODE_ENV !== "development") {
        return res.status(403).json({ message: "Dev routes are disabled" });
    }
    next();
});
/**
 * DELETE /api/dev/products
 * - products 전체 삭제
 */
router.delete("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Product_model_1.default.deleteMany({});
        res.json({ deletedCount: result.deletedCount });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to delete products" });
    }
}));
/**
 * POST /api/dev/seed-products
 * - products 전체 삭제 후 seed 3개 다시 넣기
 */
router.post("/seed-products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, productsSeed_1.seedProductsForce)();
        const products = yield Product_model_1.default.find();
        res.status(201).json({ count: products.length, products });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to seed products" });
    }
}));
exports.default = router;
