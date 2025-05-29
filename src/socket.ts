// socket.ts
"use client";
import io from "socket.io-client";

const SOCKET_URL = (process.env.NODE_ENV === "development")
    ? "http://localhost:3001"
    : "https://whiteboard-socket.onrender.com"

export const socket = io(SOCKET_URL);