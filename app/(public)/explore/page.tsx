import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Filter, RefreshCw, ArrowRightLeft, Tractor, Briefcase } from "lucide-react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Veritabanından ilanları çeken fonksiyon
async function getListings(searchParams: { [key: string]: string | string[] | undefined }) {
  const search = typeof searchParams.q === "string" ? searchParams.q : undefined;
  // Basit filtreleme mantığı (Geliştirilebilir)
  
  // Ürünleri Çek
  const products = await prisma.product.findMany({
    where: {
      active: true,
      OR: search ? [
        { title: { contains: search } }, // SQLite'da mode: 'insensitive' yok, büyük/küçük harf duyarlı olabilir
        { description: { contains: search } },
        { category: { contains: search } }
      ] : undefined
    },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  // İş İlanlarını Çek
  const jobs = await prisma.jobPosting.findMany({
    where: {
      active: true,
      OR: search ? [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } }
      ] : undefined
    },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return { products, jobs };
}

export default async function ExplorePage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams || {};
  const { products, jobs } = await getListings(searchParams);

  // Listeleri birleştirip formatlayalım
  const allListings = [
    ...products.map((p) => {
        const isBarter = p.description.includes("[TAKAS:");
        // Takas fiyatını açıklamanın başından çekmeye çalışalım veya direkt fiyatı gösterelim
        // Basitlik için: Eğer takas ise fiyat yerine "Takas Teklifi" yazalım veya description'dan parse edelim.
        // Ama şimdilik modelde 'price' sayısal. UI'da özel gösterim yapalım.
        
        return {
            id: `prod-${p.id}`,
            title: p.title,
            price: isBarter ? "Takas Teklifi" : `${p.price} ₺`,
            location: "Konum Bilgisi", // Ürün modelinde konum yoktu, eklenebilir. Şimdilik sabit.
            type: isBarter ? "Takas" : "Ürün",
            image: p.image || (isBarter ? "https://placehold.co/400x300/purple/white?text=Takas" : "https://placehold.co/400x300/green/white?text=Urun"),
            category: p.category,
            isBarter: isBarter,
            userName: p.user.name || "Kullanıcı"
        };
    }),
    ...jobs.map((j) => ({
        id: `job-${j.id}`,
        title: j.title,
        price: `${j.wage} ₺ / Ay`, // veya saatlik
        location: j.location,
        type: "İş İlanı",
        image: "https://placehold.co/400x300/blue/white?text=Is+Ilani",
        category: "İş Gücü",
        isBarter: false,
        userName: j.user.name || "İşveren"
    })),
  ];

  // (Opsiyonel) Client-side filtreleme için form submit işlemi gerekebilir.
  // Şimdilik arama çubuğu bir form içinde olacak ve GET isteği atacak.

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      {/* Header / Search Bar */}
      <div className="sticky top-0 z-40 bg-background border-b px-4 py-4 shadow-sm">
        <div className="container mx-auto flex gap-4 items-center">
          <form className="relative flex-1" action="/explore">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              name="q"
              placeholder="Ne arıyorsunuz? (Traktör, İşçi, Tohum...)" 
              className="pl-10 h-12 text-base"
              defaultValue={typeof searchParams.q === "string" ? searchParams.q : ""}
            />
          </form>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Filter className="h-4 w-4" />
          </Button>
          <Link href="/auth/sign-in">
             <Button className="hidden md:inline-flex">Giriş Yap</Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:flex w-64 flex-col gap-6 shrink-0">
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filtreler
            </h3>
            
            {/* Bu filtreler şu an görsel (dummy), çalışması için URL parametrelerine bağlanmalı */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">İlan Tipi</h4>
              <div className="flex items-center space-x-2">
                <Checkbox id="type-sale" />
                <label htmlFor="type-sale" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Satılık
                </label>
              </div>
               <div className="flex items-center space-x-2">
                <Checkbox id="type-barter" className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" />
                <label htmlFor="type-barter" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1 font-semibold text-purple-700">
                  <RefreshCw className="h-3 w-3" /> Takaslık
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="type-job" />
                <label htmlFor="type-job" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  İş İlanı
                </label>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Kategori Filtresi */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Kategoriler</h4>
              <div className="flex items-center space-x-2">
                <Checkbox id="cat1" />
                <label htmlFor="cat1" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Tahıl & Hububat
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="cat2" />
                <label htmlFor="cat2" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Tarım Ekipmanları
                </label>
              </div>
            </div>

            <Separator className="my-6" />

             <Button className="w-full">Filtreleri Uygula</Button>
          </div>
        </aside>

        {/* Listings Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Güncel İlanlar</h1>
            <span className="text-muted-foreground text-sm">{allListings.length} ilan bulundu</span>
          </div>

          {allListings.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 bg-background rounded-xl border border-dashed">
                <Tractor className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Sonuç Bulunamadı</h3>
                <p className="text-muted-foreground">Aradığınız kriterlere uygun ilan yok.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allListings.map((item) => (
                <Card key={item.id} className={`overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer flex flex-col ${item.isBarter ? 'border-purple-200 shadow-purple-100' : ''}`}>
                    <div className="aspect-video w-full overflow-hidden bg-muted relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={item.image} 
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                        {item.isBarter ? (
                            <Badge className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1">
                                <ArrowRightLeft className="h-3 w-3" /> Takas
                            </Badge>
                        ) : (
                            <Badge className="bg-background/80 text-foreground backdrop-blur-sm hover:bg-background/90">
                                {item.type}
                            </Badge>
                        )}
                    </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                        <h3 className="font-bold text-lg leading-tight line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-1">
                    <div className="flex flex-col gap-2">
                        <p className={`text-lg font-bold ${item.isBarter ? 'text-purple-700' : 'text-primary'}`}>
                            {item.price}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {item.location}
                        </div>
                    </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 mt-auto border-t bg-muted/10 flex justify-between items-center text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" /> {item.userName}
                        </span>
                        <Link href={`/ilan/${item.id}`}>
                          <Button size="sm" className={`h-8 ${item.isBarter ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}`} variant={item.isBarter ? 'default' : 'secondary'}>
                              İncele
                          </Button>
                        </Link>
                    </CardFooter>
                </Card>
                ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
