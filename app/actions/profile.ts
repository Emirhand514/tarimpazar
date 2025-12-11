"use server"

import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { writeFile } from "fs/promises"
import { join } from "path"

const prisma = new PrismaClient()

export async function updateProfileAction(formData: FormData) {
  const cookieStore = await cookies()
  const userId = cookieStore.get("session_user_id")?.value

  if (!userId) {
    return { success: false, message: "Oturum süreniz dolmuş." }
  }

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const city = formData.get("city") as string
  const district = formData.get("district") as string
  const bio = formData.get("bio") as string
  const crops = formData.get("crops") as string
  const certificates = formData.get("certificates") as string
  
  // Dosya İşleme (Avatar)
  const imageFile = formData.get("image") as File
  let imagePath = undefined

  if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
    try {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Dosya adını benzersiz yap
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
      const originalName = imageFile.name.replace(/\s+/g, '-').toLowerCase()
      const filename = `avatar-${uniqueSuffix}-${originalName}`
      
      // Kayıt Yolu: public/uploads
      const uploadDir = join(process.cwd(), "public", "uploads")
      const filePath = join(uploadDir, filename)
      
      await writeFile(filePath, buffer)
      imagePath = `/uploads/${filename}`
      
    } catch (error) {
      console.error("File upload error:", error)
      return { success: false, message: "Fotoğraf yüklenirken hata oluştu." }
    }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: `${firstName} ${lastName}`,
        email, // E-posta değişimi güvenlik gerektirir ama şimdilik izin veriyoruz
        phone,
        city,
        district,
        bio,
        crops,
        certificates,
        ...(imagePath && { image: imagePath }) // Sadece yeni resim varsa güncelle
      }
    })

    revalidatePath("/dashboard/profil")
    return { success: true, message: "Profil başarıyla güncellendi." }

  } catch (error) {
    console.error("Profile update error:", error)
    return { success: false, message: "Profil güncellenirken hata oluştu." }
  }
}

// Profil verisini çekmek için yardımcı fonksiyon (Server Component içinde kullanılacak)
export async function getUserProfile() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("session_user_id")?.value

  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  return user
}
