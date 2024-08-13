"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = getPosts;
exports.createPost = createPost;
exports.getPost = getPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
const express_validator_1 = require("express-validator");
const post_1 = __importDefault(require("../models/post"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function getPosts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentPage = Number(req.query.page) || 1;
        const POSTS_PER_PAGE = 2;
        try {
            const totalItems = yield post_1.default.find().countDocuments();
            const posts = yield post_1.default.find()
                .skip((currentPage - 1) * POSTS_PER_PAGE)
                .limit(POSTS_PER_PAGE);
            return res.status(200).json({
                message: "Fetched posts successfully.",
                posts,
                totalItems,
            });
        }
        catch (err) {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        }
    });
}
function createPost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed!");
            error.statusCode = 422;
            throw error;
        }
        const title = req.body.title;
        const content = req.body.content;
        if (!req.file) {
            const error = new Error("No image provided");
            error.statusCode = 422;
            throw error;
        }
        //create post in DB
        try {
            const post = yield new post_1.default({
                title,
                content,
                imageUrl: "images/" + req.file.filename,
                creator: {
                    name: "Tomas",
                },
            });
            yield post.save();
            res.status(201).json({
                message: "Post created successfully!",
                post,
            });
        }
        catch (err) {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        }
    });
}
function getPost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const postId = req.params.postId;
        try {
            const post = yield post_1.default.findById(postId);
            console.log("Post: ", post);
            if (!post) {
                const error = new Error("Could not find post");
                error.statusCode = 404;
                throw error;
            }
            return res.status(200).json({ message: "Post fetched", post });
        }
        catch (err) {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        }
    });
}
function updatePost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed!");
            error.statusCode = 422;
            throw error;
        }
        const postId = req.params.postId;
        const { title, content } = req.body;
        let imageUrl = req.body.image;
        console.log(req.body);
        if (req.file)
            imageUrl = "images/" + req.file.filename;
        if (!imageUrl) {
            const error = new Error("No file provided.");
            error.statusCode = 422;
            throw error;
        }
        try {
            const post = yield post_1.default.findById(postId);
            console.log("POST: ", post);
            console.log("postId: ", postId);
            if (!post) {
                const error = new Error("No post found");
                error.statusCode = 404;
                throw error;
            }
            // Delete old image file
            if (imageUrl !== post.imageUrl)
                clearImage(post.imageUrl);
            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;
            const updatedPost = yield post.save();
            return res
                .status(200)
                .json({ message: "Post updated succesfully", post: updatedPost });
        }
        catch (err) {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        }
    });
}
function deletePost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const postId = req.params.postId;
        try {
            const post = yield post_1.default.findById(postId);
            if (!post) {
                const error = new Error("Could not find post");
                error.statusCode = 404;
                throw error;
            }
            clearImage(post.imageUrl);
            yield post_1.default.findByIdAndDelete(postId);
            return res.status(200).json({ message: "Post deleted successfully" });
        }
        catch (err) {
            if (!err.statusCode)
                err.statusCode = 500;
            next(err);
        }
    });
}
const clearImage = (filePath) => {
    filePath = path_1.default.join(__dirname, "..", filePath);
    fs_1.default.unlink(filePath, (err) => console.log(err));
};
