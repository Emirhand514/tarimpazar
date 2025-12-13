"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, MessageSquare, Settings, LogOut, BarChart3, ShoppingBag, Users, Flag, FileStack, Megaphone, Mail } from "lucide-react"; // Import Mail
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Genel Bakış", href: "/dashboard" },
  { icon: ShoppingBag, label: "Market", href: "/explore" },
  { icon: FileText, label: "İlanlarım", href: "/dashboard/ilanlarim" },
  { icon: MessageSquare, label: "Mesajlar", href: "/dashboard/mesajlar" },
  { icon: BarChart3, label: "Raporlar", href: "/dashboard/raporlar" },
  { icon: Settings, label: "Ayarlar", href: "/dashboard/ayarlar" },
];

type UserType = {
    id: string;
    name: string | null;
    email: string;
    role: string;
    image: string | null;
    unreadNotificationCount?: number;
} | null;

export function Sidebar({ user }: { user: UserType }) { // Accept user prop
  const pathname = usePathname();

  const dynamicSidebarItems = [...sidebarItems]; // Create a mutable copy

  // Conditionally add Admin links
  if (user && user.role === "ADMIN") {
    const settingsIndex = dynamicSidebarItems.findIndex(item => item.label === "Ayarlar");
    const reportsItem = {
        icon: Flag,
        label: "Kullanıcı Şikayetleri",
        href: "/dashboard/reports",
    };
    const userQueryItem = {
        icon: Users,
        label: "Kullanıcı Sorgu",
        href: "/dashboard/users",
    };
    const listingsAdminItem = {
        icon: FileStack,
        label: "İlan Yönetimi",
        href: "/dashboard/admin/listings",
    };
    const announcementsAdminItem = {
        icon: Megaphone,
        label: "Duyurular",
        href: "/dashboard/admin/announcements",
    };
    const bulkMessagesAdminItem = {
        icon: Mail,
        label: "Toplu Mesaj Gönder",
        href: "/dashboard/admin/bulk-messages",
    };


    if (settingsIndex !== -1) {
        // Insert in reverse order to maintain correct final positions with splice
        dynamicSidebarItems.splice(settingsIndex, 0, reportsItem);
        dynamicSidebarItems.splice(settingsIndex, 0, userQueryItem);
        dynamicSidebarItems.splice(settingsIndex, 0, bulkMessagesAdminItem); // New item
        dynamicSidebarItems.splice(settingsIndex, 0, announcementsAdminItem);
        dynamicSidebarItems.splice(settingsIndex, 0, listingsAdminItem);
    } else {
        // Fallback: if "Ayarlar" is not found, just push to the end
        dynamicSidebarItems.push(listingsAdminItem);
        dynamicSidebarItems.push(announcementsAdminItem);
        dynamicSidebarItems.push(bulkMessagesAdminItem); // New item
        dynamicSidebarItems.push(userQueryItem);
        dynamicSidebarItems.push(reportsItem);
    }
  }

  return (
    <aside className="w-64 bg-white border-r hidden md:flex flex-col min-h-screen shrink-0">
      <nav className="flex-1 p-4 space-y-1">
        {dynamicSidebarItems.map((item) => { // Use dynamicSidebarItems
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start ${isActive ? "bg-emerald-50 text-emerald-700" : "text-muted-foreground"}`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}