"use server"

import { PrismaClient } from "@prisma/client"
import { cookies } from "next/headers"

const prisma = new PrismaClient()

async function getUserId() {
  const cookieStore = await cookies()
  return cookieStore.get("session_user_id")?.value
}

export async function getReportStats() {
  const userId = await getUserId()
  if (!userId) return null

  const [products, jobs, conversations, unreadMessagesCount] = await Promise.all([
    prisma.product.findMany({
      where: { userId },
      select: { id: true, price: true, active: true },
    }),
    prisma.jobPosting.findMany({
      where: { userId },
      select: { id: true, wage: true, active: true },
    }),
    prisma.conversation.findMany({
      where: {
        OR: [
          { participant1Id: userId },
          { participant2Id: userId },
        ],
      },
      include: {
        messages: {
          where: {
            receiverId: userId, // Bana gelen mesajlar
            isRead: false,
          },
        },
      },
    }),
    prisma.message.count({
        where: {
            receiverId: userId,
            isRead: false
        }
    })
  ])

  const totalListings = products.length + jobs.length
  const activeListings = products.filter(p => p.active).length + jobs.filter(j => j.active).length
  
  // Basit kazanç tahmini (sadece aktif ürün fiyatları)
  const estimatedRevenue = products.reduce((sum, p) => sum + (p.active ? p.price.toNumber() : 0), 0)
  // İş ilanları için kazanç tahmini daha karmaşık olur, şimdilik hariç.
  
  // Toplam görüntüleme (şimdilik mock)
  const totalViews = Math.floor(Math.random() * 5000) + 100 // Her seferinde farklı olsun
  
  return {
    totalListings,
    activeListings,
    totalViews,
    estimatedRevenue,
    newMessages: unreadMessagesCount,
  }
}

export async function getMonthlyActivity() {
    // Gerçek veri çekimi yerine şimdilik mock data dönecek
    // Normalde ilan ve mesajların createdAt alanlarından gruplanarak çekilir.
    return [
        { month: 'Oca', listings: 10, messages: 25 },
        { month: 'Şub', listings: 12, messages: 30 },
        { month: 'Mar', listings: 8, messages: 20 },
        { month: 'Nis', listings: 15, messages: 40 },
        { month: 'May', listings: 20, messages: 55 },
        { month: 'Haz', listings: 18, messages: 50 },
    ];
}

export async function getUserListingsForReports() {
    const userId = await getUserId()
    if (!userId) return []

    const [products, jobs] = await Promise.all([
        prisma.product.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: { id: true, title: true, category: true, createdAt: true, active: true, price: true }
        }),
        prisma.jobPosting.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: { id: true, title: true, location: true, createdAt: true, active: true, wage: true }
        }),
    ])

    const formattedListings = [
        ...products.map(p => ({
            id: p.id,
            title: p.title,
            category: p.category,
            date: p.createdAt.toLocaleDateString("tr-TR"),
            status: p.active ? "Aktif" : "Pasif",
            views: Math.floor(Math.random() * 200), // Mock
            type: "Ürün",
            price: p.price.toString()
        })),
        ...jobs.map(j => ({
            id: j.id,
            title: j.title,
            category: j.location, // İş ilanında kategori yerine konum
            date: j.createdAt.toLocaleDateString("tr-TR"),
            status: j.active ? "Aktif" : "Pasif",
            views: Math.floor(Math.random() * 200), // Mock
            type: "İş İlanı",
            price: j.wage.toString()
        }))
    ]

    return formattedListings.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
