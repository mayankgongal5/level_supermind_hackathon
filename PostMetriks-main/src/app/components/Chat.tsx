"use client";

import { useState, useEffect, useRef } from "react";
import { Moon, Sun, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputValue: input }),
      });

      const data = await response.json();
      console.log("API Response in frontend:", data);

      const botMessageText = data.message || "No response";
      const botMessage: Message = { text: botMessageText, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error communicating with server", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 ${
        isDarkMode ? "dark" : ""
      }`}
      style={{
        background: isDarkMode
          ? "linear-gradient(135deg, #1e293b, #0f172a)"
          : "linear-gradient(135deg, #a7c5eb, #f3eac2)",
        transition: "background 0.5s ease",
      }}
    >
      <Card
        className="w-full max-w-4xl h-[80vh] shadow-2xl rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: isDarkMode ? "#1e293b" : "#ffffff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          transition: "background 0.5s ease, box-shadow 0.5s ease",
        }}
      >
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h1
              className="text-3xl font-extrabold"
              style={{
                color: isDarkMode ? "#e2e8f0" : "#1e293b",
                transition: "color 0.5s ease",
              }}
            >
              PostMetriks
            </h1>
            <div className="flex items-center space-x-2">
              <Sun
                className="h-5 w-5"
                style={{ color: isDarkMode ? "#94a3b8" : "#f59e0b" }}
              />
              <Switch
                checked={isDarkMode}
                onCheckedChange={() => setIsDarkMode(!isDarkMode)}
              />
              <Moon
                className="h-5 w-5"
                style={{ color: isDarkMode ? "#f9fafb" : "#475569" }}
              />
            </div>
          </div>
          <div
            className="flex-grow overflow-y-auto mb-6 space-y-4 p-4 sm:p-6"
            style={{
              background: isDarkMode ? "#334155" : "#f1f5f9",
              borderRadius: "16px",
              boxShadow: "inset 0 2px 15px rgba(0, 0, 0, 0.1)",
              transition: "background 0.5s ease, box-shadow 0.5s ease",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-3xl shadow-md ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <ReactMarkdown className="prose dark:prose-invert max-w-none">
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-3xl shadow-md flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  <span className="text-gray-900 dark:text-gray-100">
                    Thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex space-x-2 mt-auto">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !isLoading && sendMessage()
              }
              className="flex-grow p-4 rounded-xl text-base"
              style={{
                border: "2px solid rgba(0, 0, 0, 0.1)",
                background: isDarkMode ? "#2d3748" : "#ffffff",
                color: isDarkMode ? "#e2e8f0" : "#1e293b",
                transition:
                  "background 0.5s ease, border 0.5s ease, color 0.5s ease",
              }}
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              className="px-6 py-4 text-lg font-bold rounded-xl transition-all duration-300 ease-in-out"
              style={{
                background: isDarkMode ? "#3b82f6" : "#2563eb",
                color: "#ffffff",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
