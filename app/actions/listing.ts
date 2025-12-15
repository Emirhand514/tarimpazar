"use server";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

interface ListingData {
  id: string;
  type: "product" | "job";
  title: string;
  description: string;
  user: {
    name: string | null;
    email: string;
  };
  createdAt: Date;
  active: boolean;
}

export async function fetchAllListingsAction(query: string): Promise<ListingData[]> {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/"); // Redirect non-admins
  }

  const whereClause: any = {};
  if (query) {
    whereClause.OR = [
      { title: { contains: query } },
      { description: { contains: query } },
      { user: { name: { contains: query } } },
      { user: { email: { contains: query } } },
    ];
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      active: true,
      user: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const jobs = await prisma.jobPosting.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      active: true,
      user: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const allListings: ListingData[] = [
    ...products.map(p => ({ ...p, type: "product" as const })),
    ...jobs.map(j => ({ ...j, type: "job" as const })),
  ];

  return allListings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function createListingAction(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth/sign-in"); // Giriş yapmamış kullanıcıyı yönlendir
  }

  const type = formData.get("type") as string; // 'product' veya 'job'
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const city = formData.get("city") as string;
  const district = formData.get("district") as string;
  const contactPhone = (formData.get("contactPhone") as string) || "";
  const images = formData.getAll("images"); // Birden fazla resim olabilir

  console.log("Images from FormData:", images.length, "files");

  // Validasyon
  if (!title || !description || !city || !district) {
    throw new Error("Lütfen tüm zorunlu alanları doldurun.");
  }

  // Resim yükleme işlemi
  const imageUrls: string[] = [];
  
  for (const imageFile of images) {
    // FormData'dan gelen file'ı kontrol et
    if (imageFile instanceof File && imageFile.size > 0) {
      console.log("Processing image file:", imageFile.name, imageFile.size, imageFile.type);
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Dosya uzantısı
        const ext = imageFile.name.split('.').pop() || 'jpg';
        const filename = `listing-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        
        // Upload klasörünü oluştur
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }

        // Dosyayı kaydet
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // URL'i oluştur
        const imageUrl = `/uploads/${filename}`;
        imageUrls.push(imageUrl);
        console.log("Image saved to:", imageUrl);
      } catch (error) {
        console.error("Resim yükleme hatası:", error);
        // Hata olsa bile devam et, sadece o resmi atla
      }
    }
  }
  
  const imageUrlsString = imageUrls.join(",");


  try {
    if (type === "job") {
      const wageStr = formData.get("wage") as string;
      const wage = wageStr ? parseFloat(wageStr) : 0;
      const currency = formData.get("currency") as string || "TRY";
      const workType = formData.get("workType") as string || "Tam Zamanlı";

      if (!workType) {
        throw new Error("İş türü seçilmelidir.");
      }

      await prisma.jobPosting.create({
        data: {
          title,
          description,
          city,
          district,
          contactPhone: contactPhone || null,
          wage,
          currency,
          workType,
          images: imageUrlsString || "",
          userId: currentUser.id,
          active: true, // Varsayılan olarak aktif
        },
      });
    } else if (type === "product") {
      const priceStr = formData.get("price") as string;
      const price = priceStr ? parseFloat(priceStr) : 0;
      const currency = formData.get("currency") as string || "TRY";
      const category = (formData.get("category") as string) || "ekipman"; // Varsayılan kategori

      await prisma.product.create({
        data: {
          title,
          description,
          city,
          district,
          contactPhone: contactPhone || null,
          price,
          currency,
          category,
          image: imageUrlsString.split(',')[0] || "", // İlk resmi ana görsel olarak al
          images: imageUrlsString || "",
          userId: currentUser.id,
          active: true, // Varsayılan olarak aktif
        },
      });
    } else {
      throw new Error("Geçersiz ilan türü belirtildi.");
    }

    revalidatePath("/dashboard"); // Dashboard sayfasını yeniden doğrula
    revalidatePath("/explore"); // İlanları incele sayfasını da yeniden doğrula

    // Başarılı olursa dashboard'a yönlendir
    redirect("/dashboard");

  } catch (error) {
    console.error("İlan oluşturulurken hata oluştu:", error);
    // Hata yönetimi: Kullanıcıya mesaj gösterme vb.
    throw error; // Hatayı tekrar fırlat
  }
}

export async function updateListingAction(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth/sign-in");
  }

  const id = formData.get("id") as string; // Güncellenecek ilanın ID'si
  const type = formData.get("type") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const city = formData.get("city") as string;
  const district = formData.get("district") as string;
  const contactPhone = formData.get("contactPhone") as string;
  
  // Mevcut ilanı al
  let existingListing: any = null;
  if (type === "product") {
    existingListing = await prisma.product.findUnique({
      where: { id, userId: currentUser.id },
      select: { images: true },
    });
  } else if (type === "job") {
    existingListing = await prisma.jobPosting.findUnique({
      where: { id, userId: currentUser.id },
      select: { images: true },
    });
  }
  
  // Mevcut resimleri al
  const existingImages = existingListing?.images ? existingListing.images.split(",").filter(Boolean) : [];
  
  // Yeni resimleri al (hem "images" hem "newImages" olabilir)
  const newImages = formData.getAll("newImages");
  const images = formData.getAll("images");
  const allNewImages = [...newImages, ...images].filter(img => img instanceof File && img.size > 0);

  // Resim yükleme işlemi
  const imageUrls: string[] = [...existingImages]; // Mevcut resimleri koru
  
  for (const imageFile of allNewImages) {
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Dosya uzantısı
        const ext = imageFile.name.split('.').pop() || 'jpg';
        const filename = `listing-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        
        // Upload klasörünü oluştur
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }

        // Dosyayı kaydet
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // URL'i oluştur
        const imageUrl = `/uploads/${filename}`;
        imageUrls.push(imageUrl);
        console.log("Image saved to:", imageUrl);
      } catch (error) {
        console.error("Resim yükleme hatası:", error);
        // Hata olsa bile devam et, sadece o resmi atla
      }
    }
  }
  
  const imageUrlsString = imageUrls.join(",");

  try {
    if (type === "job") {
      const wage = parseFloat(formData.get("wage") as string);
      const currency = formData.get("currency") as string || "TRY";
      const workType = formData.get("workType") as string;
      const active = formData.get("active") === "on"; // Checkbox'tan aktif durumu

      await prisma.jobPosting.update({
        where: { id: id, userId: currentUser.id }, // Sadece kendi ilanını güncelleyebilir
        data: {
          title,
          description,
          city,
          district,
          contactPhone,
          wage,
          currency,
          workType,
          images: imageUrlsString || "",
          active,
        },
      });
    } else if (type === "product") {
      const price = parseFloat(formData.get("price") as string);
      const currency = formData.get("currency") as string || "TRY";
      const category = (formData.get("category") as string) || ""; // Eğer null gelirse boş string ata
      const active = formData.get("active") === "on"; // Checkbox'tan aktif durumu

      await prisma.product.update({
        where: { id: id, userId: currentUser.id }, // Sadece kendi ilanını güncelleyebilir
        data: {
          title,
          description,
          city,
          district,
          contactPhone,
          price,
          currency,
          category,
          image: imageUrlsString.split(',')[0] || "",
          images: imageUrlsString || "",
          active,
        },
      });
    } else {
      throw new Error("Geçersiz ilan türü belirtildi.");
    }

    revalidatePath("/dashboard");
    revalidatePath("/explore");
    revalidatePath(`/dashboard/ilanlarim`); // İlanlarım sayfasını da yeniden doğrula
    revalidatePath(`/ilan/${type}-${id}`); // İlanın detay sayfasını da yeniden doğrula

    redirect("/dashboard/ilanlarim"); // Güncelleme sonrası ilanlarım sayfasına yönlendir

  } catch (error) {
    console.error("İlan güncellenirken hata oluştu:", error);
    throw error;
  }
}

