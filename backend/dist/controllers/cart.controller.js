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
exports.deleteCartItem = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const Cart_model_1 = __importDefault(require("../models/Cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield Cart_model_1.default.find().populate("productId");
        res.json(items);
    }
    catch (e) {
        res.status(500).json({ message: "Failed to fetch cart" });
    }
});
exports.getCart = getCart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity } = req.body;
        if (!productId)
            return res.status(400).json({ message: "productId is required" });
        const productExists = yield product_model_1.default.findById(productId);
        if (!productExists)
            return res.status(404).json({ message: "Product not found" });
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
        res.status(500).json({ message: "Failed to add to cart" });
    }
});
exports.addToCart = addToCart;
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quantity } = req.body;
        const updated = yield Cart_model_1.default.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
        res.json(updated);
    }
    catch (e) {
        res.status(500).json({ message: "Failed to update" });
    }
});
exports.updateCartItem = updateCartItem;
const deleteCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Cart_model_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    }
    catch (e) {
        res.status(500).json({ message: "Failed to delete" });
    }
});
exports.deleteCartItem = deleteCartItem;
