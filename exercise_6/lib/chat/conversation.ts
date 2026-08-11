import { nanoid } from "nanoid";
import { conversation } from "./../../db/schema";
import { db } from "@/db/drizzle";
import { and, desc, eq } from "drizzle-orm";

export async function createConversation(userId: string, title?: string) {
  const conversationId = nanoid();

  await db.insert(conversation).values({
    id: conversationId,
    title: title || "new conversation",
    userId,
  });

  return conversationId;
}

export async function getUserConversation(userId: string) {
  return await db
    .select()
    .from(conversation)
    .where(eq(conversation.userId, userId))
    .orderBy(desc(conversation.updatedAt));
}

export async function getUserConversationById(
  conversationId: string,
  userId: string,
) {
  const result = await db
    .select()
    .from(conversation)
    .where(
      and(eq(conversation.id, conversationId), eq(conversation.userId, userId)),
    )
    .limit(1);

  const conv = result[0];

  // Fix: Return null if conversation doesn't exist OR user doesn't own it
  if (!conv || conv.userId !== userId) {
    return null;
  }

  return conv;
}
