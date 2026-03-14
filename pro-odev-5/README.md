# 🔐 JWT Token Forge & Cache Battle Lab

Bu proje, geliştiricilerin JWT (JSON Web Token) güvenliğini anlamaları, farklı saldırı vektörlerini test etmeleri ve veritabanı ile önbellek (cache) arasındaki performans farkını canlı olarak gözlemlemeleri için tasarlanmış profesyonel bir güvenlik laboratuvarıdır.

## 🚀 Başlıca Paneller

### 1. TOKEN FORGE (Jeton Atölyesi)
- Gerçek JWT jetonları oluşturmanızı sağlar.
- **Desteklenen Algoritmalar**: HS256, HS384, HS512.
- **Özelleştirme**: Kullanıcı rolleri, geçerlilik süresi ve özel claim'ler (`tier: premium` gibi) eklenebilir.
- **Görselleştirme**: Jetonun Header, Payload ve Signature bölümleri renk kodlu olarak gösterilir.

### 2. LIVE DECODER (Canlı Çözücü)
- Herhangi bir JWT jetonunu (jwt.io'dan alınanlar dahil) gerçek zamanlı olarak çözer.
- Jetonun geçerliliğini ve kalan süresini (expiry countdown) takip eder.
- Sözdizimi vurgulamalı (syntax highlighting) JSON çıktısı sunar.

### 3. CACHE vs DB BATTLE (Performans Yarışı)
- **Simülasyon**: SQLite (veritabanı) ile `node-cache` (bellek içi önbellek) arasındaki hız farkını ölçer.
- **Gerçekçi Gecikme**: Veritabanı sorguları için 15-25ms arası yapay gecikme ve rastgele "spike"lar eklenmiştir.
- **Analiz**: Ortalama gecikme, P95/P99 değerleri ve hız farkı katsayısı (örn: "Cache is 47x faster") canlı olarak hesaplanır.

### 4. SECURITY AUDIT (Güvenlik Denetimi)
Otomatik olarak şu 6 saldırı vektörünü test eder:
1. **Süresi Geçmiş Jetonlar** (Expired)
2. **Henüz Geçerli Olmayanlar** (Not yet valid - nbf)
3. **Yanlış İmza** (Müdahale edilmiş jetonlar)
4. **Alg:None Saldırısı** (RFC 7519 §8)
5. **Yanlış Yayıncı** (Issuer mismatch)
6. **Aşırı Büyük Yük** (Oversized payload - DoS riski)

## 🛠 Teknik Yığın
- **Backend**: Node.js + Express
- **JWT**: `jsonwebtoken` (RFC 7519 uyumlu)
- **Cache**: `node-cache`
- **DB**: `better-sqlite3` (Saniyede binlerce işlem kapasiteli, bellek içi)
- **Frontend**: Vanilla HTML/CSS/JS (Framework kullanılmadı)
- **Grafikler**: Chart.js

## ⚙️ Kurulum ve Çalıştırma

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
2. Sunucuyu başlatın:
   ```bash
   npm start
   ```
3. Tarayıcıdan erişin: `http://localhost:3000`

## 📚 Referanslar
- [RFC 7519 (JSON Web Token)](https://tools.ietf.org/html/rfc7519)
- [RFC 7515 (JSON Web Signature)](https://tools.ietf.org/html/rfc7515)
- [JWT.io Debugger](https://jwt.io)
- [OWASP JWT Security Guide](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

---
*Bu laboratuvar eğitim amaçlıdır. Güçlü bir terminal estetiği ile geliştirilmiştir.*
