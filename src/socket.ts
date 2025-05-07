"use client";

import { io, Socket } from "socket.io-client";

const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:3001";

export const socket: Socket = io(SERVER_URL, {
  transports: ['websocket', 'polling'],
});
