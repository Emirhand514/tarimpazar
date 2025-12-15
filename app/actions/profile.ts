"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function updateUserProfileAction(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { success: false, message: "Oturum açmanız gerekiyor." };
  }

  const name = formData.get("name") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;
  const phone = formData.get("phone") as string;
  const bio = formData.get("bio") as string;
  const city = formData.get("city") as string;
  const district = formData.get("district") as string;
  const crops = formData.get("crops") as string; // Virgülle ayrılmış ürünler
  const certificates = formData.get("certificates") as string; // Virgülle ayrılmış sertifikalar
  const imageFile = formData.get("image");
  
  // FormData'dan gelen değeri kontrol et
  let actualImageFile: File | null = null;
  if (imageFile instanceof File && imageFile.size > 0) {
    actualImageFile = imageFile;
  } else if (typeof imageFile === "string" && imageFile.length > 0) {
    // Eğer string gelirse (eski URL), dosya yok demektir
    console.log("Image is a string (existing URL), not a new file");
  }

  console.log("Image file received:", actualImageFile ? {
    name: actualImageFile.name,
    size: actualImageFile.size,
    type: actualImageFile.type
  } : "No file");

  // İsim birleştirme (eğer firstName ve lastName varsa)
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : name;

  let imageUrl = currentUser.image; // Mevcut resmi koru

  // Resim yükleme işlemi
  if (actualImageFile) {
    try {
      const bytes = await actualImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Dosya uzantısı
      const ext = actualImageFile.name.split('.').pop() || 'jpg';
      const filename = `${currentUser.id}-${Date.now()}.${ext}`;
      
      // Upload klasörünü oluştur
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'users');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Dosyayı kaydet
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);

      // URL'i oluştur
      imageUrl = `/uploads/users/${filename}`;
      console.log("Image saved to:", imageUrl);
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      return { success: false, message: `Resim yüklenirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` };
    }
  } else {
    console.log("No image file to upload or file is empty");
  }

  try {
    // Email değiştiriliyorsa ve farklı bir email ise, başka kullanıcıda kullanılıyor mu kontrol et
    if (email && email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      
      if (existingUser && existingUser.id !== currentUser.id) {
        return { success: false, message: "Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor." };
      }
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: fullName || name,
        email: email ? email.toLowerCase() : currentUser.email,
        role: role || currentUser.role,
        phone,
        bio,
        city,
        district,
        crops,
        certificates,
        image: imageUrl,
      },
    });

    revalidatePath("/dashboard/settings"); // Ayarlar sayfasını güncelle
    revalidatePath("/dashboard/profil"); // Profil sayfasını güncelle

    return { success: true, message: "Profiliniz başarıyla güncellendi." };
  } catch (error: any) {
    console.error("Profil güncelleme hatası:", error);
    
    // Prisma unique constraint hatası
    if (error.code === 'P2002') {
      return { success: false, message: "Bu e-posta adresi zaten kullanılıyor." };
    }
    
    return { success: false, message: `Profil güncellenirken bir hata oluştu: ${error.message || 'Bilinmeyen hata'}` };
  }
}

export async function getUserProfile() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  // Return a subset of user data relevant for profile display
  const { id, name, email, image, phone, bio, city, district, crops, certificates, role, createdAt, updatedAt } = currentUser;

  return { id, name, email, image, phone, bio, city, district, crops, certificates, role, createdAt, updatedAt };
}