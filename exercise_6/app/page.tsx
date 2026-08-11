"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log(messages);

  return (
    <div className='flex flex-col h-screen'>
      {/* Header */}
      <div className='text-center py-6 border-b'>
        <h1 className='text-3xl font-bold mb-2'>AI SDK v5 Chat</h1>
      </div>

      {/* messages */}
      <div className='flex-1 overflow-y-auto p-6'>
        <div className='max-w-5xl mx-auto space-y-4'>
          {messages.map((message, i) => (
            <div
              key={`${message.id}-${i}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md px-6 py-1 rounded-lg ${message.role === "user" ? "bg-green-900 text-white" : "bg-slate-800 text-white"}`}
              >
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return <div key={`${message.id}-${i}`}>{part.text}</div>;

                    case "tool-weather":
                      if (part.state !== "output-available") {
                        return (
                          <div key={`${message.id}-${i}`}>
                            🌤️ Fetching weather...
                          </div>
                        );
                      }

                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className='mt-2 rounded bg-slate-800 p-3 text-sm mb-1'
                        >
                          <p>🌤️ Weather</p>
                          <p>Location: {part.output.location}</p>
                          <p>Temperature: {part.output.temperature}</p>
                        </div>
                      );

                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput("");
        }}
        className='w-full p-6 mt-5 mx-auto'
      >
        <div className='flex space-x-2'>
          <input
            className='flex-1 p-3 border rounded-lg'
            value={input}
            placeholder='Say something...'
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type='submit'
            disabled={status === "streaming"}
            className='px-4 py-3 bg-rose-500 text-white rounded-lg disabled:opacity-50'
          >
            Send
          </button>
        </div>
      </form>
      <div ref={bottomRef} />
    </div>
  );
}
