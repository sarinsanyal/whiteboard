"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { socket } from "@/socket";
import Board from "@/components/room/Board";
import Code from "@/components/room/Code";
// import Video from "@/components/room/Video";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React from 'react'

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
  const ref = useChatScroll(messages)

  const [activeTab, setActiveTab] = useState<"Board" | "Code" | "Video">("Board");

  const renderMainView = () => {
    switch (activeTab) {
      case "Board":
        return <Board roomId={roomId ?? ""} nickname={nickname ?? ""} />;
      case "Code":
        return <Code roomId={roomId ?? ""} nickname={nickname ?? ""} />;
      // case "Video":
      //   return <Video roomId={roomId ?? ""} nickname={nickname ?? ""} />;
      default:
        return null;
    }
  };

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

    const onMessage = ({ roomId, content, sender }: { sender: string; content: string; roomId: string }) => {
      setMessages((prev) => [...prev, { sender, content, self: sender === nickname }]);
      console.log(roomId);
    };

    const onUserJoined = (message: string) => {
      setMessages((prev) => [...prev, { content: message, system: true }]);
    };

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

  // useEffect(() => {
  //   const warnOnUnload = (e: BeforeUnloadEvent) => {
  //     if (localStorage.getItem("hasLeftRoom") !== "true") {
  //       e.preventDefault();
  //       e.returnValue = "";
  //     }
  //   };
  //   window.addEventListener("beforeunload", warnOnUnload);
  //   return () => window.removeEventListener("beforeunload", warnOnUnload);
  // }, []);

  function useChatScroll<T>(dep: T): React.MutableRefObject<HTMLDivElement | null> {
    const ref = React.useRef<HTMLDivElement | null>(null);
    React.useEffect(() => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, [dep]);
    return ref;
  }

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
    <div className="flex flex-col items-center min-h-screen p-4 pt-20 bg-gray-50 dark:bg-black space-y-4">
      {/* Header */}
      <div className="w-full max-w-7xl flex flex-col bg-white dark:bg-gray-950 z-1 p-5 shadow-md border rounded-lg border-gray-100 md:flex-row md:justify-between md:items-center text-center md:text-left space-y-2 md:space-y-0">
        <h1 className="text-2xl z-1 font-bold">
          Welcome to Room: <AuroraText>{roomId}</AuroraText>
        </h1>
        <h1 className="text-2xl z-1 font-bold">
          Your Nickname: <AuroraText>{nickname}</AuroraText>
        </h1>
        {/* Present Members: */}
        <Popover>
          <PopoverTrigger asChild>
            <Button className="cursor-pointer z-1 bg-green-800 dark:bg-green-800 text-white px-4 py-2 rounded-md" variant="outline">See Members Present: {users.length}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <ul className="overflow-y-auto space-y-1 text-gray-800 dark:text-gray-200">
                {users.map((user, index) => (
                  <li key={index} className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md">
                    {user}
                  </li>
                ))}
              </ul>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          className="bg-red-500 cursor-pointer z-1 text-white px-4 py-2 rounded-md"
          onClick={leaveRoom}
        >
          Leave Room
        </Button>
      </div>

      {/* Main content */}
      <div className="w-full min-h-screen max-w-7xl flex flex-col md:flex-row gap-4 flex-grow">
        <div className="flex flex-col md:w-3/4 flex-grow bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden border z-1 border-gray-200">
          <div className="flex justify-center border border-gray-100 gap-4 p-5">
            <Button
              onClick={() => setActiveTab("Board")}
              variant={activeTab === "Board" ? "default" : "outline"}
              className="text-xs md:text-sm cursor-pointer"
            >
              Whiteboard
            </Button>
            <Button
              onClick={() => setActiveTab("Code")}
              variant={activeTab === "Code" ? "default" : "outline"}
              className="text-xs md:text-sm cursor-pointer"
            >
              Code Editor
            </Button>
            {/* <Button
              onClick={() => setActiveTab("Video")}
              variant={activeTab === "Video" ? "default" : "outline"}
              className="text-xs md:text-sm cursor-pointer"
            >
              Video Call
            </Button> */}
          </div>

          <div className="flex-grow text-center bg-white dark:bg-gray-950 rounded-lg shadow-md p-4 overflow-hidden">
            {renderMainView()}
          </div>
        </div>
        {/* Chat box */}
        <div className="flex md:w-1/4 flex-col flex-grow bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden border z-1 border-gray-200">
          <div className="flex-grow overflow-y-auto space-y-3 h-[60vh]" ref={ref}>
            <div className="border border-gray-100 font-medium p-5 pb-3 text-center">
              Chat with other Members!
              <div className="text-gray-400 text-sm">
                Use @AI to chat with AI Assistant
              </div>
            </div>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex px-2 py-0 ${msg.system ? "justify-center" : msg.self ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg break-words ${msg.system
                    ? "bg-gray-300 text-gray-800 text-center"
                    : msg.self
                      ? "bg-blue-500 dark:bg-blue-900 text-black dark:text-white text-right"
                      : "bg-green-500 dark:bg-green-900 text-black dark:text-white text-left"
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
              className="flex-grow w-3/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type a message..."
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

      </div>
    </div>

  );
}
