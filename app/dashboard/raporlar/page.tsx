import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DollarSign, MessageSquare, Package, Eye } from "lucide-react";
// Placeholder for a potential chart library, e.g., Recharts, Nivo, or just static images
// import { LineChart, BarChart } from 'recharts';

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Raporlar ve İstatistikler</h1>
        <p className="text-muted-foreground">
          Platformdaki faaliyetlerinizin özetini buradan görüntüleyebilirsiniz.
        </p>
      </div>

      {/* Genel Metrikler */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam İlan</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              4 tanesi aktif
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Görüntülenme</CardTitle>
            <Eye className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1,234</div>
            <p className="text-xs text-muted-foreground">
              Geçen aydan %15 daha fazla
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yeni Mesajlar</CardTitle>
            <MessageSquare className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              Bugün 2 yeni mesaj
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kazanç (Tahmini)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺25.500</div>
            <p className="text-xs text-muted-foreground">
              Bu yılki tüm satışlardan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grafik Alanları (Placeholder) */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>İlan Durumu Dağılımı</CardTitle>
            <CardDescription>Aktif, bekleyen ve satılan ilanlarınızın oranı.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Gerçek grafik buraya gelecek */}
            <div className="flex items-center justify-center h-48 bg-muted/30 rounded-lg text-muted-foreground">
              Grafik Alanı (Pie Chart)
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Aylık İlan Görüntülemeleri</CardTitle>
            <CardDescription>İlanlarınızın aylık görüntülenme trendi.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Gerçek grafik buraya gelecek */}
            <div className="flex items-center justify-center h-48 bg-muted/30 rounded-lg text-muted-foreground">
              Grafik Alanı (Line Chart)
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Son İlan Faaliyetleri</CardTitle>
          <CardDescription>Yakın zamandaki ilan hareketleri.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Basit bir faaliyet listesi */}
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>- "Satılık Traktör" ilanı 10 yeni görüntüleme aldı. (5 dakika önce)</li>
            <li>- "Kuru Fasulye" ilanınız için yeni mesaj var. (1 saat önce)</li>
            <li>- "Satılık Mibzer" ilanı onaylandı ve yayına alındı. (Dün)</li>
          </ul>
        </CardContent>
      </Card>

    </div>
  );
}
