"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLogout = exports.authLogin = void 0;
const authLogin = (req, res, next) => {
    if (!req.session || !req.session.isLoggedIn) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};
exports.authLogin = authLogin;
const authLogout = (req, res, next) => {
    if (req.session && req.session.isLoggedIn) {
        return res.status(400).json({ message: "Already logged in" });
    }
    next();
};
exports.authLogout = authLogout;
