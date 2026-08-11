import { google } from "@ai-sdk/google";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createIdGenerator,
  validateUIMessages,
} from "ai";
import { auth } from "@/lib/auth";
import { loadChat, saveChat, getUserConversationById } from "@/lib/chat";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Get the authenticated session
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Following AI SDK best practices: expect either full messages or single message
    const body = await req.json();
    const { messages, message: singleMessage, id: conversationId } = body;

    if (!conversationId) {
      return new Response("Conversation ID is required", { status: 400 });
    }

    // Validate conversation ownership
    const conversation = await getUserConversationById(
      conversationId,
      session.user.id,
    );
    if (!conversation) {
      return new Response("Conversation not found", { status: 404 });
    }

    let allMessages: UIMessage[];

    if (singleMessage) {
      // Following Vercel guide: load previous messages and append new one
      const previousMessages = await loadChat(conversationId);
      allMessages = [...previousMessages, singleMessage];
    } else if (messages) {
      // Fallback: use all messages (less efficient)
      allMessages = messages;
    } else {
      return new Response("No messages provided", { status: 400 });
    }

    // Validate messages following Vercel guide
    let validatedMessages: UIMessage[];
    try {
      validatedMessages = await validateUIMessages({
        messages: allMessages,
        // Add tools, metadataSchema, dataPartsSchema here if needed
      });
    } catch (error) {
      console.error("Message validation failed:", error);
      // For now, use messages as-is, but log the error
      validatedMessages = allMessages;
    }


    const modelMessages = await convertToModelMessages(validatedMessages);

    console.log("validatedMessages:", validatedMessages);
    console.log("modelMessages:", modelMessages);
    console.log("is array:", Array.isArray(modelMessages));

    // Stream the AI response with proper persistence following Vercel guide
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system:
        "You are a helpful AI assistant. Be concise and helpful in your responses.",
      messages: await convertToModelMessages(validatedMessages),
    });

    // Use consumeStream to handle client disconnects (Vercel guide recommendation)
    // Note: consumeStream() is called without await to not block the response
    result.consumeStream();

    console.log(
      "About to return stream response with originalMessages:",
      validatedMessages.length,
    );

    return result.toUIMessageStreamResponse({
      originalMessages: validatedMessages,
      generateMessageId: createIdGenerator({ prefix: "msg", size: 16 }),
      onError: (error) => {
        console.error("Stream error:", error);
        return error instanceof Error ? error.message : String(error);
      },
      onFinish: async ({ messages }) => {
        const last = messages[messages.length - 1];
        const hasText = last?.parts?.some(
          (p) => p.type === "text" && p.text.trim().length > 0,
        );
        if (last?.role === "assistant" && !hasText) {
          console.error("Skipping save: assistant produced no content");
          return;
        }
        await saveChat({ chatId: conversationId, messages });
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
