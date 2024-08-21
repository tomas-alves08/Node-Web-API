import express from "express";
import { body } from "express-validator";

import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/feed";
import isAuth from "../middleware/isAuth";

const router = express.Router();

// GET /feed/posts
router.get("/posts", isAuth, getPosts);

// POST /feed/posts
router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  createPost
);

router.get("/post/:postId", isAuth, getPost);

router.put(
  "/post/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  updatePost
);

router.delete("/post/:postId", isAuth, deletePost);

export default router;
