"use client";

import { useEffect, useState } from "react";
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

  // Set initial state from localStorage or params
  useEffect(() => {
    params.then((data) => {
      const nick = localStorage.getItem("nickname");
      if (!nick) {
        router.push("/");
        return;
      }

      setRoomId(data.id);
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

    socket.on("message", ({ roomId, content, sender, }: { sender: string; content: string; roomId: string }) => {
      console.log(roomId);
      setMessages((prev) => [...prev, { sender, content, self: sender === nickname }]);
    });

    socket.on("user_joined", (message: string) => {
      setMessages((prev) => [...prev, { content: message, system: true }]);
    });

    socket.on("user_left", (message: string) => {
      setMessages((prev) => [...prev, { content: message, system: true }]);
    });

    socket.on("connect_error", (err: string) => {
      console.error("Connection error:", err);
      toast.error("Failed to connect to chat server");
    });

    return () => {
      socket.off("message");
      socket.off("user_joined");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [nickname, roomId]);

  const sendMessage = () => {
    const trimmed = messageInput.trim();
    if (!trimmed || !nickname || !roomId) return;

    socket.emit("message", { room: roomId, sender: nickname, message: trimmed });
    setMessages((prev) => [...prev, { sender: nickname, content: trimmed, self: true }]);
    setMessageInput("");
  };

  const leaveRoom = async () => {
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
    <div className="flex flex-col items-center justify-between min-h-screen p-4 space-y-4">
      <div className="w-full flex flex-col md:flex-row md:justify-between pt-20 md:items-center text-center md:text-left">
        <h1 className="text-2xl font-bold mb-2 md:mb-0 z-1">
          Welcome to Room: <AuroraText>{roomId}</AuroraText>
        </h1>
        <h1 className="text-2xl font-bold z-1">
          Your Nickname: <AuroraText>{nickname}</AuroraText>
        </h1>
        <Button className="bg-red-500 cursor-pointer z-1 mt-4 md:mt-0 w-full md:w-auto" onClick={leaveRoom}>
          Leave Room
        </Button>
      </div>

      <div className="w-full max-w-3xl flex flex-col flex-grow bg-white dark:bg-gray-950 z-1 rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="flex-grow overflow-y-auto p-4 space-y-2 h-[60vh]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.system ? "justify-center" : msg.self ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg ${msg.system
                  ? "bg-gray-300 text-gray-800 text-center"
                  : msg.self
                    ? "bg-blue-300 text-right text-black"
                    : "bg-green-200 text-left text-black"
                  }`}
              >
                {!msg.system && <p className="font-bold">{msg.sender}</p>}
                <p>{msg.content}</p>
              </div>
            </div>
          ))}

        </div>

        {/* Message input */}
        <div className="p-3 border-t border-gray-300 flex items-center gap-2">
          <input
            type="text"
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage} className="bg-blue-500 cursor-pointer text-white">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
