"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

// Bu fonksiyonlar şimdilik yer tutucudur. Gerçek veri çekme mantığı buraya eklenecektir.

export async function getReportStats() {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        redirect("/auth/sign-in"); // Oturum açmamışsa giriş sayfasına yönlendir
    }

    // Örnek istatistik verileri
    const totalUsers = await prisma.user.count();
    const totalListings = await prisma.product.count() + await prisma.jobPosting.count();
    const totalReports = await prisma.report.count();
    const pendingReports = await prisma.report.count({ where: { status: "PENDING" } });

    const estimatedRevenue: number | null = null; // Always null as per new requirement

    return {
        totalUsers,
        totalListings,
        totalReports,
        pendingReports,
        totalMessages: 1234, // Placeholder
        estimatedRevenue: estimatedRevenue,
    };
}

export async function getMonthlyActivity() {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        redirect("/auth/sign-in"); // Oturum açmamışsa giriş sayfasına yönlendir
    }
    
    // Sadece adminler bu verilere erişebilir
    if (currentUser.role !== "ADMIN") {
        redirect("/"); // Yetkisiz erişim
    }

    const data = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) { // Son 6 ayı al, eskiden yeniye doğru
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Ayın son günü

        const monthName = date.toLocaleString("tr-TR", { month: "short" });

        const listingsCount = await prisma.product.count({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        }) + await prisma.jobPosting.count({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        const messagesCount = await prisma.message.count({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        // Görüntülenme sayısı için gerçek bir alanımız olmadığı için ilan sayısıyla orantılı bir değer türetelim
        const viewsCount = listingsCount * Math.floor(Math.random() * (20 - 10 + 1) + 10); // İlan başına 10-20 arası görüntüleme

        data.push({
            month: monthName,
            listings: listingsCount,
            messages: messagesCount,
            views: viewsCount,
        });
    }
    return data;
}

export async function getUserListingsForReports() {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        redirect("/auth/sign-in"); // Oturum açmamışsa giriş sayfasına yönlendir
    }
    // Sadece adminler bu verilere erişebilir
    if (currentUser.role !== "ADMIN") {
        redirect("/"); // Yetkisiz erişim
    }

    // Örnek kullanıcı listeleme verileri
    const usersWithListings = await prisma.user.findMany({
        take: 10, // Sadece ilk 10 kullanıcının ilanlarını alalım
        select: {
            id: true,
            name: true,
            email: true,
            products: {
                take: 2, // Her kullanıcıdan en fazla 2 ilan
                select: { id: true, title: true, active: true },
            },
            jobPostings: {
                take: 2,
                select: { id: true, title: true, active: true },
            },
        },
    });

    return usersWithListings.map(user => ({
        id: user.id,
        name: user.name || user.email,
        totalListings: user.products.length + user.jobPostings.length,
        activeListings: user.products.filter(p => p.active).length + user.jobPostings.filter(j => j.active).length,
    }));
}
