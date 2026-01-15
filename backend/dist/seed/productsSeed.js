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
exports.seedProductsIfEmpty = seedProductsIfEmpty;
exports.seedProductsForce = seedProductsForce;
const Product_model_1 = __importDefault(require("../models/Product.model"));
function seedProductsIfEmpty() {
    return __awaiter(this, void 0, void 0, function* () {
        const count = yield Product_model_1.default.countDocuments();
        if (count > 0)
            return;
        yield Product_model_1.default.insertMany([
            {
                name: "T-shirt",
                price: 29.99,
                imageUrl: "https://picsum.photos/seed/tshirt/600/400",
                description: "Basic tee",
            },
            {
                name: "Hoodie",
                price: 59.99,
                imageUrl: "https://picsum.photos/seed/hoodie/600/400",
                description: "Warm hoodie",
            },
            {
                name: "Sneakers",
                price: 89.99,
                imageUrl: "https://picsum.photos/seed/sneakers/600/400",
                description: "Comfortable sneakers",
            },
        ]);
    });
}
function seedProductsForce() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Product_model_1.default.deleteMany({});
        yield Product_model_1.default.insertMany([
            {
                name: "T-shirt",
                price: 29.99,
                imageUrl: "https://picsum.photos/seed/tshirt/600/400",
                description: "Basic tee",
            },
            {
                name: "Hoodie",
                price: 59.99,
                imageUrl: "https://picsum.photos/seed/hoodie/600/400",
                description: "Warm hoodie",
            },
            {
                name: "Sneakers",
                price: 89.99,
                imageUrl: "https://picsum.photos/seed/sneakers/600/400",
                description: "Comfortable sneakers",
            },
        ]);
    });
}
