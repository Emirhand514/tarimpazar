import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Edit, Trash, Eye, MapPin } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

// Veritabanından ilanları çeken fonksiyon
async function getUserListings() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session_user_id")?.value;

  if (!userId) return { products: [], jobs: [] };

  // Ürün ve İş İlanlarını paralel çek
  const [products, jobs] = await Promise.all([
    prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.jobPosting.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { products, jobs };
}

export default async function MyListingsPage() {
  const { products, jobs } = await getUserListings();

  // İki listeyi birleştirip görüntü için formatlayalım
  const allListings = [
    ...products.map((p) => ({
      id: p.id,
      title: p.title,
      price: `${p.price} ₺`,
      location: "Konum Bilgisi", // Şemada location yoktu, description'dan parse edilebilir veya şemaya eklenebilir. Şimdilik sabit.
      status: p.active ? "active" : "passive",
      image: p.image || "https://placehold.co/400x300/e2e8f0/1e293b?text=No+Image",
      date: p.createdAt.toLocaleDateString("tr-TR"),
      type: "product"
    })),
    ...jobs.map((j) => ({
      id: j.id,
      title: j.title,
      price: `${j.wage} ₺`,
      location: j.location,
      status: j.active ? "active" : "passive",
      image: "https://placehold.co/400x300/dbeafe/1e40af?text=Is+Ilani",
      date: j.createdAt.toLocaleDateString("tr-TR"),
      type: "job"
    })),
  ];

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    active: { label: "Yayında", variant: "default" },
    pending: { label: "Onay Bekliyor", variant: "secondary" },
    passive: { label: "Pasif", variant: "outline" },
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">İlanlarım</h1>
          <p className="text-muted-foreground">
            Oluşturduğunuz ilanları buradan takip edebilir ve yönetebilirsiniz.
          </p>
        </div>
        <Link href="/dashboard/ilan-olustur">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Yeni İlan Ekle
          </Button>
        </Link>
      </div>

      {allListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-4">Henüz hiç ilan oluşturmadınız.</p>
            <Link href="/dashboard/ilan-olustur">
                <Button variant="outline">İlk İlanınızı Oluşturun</Button>
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden group flex flex-col">
                <div className="aspect-video w-full overflow-hidden bg-muted relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                    <Badge variant={statusMap[listing.status].variant}>
                        {statusMap[listing.status].label}
                    </Badge>
                </div>
                </div>
                
                <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2">{listing.title}</h3>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Menü</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" /> Görüntüle
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" /> Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash className="mr-2 h-4 w-4" /> İlanı Sil
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                </CardHeader>

                <CardContent className="p-4 pt-0 flex-1">
                <div className="flex flex-col gap-1 mt-2">
                    <span className="text-xl font-bold text-primary">{listing.price}</span>
                    <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {listing.location}
                    </div>
                </div>
                </CardContent>

                <CardFooter className="p-4 border-t bg-muted/20 text-xs text-muted-foreground flex justify-between">
                <span>{listing.type === "job" ? "İş İlanı" : "Ürün"}</span>
                <span>{listing.date}</span>
                </CardFooter>
            </Card>
            ))}
        </div>
      )}
    </div>
  );
}