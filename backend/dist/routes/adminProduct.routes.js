"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminProduct_controller_1 = __importDefault(require("../controllers/adminProduct.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const attachUser_middleware_1 = require("../middleware/attachUser.middleware");
const adminRouter = (0, express_1.Router)();
adminRouter.use(auth_middleware_1.authLogin, attachUser_middleware_1.attachUser, admin_middleware_1.checkAdmin);
adminRouter.get('/products', adminProduct_controller_1.default.getAllProducts);
adminRouter.post('/products', adminProduct_controller_1.default.addProduct);
adminRouter.get('/products/:id', adminProduct_controller_1.default.getProductById);
adminRouter.put('/products/:id', adminProduct_controller_1.default.updateProductById);
adminRouter.delete('/products/:id', adminProduct_controller_1.default.deleteProductById);
exports.default = adminRouter;
