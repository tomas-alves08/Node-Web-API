import { Document } from "mongoose";

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
}

export interface IError extends Error {
  statusCode?: number;
}
