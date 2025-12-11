import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Filter, RefreshCw, ArrowRightLeft } from "lucide-react";

// Mock Data
const listings = [
  {
    id: 99,
    title: "Yem Karma Makinesi (Takaslık)",
    price: "Takas: 50 Koyun veya Dengi",
    location: "Afyon, Emirdağ",
    type: "Takas",
    image: "https://placehold.co/400x300/purple/white?text=Takas",
    category: "Ekipman",
    isBarter: true
  },
  {
    id: 1,
    title: "Satılık Massey Ferguson 5400",
    price: "2.500.000 ₺",
    location: "Konya, Karatay",
    type: "Ürün",
    image: "https://placehold.co/400x300/green/white?text=Traktor",
    category: "Ekipman",
  },
  {
    id: 2,
    title: "10 Ton Kuru Fasulye",
    price: "45 ₺ / Kg",
    location: "Nevşehir, Derinkuyu",
    type: "Ürün",
    image: "https://placehold.co/400x300/orange/white?text=Fasulye",
    category: "Tahıl & Bakliyat",
  },
  {
    id: 3,
    title: "Deneyimli Biçerdöver Operatörü",
    price: "Günlük 3.000 ₺",
    location: "Adana, Ceyhan",
    type: "İş İlanı",
    image: "https://placehold.co/400x300/blue/white?text=Operator",
    category: "İş Gücü",
  },
  {
    id: 4,
    title: "Satılık 50 Dönüm Tarla",
    price: "1.200.000 ₺",
    location: "Ankara, Polatlı",
    type: "Gayrimenkul",
    image: "https://placehold.co/400x300/brown/white?text=Tarla",
    category: "Emlak",
  },
];

export default function ExplorePage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      {/* Header / Search Bar */}
      <div className="sticky top-0 z-40 bg-background border-b px-4 py-4 shadow-sm">
        <div className="container mx-auto flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Ne arıyorsunuz? (Traktör, İşçi, Tohum...)" 
              className="pl-10 h-12 text-base"
            />
          </div>
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
            
            {/* İlan Tipi Filtresi */}
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
               <div className="flex items-center space-x-2">
                <Checkbox id="cat4" />
                <label htmlFor="cat4" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Hayvancılık
                </label>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Konum Filtresi */}
             <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Konum</h4>
              <Input placeholder="İl veya İlçe Ara..." className="h-9" />
              <div className="flex items-center space-x-2">
                <Checkbox id="loc1" />
                <label htmlFor="loc1" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Konya
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="loc2" />
                <label htmlFor="loc2" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Adana
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
            <span className="text-muted-foreground text-sm">{listings.length} ilan bulundu</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <Card key={item.id} className={`overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer ${item.isBarter ? 'border-purple-200 shadow-purple-100' : ''}`}>
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
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg leading-tight line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
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
                <CardFooter className="p-4 pt-0 mt-2">
                  <Button className={`w-full ${item.isBarter ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}`} variant={item.isBarter ? 'default' : 'secondary'}>
                    Detayları Gör
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}