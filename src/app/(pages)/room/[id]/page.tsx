"use client";

import { SetStateAction, useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { AuroraText } from "@/components/magicui/aurora-text";
// import { Card } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { socket } from "@/socket";

interface Message {
  sender: string;
  content: string;
  self: boolean;
}

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [roomExists, setRoomExists] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setNickname(localStorage.getItem("nickname"));
    setSessionId(localStorage.getItem("sessionId"));
    localStorage.setItem("hasLeftRoom", "false");
  }, []);

  useEffect(() => {
    const checkRoom = async () => {
      const nickname = localStorage.getItem("nickname");
      const sessionId = localStorage.getItem("sessionId");
      const roomId = id;

      if (!nickname || !sessionId) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch(`/api/room/check?roomId=${roomId}`);
        if (res.ok) {
          setRoomExists(true);
        } else {
          setRoomExists(false);
        }
      } catch (err) {
        console.error("Error checking room:", err);
        setRoomExists(false);
      } finally {
        setLoading(false);
      }
    };

    checkRoom();
  }, [id, router]);

  useEffect(() => {
    if (socket.connected) onConnect();

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.opts?.transports?.[0] || "N/A");

      socket.io.on("upgrade", (transport: { name: SetStateAction<string> }) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Listen for incoming messages
    socket.on("message", ({ sender, content }: { sender: string; content: string }) => {
      setMessages((prev) => [...prev, { sender, content, self: sender === nickname }]);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message");
    };
  }, [nickname]);

  const sendMessage = () => {
    const trimmed = messageInput.trim();
    if (trimmed && nickname) {
      socket.emit("message", { sender: nickname, content: trimmed });
      setMessages((prev) => [...prev, { sender: nickname, content: trimmed, self: true }]);
      setMessageInput("");
    }
  };

  const leaveRoom = async () => {
    localStorage.setItem("hasLeftRoom", "true");
    const roomId = localStorage.getItem("roomId");
    const sessionId = localStorage.getItem("sessionId");

    if (!roomId || !sessionId) {
      console.error("Missing roomId or sessionId");
      router.push("/");
      return;
    }

    try {
      const res = await fetch("/api/room/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, sessionId }),
      });

      if (res.ok) {
        toast.message(`Successfully Left Room: ${roomId}`);
        localStorage.removeItem("roomId");
        localStorage.removeItem("sessionId");
        localStorage.removeItem("nickname");
        localStorage.removeItem("admin");
        router.push("/");
      } else {
        console.error("Failed to leave room");
      }
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasLeft = localStorage.getItem("hasLeftRoom");
      if (hasLeft !== "true") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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
          Welcome to Room: <AuroraText>{id}</AuroraText>
        </h1>
        <h1 className="text-2xl font-bold z-1">
          Your Nickname: <AuroraText>{nickname}</AuroraText>
        </h1>
        <Button className="bg-red-500 cursor-pointer z-1 mt-4 md:mt-0 w-full md:w-auto" onClick={leaveRoom}>
          Leave Room
        </Button>
      </div>

      {/* Chat box */}
      <div className="w-full max-w-3xl flex flex-col flex-grow bg-white z-1 rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="flex-grow overflow-y-auto p-4 space-y-2 h-[60vh]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.self ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg ${
                  msg.self
                    ? "bg-blue-100 text-right text-black"
                    : "bg-gray-200 text-left text-black"
                }`}
              >
                <p className="font-bold">{msg.sender}</p>
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
          <Button onClick={sendMessage} className="bg-blue-500 text-white">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
