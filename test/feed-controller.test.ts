import { Request, Response } from "express";
import mongoose from "mongoose";
import { expect } from "chai";
import sinon from "sinon";
import dotenv from "dotenv";

dotenv.config();

import Post from "../src/models/post";
import User from "../src/models/user";
import { createPost } from "../src/controllers/feed";
import { RequestCustom, RequestCustomTest } from "../src/utils/schema";

describe("Feed Controller", async function () {
  this.timeout(10000);

  before(async function () {
    this.timeout(5000);

    const result = await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.gartik4.mongodb.net/test-messages?retryWrites=true`
    );

    await Post.findByIdAndDelete("5f4b6f4e6f4b6f4e12345678");

    const user = new User({
      email: "t@m.com",
      password: "test",
      name: "Tomas",
      posts: [],
      _id: "5f4b6f4e6f4b6f4e12345678",
    });
    await user.save();
  });

  it("should add a created post to the posts of the creator", async function () {
    const req = {
      body: { title: "Test post", content: "A test post" },
      file: { path: "xyz" },
      userId: "5f4b6f4e6f4b6f4e12345678",
    } as Partial<RequestCustomTest>;

    const res = {
      status: function () {
        return this;
      },
      json: function () {
        return this;
      },
    } as Partial<Response>;

    const savedUser = await createPost(
      req as Request,
      res as Response,
      function () {}
    );

    expect(savedUser).to.have.property("posts");
    expect(savedUser?.posts).to.have.length(1);

    // (User.findOne as any).restore();
  }).timeout(5000);

  after(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });
});
