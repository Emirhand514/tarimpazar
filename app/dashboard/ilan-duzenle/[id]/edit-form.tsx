"use client"

import { useState, useTransition } from "react"
import { updateListingAction } from "@/app/actions/listing"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, ImagePlus } from "lucide-react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { turkeyLocations } from "@/lib/locations"

export default function EditListingForm({ listing }: { listing: any }) {
  const [isPending, startTransition] = useTransition()
  const [images, setImages] = useState<string[]>(listing.images ? listing.images.split(",") : [])
  const [selectedCity, setSelectedCity] = useState(listing.city || "")

  const currentDistricts = turkeyLocations.find(c => c.city === selectedCity)?.districts || []

  const handleSubmit = async (formData: FormData) => {
    formData.append("id", listing.id)
    formData.append("type", listing.type)

    startTransition(async () => {
      try {
        await updateListingAction(formData);
        // Redirect başarılıysa buraya gelmez
      } catch (error: any) {
        // Next.js redirect() özel bir hata fırlatır (NEXT_REDIRECT)
        // Bu hatayı ignore etmemiz gerekiyor
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
          // Redirect başarılı, hata mesajı gösterme
          return;
        }
        console.error("İlan güncelleme hatası:", error);
        toast.error(error.message || "İlan güncellenirken bir hata oluştu.");
      }
    })
  }

  return (
    <form action={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>İlan Detayları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="title">İlan Başlığı</Label>
            <Input id="title" name="title" defaultValue={listing.title} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea 
              id="description"
              name="description"
              className="min-h-[120px]"
              defaultValue={listing.description}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Fiyat / Ücret</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">₺</span>
              <Input id="price" name="price" className="pl-7" defaultValue={listing.price} />
            </div>
          </div>

          {/* Konum */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>İl</Label>
              <Select name="city" defaultValue={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="İl Seçiniz" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {turkeyLocations.map((loc) => (
                    <SelectItem key={loc.city} value={loc.city}>
                      {loc.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>İlçe</Label>
              <Select name="district" defaultValue={listing.district} disabled={!selectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="İlçe Seçiniz" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {currentDistricts.map((dist) => (
                    <SelectItem key={dist} value={dist}>
                      {dist}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* İletişim Bilgileri (Opsiyonel) */}
          <div className="space-y-2">
            <Label htmlFor="contactPhone">İletişim Telefonu (Opsiyonel)</Label>
            <Input 
              id="contactPhone" 
              name="contactPhone" 
              placeholder="İlanınız için alternatif bir telefon numarası (örn: 05xx xxx xx xx)" 
              type="tel"
              defaultValue={listing.contactPhone || ""}
            />
          </div>

          {/* Galeri Önizleme */}
          <div className="space-y-2">
            <Label>Mevcut Fotoğraflar</Label>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={img} alt="ilan" className="h-20 w-20 object-cover rounded-lg border" />
                ))}
                {images.length === 0 && <p className="text-sm text-muted-foreground">Fotoğraf yok.</p>}
            </div>
          </div>

          {/* Yeni Fotoğraf Yükleme */}
          <div className="space-y-2">
            <Label htmlFor="newImages">Yeni Fotoğraf Ekle</Label>
            <div className="flex items-center gap-4">
                <Input id="newImages" name="newImages" type="file" multiple accept="image/*" className="cursor-pointer" />
            </div>
            <p className="text-xs text-muted-foreground">Yeni yükledikleriniz mevcutların yanına eklenir.</p>
          </div>

        </CardContent>
        <CardFooter className="flex justify-end border-t px-6 py-4">
          <Button size="lg" type="submit" disabled={isPending}>
            {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Güncelleniyor...
                </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Kaydet
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
