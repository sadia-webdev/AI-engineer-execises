"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/database",
    }),
  });

  console.log(messages);

  return (
    <div className='flex flex-col h-screen'>


      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-6'>
        <div className='max-w-4xl mx-auto space-y-4'>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xl px-4 py-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-green-700 text-white"
                    : "bg-gray-800 text-white"
                }`}
              >
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <div key={index} className='whitespace-pre-wrap'>
                        {part.text}
                      </div>
                    );
                  }

                  if (part.type === "tool-FetchMovies") {
                    return (
                      <div key={index} className='mt-2'>
                        <h3 className='font-bold text-amber-400'>
                          Movies from database:
                        </h3>

                        <pre className='text-sm whitespace-pre-wrap overflow-auto'>
                          {JSON.stringify(part.output, null, 2)}
                        </pre>
                      </div>
                    );
                  }

                  if (part.type === "tool-FetchUsers") {
                    return (
                      <div key={index} className='mt-2'>
                        <h3 className='font-bold text-blue-400'>
                          Users from database:
                        </h3>

                        <pre className='text-sm whitespace-pre-wrap overflow-auto'>
                          {JSON.stringify(part.output, null, 2)}
                        </pre>
                      </div>
                    );
                  }

                  if (part.type === "tool-CountMoviesByGenre") {
                    return (
                      <div key={index} className='mt-2'>
                        <h3 className='font-bold text-purple-400'>
                          Movies by genre:
                        </h3>

                        <pre className='text-sm whitespace-pre-wrap overflow-auto'>
                          {JSON.stringify(part.output, null, 2)}
                        </pre>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}

          {/* Loading state */}
          {status === "submitted" && (
            <div className='text-gray-400'>AI is thinking...</div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className='border-t p-4'>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!input.trim()) return;

            sendMessage({
              text: input,
            });

            setInput("");
          }}
          className='max-w-4xl mx-auto'
        >
          <div className='flex gap-2'>
            <input
              className='flex-1 p-3 border rounded-full'
              value={input}
              placeholder='Ask about your database...'
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              type='submit'
              disabled={status === "submitted"}
              className='px-4 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50'
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
