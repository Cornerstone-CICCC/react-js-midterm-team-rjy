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
exports.attachUser = void 0;
const user_model_1 = require("../models/user.model");
const attachUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.userId))
        return next();
    if (!req.user) {
        const user = yield user_model_1.User.findById(req.session.userId).select("role");
        if (user) {
            req.user = { id: user._id.toString(), role: user.role };
        }
    }
    next();
});
exports.attachUser = attachUser;
