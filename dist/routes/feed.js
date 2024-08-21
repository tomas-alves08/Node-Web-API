"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const feed_1 = require("../controllers/feed");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const router = express_1.default.Router();
// GET /feed/posts
router.get("/posts", isAuth_1.default, feed_1.getPosts);
// POST /feed/posts
router.post("/post", isAuth_1.default, [
    (0, express_validator_1.body)("title").trim().isLength({ min: 5 }),
    (0, express_validator_1.body)("content").trim().isLength({ min: 5 }),
], feed_1.createPost);
router.get("/post/:postId", isAuth_1.default, feed_1.getPost);
router.put("/post/:postId", isAuth_1.default, [
    (0, express_validator_1.body)("title").trim().isLength({ min: 5 }),
    (0, express_validator_1.body)("content").trim().isLength({ min: 5 }),
], feed_1.updatePost);
router.delete("/post/:postId", isAuth_1.default, feed_1.deletePost);
exports.default = router;
