# Domain DNS Ayarları

## TarımPazar Domain DNS Yapılandırması

### DNS Kayıtları

Domain sağlayıcınızın DNS ayarlarında aşağıdaki kayıtları ekleyin:

#### 1. A Kaydı (Ana Domain)
- **Tip:** A
- **Host/Name:** `@` veya boş
- **Value/IP:** `173.212.232.190`
- **TTL:** `3600` (1 saat) veya varsayılan

#### 2. CNAME Kaydı (WWW Alt Domain)
- **Tip:** CNAME
- **Host/Name:** `www`
- **Value:** `tarimpazar.com`
- **TTL:** `3600` (1 saat) veya varsayılan

### DNS Kontrolü

DNS kayıtlarının yayılmasını kontrol etmek için:

```bash
# Terminal'den
dig tarimpazar.com
nslookup tarimpazar.com

# Online araçlar
https://dnschecker.org/#A/tarimpazar.com
https://www.whatsmydns.net/#A/tarimpazar.com
```

### SSL Sertifikası (DNS Kayıtları Yayıldıktan Sonra)

DNS kayıtları yayıldıktan sonra SSL sertifikası almak için:

```bash
# Sunucuya bağlanın
ssh root@173.212.232.190

# Certbot ile SSL sertifikası alın
certbot --nginx -d tarimpazar.com -d www.tarimpazar.com
```

### Mevcut Durum

- ✅ Sunucu çalışıyor: http://173.212.232.190
- ✅ Nginx yapılandırıldı
- ✅ Next.js uygulaması çalışıyor
- ⏳ DNS kayıtları bekleniyor

### Not

DNS yayılımı genellikle 5 dakika ile 48 saat arasında sürer. DNS kayıtları yayıldıktan sonra domain üzerinden siteye erişebilirsiniz.

