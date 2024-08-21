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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const auth_1 = require("../controllers/auth");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const router = express_1.default.Router();
router.put("/signup", [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom((value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req }) {
        const user = yield user_1.default.findOne({ email: value });
        if (user)
            return Promise.reject("E-mail address already exist");
    })),
    (0, express_validator_1.body)("password").trim().isLength({ min: 6 }),
    (0, express_validator_1.body)("name").trim().not().isEmpty(),
], auth_1.signup);
router.post("/login", auth_1.login);
router.get("/status", isAuth_1.default, auth_1.getUserStatus);
router.patch("/status", isAuth_1.default, [
    (0, express_validator_1.body)("status").trim().not().isEmpty(),
], auth_1.updateUserStatus);
exports.default = router;
