"use server"

import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { writeFile, unlink } from "fs/promises"
import { join } from "path"

const prisma = new PrismaClient()

// Dosya Yükleme Yardımcısı
async function uploadFiles(files: File[]): Promise<string[]> {
  const uploadedPaths: string[] = []
  const uploadDir = join(process.cwd(), "public", "uploads")

  for (const file of files) {
    if (file.size > 0 && file.name !== "undefined") {
      try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase()
        const filename = `listing-${uniqueSuffix}-${originalName}`
        const filePath = join(uploadDir, filename)
        
        await writeFile(filePath, buffer)
        uploadedPaths.push(`/uploads/${filename}`)
      } catch (error) {
        console.error("File upload failed:", error)
      }
    }
  }
  return uploadedPaths
}

export async function createListingAction(formData: FormData) {
  const cookieStore = await cookies()
  const userId = cookieStore.get("session_user_id")?.value

  if (!userId) {
    return { success: false, message: "Oturum süreniz dolmuş." }
  }

  const listingType = formData.get("listingType") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const priceRaw = formData.get("price") as string
  const city = formData.get("city") as string
  const district = formData.get("district") as string
  const category = formData.get("category") as string
  const barterDesc = formData.get("barterDesc") as string

  // Fotoğrafları Al
  const files = formData.getAll("images") as File[]
  const uploadedImages = await uploadFiles(files)
  
  // İlk resmi ana resim yap, diğerlerini galeriye ekle
  const mainImage = uploadedImages.length > 0 ? uploadedImages[0] : null
  const allImagesStr = uploadedImages.join(",")

  if (!title || !description || !city) {
    return { success: false, message: "Lütfen zorunlu alanları doldurun." }
  }

  try {
    const location = `${city}, ${district}`
    const price = parseFloat(priceRaw) || 0

    if (listingType === "job" || listingType === "service") {
      await prisma.jobPosting.create({
        data: {
          userId,
          title,
          description,
          location,
          wage: price,
          workType: listingType === "service" ? "SERVICE" : "FULL_TIME",
          images: allImagesStr
        }
      })
    } else {
      let finalDesc = description;
      if (listingType === "barter") {
        finalDesc = `[TAKAS: ${barterDesc}] 

 ${description}`
      }

      await prisma.product.create({
        data: {
          userId,
          title,
          description: finalDesc,
          price: price,
          category,
          image: mainImage,
          images: allImagesStr,
          active: true
        }
      })
    }

  } catch (error) {
    console.error("Create Listing Error:", error)
    return { success: false, message: "İlan oluşturulurken hata oluştu." }
  }

  revalidatePath("/dashboard/ilanlarim")
  revalidatePath("/explore")
  redirect("/dashboard/ilanlarim")
}

export async function updateListingAction(formData: FormData) {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value
    
    if (!userId) return { success: false, message: "Yetkisiz işlem." }

    const id = formData.get("id") as string
    const type = formData.get("type") as string // "product" or "job"
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const priceRaw = formData.get("price") as string
    
    // Yeni yüklenen dosyalar
    const files = formData.getAll("newImages") as File[]
    const newUploadedImages = await uploadFiles(files)
    
    // Mevcut (silinmemiş) resimlerin listesi de formdan gelebilir ama şimdilik basitleştirelim:
    // Sadece yeni resim eklemeyi destekleyelim veya eskilerin üzerine yazalım. 
    // Daha gelişmiş bir UI'da "bunu sil, bunu tut" yapılır.
    // Şimdilik: Eğer yeni resim varsa eskisinin üstüne ekle.

    try {
        const price = parseFloat(priceRaw) || 0

        if (type === "product") {
            const product = await prisma.product.findUnique({ where: { id } })
            if (!product || product.userId !== userId) return { success: false, message: "İlan bulunamadı veya yetkiniz yok." }

            let updatedImages = product.images ? product.images.split(",") : []
            if (newUploadedImages.length > 0) {
                updatedImages = [...updatedImages, ...newUploadedImages]
            }

            await prisma.product.update({
                where: { id },
                data: {
                    title,
                    description,
                    price,
                    image: updatedImages[0] || product.image, // Ana resim güncelle
                    images: updatedImages.join(",")
                }
            })
        } else {
            const job = await prisma.jobPosting.findUnique({ where: { id } })
            if (!job || job.userId !== userId) return { success: false, message: "İlan bulunamadı veya yetkiniz yok." }
            
             let updatedImages = job.images ? job.images.split(",") : []
            if (newUploadedImages.length > 0) {
                updatedImages = [...updatedImages, ...newUploadedImages]
            }

            await prisma.jobPosting.update({
                where: { id },
                data: {
                    title,
                    description,
                    wage: price,
                    images: updatedImages.join(",")
                }
            })
        }

        revalidatePath("/dashboard/ilanlarim")
        revalidatePath("/explore")
        return { success: true, message: "İlan güncellendi." }

    } catch (error) {
        console.error("Update error:", error)
        return { success: false, message: "Güncelleme başarısız." }
    }
}

export async function deleteListingAction(id: string, type: "product" | "job") {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value
    
    if (!userId) return { success: false, message: "Yetkisiz işlem." }

    try {
        if (type === "product") {
            const product = await prisma.product.findUnique({ where: { id } })
            if (!product || product.userId !== userId) return { success: false, message: "Yetkisiz işlem." }
            await prisma.product.delete({ where: { id } })
        } else {
             const job = await prisma.jobPosting.findUnique({ where: { id } })
            if (!job || job.userId !== userId) return { success: false, message: "Yetkisiz işlem." }
            await prisma.jobPosting.delete({ where: { id } })
        }

        revalidatePath("/dashboard/ilanlarim")
        revalidatePath("/explore")
        return { success: true, message: "İlan silindi." }
    } catch (error) {
         console.error("Delete error:", error)
        return { success: false, message: "Silme işlemi başarısız." }
    }
}