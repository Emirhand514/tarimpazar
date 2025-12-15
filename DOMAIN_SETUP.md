# 🌐 Domain Bağlama Rehberi - tarimpazar.com

## 📋 Genel Bakış

Domain'i sunucuya bağlamak için aşağıdaki adımları takip edin:

## 1️⃣ DNS Ayarları (Domain Sağlayıcınızda)

Domain'inizi aldığınız yerde (GoDaddy, Namecheap, vs.) DNS ayarlarına gidin ve şu kayıtları ekleyin:

### A Record (IPv4)
```
Type: A
Name: @ (veya boş)
Value: 173.212.232.190
TTL: 3600 (veya otomatik)
```

### AAAA Record (IPv6) - Opsiyonel
```
Type: AAAA
Name: @ (veya boş)
Value: 2a02:c207:2297:2788::1
TTL: 3600 (veya otomatik)
```

### WWW Subdomain (CNAME veya A Record)

**Seçenek 1: CNAME (Önerilen)**
```
Type: CNAME
Name: www
Value: tarimpazar.com
TTL: 3600
```

**Seçenek 2: A Record**
```
Type: A
Name: www
Value: 173.212.232.190
TTL: 3600
```

### DNS Kayıt Örnekleri:

**GoDaddy için:**
1. Domain yönetimi → DNS yönetimi
2. "A" kaydı ekle: `@` → `173.212.232.190`
3. "CNAME" kaydı ekle: `www` → `tarimpazar.com`

**Namecheap için:**
1. Domain List → Manage → Advanced DNS
2. Add New Record → A Record → `@` → `173.212.232.190`
3. Add New Record → CNAME Record → `www` → `tarimpazar.com`

## 2️⃣ DNS Yayılmasını Bekleyin

DNS kayıtlarının yayılması 5 dakika ile 48 saat arasında sürebilir (genellikle 15-30 dakika).

DNS yayılmasını kontrol etmek için:

```bash
# Terminal'den kontrol
nslookup tarimpazar.com
dig tarimpazar.com
ping tarimpazar.com

# Online araçlar
- https://dnschecker.org
- https://www.whatsmydns.net
```

## 3️⃣ Nginx Yapılandırması

Nginx config dosyası zaten domain adını içeriyor. Kontrol etmek için:

```bash
cat /etc/nginx/sites-available/tarimpazar | grep server_name
```

Eğer domain adı yoksa veya güncellemek isterseniz:

```bash
# Config dosyasını düzenle
nano /etc/nginx/sites-available/tarimpazar

# Server name kısmını şu şekilde güncelle:
server_name tarimpazar.com www.tarimpazar.com 173.212.232.190;

# Nginx'i test et
nginx -t

# Nginx'i yeniden başlat
systemctl reload nginx
```

## 4️⃣ SSL Sertifikası Kurulumu (Let's Encrypt)

DNS yayıldıktan sonra SSL sertifikası kuralım:

```bash
# Certbot kurulumu
apt-get update
apt-get install -y certbot python3-certbot-nginx

# SSL sertifikası al (otomatik Nginx config güncellemesi ile)
certbot --nginx -d tarimpazar.com -d www.tarimpazar.com

# Sertifika yenileme testi
certbot renew --dry-run
```

Certbot şunları yapacak:
- SSL sertifikası alacak
- Nginx config'ini otomatik güncelleyecek
- HTTP'den HTTPS'e yönlendirme ekleyecek
- Otomatik yenileme cron job'ı ekleyecek

## 5️⃣ Güvenlik Duvarı Ayarları

Port 80 (HTTP) ve 443 (HTTPS) açık olmalı:

```bash
# UFW kontrolü
ufw status

# Gerekirse portları aç
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp  # SSH (zaten açık olmalı)
```

## 6️⃣ Domain Testi

### DNS Kontrolü
```bash
# DNS çözümlemesini kontrol et
nslookup tarimpazar.com
# Beklenen: 173.212.232.190

# Ping testi
ping tarimpazar.com
# Beklenen: 173.212.232.190'den yanıt
```

### HTTP/HTTPS Kontrolü
```bash
# HTTP testi (SSL kurulumundan önce)
curl -I http://tarimpazar.com

# HTTPS testi (SSL kurulumundan sonra)
curl -I https://tarimpazar.com
```

### Tarayıcıdan Test
1. http://tarimpazar.com açılmalı
2. http://www.tarimpazar.com açılmalı
3. SSL kurulumundan sonra https://tarimpazar.com çalışmalı

## 7️⃣ Son Kontroller

### Nginx Log Kontrolü
```bash
# Access log
tail -f /var/log/nginx/tarimpazar-access.log

# Error log
tail -f /var/log/nginx/tarimpazar-error.log
```

### PM2 Durumu
```bash
pm2 status
pm2 logs tarimpazar
```

## 📝 Önemli Notlar

1. **DNS Yayılması:** İlk kez domain ekliyorsanız 24-48 saat bekleyin. Güncelleniyorsa 15-30 dakika yeterli.

2. **SSL Sertifikası:** Let's Encrypt ücretsizdir ve 90 günde bir otomatik yenilenir.

3. **Nginx Reload:** Config değişikliklerinden sonra mutlaka `nginx -t` ile test edin ve `systemctl reload nginx` ile yeniden yükleyin.

4. **Domain Doğrulama:** DNS yayılmadan SSL sertifikası alınamaz. Önce DNS'in yayılmasını bekleyin.

## 🔧 Sorun Giderme

### Domain çalışmıyor
```bash
# DNS kontrolü
dig tarimpazar.com +short
# 173.212.232.190 dönmeli

# Nginx durumu
systemctl status nginx

# Port kontrolü
ss -tlnp | grep -E '80|443'
```

### SSL kurulumu başarısız
- DNS'in tamamen yayıldığından emin olun
- Port 80'in açık olduğunu kontrol edin
- Nginx config'inde server_name'in doğru olduğunu kontrol edin

### 502 Bad Gateway
- PM2 durumunu kontrol edin: `pm2 status`
- Nginx error loglarını kontrol edin: `tail -f /var/log/nginx/tarimpazar-error.log`
- Uygulamanın çalıştığını kontrol edin: `curl http://localhost:3000`

## 📞 Yardım

Sorun yaşarsanız:
1. DNS checker ile domain yayılımını kontrol edin
2. Nginx ve PM2 loglarını kontrol edin
3. Sunucu bağlantısını test edin

