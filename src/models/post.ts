import mongoose, { Schema } from "mongoose";
import { IPost } from "../utils/schema";

const PostSchema = mongoose.Schema;

const postSchema: Schema = new PostSchema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPost>("Post", postSchema);
