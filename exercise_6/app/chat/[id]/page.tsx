import Chat from "@/components/Chat";
import { auth } from "@/lib/auth";
import {
  getUserConversationById,
  loadChat,
  getUserConversation,
} from "@/lib/chat";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: PageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const conversations = await getUserConversation(session.user.id);

  const conversation = await getUserConversationById(id, session.user.id);

  // if(!conversation){
  //   redirect("/chat")
  // }

  const initialMessages = await loadChat(id);

  return (
    <Chat
      conversationId={id}
      initialMessages={initialMessages}
      conversationTitle='new chat'
      conversations={conversations}
    />
  );
}
