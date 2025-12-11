import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Save } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Profil Ayarları</h1>
        <p className="text-muted-foreground">
          Kişisel bilgilerinizi ve hesap tercihlerinizi buradan yönetebilirsiniz.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_300px]">
        {/* Main Form Area */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kişisel Bilgiler</CardTitle>
              <CardDescription>
                Diğer kullanıcıların sizi tanıması için temel bilgilerinizi girin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ad</Label>
                  <Input id="firstName" placeholder="Adınız" defaultValue="Ahmet" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Soyad</Label>
                  <Input id="lastName" placeholder="Soyadınız" defaultValue="Yılmaz" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta Adresi</Label>
                <Input id="email" type="email" placeholder="ornek@email.com" defaultValue="ahmet.yilmaz@tarim.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon Numarası</Label>
                <Input id="phone" type="tel" placeholder="05XX XXX XX XX" defaultValue="0532 123 45 67" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Hakkımda</Label>
                <Textarea
                  id="bio"
                  placeholder="Kendinizden ve yaptığınız işlerden kısaca bahsedin..."
                  className="min-h-[100px]"
                  defaultValue="20 yıldır Konya Ovası'nda buğday ve mısır tarımı yapıyorum. Tecrübeli bir çiftçiyim."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adres Bilgileri</CardTitle>
              <CardDescription>
                İşlerinizin konumu için adres bilgilerinizi güncel tutun.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">İl</Label>
                  <Input id="city" placeholder="Örn: Konya" defaultValue="Konya" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">İlçe</Label>
                  <Input id="district" placeholder="Örn: Karatay" defaultValue="Karatay" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Açık Adres</Label>
                <Textarea id="address" placeholder="Mahalle, Sokak, No..." />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t px-6 py-4">
              <Button size="lg" className="w-full md:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Değişiklikleri Kaydet
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar / Avatar Area */}
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-8 pt-8 text-center">
              <div className="mx-auto relative mb-4 h-32 w-32 rounded-full border-4 border-background bg-primary/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">AY</span>
                <button className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Fotoğraf Yükle</span>
                </button>
              </div>
              <CardTitle>Ahmet Yılmaz</CardTitle>
              <CardDescription>Çiftçi</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Üyelik Tarihi:</span>
                  <span className="font-medium">10 Aralık 2025</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hesap Durumu:</span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                    Aktif
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
