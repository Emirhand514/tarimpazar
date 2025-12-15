import { getConversations, getMessages } from "@/app/actions/message";
import ChatView from "./chat-view";
import ConversationList from "./conversation-list";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MessagesPage(props: {
  searchParams?: Promise<{ conv?: string }>;
}) {
  const searchParams = await props.searchParams || {};
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    redirect("/auth/sign-in");
  }

  const conversations = await getConversations();
  const selectedConversationId = searchParams.conv;

  let selectedConversation = null;
  let initialMessages: any[] = [];
  let initialIsBlocked = false;

  if (selectedConversationId) {
    selectedConversation = conversations.find(c => c.id === selectedConversationId);
    if (selectedConversation) {
        initialMessages = await getMessages(selectedConversationId);
        
        // currentUser is guaranteed to exist due to redirect check above
        const block = await prisma.block.findUnique({
            where: {
                blockerId_blockedId: {
                    blockerId: currentUser.id,
                    blockedId: selectedConversation.partner.id
                }
            }
        });
        initialIsBlocked = !!block;
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-120px)] rounded-xl border bg-card overflow-hidden">
      {/* Conversation List (Left Panel) */}
      <ConversationList 
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        currentUserId={currentUser.id}
      />

      {/* Chat Window (Right Panel) */}
      <div className={`flex-col flex-1 ${selectedConversationId ? 'flex' : 'hidden md:flex'}`}>
        {selectedConversation ? (
          <ChatView 
            conversationId={selectedConversation.id} 
            partner={selectedConversation.partner} 
            initialMessages={initialMessages}
            initialIsBlocked={initialIsBlocked}
            isLoggedIn={true} // User is guaranteed to be logged in due to redirect check
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground text-center p-8">
            <div>
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Bir sohbet seçin</p>
                <p className="text-sm">veya ilanlardan "Mesaj Gönder" ile yeni bir sohbet başlatın.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}