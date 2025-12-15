import { Sidebar } from "@/components/layout/sidebar";
import { getCurrentUser } from "@/lib/auth"; // Import getCurrentUser
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser(); // Fetch current user

  // If user is not found, redirect to login
  if (!user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <div className="flex flex-1 w-full">
        <Sidebar user={user} /> {/* Pass user to Sidebar */}
        <main className="flex-1 w-full min-w-0 p-4 md:p-6 bg-muted/10 md:ml-0 pt-16 md:pt-6">
          <div className="w-full max-w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
