"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Loader2 } from "lucide-react"
import { createReportAction } from "@/app/actions/report"
import { toast } from "sonner"

interface ReportListingButtonProps {
  reportedUserId: string
  reportedListingId: string
  isLoggedIn: boolean
}

export default function ReportListingButton({ 
  reportedUserId, 
  reportedListingId,
  isLoggedIn 
}: ReportListingButtonProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!reason.trim()) {
      toast.error("Lütfen şikayet sebebini belirtin.")
      return
    }

    startTransition(async () => {
      const result = await createReportAction(reportedUserId, reason, reportedListingId)
      if (result.success) {
        toast.success(result.message)
        setOpen(false)
        setReason("")
      } else {
        toast.error(result.message)
      }
    })
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        İlanı Şikayet Et
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İlanı Şikayet Et</DialogTitle>
            <DialogDescription>
              Bu ilan hakkında şikayette bulunmak için sebebinizi belirtin. 
              Şikayetiniz incelenecek ve gerekli işlemler yapılacaktır.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Şikayet Sebebi</Label>
                <Textarea
                  id="reason"
                  placeholder="Örn: Yanıltıcı bilgi, spam içerik, yasa dışı içerik..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  required
                  disabled={isPending}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  setReason("")
                }}
                disabled={isPending}
              >
                İptal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  "Şikayet Et"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

