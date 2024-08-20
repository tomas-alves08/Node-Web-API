import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { validationResult } from "express-validator";
import { IError, RequestCustom } from "../utils/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function signup(req: Request, res: Response, next: NextFunction) {
  // Form Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: IError = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPw,
      name,
    });
    const savedUser = await user.save();
    res.status(201).json({ message: "User created", userId: savedUser._id });
  } catch (err: any) {
    if (!(err as IError).statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User could not be found") as IError;
      error.statusCode = 401;
      throw error;
    }

    const isPwEqual = await bcrypt.compare(password, user.password);
    if (!isPwEqual) {
      const error = new Error("Password not valid") as IError;
      error.statusCode = 401;
      throw error;
    }

    // console.log("LOGIN: ", user);
    // console.log("LOGIN: ", isPwEqual);
    // console.log("LOGIN .ENV: ", process.env.WEB_TOKEN_SECRET);

    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      process.env.WEB_TOKEN_SECRET || "",
      { expiresIn: "1h" }
    );

    // console.log("LOGIN: ", token);

    res.status(200).json({ token, userId: user._id.toString() });
  } catch (err: any) {
    if (!(err as IError).statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function getUserStatus(req: RequestCustom, res: Response, next: NextFunction) {
  try{
    const user = await User.findById(req.userId);
    if(!user){
      const error = new Error("User could not be found") as IError;
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({message: "User status fetched successfully", status: user.status});
    }catch(err: any) {
      if (!(err as IError).statusCode) err.statusCode = 500;
      next(err);
    }
}

export async function updateUserStatus(req: RequestCustom, res: Response, next: NextFunction) {
  const newStatus = req.body.status;
  // console.log("newStatus: ", newStatus);
  try{
    const user = await User.findById(req.userId);
    // console.log("USER: ", user, req.userId);

    if(!user){
      const error = new Error("User could not be found") as IError;
      error.statusCode = 404;
      throw error;
    }

    user.status = newStatus;
    await user.save();

    res.status(200).json({message: "User status updated successfully",status: user.status});
  } catch(err: any) {
    if (!(err as IError).statusCode) err.statusCode = 500;
    next(err);
  }
}