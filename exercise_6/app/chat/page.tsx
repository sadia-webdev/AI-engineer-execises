import { createConversation } from "@/lib/chat";
import { getUser } from "@/server/users";
import { redirect } from "next/navigation";

const NewChatPage = async () => {
  // get the auth user
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  //   create new conversation
  const conversationId = await createConversation(user.user.id);


  redirect(`/chat/${conversationId}`);
};

export default NewChatPage;
