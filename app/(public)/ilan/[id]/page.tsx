import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // AvatarImage de eklendi
import { PrismaClient } from "@prisma/client";
import { MapPin, Calendar, User, MessageSquare, ArrowLeft, Share2, AlertTriangle, RefreshCw } from "lucide-react";
import { notFound } from "next/navigation";
import MessageButton from "./message-button"; // Doğru import edildi

const prisma = new PrismaClient();

async function getListingDetail(id: string) {
  // ID formatı: "prod-clps..." veya "job-clps..."
  const [type, realId] = id.split("-");

  if (!realId) return null;

  if (type === "prod") {
    const product = await prisma.product.findUnique({
      where: { id: realId },
      include: { user: true }
    });
    if (!product) return null;
    return { ...product, type: "product" as const };
  } 
  
  if (type === "job") {
    const job = await prisma.jobPosting.findUnique({
      where: { id: realId },
      include: { user: true }
    });
    if (!job) return null;
    return { ...job, type: "job" as const };
  }

  return null;
}

export default async function ListingDetailPage(props: { params: { id: string } }) { // Promise'i kaldırdım, direkt id
  const params = props.params;
  const listing = await getListingDetail(params.id);

  if (!listing) {
    notFound();
  }

  const isBarter = listing.type === "product" && listing.description.includes("[TAKAS:");
  // @ts-ignore - Prisma tipleri dynamic return ile bazen karışabilir, basitleştiriyoruz
  const price = listing.type === "product" ? listing.price : listing.wage;
  // @ts-ignore
  const location = listing.type === "product" ? "Konum Bilgisi Alınamadı" : listing.location;
  // @ts-ignore
  const image = listing.type === "product" && listing.image ? listing.image : 
                (listing.type === "job" ? "https://placehold.co/800x600/blue/white?text=Is+Ilani" : 
                "https://placehold.co/800x600/green/white?text=Urun");

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-6">
          <Link href="/explore" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            İlanlara Dön
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image Gallery (Single Image for now) */}
            <div className="rounded-2xl overflow-hidden bg-background border shadow-sm aspect-video relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={image} 
                alt={listing.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                 {isBarter ? (
                    <Badge className="bg-purple-600 text-white border-purple-600 px-3 py-1 text-sm">
                        <RefreshCw className="mr-1 h-3 w-3" /> Takas Teklifi
                    </Badge>
                 ) : (
                    <Badge className="bg-background/90 text-foreground backdrop-blur px-3 py-1 text-sm">
                        {listing.type === "job" ? "İş İlanı" : "Satılık"}
                    </Badge>
                 )}
              </div>
            </div>

            {/* Title & Description */}
            <div className="bg-card rounded-2xl p-6 md:p-8 border shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                        {listing.title}
                    </h1>
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <Share2 className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" /> {location}
                    </span>
                    <span className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" /> {listing.createdAt.toLocaleDateString("tr-TR")}
                    </span>
                </div>

                <Separator />

                <div className="prose prose-stone max-w-none dark:prose-invert">
                    <h3 className="text-lg font-semibold mb-2">Açıklama</h3>
                    <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                        {listing.description}
                    </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-6">
            
            {/* Price Card */}
            <Card className="border-none shadow-md overflow-hidden">
                <div className={`p-6 ${isBarter ? 'bg-purple-600 text-white' : 'bg-primary text-primary-foreground'}`}>
                    <p className="text-sm opacity-90 mb-1">
                        {isBarter ? "Takas Değeri / Koşulu" : "Fiyat"}
                    </p>
                    <p className="text-3xl font-bold tracking-tight">
                        {isBarter ? "Teklif Usulü" : `${price} ₺`}
                    </p>
                </div>
                <CardContent className="p-6 grid gap-3">
                    <MessageButton receiverId={listing.userId} listingTitle={listing.title} />
                    <Button variant="outline" className="w-full">
                        İlan Sahibini Ara
                    </Button>
                </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                            <AvatarImage src={listing.user.image || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                                {listing.user.name ? listing.user.name.substring(0,2).toUpperCase() : "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-lg">{listing.user.name || "Kullanıcı"}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                                {listing.user.role?.toLowerCase() || "Üye"}
                            </p>
                        </div>
                    </div>
                    <Separator className="mb-4" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Üyelik Tarihi: {listing.user.createdAt.toLocaleDateString("tr-TR")}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Safety Tips */}
            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/20 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="font-semibold mb-1">Güvenli Ticaret İpuçları</p>
                    <ul className="list-disc list-inside space-y-1 opacity-90">
                        <li>Ödemeyi ürünü görmeden yapmayın.</li>
                        <li>Kişisel verilerinizi paylaşırken dikkatli olun.</li>
                    </ul>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}