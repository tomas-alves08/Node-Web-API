import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";

import feedRoutes from "./routes/feed-router";

const app = express();

app.use(bodyParser.json()); // this parses application/json data

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

app.listen(8080);
