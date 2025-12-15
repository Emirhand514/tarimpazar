"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Locale } from "@/lib/i18n"

export function LanguageToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const [locale, setLocale] = React.useState<Locale>('tr')

  React.useEffect(() => {
    // Cookie'den locale oku
    const savedLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1] as Locale | undefined
    
    if (savedLocale && (savedLocale === 'tr' || savedLocale === 'en')) {
      setLocale(savedLocale)
    }
  }, [])

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    // Cookie'ye kaydet (30 gün)
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 30}`
    // Sayfayı yenile
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Dil değiştir</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLocale('tr')}>
          <span>🇹🇷 Türkçe</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLocale('en')}>
          <span>🇬🇧 English</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

