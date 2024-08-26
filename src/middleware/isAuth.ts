import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { IError, IJwtPayloadCustom, RequestCustom } from "../utils/schema";
import { Types } from "mongoose";

export default async function (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const error: IError = new Error("Not authenticated");
    error.statusCode = 401;
    // throw error;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    const error: IError = new Error("Not authenticated - No token existent");
    error.statusCode = 401;

    return next(error);
  }

  try {
    const decodedToken = jwt.verify(
      token || "",
      process.env.WEB_TOKEN_SECRET || ""
    ) as IJwtPayloadCustom;

    if (!decodedToken) {
      const error: IError = new Error("Not authenticated");
      error.statusCode = 401;
      throw error;
    }

    req.userId = new Types.ObjectId(decodedToken.userId);

    next();
  } catch (err: any) {
    if (!(err as IError).statusCode) err.statusCode = 500;
    throw err;
  }
}
