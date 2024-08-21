import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import https from "https";

import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from "multer";
import * as socketServer from "./socket";
import { Socket } from "socket.io";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import feedRoutes from "./routes/feed";
import authRoutes from "./routes/auth";
import path from "path";
import { IError } from "./utils/schema";

const app = express();

const privateKey = fs.readFileSync("server-key");
const certificate = fs.readFileSync("server.cert");

// SECURITY MIDDLEWARE
app.use(helmet());

// COMPRESSION MIDDLEWARE
app.use(compression());

// LOGGER MIDDLEWARE
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

// FILE STORAGE IN THE DIST FOLDER!!!!
const imagesDir = path.join(__dirname, "images");
// console.log("imagesDir: ", imagesDir);
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "dist/images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  )
    cb(null, true);
  else cb(null, false);
};

// DATA MIDDLEWARE
app.use(bodyParser.json()); // this parses application/json data
app.use(multer({ storage: fileStorage, fileFilter }).single("image")); // Middleware to upload image files
app.use("/images", express.static(path.join(__dirname, "images"))); // Middlewaree to serve images from dist folder

// Middleware to allow CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

// ERROR HANDLING MIDDLEWARE
app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message, error });
});

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => {
    // Development Mode
    const server = app.listen(process.env.PORT || 8080);

    // SET UP SOCKET.IO
    const io = socketServer.init(server, {
      cors: {
        origin: "https://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      },
    });
    io.on("connection", (socket: Socket) => {
      console.log("Client connected", socket.id);
    });
  })
  .catch((err: any) => {
    console.log(err.message);
  });
