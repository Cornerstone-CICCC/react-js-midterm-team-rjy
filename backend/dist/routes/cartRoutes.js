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
const Cart_model_1 = __importDefault(require("../models/Cart.model"));
const Product_model_1 = __importDefault(require("../models/Product.model"));
const router = (0, express_1.Router)();
/**
 * GET /api/cart
 * - 장바구니 전체 조회 (product populate)
 */
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield Cart_model_1.default.find().populate("productId");
        res.json(items);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to fetch cart" });
    }
}));
/**
 * POST /api/cart/add
 * body: { productId: string, quantity?: number }
 * - 이미 있으면 quantity 증가, 없으면 새로 생성
 */
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity } = req.body;
        if (!productId) {
            return res.status(400).json({ message: "productId is required" });
        }
        // product 존재 확인(안전)
        const productExists = yield Product_model_1.default.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: "Product not found" });
        }
        const qty = Math.max(1, Number(quantity !== null && quantity !== void 0 ? quantity : 1));
        const existing = yield Cart_model_1.default.findOne({ productId });
        if (existing) {
            existing.quantity += qty;
            yield existing.save();
            return res.status(200).json(existing);
        }
        const created = yield Cart_model_1.default.create({ productId, quantity: qty });
        res.status(201).json(created);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to add to cart" });
    }
}));
/**
 * PATCH /api/cart/:id
 * body: { quantity: number }
 */
router.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quantity } = req.body;
        const qty = Number(quantity);
        if (!Number.isFinite(qty) || qty < 1) {
            return res.status(400).json({ message: "quantity must be >= 1" });
        }
        const updated = yield Cart_model_1.default.findByIdAndUpdate(req.params.id, { quantity: qty }, { new: true });
        if (!updated) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        res.json(updated);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to update cart item" });
    }
}));
/**
 * DELETE /api/cart/:id
 * - 아이템 1개 삭제
 */
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield Cart_model_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        res.json({ message: "Deleted", id: req.params.id });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to delete cart item" });
    }
}));
/**
 * DELETE /api/cart
 * - 장바구니 전체 비우기(개발 편의)
 */
router.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Cart_model_1.default.deleteMany({});
        res.json({ deletedCount: result.deletedCount });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to clear cart" });
    }
}));
exports.default = router;
