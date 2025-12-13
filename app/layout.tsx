import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { MasterHeader } from "@/components/layout/master-header";
import { Footer } from "@/components/layout/footer";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Tarım Platformu",
  description: "Tarım sektöründe istihdam ve ticaret platformu",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <MasterHeader user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
        <ShadcnToaster />
      </body>
    </html>
  );
}
