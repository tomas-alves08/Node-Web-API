"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = mongoose_1.default.Schema;
const postSchema = new PostSchema({
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
        type: {
            name: String,
        },
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Post", postSchema);
