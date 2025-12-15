import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası - Tarımpazar",
  description: "Tarımpazar gizlilik politikası ve kişisel verilerin korunması",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card rounded-2xl p-8 md:p-12 border shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Gizlilik Politikası</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Son Güncelleme: {new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="prose prose-stone max-w-none dark:prose-invert space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Genel Bilgiler</h2>
              <p className="text-muted-foreground leading-relaxed">
                Tarımpazar olarak, kullanıcılarımızın gizliliğini korumak ve kişisel verilerinin güvenliğini sağlamak bizim için büyük önem taşımaktadır. 
                Bu gizlilik politikası, platformumuzu kullanırken topladığımız bilgilerin nasıl kullanıldığını, korunduğunu ve paylaşıldığını açıklamaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Toplanan Bilgiler</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Platformumuzu kullanırken aşağıdaki bilgileri toplayabiliriz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Ad, soyad, e-posta adresi, telefon numarası gibi kişisel bilgiler</li>
                <li>Kullanıcı hesabı oluşturma ve giriş bilgileri</li>
                <li>İlan paylaşımı, mesajlaşma ve platform içi aktiviteler</li>
                <li>IP adresi, tarayıcı türü, cihaz bilgileri gibi teknik veriler</li>
                <li>Çerezler (cookies) ve benzeri izleme teknolojileri</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Bilgilerin Kullanımı</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Toplanan bilgiler aşağıdaki amaçlarla kullanılmaktadır:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Platform hizmetlerinin sağlanması ve kullanıcı deneyiminin iyileştirilmesi</li>
                <li>Kullanıcı hesaplarının yönetimi ve güvenliğin sağlanması</li>
                <li>İlan yönetimi, mesajlaşma ve iletişim hizmetlerinin sunulması</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                <li>Kullanıcılara önemli bildirimlerin iletilmesi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Bilgilerin Paylaşımı</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kişisel bilgileriniz, yasal yükümlülüklerimiz veya kolluk kuvvetlerinin talepleri dışında, 
                üçüncü taraflarla paylaşılmamaktadır. Platform içi iletişimlerde (mesajlaşma, ilan paylaşımı) 
                diğer kullanıcılarla paylaşılan bilgilerden kullanıcılarımız kendileri sorumludur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Veri Güvenliği</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kişisel verilerinizin güvenliği için teknik ve idari önlemler alınmaktadır. 
                Ancak, internet üzerinden veri iletiminin %100 güvenli olmadığını unutmamanız önemlidir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Çerezler</h2>
              <p className="text-muted-foreground leading-relaxed">
                Platformumuz, kullanıcı deneyimini iyileştirmek ve platform işlevselliğini sağlamak için çerezler kullanmaktadır. 
                Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. KVKK Haklarınız</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenmişse bilgi talep etme</li>
                <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                <li>Kanunda öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Değişiklikler</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bu gizlilik politikası, gerektiğinde güncellenebilir. Önemli değişiklikler kullanıcılara bildirilecektir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. İletişim</h2>
              <p className="text-muted-foreground leading-relaxed">
                Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

