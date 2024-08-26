import { Request, Response } from "express";
import mongoose from "mongoose";
import { expect } from "chai";
import sinon from "sinon";
import dotenv from "dotenv";

dotenv.config();

import User from "../src/models/user";
import { getUserStatus, login } from "../src/controllers/auth";
import { CustomResponse } from "../src/utils/schema";

describe("Auth Controller - Login", async function () {
  this.timeout(10000);

  before(async function () {
    this.timeout(10000);

    const result = await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.gartik4.mongodb.net/test-messages?retryWrites=true`
    );

    await User.findByIdAndDelete("5f4b6f4e6f4b6f4e12345678");

    const user = new User({
      email: "t@m.com",
      password: "test",
      name: "Tomas",
      posts: [],
      _id: "5f4b6f4e6f4b6f4e12345678",
    });
    await user.save();
  });

  it("should throw an error with code 500 if accessing the database fails", async () => {
    const findOneStub = sinon.stub(User, "findOne");
    findOneStub.throws(new Error("Database access failed"));

    const req = {
      body: { email: "test@test.com", password: "test" },
    } as Partial<Request>;

    const res = {
      statusCode: 0,
      status: function (code: number) {
        this.statusCode = code;
        return this;
      },
      json: sinon.spy(),
    } as Partial<Response>;

    await login(req as Request, res as Response, (err: any) => {
      console.log(err.statusCode);
      expect(err).to.be.an("error");
      expect(err).to.have.property("statusCode", 500);
    });

    (User.findOne as any).restore();
  }).timeout(5000);

  it("should send a response with a valid user status for an existing user", async () => {
    const req = {
      userId: "5f4b6f4e6f4b6f4e12345678",
    } as Partial<Request>;

    const res: CustomResponse = {
      statusCode: 500,
      // userStatus: null,
      status: function (code: number) {
        this.statusCode = code;
        return this;
      },
      json: function (data: any) {
        this.userStatus = data.status;
        return this as CustomResponse;
      },
    } as CustomResponse;

    await getUserStatus(req as Request, res as Response, () => {});

    expect(res.statusCode).to.be.equal(200);
    expect(res.userStatus).to.be.equal("I am new");
  });

  after(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });
});
