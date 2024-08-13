import { Request, Response, NextFunction } from "express";
import { IError, IPost } from "../utils/schema";
import { validationResult } from "express-validator";
import Post from "../models/post";
import path from "path";
import fs from "fs";

export async function getPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const currentPage: number = Number(req.query.page) || 1;
  const POSTS_PER_PAGE = 2;

  try {
    const totalItems = await Post.find().countDocuments();

    const posts = await Post.find()
      .skip((currentPage - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE);

    return res.status(200).json({
      message: "Fetched posts successfully.",
      posts,
      totalItems,
    });
  } catch (err: any) {
    if (!(err as IError).statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: IError = new Error("Validation failed!");
    error.statusCode = 422;
    throw error;
  }
  const title: string = req.body.title;
  const content: string = req.body.content;

  if (!req.file) {
    const error: IError = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  //create post in DB
  try {
    const post: IPost = await new Post({
      title,
      content,
      imageUrl: "images/" + req.file.filename,
      creator: {
        name: "Tomas",
      },
    });
    await post.save();

    res.status(201).json({
      message: "Post created successfully!",
      post,
    });
  } catch (err: any) {
    if (!(err as IError).statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function getPost(req: Request, res: Response, next: NextFunction) {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    console.log("Post: ", post);
    if (!post) {
      const error: IError = new Error("Could not find post");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({ message: "Post fetched", post });
  } catch (err: any) {
    if (!(err as IError).statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: IError = new Error("Validation failed!");
    error.statusCode = 422;
    throw error;
  }

  const postId = req.params.postId;
  const { title, content } = req.body;
  let imageUrl = req.body.image;

  console.log(req.body);

  if (req.file) imageUrl = "images/" + req.file.filename;

  if (!imageUrl) {
    const error: IError = new Error("No file provided.");
    error.statusCode = 422;
    throw error;
  }

  try {
    const post = await Post.findById(postId);
    console.log("POST: ", post);
    console.log("postId: ", postId);
    if (!post) {
      const error: IError = new Error("No post found");
      error.statusCode = 404;
      throw error;
    }

    // Delete old image file
    if (imageUrl !== post.imageUrl) clearImage(post.imageUrl);

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;

    const updatedPost = await post.save();

    return res
      .status(200)
      .json({ message: "Post updated succesfully", post: updatedPost });
  } catch (err: any) {
    if (!(err as IError).statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error: IError = new Error("Could not find post");
      error.statusCode = 404;
      throw error;
    }

    clearImage(post.imageUrl);

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err: any) {
    if (!(err as IError).statusCode) err.statusCode = 500;
    next(err);
  }
}

const clearImage = (filePath: string) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
