import { Request, Response, NextFunction } from "express";

const posts = [
  {
    title: "First Post",
    content: "This is your first post!",
  },
];

export async function getPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(200).json({
    posts,
  });
}

export async function postPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const title: string = req.body.title;
  const content: string = req.body.content;

  const newPost = {
    id: new Date().toISOString(),
    title,
    content,
  };
  //create post in DB
  posts.push(newPost);

  res.status(201).json({
    message: "Post created successfully!",
    post: newPost,
  });
}
