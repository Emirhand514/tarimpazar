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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImagePlus, Upload, X } from "lucide-react"

export default function CreateListingPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Yeni İlan Oluştur</h1>
        <p className="text-muted-foreground">
          Satmak istediğiniz ürünü veya aradığınız iş gücünü binlerce kişiye ulaştırın.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>İlan Detayları</CardTitle>
          <CardDescription>
            İlanınızın doğru kişilere ulaşması için bilgileri eksiksiz doldurun.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* İlan Türü ve Kategori */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>İlan Türü</Label>
              <Select defaultValue="product">
                <SelectTrigger>
                  <SelectValue placeholder="Tür seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Ürün Satışı</SelectItem>
                  <SelectItem value="job">İş İlanı (Eleman Arayan)</SelectItem>
                  <SelectItem value="service">Hizmet (Biçerdöver vb.)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tahil">Tahıl & Hububat</SelectItem>
                  <SelectItem value="sebze">Sebze & Meyve</SelectItem>
                  <SelectItem value="hayvan">Hayvancılık</SelectItem>
                  <SelectItem value="ekipman">Tarım Ekipmanı</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Başlık ve Açıklama */}
          <div className="space-y-2">
            <Label htmlFor="title">İlan Başlığı</Label>
            <Input id="title" placeholder="Örn: 10 Ton Kuru Fasulye Satılık" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea 
              id="description" 
              placeholder="Ürününüzün veya işin detaylarını buraya yazın..." 
              className="min-h-[120px]"
            />
          </div>

          {/* Fiyat ve Miktar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Fiyat / Ücret</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">₺</span>
                <Input id="price" className="pl-7" placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Miktar / Birim</Label>
              <div className="flex gap-2">
                <Input id="amount" placeholder="Örn: 500" />
                <Select defaultValue="kg">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kg</SelectItem>
                    <SelectItem value="ton">Ton</SelectItem>
                    <SelectItem value="adet">Adet</SelectItem>
                    <SelectItem value="gun">Günlük</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Konum */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>İl</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="İl Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="konya">Konya</SelectItem>
                  <SelectItem value="ankara">Ankara</SelectItem>
                  <SelectItem value="adana">Adana</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>İlçe</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="İlçe Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="merkez">Merkez</SelectItem>
                  {/* Dinamik olarak dolacak */}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Görsel Yükleme Alanı */}
          <div className="space-y-2">
            <Label>Fotoğraflar</Label>
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="p-3 bg-primary/10 rounded-full">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <span className="font-semibold text-primary">Yüklemek için tıklayın</span>
                <span className="text-muted-foreground"> veya sürükleyip bırakın</span>
              </div>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF (Maks. 5MB)</p>
            </div>
            
            {/* Yüklü Görsel Örneği (Statik) */}
            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
              <div className="relative h-20 w-20 rounded-lg overflow-hidden border shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://placehold.co/100" alt="Önizleme" className="h-full w-full object-cover" />
                <button className="absolute top-1 right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90">
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="h-20 w-20 rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer shrink-0">
                <ImagePlus className="h-6 w-6" />
              </div>
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline">İptal</Button>
          <Button size="lg" className="px-8">İlanı Yayınla</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
