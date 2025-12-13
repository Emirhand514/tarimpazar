"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserProfileAction(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { success: false, message: "Oturum açmanız gerekiyor." };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const bio = formData.get("bio") as string;
  const city = formData.get("city") as string;
  const district = formData.get("district") as string;
  const crops = formData.get("crops") as string; // Virgülle ayrılmış ürünler
  const certificates = formData.get("certificates") as string; // Virgülle ayrılmış sertifikalar

  try {
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name,
        phone,
        bio,
        city,
        district,
        crops,
        certificates,
      },
    });

    revalidatePath("/dashboard/settings"); // Ayarlar sayfasını güncelle
    // Ayrıca profilin göründüğü diğer sayfaları da güncelleyebiliriz (örn: /dashboard/profil)
    // revalidatePath("/dashboard/profil"); 

    return { success: true, message: "Profiliniz başarıyla güncellendi." };
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    return { success: false, message: "Profil güncellenirken bir hata oluştu." };
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