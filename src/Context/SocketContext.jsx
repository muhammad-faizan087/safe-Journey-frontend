import { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [OnlineUsers, setOnlineUsers] = useState([]);

  const getTokenFromCookie = () => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((c) => c.startsWith("token="));
    return tokenCookie?.split("=")[1];
  };

  useEffect(() => {
    const token = getTokenFromCookie();
    if (!token) return;

    const socketInstance = io("http://localhost:3000", {
      withCredentials: true,
      auth: {
        token,
      },
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketInstance.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
      console.log("Updated online users:", users);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, OnlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
