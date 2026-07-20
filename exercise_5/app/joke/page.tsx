"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({api: '/api/jokes'});


  console.log(messages)
  

  return (
    <div className='flex flex-col h-screen'>
      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-6'>
        {status === "submitted" && (
          <div className='text-gray-400 justify-end'>AI is thinking...</div>
        )}
        <div className='max-w-4xl mx-auto space-y-4'>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-rose-500 text-white"
                    : " text-white"
                }`}
              >
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <div key={i} className='whitespace-pre-wrap'>
                        {part.text}
                      </div>
                    );
                  }

                  
                  if (part.type === "tool-call") {
                    return (
                      <div key={i} className='text-xs text-amber-400 italic'>
                        Calling {part.fetchDadRandomJoke}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Input at Bottom */}
      <div className=' p-4'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage({ text: input });
            setInput("");
          }}
          className='max-w-4xl mx-auto'
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
              className='px-4 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600'
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
