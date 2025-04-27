"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { Message } from "../types";
import useStreamText from "@/hooks/useStreamText";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>(
    "Hello! I'm your personal AI fitness trainer. How can I help you today?"
  );
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const { streamedText, isStreaming } = useStreamText(text);

  useEffect(() => {

    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("fitnessCoachUserId");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        const newUserId = "user_" + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("fitnessCoachUserId", newUserId);
        setUserId(newUserId);
      }

      setMessages([
        {
          role: "assistant",
          content:
            "Hello! I'm your personal AI fitness trainer. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, []);
  console.log("isStreaming", isStreaming);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !userId) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date().toISOString(),
      },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          userId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error communicating with server");
      }

      const data = await response.json();

      // Add trainer response to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date().toISOString(),
        },
      ]);
      setText(data.response);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, an error occurred. Please try again later.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Head>
        <title>AI Fitness Trainer</title>
        <meta
          name="description"
          content="AI-powered fitness trainer that remembers your history"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700 p-4">
          AI Fitness Trainer
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-[80%] ${
                  message.role === "assistant"
                    ? "bg-blue-100 text-gray-800 ml-auto"
                    : "bg-gray-100 text-gray-800 mr-auto"
                }`}
              >
                {message.role === "assistant" && index === messages.length - 1
                  ? streamedText
                  : message.content}
              </div>
            ))}
            {isLoading && (
              <div className="p-3 bg-blue-100 rounded-lg max-w-[80%] ml-auto text-gray-800">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your trainer..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                disabled={isLoading || isStreaming}
              >
                Send
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-gray-700 text-sm">
          <p className="font-medium">Example messages:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>
              I am 35 years old, I weigh 80 kilograms and my height is 175
              centimeters
            </li>
            <li>I worked out today running for 30 minutes</li>
            <li>I worked out yesterday with weights for 45 minutes</li>
            <li>What exercises should I do to strengthen my back?</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
