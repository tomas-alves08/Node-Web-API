import { Document, Schema, Types } from "mongoose";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
// import User from "../models/user";

export interface IPost extends Document {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  creator: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  _doc: Document<IPost>;
}

export interface IError extends Error {
  statusCode?: number;
}

export interface IUser {
  _id: Schema.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  status: string;
  posts: IPost[];
}

export interface RequestCustom extends Request {
  userId?: Types.ObjectId;
}

export interface IJwtPayloadCustom extends JwtPayload {
  userId: string;
}
