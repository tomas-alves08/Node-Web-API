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
exports.signup = signup;
exports.login = login;
exports.getUserStatus = getUserStatus;
exports.updateUserStatus = updateUserStatus;
const user_1 = __importDefault(require("../models/user"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function signup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Form Validation
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            throw error;
        }
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
        try {
            const hashedPw = yield bcryptjs_1.default.hash(password, 12);
            const user = new user_1.default({
                email,
                password: hashedPw,
                name,
            });
            const savedUser = yield user.save();
            res.status(201).json({ message: "User created", userId: savedUser._id });
        }
        catch (err) {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        }
    });
}
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        const password = req.body.password;
        try {
            const user = yield user_1.default.findOne({ email: email });
            if (!user) {
                const error = new Error("User could not be found");
                error.statusCode = 401;
                throw error;
            }
            const isPwEqual = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPwEqual) {
                const error = new Error("Password not valid");
                error.statusCode = 401;
                throw error;
            }
            // console.log("LOGIN: ", user);
            // console.log("LOGIN: ", isPwEqual);
            // console.log("LOGIN .ENV: ", process.env.WEB_TOKEN_SECRET);
            const token = jsonwebtoken_1.default.sign({ email: user.email, userId: user._id.toString() }, process.env.WEB_TOKEN_SECRET || "", { expiresIn: "24h" });
            // console.log("LOGIN: ", token);
            res.status(200).json({ token, userId: user._id.toString() });
        }
        catch (err) {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        }
    });
}
function getUserStatus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.default.findById(req.userId);
            if (!user) {
                const error = new Error("User could not be found");
                error.statusCode = 404;
                throw error;
            }
            res
                .status(200)
                .json({
                message: "User status fetched successfully",
                status: user.status,
            });
        }
        catch (err) {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        }
    });
}
function updateUserStatus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const newStatus = req.body.status;
        // console.log("newStatus: ", newStatus);
        try {
            const user = yield user_1.default.findById(req.userId);
            // console.log("USER: ", user, req.userId);
            if (!user) {
                const error = new Error("User could not be found");
                error.statusCode = 404;
                throw error;
            }
            user.status = newStatus;
            yield user.save();
            res
                .status(200)
                .json({
                message: "User status updated successfully",
                status: user.status,
            });
        }
        catch (err) {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        }
    });
}
