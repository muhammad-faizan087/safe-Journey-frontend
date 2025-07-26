import { io } from "socket.io-client";

export const socket_ = io(
  "https://safejourney-backend-production.up.railway.app",
  {
    withCredentials: true,
  }
);
