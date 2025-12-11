import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@tarim.com'
  
  // Admin kullanıcısı var mı kontrol et
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Sistem Yöneticisi',
        password: 'admin123', // Demo amaçlı düz metin. Gerçekte bcrypt ile hashlenmeli.
        role: 'ADMIN',
      },
    })
    console.log(`Admin kullanıcısı oluşturuldu: ${admin.email}`)
  } else {
    console.log('Admin kullanıcısı zaten mevcut.')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
