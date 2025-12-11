import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Assuming Avatar component exists or will be created
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Mock Data for conversations
const conversations = [
  {
    id: "conv1",
    partnerName: "Ahmet Yılmaz",
    partnerAvatar: "AY",
    lastMessage: "İlanınızla ilgileniyorum, detayları konuşabilir miyiz?",
    time: "15:30",
    unread: true,
  },
  {
    id: "conv2",
    partnerName: "Ayşe Çiftçi",
    partnerAvatar: "AÇ",
    lastMessage: "Traktör ilanı hakkında bilgi alacaktım.",
    time: "Dün",
    unread: false,
  },
  {
    id: "conv3",
    partnerName: "Mehmet Tüccar",
    partnerAvatar: "MT",
    lastMessage: "Fasulye için teklifim...",
    time: "09 Ara",
    unread: true,
  },
];

// Mock Data for messages in a conversation
const messages = [
  {
    id: "msg1",
    sender: "other",
    content: "Merhaba, ilanınızla ilgileniyorum.",
    time: "15:28",
  },
  {
    id: "msg2",
    sender: "other",
    content: "Detayları konuşabilir miyiz?",
    time: "15:30",
  },
  {
    id: "msg3",
    sender: "me",
    content: "Tabii, yardımcı olabilirim. Hangi ilan için sormuştunuz?",
    time: "15:35",
  },
];

export default function MessagesPage() {
  const selectedConversationId = "conv1"; // Simulate selected conversation

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-120px)] rounded-xl border bg-card overflow-hidden">
      {/* Conversation List (Left Panel) */}
      <div className="flex flex-col w-full md:w-80 border-r bg-background shrink-0">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Mesajlar</h2>
        </div>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Kişi Ara..." className="pl-10 h-10" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <Link key={conv.id} href={`/dashboard/mesajlar?conv=${conv.id}`}>
              <div
                className={`flex items-center gap-3 p-4 border-b hover:bg-muted/50 ${
                  conv.id === selectedConversationId ? "bg-muted/70" : ""
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{conv.partnerAvatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{conv.partnerName}</h3>
                    <span className="text-xs text-muted-foreground">{conv.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unread && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Chat Window (Right Panel) */}
      <div className="flex flex-col flex-1">
        {selectedConversationId ? (
          <>
            <div className="p-4 border-b flex items-center gap-3 bg-background">
              <Avatar className="h-10 w-10">
                <AvatarFallback>AY</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">Ahmet Yılmaz</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-muted/30">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 text-sm ${
                      msg.sender === "me"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground border shadow-sm"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span
                      className={`text-xs mt-1 ${
                        msg.sender === "me"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      } block text-right`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-background flex items-center gap-2">
              <Input placeholder="Mesajınızı yazın..." className="flex-1 h-12" />
              <Button size="icon" className="h-12 w-12">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground text-center">
            <MessageSquare className="h-12 w-12 mb-4" />
            <p>Bir sohbet seçin veya yeni bir sohbet başlatın.</p>
          </div>
        )}
      </div>
    </div>
  );
}
