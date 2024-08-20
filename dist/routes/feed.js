"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const feed_controller_1 = require("../controllers/feed-controller");
const router = express_1.default.Router();
// GET /feed/posts
router.get("/posts", feed_controller_1.getPosts);
// POST /feed/posts
router.post("/post", [
    (0, express_validator_1.body)("title").trim().isLength({ min: 5 }),
    (0, express_validator_1.body)("content").trim().isLength({ min: 5 }),
], feed_controller_1.createPost);
router.get("/post/:postId", feed_controller_1.getPost);
router.put("/post/:postId", [
    (0, express_validator_1.body)("title").trim().isLength({ min: 5 }),
    (0, express_validator_1.body)("content").trim().isLength({ min: 5 }),
], feed_controller_1.updatePost);
router.delete("/post/:postId", feed_controller_1.deletePost);
exports.default = router;
