import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Şartları - Tarımpazar",
  description: "Tarımpazar kullanım şartları ve hizmet koşulları",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card rounded-2xl p-8 md:p-12 border shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Kullanım Şartları</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Son Güncelleme: {new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="prose prose-stone max-w-none dark:prose-invert space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Genel Koşullar</h2>
              <p className="text-muted-foreground leading-relaxed">
                Tarımpazar platformunu kullanarak, aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız. 
                Bu şartlara uymamanız durumunda platformdan erişiminiz kısıtlanabilir veya hesabınız kapatılabilir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Hizmet Kapsamı</h2>
              <p className="text-muted-foreground leading-relaxed">
                Tarımpazar, tarım sektörüne yönelik ürün ve hizmet ilanları paylaşım platformudur. 
                Platform üzerinden ürün satışı, iş ilanı paylaşımı ve kullanıcılar arası iletişim hizmetleri sunulmaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Kullanıcı Sorumlulukları</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Platformu kullanırken aşağıdaki kurallara uymalısınız:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Yanlış, yanıltıcı veya hukuka aykırı bilgi paylaşmamalısınız</li>
                <li>Başkalarının haklarına saygı göstermeli ve zarar verici davranışlarda bulunmamalısınız</li>
                <li>Spam, reklam veya istenmeyen içerik paylaşmamalısınız</li>
                <li>Telif hakları, marka hakları veya diğer fikri mülkiyet haklarını ihlal etmemelisiniz</li>
                <li>Yasa dışı faaliyetlerde bulunmamalısınız</li>
                <li>Diğer kullanıcıların kişisel bilgilerini izinsiz kullanmamalısınız</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. İlan Paylaşımı</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Platform üzerinden ilan paylaşırken:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>İlanlarınızın doğru, güncel ve yasal olduğundan emin olmalısınız</li>
                <li>Ürün veya hizmet açıklamalarında yanıltıcı bilgi vermemelisiniz</li>
                <li>Uygun görsel ve açıklamalar kullanmalısınız</li>
                <li>Fiyat bilgilerini net ve güncel tutmalısınız</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. İşlemler ve Sorumluluk</h2>
              <p className="text-muted-foreground leading-relaxed">
                Platform, kullanıcılar arasındaki işlemlerde aracılık yapmakla birlikte, işlemlerin sonuçlarından 
                sorumlu değildir. Kullanıcılar arasındaki satış, satın alma ve diğer işlemlerden platform sorumlu tutulamaz. 
                İşlemlerde dikkatli olmanız ve gerekli önlemleri almanız önemlidir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Hesap Güvenliği</h2>
              <p className="text-muted-foreground leading-relaxed">
                Hesap bilgilerinizin gizliliğinden ve güvenliğinden siz sorumlusunuz. 
                Şifrenizi kimseyle paylaşmamalı ve güvenli bir şifre kullanmalısınız. 
                Hesabınız üzerinden yapılan tüm işlemlerden siz sorumlusunuz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. İçerik Kaldırma ve Hesap Kapatma</h2>
              <p className="text-muted-foreground leading-relaxed">
                Platform, kullanım şartlarını ihlal eden içerikleri ve hesapları uyarı vermeksizin kaldırma veya kapatma hakkına sahiptir. 
                Yasa dışı faaliyetler, spam, dolandırıcılık veya diğer kullanıcıları rahatsız edici davranışlar hesap kapatma nedeni olabilir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Fikri Mülkiyet Hakları</h2>
              <p className="text-muted-foreground leading-relaxed">
                Platform üzerindeki içerikler, tasarımlar ve markalar ilgili sahiplerinin fikri mülkiyet haklarına tabidir. 
                İzinsiz kullanım yasal işlemlere neden olabilir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Değişiklikler</h2>
              <p className="text-muted-foreground leading-relaxed">
                Platform, kullanım şartlarını gerektiğinde değiştirme hakkını saklı tutar. 
                Önemli değişiklikler kullanıcılara bildirilecektir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Uygulanacak Hukuk</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bu kullanım şartları Türkiye Cumhuriyeti yasalarına tabidir. 
                Herhangi bir uyuşmazlık durumunda Türkiye mahkemeleri yetkilidir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. İletişim</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kullanım şartları hakkında sorularınız için bizimle iletişime geçebilirsiniz.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

