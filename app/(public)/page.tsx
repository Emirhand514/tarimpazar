import Link from "next/link";
import { ArrowRight, Tractor, Wheat, Users, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Tractor className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              TarımPlatform
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/auth/sign-in"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/auth/sign-up"
              className="hidden md:inline-flex h-10 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Kayıt Ol
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-accent/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-secondary/20 px-3 py-1 text-sm text-secondary-foreground mb-4 font-semibold">
                🚜 Türkiye'nin Çiftçi Ağı
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-foreground">
                Tarladan Sofraya <br className="hidden sm:inline" />
                <span className="text-primary">Güvenli Ticaret</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl mt-4">
                Çiftçiler, biçerdöver operatörleri ve tüccarlar tek platformda. 
                İş gücünüzü bulun, ürününüzü değerinde satın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-lg font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Hemen Başla
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex h-14 items-center justify-center rounded-xl border border-input bg-background px-8 text-lg font-bold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  İlanları İncele
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center p-6 border rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Geniş İş Ağı</h3>
                <p className="text-muted-foreground">
                  Binlerce operatör ve mevsimlik işçi ile anında iletişim kurun.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center p-6 border rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 bg-secondary/20 rounded-full mb-4">
                  <Wheat className="h-10 w-10 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ürün Pazarı</h3>
                <p className="text-muted-foreground">
                  Hasat ettiğiniz ürünleri komisyonsuz ve doğrudan alıcıya ulaştırın.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center p-6 border rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <ShieldCheck className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Güvenli Ödeme</h3>
                <p className="text-muted-foreground">
                  Doğrulanmış kullanıcılar ve güvenli altyapı ile ticaret yapın.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t py-6 md:py-0 bg-muted/30">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; 2025 TarımPlatform. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4">
              Gizlilik
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}