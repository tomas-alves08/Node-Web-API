"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const socket_1 = __importDefault(require("./socket"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const feed_1 = __importDefault(require("./routes/feed"));
const auth_1 = __importDefault(require("./routes/auth"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const privateKey = fs_1.default.readFileSync("server-key");
const certificate = fs_1.default.readFileSync("server.cert");
// SECURITY MIDDLEWARE
app.use((0, helmet_1.default)());
// COMPRESSION MIDDLEWARE
app.use((0, compression_1.default)());
// LOGGER MIDDLEWARE
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, "access.log"), { flags: "a" });
app.use((0, morgan_1.default)("combined", { stream: accessLogStream }));
// FILE STORAGE IN THE DIST FOLDER!!!!
const imagesDir = path_1.default.join(__dirname, "images");
// console.log("imagesDir: ", imagesDir);
if (!fs_1.default.existsSync(imagesDir)) {
    fs_1.default.mkdirSync(imagesDir, { recursive: true });
}
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "dist/images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg")
        cb(null, true);
    else
        cb(null, false);
};
// DATA MIDDLEWARE
app.use(body_parser_1.default.json()); // this parses application/json data
app.use((0, multer_1.default)({ storage: fileStorage, fileFilter }).single("image")); // Middleware to upload image files
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "images"))); // Middlewaree to serve images from dist folder
// Middleware to allow CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use("/feed", feed_1.default);
app.use("/auth", auth_1.default);
// ERROR HANDLING MIDDLEWARE
app.use((error, req, res, next) => {
    // console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message, error });
});
mongoose_1.default
    .connect(process.env.MONGODB_URI || "")
    .then(() => {
    // Development Mode
    const server = app.listen(process.env.PORT || 8080);
    // SET UP SOCKET.IO
    const io = socket_1.default.init(server, {
        cors: {
            origin: "https://localhost:3000",
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log("Client connected", socket.id);
    });
})
    .catch((err) => {
    console.log(err.message);
});
