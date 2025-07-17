import { io } from "socket.io-client";

export const socket_ = io("http://localhost:3000", {
  withCredentials: true,
});
