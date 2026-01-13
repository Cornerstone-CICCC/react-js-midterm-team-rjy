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
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = require("../models/product.model");
/**
 * GET /admin/products
 */
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.Product.find();
        res.status(200).json(products);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get all admin product." });
    }
});
/**
 * POST /admin/products
 */
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, category, description, imgUrl } = req.body;
    try {
        const newProduct = yield product_model_1.Product.create({ name, price, category, description, imgUrl });
        if (!newProduct) {
            res.status(500).json({ message: "Unable to add product." });
            return;
        }
        res.status(200).json(newProduct);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add product.' });
    }
});
/**
 * PUT /admin/products/:id
 */
const updateProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, category, description, imgUrl } = req.body;
    try {
        const updatedProduct = yield product_model_1.Product.findByIdAndUpdate(req.params.id, { name, price, category, description, imgUrl }, { new: true });
        if (!updatedProduct) {
            res.status(404).json({ message: "Product not found." });
            return;
        }
        res.status(200).json(updatedProduct);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update product." });
    }
});
/**
 * DELETE /admin/products:id
 */
const deleteProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedProduct = yield product_model_1.Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            res.status(404).json({ message: "Product not found." });
            return;
        }
        res.status(200).json(deletedProduct);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete product." });
    }
});
exports.default = {
    getAllProducts,
    addProduct,
    updateProductById,
    deleteProductById
};
