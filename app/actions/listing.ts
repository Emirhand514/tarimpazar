"use server";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
  const contactPhone = formData.get("contactPhone") as string;
  const images = formData.getAll("images"); // Birden fazla resim olabilir

  // Resim yükleme mantığı buraya eklenebilir (örneğin Cloudinary'ye)
  // Şimdilik sadece URL'leri virgülle ayrılmış string olarak tutalım
  const imageUrls = images.map(file => {
    // Burada gerçek bir dosya yükleme işlemi olmalı
    // Şimdilik placeholder URL dönüyorum
    return file instanceof File && file.size > 0 ? `https://placeholder.com/${file.name}` : "";
  }).filter(Boolean).join(",");


  try {
    if (type === "job") {
      const wage = parseFloat(formData.get("wage") as string);
      const currency = formData.get("currency") as string || "TRY";
      const workType = formData.get("workType") as string;

      await prisma.jobPosting.create({
        data: {
          title,
          description,
          city,
          district,
          contactPhone,
          wage,
          currency,
          workType,
          images: imageUrls,
          userId: currentUser.id,
          active: true, // Varsayılan olarak aktif
        },
      });
    } else if (type === "product") {
      const price = parseFloat(formData.get("price") as string);
      const currency = formData.get("currency") as string || "TRY";
      const category = (formData.get("category") as string) || ""; // Eğer null gelirse boş string ata

      await prisma.product.create({
        data: {
          title,
          description,
          city,
          district,
          contactPhone,
          price,
          currency,
          category,
          image: imageUrls.split(',')[0], // İlk resmi ana görsel olarak al
          images: imageUrls,
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
  const images = formData.getAll("images"); // Yeni veya mevcut resimler

  // Resim yükleme mantığı buraya eklenebilir
  const imageUrls = images.map(file => {
    return file instanceof File && file.size > 0 ? `https://placeholder.com/${file.name}` : "";
  }).filter(Boolean).join(",");

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
          images: imageUrls,
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
          image: imageUrls.split(',')[0],
          images: imageUrls,
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

