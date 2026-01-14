"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = __importDefault(require("../controllers/user.controllers"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRouter = (0, express_1.Router)();
userRouter.post("/signup", auth_middleware_1.authLogout, user_controllers_1.default.signUp);
userRouter.post("/login", auth_middleware_1.authLogout, user_controllers_1.default.logIn);
userRouter.post("/logout", auth_middleware_1.authLogin, user_controllers_1.default.logOut);
userRouter.get("/profile", auth_middleware_1.authLogin, user_controllers_1.default.getCurrentUser);
userRouter.put("/update-profile", auth_middleware_1.authLogin, user_controllers_1.default.updateProfile);
exports.default = userRouter;
