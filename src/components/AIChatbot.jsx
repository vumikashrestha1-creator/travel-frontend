import { useState, useRef, useEffect } from "react";
import api from "../api/axios";

const SUGGESTIONS = [
  { label: "🏖️ Best beach destinations", msg: "What are the best beach destinations for Australians?" },
  { label: "✈️ Cheap flight tips", msg: "How do I find cheap international flights?" },
  { label: "🏨 Hotel booking tips", msg: "What should I look for when booking a hotel?" },
  { label: "🗺️ Bali travel guide", msg: "Give me a travel guide for Bali" },
  { label: "💰 Budget Europe trip", msg: "How much does a 2 week Europe trip cost?" },
  { label: "🛂 Visa tips", msg: "Do Australians need a visa for Japan?" },
  { label: "🎒 Packing tips", msg: "What should I pack for a tropical holiday?" },
  { label: "🍜 Food in Tokyo", msg: "What food should I try in Tokyo?" },
];

const AIChatbot = () => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [messages, setMessages] = useState([
    {
      role:    "assistant",
      content: "Hi! I'm SafeNest AI 🌍 I can help with destination guides, visa info, packing tips, budget planning and more! What would you like to know?",
    }
  ]);
  const [input,      setInput]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [showTips,   setShowTips]   = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async (text) => {
    const msgText = text || input;
    if (!msgText.trim() || loading) return;

    setShowTips(false);
    const userMsg = { role: "user", content: msgText };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/api/ai/chat/", {
        message: msgText,
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
          content: "Sorry, I'm having trouble connecting. Please try again! 🙏",
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

  const handleReset = () => {
    setMessages([{
      role:    "assistant",
      content: "Hi! I'm SafeNest AI 🌍 I can help with destination guides, visa info, packing tips, budget planning and more! What would you like to know?",
    }]);
    setShowTips(true);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ height: "480px" }}>

          {/* Header */}
          <div className="bg-teal-700 px-4 py-3 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-sm">
                🤖
              </div>
              <div>
                <p className="text-white text-sm font-semibold">SafeNest AI</p>
                <p className="text-teal-200 text-xs">Travel Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="text-teal-200 hover:text-white text-xs border border-teal-500 px-2 py-1 rounded-lg transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-teal-200 text-lg font-bold"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">

            {/* Quick suggestion cards — shown at start */}
            {showTips && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 text-center mb-2">Quick questions to get started:</p>
                {SUGGESTIONS.slice(0, 4).map((s) => (
                  <button
                    key={s.label}
                    onClick={() => sendMessage(s.msg)}
                    className="w-full text-left text-xs bg-white border border-teal-100 text-teal-800 px-3 py-2 rounded-xl hover:bg-teal-50 transition-colors shadow-sm"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={"flex " + (msg.role === "user" ? "justify-end" : "justify-start")}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-xs mr-2 shrink-0 mt-1">
                    🤖
                  </div>
                )}
                <div
                  className={
                    "max-w-xs px-3 py-2 rounded-2xl text-sm leading-relaxed " +
                    (msg.role === "user"
                      ? "bg-teal-700 text-white rounded-br-sm"
                      : "bg-white text-gray-700 border border-gray-200 rounded-bl-sm shadow-sm")
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-xs mr-2 shrink-0">
                  🤖
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestion chips */}
          {!showTips && (
            <div className="px-3 py-2 bg-white border-t border-gray-100 shrink-0">
              <div className="flex gap-1 flex-wrap">
                {SUGGESTIONS.slice(4, 7).map((s) => (
                  <button
                    key={s.label}
                    onClick={() => sendMessage(s.msg)}
                    className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full hover:bg-teal-100 transition-colors border border-teal-100"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything about travel..."
              className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-teal-700 text-white px-3 py-2 rounded-xl hover:bg-teal-800 transition-colors disabled:bg-teal-300 text-sm"
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