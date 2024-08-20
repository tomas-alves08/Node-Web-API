import mongoose, { Schema } from "mongoose";
import { IUser } from "../utils/schema";

const UserSchema = mongoose.Schema;

const userSchema: Schema = new UserSchema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "I am new",
  },
  posts: {
    type: [
      {
        type: Schema.ObjectId,
        ref: "Post",
      },
    ],
  },
});

export default mongoose.model<IUser>("User", userSchema);
