import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001; 

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        let userRoom: string | null = null;

        socket.on("join-room", ({ room, nickname }: { room: string; nickname: string }) => {
            userRoom = room;
            socket.join(room);
            console.log(`${nickname} joined room ${room}`);
            socket.to(room).emit("user-joined", `${nickname} joined the room`);
        });

        socket.on("message", ({ sender, content }: { sender: string; content: string }) => {
            if (userRoom) {
                socket.to(userRoom).emit("message", { sender, content });
            }
        });

        socket.on("disconnect", () => {
            console.log(`Disconnected: ${socket.id}`);
        });
    });

    httpServer
        .once("error", (err) => {
            console.error("Server error:", err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`Server ready at http://${hostname}:${port}`);
        });
});
