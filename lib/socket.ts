"use client"

import { io } from "socket.io-client"

export const socket = io("https://socket-server-bdig.onrender.com", {
  transports: ["polling", "websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
})