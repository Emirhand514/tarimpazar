import { Sidebar } from "@/components/layout/sidebar";
import { getCurrentUser } from "@/lib/auth"; // Import getCurrentUser

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser(); // Fetch current user

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar user={user} /> {/* Pass user to Sidebar */}
        <main className="flex-1 p-6 bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  );
}
