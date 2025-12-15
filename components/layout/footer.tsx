"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="w-full border-t py-6 bg-muted/30 mt-auto">
      <div className="container flex flex-col gap-4 md:h-auto px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} Tarımpazar. Tüm hakları saklıdır.
            </p>
            <p className="text-center text-xs text-muted-foreground md:text-left">
              Tarımpazar platformu ve altyapısı <strong>SAFORY GROUP</strong> markasına aittir.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/gizlilik-politikasi" className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4">
              Gizlilik Politikası
            </Link>
            <Link href="/kullanim-sartlari" className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}