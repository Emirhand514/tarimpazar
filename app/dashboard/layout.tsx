import Link from "next/link";
import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  Users,
  Tractor,
  LogOut,
  Menu,
} from "lucide-react";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Tractor className="h-6 w-6 text-primary" />
              <span className="text-lg text-foreground">TarımPlatform</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary bg-primary/10 transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Genel Bakış
              </Link>
              <Link
                href="/dashboard/ilanlarim"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
              >
                <Package className="h-4 w-4" />
                İlanlarım
              </Link>
              <Link
                href="/dashboard/mesajlar"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
              >
                <Users className="h-4 w-4" />
                Mesajlar
              </Link>
              <Link
                href="/dashboard/raporlar"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
              >
                <LineChart className="h-4 w-4" />
                Raporlar
              </Link>
              <Link
                href="/dashboard/ayarlar"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                Ayarlar
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4 border-t">
            <Link
              href="/auth/sign-out" // Bu linki uygun bir çıkış rotasına yönlendirin
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-destructive hover:bg-destructive/10 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
        {/* Header for Mobile/Main */}
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6 lg:px-8">
          <Link href="#" className="flex items-center gap-2 font-semibold md:hidden">
            <Tractor className="h-6 w-6 text-primary" />
            <span className="text-lg text-foreground">TarımPlatform</span>
          </Link>
          {/* Mobile Nav Toggle - This would need a client component for state */}
          <button className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </button>
          
          <div className="w-full flex-1">
            {/* Search or other header elements can go here */}
          </div>
          
          <div className="flex items-center gap-4">
            <button className="rounded-full border border-border w-8 h-8 flex items-center justify-center">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Bildirimler</span>
            </button>
            {/* User Avatar - Replace with actual user info */}
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
              U
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
