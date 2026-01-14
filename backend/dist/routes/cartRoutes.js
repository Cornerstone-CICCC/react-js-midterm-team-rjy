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
const router = (0, express_1.Router)();
// GET /api/cart
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield Cart_model_1.default.find().populate("product");
        res.json(items);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}));
// POST /api/cart
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity } = req.body;
        const item = new Cart_model_1.default({ product: productId, quantity });
        const saved = yield item.save();
        res.status(201).json(saved);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}));
exports.default = router;
