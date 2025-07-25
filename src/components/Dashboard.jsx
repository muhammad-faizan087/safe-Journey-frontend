"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Search,
  MessageCircle,
  MapPin,
  Users,
  Bell,
  Settings,
  Shield,
  Clock,
  Star,
  Phone,
  User,
  Send,
  Plus,
  Navigation,
  AlertCircle,
  CheckCircle,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Button from "./Button";

import { useSocketContext } from "../Context/SocketContext.jsx";
import sound from "../assets/notification.mp3";
import { format } from "date-fns";
import AutoPlaceInput from "./Api try.jsx";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchData, setSearchData] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
  });
  const [isActive, setIsActive] = useState(true);
  const [selectedChat, setSelectedChat] = useState();
  const [SelectedRoute, setSelectedRoute] = useState();
  const [message, setMessage] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [NotificationsArray, setNotificationsArray] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [UserData, setUserData] = useState("");
  const [Companions, setCompanions] = useState([]);
  const [chats, setchats] = useState([]);
  const searchRef = useRef();
  const { socket, OnlineUsers } = useSocketContext();
  const messagesEndRef = useRef();
  const matchedRef = useRef(false);
  const MessageButtonRef = useRef();

  const now = new Date();
  const Currentdate = format(now, "yyyy-MM-dd");
  const Currenttime = format(now, "HH:mm");

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [selectedChat?.messages]);

  useEffect(() => {
    if (isActive || !isActive) {
      if (searchRef.current) {
        searchRef.current.disabled = !isActive;
      }
    }
  }, [isActive]);

  const getConversations = async () => {
    try {
      const response = await fetch(
        "https://safejourney-backend-production.up.railway.app/message/getConversations",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.conversations && data.conversations.length >= 0) {
        setchats(data.conversations);
        // setmessages(data.conversations.map((chat) => chat.messages));
      }
    } catch (error) {
      console.log("Error fetching conversations:", error);
    }
  };

  const WaitgettingConversations = async () => {
    await getConversations();
  };

  useEffect(() => {
    WaitgettingConversations();
  }, []);

  const getUserData = async () => {
    try {
      const response = await fetch(
        "https://safejourney-backend-production.up.railway.app/dashboard",
        {
          credentials: "include",
        }
      );

      const data = await response.json();
      // console.log(data);
      setUserData(data);
      setNotificationsArray(data.Notifications);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const WaitgettingData = async () => {
    await getUserData();
  };

  useEffect(() => {
    WaitgettingData();
  }, []);

  // const postJourneyDetails = async (
  //   fromAddress,
  //   toAddress,
  //   date,
  //   time,
  //   status,
  //   email
  // ) => {
  //   try {
  //     const response = await fetch(
  //       "https://safejourney-backend-production.up.railway.app/journeys/create-journey",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include",
  //         body: JSON.stringify({
  //           fromAddress,
  //           toAddress,
  //           date,
  //           time,
  //           status,
  //           email,
  //         }),
  //       }
  //     );
  //     const data = await response.json();
  //     console.log("Data:", data);
  //   } catch (error) {
  //     console.log("Error:", error);
  //   }
  // };

  // function filterOutCurrentUser(companions, currentUserEmail) {
  //   return companions.filter((companion) => {
  //     return (
  //       companion?.user?.email && companion.user.email !== currentUserEmail
  //     );
  //   });
  // }

  // const getTravelCompanions = async (
  //   origin,
  //   destination,
  //   date,
  //   time,
  //   email
  // ) => {
  //   try {
  //     const response = await fetch(
  //       "https://safejourney-backend-production.up.railway.app/journeys/getCompanions",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include",
  //         body: JSON.stringify({
  //           origin,
  //           destination,
  //           date,
  //           time,
  //           email,
  //         }),
  //       }
  //     );
  //     const data = await response.json();
  //     const filteredCompanions = filterOutCurrentUser(
  //       data.companions,
  //       UserData.email
  //     );
  //     console.log(data.companions);
  //     setCompanions(data.companions);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const deleteMatchedJourney = async (
    receiverEmail,
    senderEmail,
    origin,
    destination
  ) => {
    try {
      const response = await fetch(
        "https://safejourney-backend-production.up.railway.app/journeys/deleteMatchedJourney",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            receiverEmail,
            senderEmail,
            origin,
            destination,
          }),
        }
      );
      const data = await response.json();
      console.log("Matched journey deleted:", data);
    } catch (error) {
      console.log("Error deleting matched journey:", error);
    }
  };

  const handleMatched = async (e) => {
    // e.preventDefault();
    matchedRef.current.disabled = true;
    await deleteMatchedJourney(
      selectedChat.receiverEmail,
      selectedChat.senderEmail,
      selectedChat.origin,
      selectedChat.destination
    );
  };

  function to12HourTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  const createJourneyAndGetCompanions = async (
    email,
    from,
    to,
    date,
    time,
    status
  ) => {
    try {
      const res = await fetch(
        "https://safejourney-backend-production.up.railway.app/journeys/createJourneyAndGetCompanions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            fromAddress: from,
            toAddress: to,
            date,
            time,
            status,
          }),
        }
      );
      const { companions, journey } = await res.json();
      console.log("Companions:", companions);
      setCompanions(companions);
    } catch (error) {
      console.log("Error creating journey", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    searchRef.current.blur();
    searchRef.current.disabled = true;
    searchRef.current.textContent = "Searching...";
    console.log(searchData.origin, searchData.destination);
    await createJourneyAndGetCompanions(
      UserData.email,
      searchData.origin,
      searchData.destination,
      searchData.date,
      searchData.time,
      isActive ? "active" : "inactive"
    );
    setSearchData({
      origin: "",
      destination: "",
      date: "",
      time: "",
    });

    searchRef.current.disabled = false;
    searchRef.current.textContent = "Search Companions";
    searchRef.current.blur(false);
  };

  const sendMessage = async (id, message, senderEmail) => {
    if (!selectedChat) return;
    try {
      const response = await fetch(
        "https://safejourney-backend-production.up.railway.app/message/sendMessage/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            message,
            receiverId: id,
            senderEmail,
          }),
        }
      );
      const data = await response.json();
      console.log("Message sent:", data);
      return data.newMessage;
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const getReceiverId = () => {
    if (!selectedChat || !UserData) return null;
    return selectedChat.participants.find((id) => id !== UserData.id);
  };

  // const handleSendMessage = async (e) => {
  //   e.preventDefault();
  //   MessageButtonRef.current.disabled = true;
  //   const receiverId = getReceiverId();
  //   if (message.trim() && receiverId) {
  //     const newMessage = await sendMessage(receiverId, message, UserData.email);
  //     MessageButtonRef.current.disabled = false;
  //     console.log("New message:", newMessage);
  //     console.log("📤 Socket message emitted:", newMessage);
  //     setMessage("");
  //   }
  // };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const receiverId = getReceiverId(); // implement this to get the active chat's other user ID
    const tempId = Math.random().toString(36);
    const optimisticMessage = {
      _id: tempId,
      message,
      senderId: UserData.id,
      receiverId,
      createdAt: new Date().toISOString(),
      clientId: tempId,
    };

    // Show immediately
    setSelectedChat((prev) => ({
      ...prev,
      messages: [...(prev?.messages || []), optimisticMessage],
    }));

    setMessage("");

    try {
      const data = await sendMessage(receiverId, message, UserData.email);
      if (data.success) {
        // Replace optimistic message with actual one
        setSelectedChat((prev) => ({
          ...prev,
          messages: prev.messages.map((msg) =>
            msg._id === tempId ? data.newMessage : msg
          ),
        }));
      }
    } catch (error) {
      console.error("Send error:", error);
    }
  };

  const sendNotification = async (receiverId, message, time) => {
    try {
      const res = await fetch(
        "https://safejourney-backend-production.up.railway.app/notify/sendNotification/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            receiverId,
            message,
            time,
          }),
        }
      );
      const data = await res.json();
      console.log(data);
      setNotificationsArray((prev) => [{ message, time }, ...prev]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async ({
      message,
      conversationId,
      senderName,
      receiverName,
      type,
      receiverId,
    }) => {
      if (
        !message ||
        !conversationId ||
        !senderName ||
        !receiverName ||
        !type ||
        !receiverId
      )
        return;

      console.log("📥 Socket message received:", {
        message,
        conversationId,
        senderName,
        receiverName,
        type,
        receiverId,
      });

      if (type === "Received") {
        const notification = new Audio(sound);
        notification.play().catch((e) => {
          console.error("Manual test audio play failed:", e);
        });
        // const FullTime = new Date().toISOString();
        // await sendNotification(
        //   receiverId,
        //   `You've received a new message from ${senderName}`,
        //   FullTime
        // );
      }

      setchats((prevChats) => {
        const chatExists = prevChats.some(
          (chat) => chat._id === conversationId
        );

        if (chatExists) {
          return prevChats.map((chat) => {
            if (chat._id !== conversationId) return chat;

            const messageExists = chat.messages.some(
              (m) => m._id === message._id
            );
            const updatedMessages = messageExists
              ? chat.messages
              : [...chat.messages, message];

            return {
              ...chat,
              messages: updatedMessages,
              lastMessage: message.message,
            };
          });
        } else {
          return [
            ...prevChats,
            {
              _id: conversationId,
              messages: [message],
              lastMessage: message.message,
              participants: [message.senderId, message.receiverId],
              senderName: senderName,
              receiverName: receiverName,
            },
          ];
        }
      });
      setSelectedChat((prevChat) => {
        if (!prevChat || prevChat._id !== conversationId) return prevChat;

        const messageExists = prevChat.messages.some(
          (m) => m._id === message._id
        );
        if (messageExists) return prevChat;

        return {
          ...prevChat,
          messages: [...prevChat.messages, message],
        };
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket]);

  const createConversation = async (
    receiverId,
    receiverName,
    senderName,
    origin,
    destination,
    senderEmail
  ) => {
    try {
      const response = await fetch(
        "https://safejourney-backend-production.up.railway.app/message/createConversation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            receiverId,
            receiverName,
            senderName,
            origin,
            destination,
            senderEmail,
          }),
        }
      );
      const data = await response.json();
      console.log("Success:", data.success, "data:", data);
    } catch (error) {
      console.log("Error creating conversation:", error);
    }
  };

  const startChat = async (e, companion) => {
    console.log("Starting chat with companion:", companion);
    e.target.textContent = "...";
    e.target.disabled = true;
    await createConversation(
      companion.user._id,
      companion.user.firstName + " " + companion.user.lastName,
      UserData.firstName + " " + UserData.lastName,
      companion.journey.from.address,
      companion.journey.to,
      UserData.email
    );
    await getConversations();
    setActiveTab("messages");
    setShowMobileChat(true);
    setSidebarOpen(false);
    e.target.textContent = "Message";
    e.target.disabled = false;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    setShowMobileChat(false);
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowMobileChat(true);
  };

  const handleRouteSelect = async (e, route) => {
    e.preventDefault();
    setSelectedRoute(route);

    if (e.target.textContent === "Activate") {
      e.target.textContent = "Activating...";
      // setShowMobileChat(true);
      await createJourneyAndGetCompanions(
        UserData.email,
        route.from,
        route.to,
        Currentdate,
        Currenttime,
        "active"
      );
      e.target.textContent = "DeActivate";
    } else if (e.target.textContent === "DeActivate") {
      e.target.textContent = "DeActivating...";
      await deleteMatchedJourney(
        "dummyemail@gmail.com",
        UserData.email,
        route.from,
        route.to
      );
      e.target.textContent = "Activate";
    }
  };

  const Notify = async (email) => {
    try {
      const response = await fetch(
        "https://safejourney-backend-production.up.railway.app/notify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleNotifyContact = async (e, contact) => {
    e.preventDefault();
    e.target.textContent = "Notifying...";
    await Notify(contact.email);
    e.target.textContent = "Notify";
  };

  return (
    <div className="min-h-screen min-w-fit bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <div className="relative h-6 w-6 sm:h-8 sm:w-8">
                  <div className="absolute inset-0 rounded-full bg-rose-500" />
                  <Shield className="absolute inset-0 h-6 w-6 sm:h-8 sm:w-8 text-white p-1" />
                </div>
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  SafeJourney
                </span>
              </div>
            </div>

            <motion.div
              className="flex items-center gap-2 sm:gap-4"
              initial={{ opacity: 0, translateX: "100%" }}
              whileInView={{
                opacity: 1,
                translateX: "0",
                transition: { duration: 1 },
              }}
            >
              {/* Active Status Toggle */}
              <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                <span className="text-xs sm:text-sm font-medium">
                  I need to travel
                </span>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    isActive ? "bg-rose-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      isActive
                        ? "translate-x-5 sm:translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Mobile Active Status */}
              <button
                onClick={() => setIsActive(!isActive)}
                className={`sm:hidden p-2 rounded-full ${
                  isActive
                    ? "bg-rose-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <Navigation className="h-4 w-4" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-900 relative"
                >
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {NotificationsArray.length}
                  </span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {NotificationsArray.length > 0 ? (
                        NotificationsArray.map((notification, index) => {
                          return (
                            <div
                              className="p-3 border-b hover:bg-gray-50"
                              key={index}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div>
                                  <p className="text-sm">
                                    {notification.message}
                                  </p>
                                  {
                                    <p className="text-xs text-gray-500">
                                      {to12HourTime(notification.time)}
                                    </p>
                                  }
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <h1 className="p-3">No Notifications To Show</h1>
                      )}
                      {/* <div className="p-3 border-b hover:bg-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm">
                              New travel companion found for your route
                            </p>
                            <p className="text-xs text-gray-500">
                              10 minutes ago
                            </p>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-2">
                <img
                  src="/profile.svg"
                  alt="Profile"
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                />
                <span className="hidden sm:block text-sm font-medium">
                  {UserData.firstName} {UserData.lastName}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:transform-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile sidebar header */}
            <div className="flex items-center justify-between p-4 border-b lg:hidden">
              <span className="font-semibold">Menu</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <motion.div
              className="flex-1 p-4"
              initial={{ opacity: 0, translateX: "-100%" }}
              whileInView={{
                opacity: 1,
                translateX: "0",
                transition: { duration: 0.6 },
              }}
            >
              <nav className="space-y-2">
                <button
                  onClick={() => handleTabChange("search")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm sm:text-base ${
                    activeTab === "search"
                      ? "bg-rose-50 text-rose-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  Find Companions
                </button>
                <button
                  onClick={() => handleTabChange("messages")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm sm:text-base ${
                    activeTab === "messages"
                      ? "bg-rose-50 text-rose-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  Messages
                  {/* {chats.some((chat) => chat.unread > 0) && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {chats.reduce((sum, chat) => sum + chat.unread, 0)}
                    </span>
                  )} */}
                </button>
                <button
                  onClick={() => handleTabChange("routes")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm sm:text-base ${
                    activeTab === "routes"
                      ? "bg-rose-50 text-rose-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Navigation className="h-4 w-4 sm:h-5 sm:w-5" />
                  My Routes
                </button>
                {/* <button
                  onClick={() => handleTabChange("history")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm sm:text-base ${
                    activeTab === "history"
                      ? "bg-rose-50 text-rose-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                  Journey History
                </button> */}
                <button
                  onClick={() => handleTabChange("safety")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm sm:text-base ${
                    activeTab === "safety"
                      ? "bg-rose-50 text-rose-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                  Safety Center
                </button>
                <button
                  onClick={() => handleTabChange("settings")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm sm:text-base ${
                    activeTab === "settings"
                      ? "bg-rose-50 text-rose-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                  Settings
                </button>
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-sm mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Journeys Completed</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Safety Rating</span>
                    <span className="font-medium text-green-600">4.9/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Connections</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
              </div>

              {/* Mobile Active Status */}
              <div className="sm:hidden mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">I need to travel</span>
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isActive ? "bg-rose-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-4 sm:p-6">
            {/* Search Tab */}
            {activeTab === "search" && (
              <div className="space-y-4 sm:space-y-6">
                {/* Search Form */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">
                    Find Travel Companions
                  </h2>
                  {/* <motion.form
                    onSubmit={handleSearch}
                    className="space-y-4"
                    initial={{ opacity: 0, translateY: "-20%" }}
                    whileInView={{
                      opacity: 1,
                      translateY: "0",
                      transition: {
                        duration: 0.6,
                        ease: "easeOut",
                      },
                    }}
                    viewport={{ once: true }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          From
                        </label>
                        <input
                          type="text"
                          placeholder="Enter origin location"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
                          value={searchData.origin}
                          required={true}
                          onChange={(e) =>
                            setSearchData({
                              ...searchData,
                              origin: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          To
                        </label>
                        <input
                          type="text"
                          placeholder="Enter destination"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
                          value={searchData.destination}
                          required={true}
                          onChange={(e) =>
                            setSearchData({
                              ...searchData,
                              destination: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
                          value={searchData.date}
                          required={true}
                          onChange={(e) =>
                            setSearchData({
                              ...searchData,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Preferred Time
                        </label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
                          value={searchData.time}
                          required={true}
                          onChange={(e) =>
                            setSearchData({
                              ...searchData,
                              time: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      ref={searchRef}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search Companions
                    </Button>
                  </motion.form> */}
                  <motion.form
                    onSubmit={handleSearch}
                    className="space-y-4"
                    initial={{ opacity: 0, translateY: "-20%" }}
                    whileInView={{
                      opacity: 1,
                      translateY: "0",
                      transition: {
                        duration: 0.6,
                        ease: "easeOut",
                      },
                    }}
                    viewport={{ once: true }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AutoPlaceInput
                        label="From"
                        value={searchData.origin}
                        onChange={(val) =>
                          setSearchData((prev) => ({ ...prev, origin: val }))
                        }
                      />

                      <AutoPlaceInput
                        label="To"
                        value={searchData.destination}
                        onChange={(val) =>
                          setSearchData((prev) => ({
                            ...prev,
                            destination: val,
                          }))
                        }
                      />

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
                          value={searchData.date}
                          required={true}
                          onChange={(e) =>
                            setSearchData({
                              ...searchData,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Preferred Time
                        </label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
                          value={searchData.time}
                          required={true}
                          onChange={(e) =>
                            setSearchData({
                              ...searchData,
                              time: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      ref={searchRef}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search Companions
                    </Button>
                  </motion.form>
                </div>

                {/* Search Results */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4">
                    Available Travel Companions
                  </h3>
                  <div className="space-y-4">
                    {Companions || Companions.length > 0 ? (
                      Companions.map((companion, index) =>
                        companion.user ? (
                          <motion.div
                            key={index}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            initial={{ opacity: 0, translateY: "-20%" }}
                            whileInView={{
                              opacity: 1,
                              translateY: "0",
                              transition: {
                                duration: 0.6,
                                ease: "easeOut",
                              },
                            }}
                            viewport={{ once: true }}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              <div className="flex items-start gap-3 sm:gap-4">
                                <img
                                  src="/profile.svg"
                                  alt={
                                    companion.user.firstName +
                                    companion.user.lastName
                                  }
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-sm sm:text-base truncate">
                                      {companion.user.firstName +
                                        companion.user.lastName}
                                    </h4>
                                    {companion.user.isVerified && (
                                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                    Status : {companion.journey.status}
                                  </p>
                                  {/* <div className="flex items-center gap-1 mb-2">
                                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                                  <span className="text-xs sm:text-sm">
                                    {companion.rating}
                                  </span>
                                  <span className="text-xs sm:text-sm text-gray-500">
                                    ({companion.reviews} reviews)
                                  </span>
                                </div> */}
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2 text-xs sm:text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                      <div className="truncate flex gap-1">
                                        {companion.journey.from.address}{" "}
                                        <ArrowRight />
                                        {companion.journey.to.address}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                      <span>
                                        {to12HourTime(companion.journey.time)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                                    <span className="text-green-600">
                                      Safety Score: {companion.safetyScore}%
                                    </span>
                                    <span className="text-blue-600">
                                      {companion.mutualConnections} mutual
                                      connections
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 sm:flex-col lg:flex-row">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    startChat(e, companion);
                                  }}
                                  className="flex-1 sm:flex-none"
                                >
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  <span className="hidden sm:inline">
                                    Message
                                  </span>
                                </Button>
                                <Button
                                  size="sm"
                                  className="flex-1 sm:flex-none"
                                >
                                  <Users className="h-4 w-4 mr-1" />
                                  <span className="hidden sm:inline">
                                    Connect
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ) : null
                      )
                    ) : (
                      <h1>No Active Companions</h1>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex h-[calc(100vh-200px)] sm:h-[600px]">
                  {/* Chat List - Hidden on mobile when chat is selected */}
                  <div
                    className={`w-full sm:w-1/3 border-r ${
                      showMobileChat ? "hidden sm:block" : "block"
                    }`}
                  >
                    <div className="p-4 border-b">
                      <h3 className="font-semibold">Messages</h3>
                    </div>
                    <div className="overflow-y-auto h-full">
                      {chats.map((chat) => (
                        <div
                          key={chat._id}
                          onClick={() => handleChatSelect(chat)}
                          className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                            selectedChat?._id === chat._id ? "bg-rose-50" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src="/profile.svg"
                                alt={
                                  chat.receiverName ===
                                  UserData.firstName + " " + UserData.lastName
                                    ? chat.senderName
                                    : chat.receiverName
                                }
                                className="w-10 h-10 rounded-full"
                              />
                              {OnlineUsers.includes(getReceiverId()) && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium truncate text-sm sm:text-base">
                                  {chat.receiverName ===
                                  UserData.firstName + " " + UserData.lastName
                                    ? chat.senderName
                                    : chat.receiverName}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {chat.time ? chat.time : "Just now"}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">
                                {chat.lastMessage}
                              </p>
                            </div>
                            {/* {chat.unread > 0 && (
                              <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {chat.unread}
                              </div>
                            )} */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat Window */}
                  <div
                    className={`flex-1 flex flex-col ${
                      showMobileChat ? "block" : "hidden sm:flex"
                    }`}
                  >
                    {selectedChat ? (
                      <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setShowMobileChat(false)}
                              className="sm:hidden p-1 hover:bg-gray-100 rounded"
                            >
                              <ArrowLeft className="h-5 w-5" />
                            </button>
                            <img
                              src="/profile.svg"
                              alt={
                                selectedChat.receiverName ===
                                UserData.firstName + " " + UserData.lastName
                                  ? selectedChat.senderName
                                  : selectedChat.receiverName
                              }
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <h4 className="font-medium text-sm sm:text-base">
                                {selectedChat.receiverName ===
                                UserData.firstName + " " + UserData.lastName
                                  ? selectedChat.senderName
                                  : selectedChat.receiverName}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-500">
                                {OnlineUsers.includes(getReceiverId())
                                  ? "Online"
                                  : "Offline"}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              className="w-full sm:w-auto"
                              ref={matchedRef}
                              onClick={handleMatched}
                            >
                              Matched
                            </Button>
                          </div>
                        </div>

                        {/* Messages */}
                        <div
                          className="flex-1 overflow-y-auto h-full p-4 space-y-4"
                          ref={messagesEndRef}
                          style={{ scrollBehavior: "smooth" }}
                        >
                          {selectedChat.messages
                            ? selectedChat.messages.map((msg) => (
                                <div
                                  key={msg._id}
                                  className={`flex ${
                                    msg.senderId === UserData.id
                                      ? "justify-end"
                                      : "justify-start"
                                  }`}
                                >
                                  <div
                                    className={`max-w-xs sm:max-w-sm lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                                      msg.senderId === UserData.id
                                        ? "bg-rose-500 text-white"
                                        : "bg-gray-100 text-gray-900"
                                    }`}
                                  >
                                    <p className="text-sm sm:text-base">
                                      {msg.message}
                                    </p>
                                    <p
                                      className={`text-xs mt-1 ${
                                        msg.senderId === UserData.id
                                          ? "text-rose-100"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {to12HourTime(msg.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              ))
                            : ""}
                        </div>

                        {/* Message Input */}
                        <form
                          onSubmit={handleSendMessage}
                          className="p-4 border-t"
                        >
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Type a message..."
                              required={true}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button
                              type="submit"
                              size="sm"
                              ref={MessageButtonRef}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </form>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-sm sm:text-base">
                            Select a conversation to start messaging
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Routes Tab */}
            {activeTab === "routes" && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    My Routes
                  </h2>
                  {/* <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Route
                  </Button> */}
                </div>
                <div className="space-y-4">
                  {UserData.routes.map((route, index) => {
                    return (
                      <div className="border rounded-lg p-4" key={index}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-sm sm:text-base">
                              {route.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {route.from} → {route.to}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Usually active: {route.frequency}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {/* <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 sm:flex-none bg-transparent"
                            >
                              Edit
                            </Button> */}
                            <Button
                              size="sm"
                              className="flex-1 sm:flex-none cursor-pointer bg-green-500"
                              onClick={(e) => {
                                handleRouteSelect(e, route);
                              }}
                            >
                              Activate
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {/* Safety Center Tab */}
            {activeTab === "safety" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">
                    Safety Center
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Emergency Contacts</h3>
                      <div className="space-y-2">
                        {UserData.contacts.map((contact, index) => {
                          return (
                            <div
                              className="flex items-center justify-between p-3 border rounded-lg"
                              key={index}
                            >
                              <div>
                                <p className="font-medium text-sm sm:text-base">
                                  {contact.name}({contact.relation})
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {contact.email}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  handleNotifyContact(e, contact);
                                }}
                              >
                                Notify
                              </Button>
                            </div>
                          );
                        })}
                        {/* <Button
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Emergency Contact
                        </Button> */}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium">Safety Features</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base">
                            Share journey with emergency contacts
                          </span>
                          <input
                            type="checkbox"
                            className="rounded"
                            defaultChecked
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base">
                            Real-time location sharing
                          </span>
                          <input
                            type="checkbox"
                            className="rounded"
                            defaultChecked
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base">
                            Automatic check-in reminders
                          </span>
                          <input type="checkbox" className="rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <h3 className="font-medium mb-4">Safety Tips</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm sm:text-base">
                          Always meet in public places
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Meet your travel companion at well-lit, populated
                          areas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm sm:text-base">
                          Verify identity before traveling
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Check their student ID and profile verification status
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm sm:text-base">
                          Share your journey details
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Let your emergency contacts know your travel plans
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-6">
                  Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Profile Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          defaultValue={
                            UserData.firstName + " " + UserData.lastName
                          }
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Bio
                        </label>
                        <textarea
                          rows={3}
                          defaultValue="Computer Science student who loves to travel safely with fellow students."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">
                      Notification Preferences
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base">
                          New travel companion matches
                        </span>
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base">
                          Message notifications
                        </span>
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base">
                          Journey reminders
                        </span>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Privacy Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base">
                          Show my profile to verified users only
                        </span>
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base">
                          Allow direct messages from anyone
                        </span>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full sm:w-auto">Save Changes</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
