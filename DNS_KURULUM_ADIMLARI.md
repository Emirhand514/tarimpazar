# DNS Kurulum Adımları - tarimpazar.com

## Sorun
Domain üzerinden siteye erişilemiyor çünkü DNS kayıtları eksik.

## Çözüm: DNS Kayıtlarını Ekleyin

### 1. Domain Sağlayıcınızın DNS Yönetim Paneline Giriş Yapın

Domain'i nereden aldıysanız (GoDaddy, Namecheap, Türkticaret, vb.) oranın yönetim paneline giriş yapın.

### 2. DNS Ayarlarına Gidin

DNS ayarları genellikle şu isimlerle bulunur:
- DNS Yönetimi
- DNS Ayarları  
- DNS Records
- Name Servers

### 3. Aşağıdaki Kayıtları Ekleyin

#### A) A Kaydı (Ana Domain için)

**Örnek görünüm:**

| Tip | Host/Name | Value/IP | TTL |
|-----|-----------|----------|-----|
| A   | @         | 173.212.232.190 | 3600 |

Veya bazı sağlayıcılarda:

| Tip | Host/Name | Value/IP | TTL |
|-----|-----------|----------|-----|
| A   | (boş)     | 173.212.232.190 | 3600 |

#### B) CNAME Kaydı (www için)

| Tip   | Host/Name | Value | TTL |
|-------|-----------|-------|-----|
| CNAME | www       | tarimpazar.com | 3600 |

### 4. Kayıtları Kaydedin

Kayıtları ekledikten sonra "Kaydet" veya "Uygula" butonuna tıklayın.

### 5. DNS Yayılımını Bekleyin

- **Genellikle:** 5 dakika - 2 saat
- **Bazen:** 24-48 saat

### 6. DNS Kontrolü

Kayıtların yayıldığını kontrol etmek için:

**Online araçlar:**
- https://dnschecker.org/#A/tarimpazar.com
- https://www.whatsmydns.net/#A/tarimpazar.com

**Terminal'den:**
```bash
dig tarimpazar.com
nslookup tarimpazar.com
```

**Beklenen sonuç:**
```
tarimpazar.com.    IN    A    173.212.232.190
```

### 7. DNS Yayıldıktan Sonra

DNS yayıldıktan sonra domain üzerinden siteye erişebilirsiniz:
- http://tarimpazar.com
- http://www.tarimpazar.com

### Önemli Notlar

- ⚠️ DNS kayıtları yayılana kadar site sadece IP üzerinden erişilebilir: http://173.212.232.190
- ✅ Sunucu çalışıyor ve hazır
- ⏳ DNS kayıtlarının eklenmesi bekleniyor

### Yardım

DNS kayıtlarını eklerken sorun yaşarsanız:
1. Domain sağlayıcınızın destek ekibiyle iletişime geçin
2. Onlara şu bilgiyi verin: "tarimpazar.com domain'i için A kaydı eklemek istiyorum, IP: 173.212.232.190"

