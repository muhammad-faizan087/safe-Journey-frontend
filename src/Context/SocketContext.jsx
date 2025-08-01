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
    // const token = getTokenFromCookie();
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    console.log("Connecting socket to:", "import.meta.env.VITE_BackEnd_URL");

    if (!token) return;

    const socketInstance = io("import.meta.env.VITE_BackEnd_URL", {
      transports: ["websocket"],
      upgrade: true,
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

    socketInstance.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
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
