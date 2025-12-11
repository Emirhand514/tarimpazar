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

// Mock Data for User's Listings
const myListings = [
  {
    id: 1,
    title: "Satılık Massey Ferguson 5400",
    price: "2.500.000 ₺",
    location: "Konya, Karatay",
    status: "active", // active, pending, sold
    image: "https://placehold.co/400x300/green/white?text=Traktor",
    views: 124,
    date: "10 Ara 2025"
  },
  {
    id: 2,
    title: "10 Ton Kuru Fasulye",
    price: "45 ₺ / Kg",
    location: "Nevşehir, Derinkuyu",
    status: "pending",
    image: "https://placehold.co/400x300/orange/white?text=Fasulye",
    views: 0,
    date: "11 Ara 2025"
  },
  {
    id: 3,
    title: "2023 Model Mibzer",
    price: "150.000 ₺",
    location: "Konya, Selçuklu",
    status: "sold",
    image: "https://placehold.co/400x300/gray/white?text=Mibzer",
    views: 850,
    date: "01 Kas 2025"
  },
];

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Yayında", variant: "default" },
  pending: { label: "Onay Bekliyor", variant: "secondary" },
  sold: { label: "Satıldı / Pasif", variant: "outline" },
};

export default function MyListingsPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {myListings.map((listing) => (
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
              <span>{listing.views} Görüntülenme</span>
              <span>{listing.date}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
