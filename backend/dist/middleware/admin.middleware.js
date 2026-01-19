"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdmin = void 0;
const role_1 = require("../types/role");
const checkAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== role_1.Role.ADMIN) {
        return res.status(403).json({
            message: "You are not allowed to access this!",
        });
    }
    next();
};
exports.checkAdmin = checkAdmin;
