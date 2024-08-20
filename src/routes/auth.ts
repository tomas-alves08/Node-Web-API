import express from "express";
import { body } from "express-validator";
import User from "../models/user";
import { getUserStatus, login, signup, updateUserStatus } from "../controllers/auth";
import isAuth from "../middleware/isAuth";

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) return Promise.reject("E-mail address already exist");
      }),
    body("password").trim().isLength({ min: 6 }),
    body("name").trim().not().isEmpty(),
  ],
  signup
);

router.post("/login", login);

router.get("/status", isAuth, getUserStatus);

router.patch("/status", isAuth,[
  body("status").trim().not().isEmpty(),
], updateUserStatus);

export default router;
