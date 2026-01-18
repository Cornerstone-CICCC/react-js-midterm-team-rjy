"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachUser = void 0;
const attachUser = (req, res, next) => {
    const { userId, userRole } = req.session;
    if (!userId) {
        return res.status(401).json({ message: "Not authenticated." });
    }
    req.user = {
        id: userId,
        role: userRole,
    };
    next();
};
exports.attachUser = attachUser;
