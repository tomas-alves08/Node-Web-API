import express from "express";

import { getPosts, postPost } from "../controllers/feed-controller";

const router = express.Router();

// GET /feed/posts
router.get("/posts", getPosts);

// POST /feed/posts
router.post("/post", postPost);

export default router;
