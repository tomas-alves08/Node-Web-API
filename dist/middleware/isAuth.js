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
exports.default = default_1;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
function default_1(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.get("Authorization");
        // console.log("authHeader: ", authHeader);
        if (!authHeader) {
            const error = new Error("Not authenticated");
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(" ")[1];
        // console.log("TOKEN: ", token);
        if (!token) {
            const error = new Error("Not authenticated");
            error.statusCode = 401;
            throw error;
        }
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token || "", process.env.WEB_TOKEN_SECRET || "");
            // console.log("decodedToken: ", decodedToken);
            if (!decodedToken) {
                const error = new Error("Not authenticated");
                error.statusCode = 401;
                throw error;
            }
            req.userId = new mongoose_1.Types.ObjectId(decodedToken.userId);
            next();
        }
        catch (err) {
            if (!err.statusCode)
                err.statusCode = 500;
            throw err;
        }
    });
}
