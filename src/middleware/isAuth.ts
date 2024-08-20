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
  // console.log("authHeader: ", authHeader);
  if (!authHeader) {
    const error: IError = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1]; 
  // console.log("TOKEN: ", token);

  if (!token) {
    const error: IError = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  try {
    const decodedToken = jwt.verify(
      token || "",
      process.env.WEB_TOKEN_SECRET || ""
    ) as IJwtPayloadCustom;
    // console.log("decodedToken: ", decodedToken);

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
