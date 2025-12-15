"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Check } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonProps {
  listingId: string
  listingTitle: string
}

export default function ShareButton({ listingId, listingTitle }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || "https://tarimpazar.com"
  const shareUrl = `${baseUrl}/ilan/${listingId}`

  const handleShare = async () => {
    // Web Share API'yi dene (mobilde çalışır)
    if (navigator.share) {
      try {
        await navigator.share({
          title: listingTitle,
          text: `Bu ilanı inceleyin: ${listingTitle}`,
          url: shareUrl,
        })
        return
      } catch (error: any) {
        // Kullanıcı paylaşımı iptal ettiyse sessizce devam et
        if (error.name !== "AbortError") {
          console.error("Share error:", error)
        }
      }
    }

    // Fallback: URL'yi panoya kopyala
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success("Link panoya kopyalandı!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Copy to clipboard failed:", error)
      toast.error("Link kopyalanamadı. Lütfen manuel olarak kopyalayın.")
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={handleShare}
      title="Paylaş"
    >
      {copied ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : (
        <Share2 className="h-5 w-5 text-muted-foreground" />
      )}
    </Button>
  )
}

