"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
let io;
exports.default = {
    init: (httpServer, corsOptions) => {
        io = new socket_io_1.Server(httpServer, { cors: corsOptions });
        return io;
    },
    getIo: () => {
        if (!io) {
            throw new Error("Socket.io not initialized");
        }
        return io;
    }
};
