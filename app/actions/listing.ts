"use server"

import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export async function createListingAction(formData: FormData) {
  const cookieStore = await cookies()
  const userId = cookieStore.get("session_user_id")?.value

  if (!userId) {
    return { success: false, message: "Oturum süreniz dolmuş." }
  }

  const listingType = formData.get("listingType") as string // product, barter, job, service
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const priceRaw = formData.get("price") as string
  const amount = formData.get("amount") as string
  const unit = formData.get("unit") as string
  const city = formData.get("city") as string
  const district = formData.get("district") as string
  const category = formData.get("category") as string
  const barterDesc = formData.get("barterDesc") as string // Takas için açıklama

  // Basit validasyon
  if (!title || !description || !city) {
    return { success: false, message: "Lütfen zorunlu alanları doldurun." }
  }

  try {
    const location = `${city}, ${district}`
    // Fiyatı sayıya çevir veya 0 al
    const price = parseFloat(priceRaw) || 0

    if (listingType === "job" || listingType === "service") {
      // İŞ İLANI TABLOSUNA KAYIT
      await prisma.jobPosting.create({
        data: {
          userId,
          title,
          description,
          location,
          wage: price, // wage = price
          workType: listingType === "service" ? "SERVICE" : "FULL_TIME", // Basitleştirilmiş
          // currency, active default değerleri alır
        }
      })
    } else {
      // ÜRÜN / TAKAS İLANI TABLOSUNA KAYIT
      // Takas ise açıklamaya not düşelim veya ayrı bir field tutalım.
      // Şemamızda 'type' alanı yoktu, description'a ekleyelim.
      let finalDesc = description;
      if (listingType === "barter") {
        finalDesc = `[TAKAS: ${barterDesc}] \n\n ${description}`
      }

      await prisma.product.create({
        data: {
          userId,
          title,
          description: finalDesc,
          price: price,
          category,
          // image: "placeholder", // Şimdilik boş veya placeholder
          active: true
        }
      })
    }

  } catch (error) {
    console.error("Create Listing Error:", error)
    return { success: false, message: "İlan oluşturulurken hata oluştu." }
  }

  redirect("/dashboard/ilanlarim")
}
