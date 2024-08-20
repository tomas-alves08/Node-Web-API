import { Server } from "socket.io";

let io:Server;

export default {
    init: (httpServer:any, corsOptions: any) => {
        io = new Server(httpServer, { cors: corsOptions });
        return io;
    },
    getIo: () => {
        if(!io){
            throw new Error("Socket.io not initialized");
        }
        return io;
    }
}