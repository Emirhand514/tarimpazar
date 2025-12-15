import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { turkeyLocations } from '../lib/locations';

const prisma = new PrismaClient();

const sampleProducts = [
  { title: "Organik Domates", desc: "Tarladan taze toplanmış organik domatesler", price: 15000, category: "sebze" },
  { title: "Traktör", desc: "2015 model, bakımlı traktör", price: 350000, category: "ekipman" },
  { title: "Koyun Sürüsü", desc: "50 adet sağlıklı koyun", price: 500000, category: "hayvan" },
  { title: "Buğday", desc: "1 ton birinci kalite buğday", price: 12000, category: "tahil" },
  { title: "Tarım Makinesi", desc: "Biçerdöver, çok iyi durumda", price: 750000, category: "ekipman" },
  { title: "Elma", desc: "Yerli elma, tonluk satış", price: 18000, category: "sebze" },
  { title: "İnek", desc: "Süt ineği, yüksek verimli", price: 85000, category: "hayvan" },
  { title: "Arpa", desc: "Kaliteli arpa, toptan satış", price: 11000, category: "tahil" },
  { title: "Sulama Sistemi", desc: "Damla sulama sistemi, tam takım", price: 45000, category: "ekipman" },
  { title: "Patates", desc: "Yerli patates, taze", price: 14000, category: "sebze" },
];

const sampleJobs = [
  { title: "Mevsimlik İşçi", desc: "Hasat döneminde çalışacak mevsimlik işçi aranıyor", wage: 1500, workType: "Mevsimlik" },
  { title: "Traktör Operatörü", desc: "Deneyimli traktör operatörü aranıyor", wage: 12000, workType: "Tam Zamanlı" },
  { title: "Çiftlik İşçisi", desc: "Hayvan bakımı ve tarım işlerinde çalışacak personel", wage: 10000, workType: "Tam Zamanlı" },
  { title: "Biçerdöver Operatörü", desc: "Deneyimli biçerdöver operatörü aranıyor", wage: 15000, workType: "Mevsimlik" },
  { title: "Sera İşçisi", desc: "Sera işlerinde çalışacak personel", wage: 9000, workType: "Tam Zamanlı" },
];

const roles = ["FARMER", "WORKER", "BUSINESS", "TRADER"];
const firstNames = ["Ahmet", "Mehmet", "Ali", "Mustafa", "Hasan", "Hüseyin", "İbrahim", "Osman", "Fatma", "Ayşe", "Zeynep", "Emine", "Hatice", "Meryem"];
const lastNames = ["Yılmaz", "Kaya", "Demir", "Şahin", "Çelik", "Yıldız", "Yıldırım", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan"];

async function main() {
  console.log("🎭 Fake veri oluşturma işlemi başlatılıyor...");
  
  const defaultPassword = 'password123';
  const hashedPassword = await hash(defaultPassword, 10);

  // 40-50 arası kullanıcı oluştur
  const userCount = Math.floor(Math.random() * 11) + 40; // 40-50 arası
  console.log(`👤 ${userCount} adet fake kullanıcı oluşturuluyor...`);

  const createdUsers = [];

  for (let i = 1; i <= userCount; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const userName = `${firstName} ${lastName}`;
    const userEmail = `fake${i}@tarimpazar.com`;
    const userRole = roles[Math.floor(Math.random() * roles.length)];

    // Random city and district
    const randomLocation = turkeyLocations[Math.floor(Math.random() * turkeyLocations.length)];
    const randomCity = randomLocation.city;
    const randomDistrict = randomLocation.districts[Math.floor(Math.random() * randomLocation.districts.length)];

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userEmail }
      });

      if (existingUser) {
        console.log(`⚠️  Kullanıcı zaten mevcut: ${userEmail}`);
        createdUsers.push(existingUser);
        continue;
      }

      const user = await prisma.user.create({
        data: {
          email: userEmail,
          name: userName,
          password: hashedPassword,
          role: userRole,
          city: randomCity,
          district: randomDistrict,
          phone: `05${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
        }
      });

      createdUsers.push(user);
      console.log(`✅ Kullanıcı oluşturuldu: ${userName} (${userEmail})`);

      // Her kullanıcı için 1-3 arası ilan oluştur
      const listingCount = Math.floor(Math.random() * 3) + 1; // 1-3 arası
      
      for (let j = 0; j < listingCount; j++) {
        const isProduct = Math.random() > 0.4; // %60 ürün, %40 iş ilanı

        if (isProduct) {
          const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
          const location = turkeyLocations[Math.floor(Math.random() * turkeyLocations.length)];
          const district = location.districts[Math.floor(Math.random() * location.districts.length)];

          await prisma.product.create({
            data: {
              title: `${product.title} - ${location.city}`,
              description: `${product.desc}. İletişim için telefon edebilirsiniz.`,
              price: product.price + Math.floor(Math.random() * 10000) - 5000, // Fiyat varyasyonu
              currency: "TRY",
              category: product.category,
              city: location.city,
              district: district,
              contactPhone: user.phone || undefined,
              userId: user.id,
              active: true,
              image: `https://picsum.photos/seed/${user.id}-${j}/600/400`, // Random görsel
              images: `https://picsum.photos/seed/${user.id}-${j}-1/600/400,https://picsum.photos/seed/${user.id}-${j}-2/600/400`,
            }
          });
        } else {
          const job = sampleJobs[Math.floor(Math.random() * sampleJobs.length)];
          const location = turkeyLocations[Math.floor(Math.random() * turkeyLocations.length)];
          const district = location.districts[Math.floor(Math.random() * location.districts.length)];

          await prisma.jobPosting.create({
            data: {
              title: `${job.title} - ${location.city}`,
              description: `${job.desc}. Detaylı bilgi için iletişime geçebilirsiniz.`,
              wage: job.wage + Math.floor(Math.random() * 2000) - 1000, // Ücret varyasyonu
              currency: "TRY",
              workType: job.workType,
              city: location.city,
              district: district,
              contactPhone: user.phone || undefined,
              userId: user.id,
              active: true,
              images: `https://picsum.photos/seed/${user.id}-job-${j}/600/400`,
            }
          });
        }
      }

      console.log(`   └─ ${listingCount} adet ilan oluşturuldu`);
    } catch (error) {
      console.error(`❌ Kullanıcı oluşturulurken hata: ${userEmail}`, error);
    }
  }

  // İstatistikler
  const totalProducts = await prisma.product.count();
  const totalJobs = await prisma.jobPosting.count();
  const totalUsers = await prisma.user.count();

  console.log("\n📊 İstatistikler:");
  console.log(`   👥 Toplam kullanıcı: ${totalUsers}`);
  console.log(`   🛒 Toplam ürün ilanı: ${totalProducts}`);
  console.log(`   💼 Toplam iş ilanı: ${totalJobs}`);
  console.log(`\n✅ İşlem tamamlandı! ${createdUsers.length} kullanıcı ve ilanları oluşturuldu.`);
  console.log(`\n🔑 Tüm kullanıcıların şifresi: password123`);
}

main()
  .catch((e) => {
    console.error("❌ Hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

