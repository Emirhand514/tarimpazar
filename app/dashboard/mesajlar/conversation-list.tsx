"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash2, MoreVertical, MessageSquare, AlertTriangle } from "lucide-react"
import { deleteConversationAction, clearAllConversationsAction } from "@/app/actions/message"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Conversation {
  id: string
  partner: {
    id: string
    name: string | null
    image: string | null
  }
  lastMessage: {
    content: string
    createdAt: Date
    isRead: boolean
    senderId: string
  } | null
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversationId: string | undefined
  currentUserId: string
}

export default function ConversationList({ conversations, selectedConversationId, currentUserId }: ConversationListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false)
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null)

  const handleDeleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedConvId(conversationId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteConversation = () => {
    if (!selectedConvId) return
    
    startTransition(async () => {
      const result = await deleteConversationAction(selectedConvId)
      if (result.success) {
        toast.success(result.message)
        setDeleteDialogOpen(false)
        setSelectedConvId(null)
        router.refresh()
        // Eğer silinen sohbet seçiliyse, sohbet seçimini kaldır
        if (selectedConversationId === selectedConvId) {
          router.push("/dashboard/mesajlar")
        }
      } else {
        toast.error(result.message)
      }
    })
  }

  const handleClearAll = () => {
    setClearAllDialogOpen(true)
  }

  const confirmClearAll = () => {
    startTransition(async () => {
      const result = await clearAllConversationsAction()
      if (result.success) {
        toast.success(result.message)
        setClearAllDialogOpen(false)
        router.push("/dashboard/mesajlar")
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <>
      <div className={`flex flex-col w-full md:w-80 border-r bg-background shrink-0 ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Mesajlar</h2>
          {conversations.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={handleClearAll}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" /> Tüm Sohbetleri Temizle
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="p-4">
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input 
              placeholder="Kişi Ara..." 
              className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Henüz hiç mesajınız yok.
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`relative group flex items-center gap-3 p-4 border-b hover:bg-muted/50 transition-colors ${
                  conv.id === selectedConversationId ? "bg-muted/70" : ""
                }`}
              >
                <Link href={`/dashboard/mesajlar?conv=${conv.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conv.partner.image || undefined} />
                    <AvatarFallback>{conv.partner.name ? conv.partner.name.substring(0,2).toUpperCase() : "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold truncate">{conv.partner.name}</h3>
                      <div className="flex items-center gap-2">
                        {conv.lastMessage && !conv.lastMessage.isRead && conv.lastMessage.senderId !== currentUserId && (
                          <span className="h-2 w-2 bg-primary rounded-full" title="Okunmamış mesaj" />
                        )}
                        {conv.lastMessage && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(conv.lastMessage.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm truncate ${conv.lastMessage && !conv.lastMessage.isRead && conv.lastMessage.senderId !== currentUserId ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                      {conv.lastMessage ? conv.lastMessage.content : "Yeni Sohbet"}
                    </p>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                  title="Sohbeti Sil"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Conversation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sohbeti Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu sohbeti kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm mesajlar silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteConversation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Dialog */}
      <AlertDialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tüm Sohbetleri Temizle</AlertDialogTitle>
            <AlertDialogDescription>
              Tüm sohbetlerinizi ve mesajlarınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? "Temizleniyor..." : "Tümünü Temizle"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

