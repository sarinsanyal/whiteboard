"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { socket } from "@/socket";

interface Message {
  sender?: string;
  content: string;
  self?: boolean;
  system?: boolean;
}

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [roomExists, setRoomExists] = useState(false);
  const [users, setUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Set initial state from localStorage or params
  useEffect(() => {
    params.then((data) => {
      const nick = localStorage.getItem("nickname");
      if (!nick) {
        router.push("/");
        return;
      }

      setRoomId(data.id);
      localStorage.setItem("roomId", data.id);
      setNickname(nick);
      localStorage.setItem("hasLeftRoom", "false");
    });
  }, [params, router]);

  // Check if room exists
  useEffect(() => {
    const checkRoom = async () => {
      if (!roomId) return;
      try {
        const res = await fetch(`/api/room/check?roomId=${roomId}`);
        setRoomExists(res.ok);
      } catch (err) {
        console.error("Error checking room:", err);
      } finally {
        setLoading(false);
      }
    };
    checkRoom();
  }, [roomId]);

  // Handle socket events
  useEffect(() => {
    if (!nickname || !roomId) return;

    socket.connect();

    socket.emit("join-room", { room: roomId, username: nickname });

    // Message from other users
    const onMessage = ({ roomId, content, sender }: { sender: string; content: string; roomId: string }) => {
      setMessages((prev) => [...prev, { sender, content, self: sender === nickname }]);
      console.log(roomId);
    };

    // System message: user joined
    const onUserJoined = (message: string) => {
      setMessages((prev) => [...prev, { content: message, system: true }]);
    };

    // System message: user left
    const onUserLeft = (message: string) => {
      setMessages((prev) => [...prev, { content: message, system: true }]);
    };

    const onRoomUsers = (userList: string[]) => {
      setUsers(userList);
    };

    const onConnectError = (err: string) => {
      console.error("Connection error:", err);
      toast.error("Failed to connect to chat server");
    };

    // Register listeners
    socket.on("message", onMessage);
    socket.on("user_joined", onUserJoined);
    socket.on("update-users", onRoomUsers);
    socket.on("user_left", onUserLeft);
    socket.on("connect_error", onConnectError);

    // Cleanup on unmount or re-render
    return () => {
      socket.off("message", onMessage);
      socket.off("user_joined", onUserJoined);
      socket.off("update-users", onRoomUsers);
      socket.off("user_left", onUserLeft);
      socket.off("connect_error", onConnectError);
      socket.disconnect();
    };
  }, [nickname, roomId]);

  //send a message
  const sendMessage = () => {
    const trimmed = messageInput.trim();
    if (!trimmed || !nickname || !roomId) return;

    socket.emit("message", { room: roomId, sender: nickname, message: trimmed });
    setMessages((prev) => [...prev, { sender: nickname, content: trimmed, self: true }]);
    setMessageInput("");
  };

  //leave the room
  const leaveRoom = async () => {
    socket.emit("leave-room", { room: roomId, username: nickname });
    socket.disconnect();
    localStorage.setItem("hasLeftRoom", "true");
    try {
      await fetch("/api/room/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: localStorage.getItem("roomId"),
          sessionId: localStorage.getItem("sessionId"),
        }),
      });
      toast.message(`Left Room: ${roomId}`);
    } catch (err) {
      console.error("Failed to leave room:", err);
    } finally {
      localStorage.removeItem("roomId");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("nickname");
      localStorage.removeItem("admin");
      router.push("/");
    }
  };

  useEffect(() => {
    const warnOnUnload = (e: BeforeUnloadEvent) => {
      if (localStorage.getItem("hasLeftRoom") !== "true") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warnOnUnload);
    return () => window.removeEventListener("beforeunload", warnOnUnload);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold">Loading Room...</h1>
      </div>
    );
  }

  if (!roomExists) {
    setTimeout(() => {
      router.push("/room");
    }, 1000);

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Room Not Found</h1>
          <p className="text-lg text-gray-600">Redirecting you to all rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50 dark:bg-black space-y-4">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row md:justify-between md:items-center text-center md:text-left pt-20 space-y-2 md:space-y-0">
        <h1 className="text-2xl z-1 font-bold">
          Welcome to Room: <AuroraText>{roomId}</AuroraText>
        </h1>
        <h1 className="text-2xl z-1 font-bold">
          Your Nickname: <AuroraText>{nickname}</AuroraText>
        </h1>
        <Button
          className="bg-red-500 cursor-pointer z-1 text-white px-4 py-2 rounded-md"
          onClick={leaveRoom}
        >
          Leave Room
        </Button>
      </div>

      {/* Main content */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-4 flex-grow">
        {/* Chat box */}
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden border z-1 border-gray-200">
          <div className="flex-grow overflow-y-auto p-4 space-y-3 h-[60vh]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.system ? "justify-center" : msg.self ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg break-words ${msg.system
                    ? "bg-gray-300 text-gray-800 text-center"
                    : msg.self
                      ? "bg-blue-500 text-black text-right"
                      : "bg-green-200 text-black text-left"
                    }`}
                >
                  {!msg.system && <p className="font-semibold">{msg.sender}</p>}
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input section */}
          <div className="p-3 border-t border-gray-300 flex items-center gap-2">
            <input
              type="text"
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type a message (use @AI for Gemini) ..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button
              onClick={sendMessage}
              className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-md"
            >
              Send
            </Button>
          </div>
        </div>

        {/* People present */}
        <div className="w-full md:w-1/4 bg-white dark:bg-gray-950 border z-1 border-gray-200 rounded-lg shadow-md p-4 h-[60vh] flex flex-col">
          <h2 className="text-xl font-semibold mb-2">People in Room</h2>
          <ul className="overflow-y-auto space-y-1 text-gray-800 dark:text-gray-200">
            {users.map((user, index) => (
              <li key={index} className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md">
                {user}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

  );
}
