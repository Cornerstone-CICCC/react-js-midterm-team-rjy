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
exports.changePassword = exports.logOut = exports.getCurrentUser = exports.logIn = exports.signUp = void 0;
const user_model_1 = require("../models/user.model");
/**
 * Sign up a new user
 */
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newUser = yield user_model_1.User.create({ fullname, email, password });
        if (req.session) {
            req.session.userId = newUser._id.toString();
            req.session.isLoggedIn = true;
        }
        res.status(201).json({ message: "User created successfully", id: newUser._id,
            fullname: newUser.fullname, email: newUser.email });
    }
    catch (error) {
        console.error("Signup error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.signUp = signUp;
/**
 * Log in an existing user
 */
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        if (req.session) {
            req.session.userId = user._id.toString();
            req.session.isLoggedIn = true;
        }
        res.status(200).json({
            message: "Login successful",
            user: { id: user._id, fullname: user.fullname, email: user.email },
        });
    }
    catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.logIn = logIn;
/**
 * Get current logged-in user
 */
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = yield user_model_1.User.findById(userId).select("-password");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json({ user });
    }
    catch (error) {
        console.error("Get current user error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCurrentUser = getCurrentUser;
/**
 * Log out the current user
 */
const logOut = (req, res) => {
    if (req.session)
        (req.session.destroy(err => {
            if (err) {
                console.error("Logout error: ", err);
                return res.status(500).json({ message: "Internal server error" });
            }
            res.status(200).json({ message: "Logout successful" });
        }));
};
exports.logOut = logOut;
/**
 * Change password for the logged-in user
 */
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const { password, email } = req.body;
        if (!password && email) {
            return res.status(400).json({ message: "New password is required" });
        }
        const user = yield user_model_1.User.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (password)
            user.password = password;
        yield user.save();
        res.json({
            message: "Account updated",
            user: { id: user._id, fullname: user.fullname, email: user.email, password: user.password },
        });
    }
    catch (error) {
        console.error("Change password error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.changePassword = changePassword;
exports.default = {
    signUp: exports.signUp,
    logIn: exports.logIn,
    getCurrentUser: exports.getCurrentUser,
    logOut: exports.logOut,
    changePassword: exports.changePassword
};
