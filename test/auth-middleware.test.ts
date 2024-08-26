import authMiddleware from "../src/middleware/isAuth"; // Ensure the correct import path
import { expect } from "chai";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import sinon from "sinon";

// Ensure that Mocha is properly set up for handling async tests
describe("Auth Middleware", () => {
  it("should throw an error if no authorization header is present", async () => {
    const req = {
      get: () => undefined, // Mocking missing Authorization header
    } as Partial<Request>;

    const res = {} as Partial<Response>;

    // Wrap the middleware call in a Promise
    const middlewareCall = new Promise<void>((resolve, reject) => {
      authMiddleware(req as Request, res as Response, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Check if the error is thrown
    try {
      await middlewareCall;
      // If no error is thrown, fail the test
      throw new Error("Expected an error to be thrown but none was received.");
    } catch (err: any) {
      // Check for expected error properties
      expect(err).to.be.an("error");
      expect(err.statusCode).to.equal(401);
      expect(err.message).to.equal("Not authenticated");
    }
  });

  it("should throw an error if token is only one string", async () => {
    const req = {
      get: (header: string) =>
        header === "Authorization" ? "undefined" : undefined,
    } as Partial<Request>;

    const res = {} as Partial<Response>;

    // Wrap the middleware call in a Promise

    const middlewareCall = new Promise<void>((resolve, reject) => {
      authMiddleware(req as Request, res as Response, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Check if the error is thrown
    try {
      await middlewareCall;
      // If no error is thrown, fail the test
      throw new Error("Expected an error to be thrown but none was received.");
    } catch (err: any) {
      // Check for expected error properties
      expect(err).to.be.an("error");
      expect(err.statusCode).to.equal(401);
      expect(err.message).to.equal("Not authenticated - No token existent");
    }
  });

  it("should return a token with a userId after decoding the token", async () => {
    const req = {
      get: (header: string) => "Bearer jhdjgfcgjhkj",
    } as Partial<Request> & { userId?: string };

    const res = {} as Partial<Response>;

    const jwtVerifyStub = sinon
      .stub(jwt, "verify")
      .returns({ userId: "123456789012345678901234" } as any);

    authMiddleware(req as Request, res as Response, (err) => {});

    expect(req).to.have.property("userId");
    expect(req.userId?.toString()).to.be.equal("123456789012345678901234");
    expect(jwtVerifyStub.called).to.be.true;

    jwtVerifyStub.restore();
  });
});
