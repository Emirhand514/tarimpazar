import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@tarim.com' },
      select: { email: true, password: true, role: true, id: true }
    });

    if (admin) {
      console.log('✅ Admin kullanıcısı bulundu:');
      console.log(JSON.stringify(admin, null, 2));
    } else {
      console.log('❌ Admin kullanıcısı bulunamadı!');
    }
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();

