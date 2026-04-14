import { useState } from "react";
import api from "../api/axios";

const AIChatbot = () => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [messages, setMessages] = useState([
    {
      role:    "assistant",
      content: "Hi! I'm SafeNest AI 🌍 Ask me anything about travel or say something like 'beach holiday under $1000' for recommendations!",
    }
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/api/ai/chat/", {
        message: input,
        history: messages.slice(-6),
      });
      setMessages([
        ...updated,
        { role: "assistant", content: res.data.message }
      ]);
    } catch (error) {
      setMessages([
        ...updated,
        {
          role:    "assistant",
          content: "Sorry, I am having trouble connecting. Please try again later.",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-teal-700 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-sm">
                🤖
              </div>
              <div>
                <p className="text-white text-sm font-semibold">SafeNest AI</p>
                <p className="text-teal-200 text-xs">Travel Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-teal-200 text-lg font-bold"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 bg-gray-50">
            {messages.map(function(msg, i) {
              return (
                <div
                  key={i}
                  className={
                    "flex " +
                    (msg.role === "user" ? "justify-end" : "justify-start")
                  }
                >
                  <div
                    className={
                      "max-w-xs px-3 py-2 rounded-2xl text-sm " +
                      (msg.role === "user"
                        ? "bg-teal-700 text-white rounded-br-sm"
                        : "bg-white text-gray-700 border border-gray-200 rounded-bl-sm shadow-sm")
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-2 bg-white border-t border-gray-100">
            <div className="flex gap-1 flex-wrap">
              {["Beach holiday 🏖️", "Budget flights ✈️", "Luxury hotels 🏨"].map(function(suggestion) {
                return (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full hover:bg-teal-100 transition-colors border border-teal-100"
                  >
                    {suggestion}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-teal-700 text-white px-3 py-2 rounded-xl hover:bg-teal-800 transition-colors disabled:bg-teal-300 text-sm font-medium"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-teal-700 hover:bg-teal-800 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110"
      >
        {isOpen ? "×" : "🤖"}
      </button>
    </div>
  );
};

export default AIChatbot;