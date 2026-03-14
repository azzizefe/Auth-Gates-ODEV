# Test ve Keşif Dökümantasyonu (Testing & Discovery Documentation)

Bu döküman, projenin temel görevi olan **"Bir web uygulamasının iki giriş kapısını (REST API + WebSocket) keşfetme ve test etme"** sürecini açıklar.

## 1. REST API Giriş Kapısı Keşfі (REST API Entry Point Discovery)

REST API uç noktalarını keşfetmek için `endpoint_scanner.py` modülü kullanılır.

### Test Süreci:
- **Yöntem**: Wordlist tabanlı kaba kuvvet (brute-force) taraması.
- **Analiz**: Uç noktanın varlığı (HTTP 200/404) ve güvenlik durumu (HTTP 401/403) kontrol edilir.
- **Çalıştırma**:
  ```bash
  python endpoint_scanner.py <URL> -w wordlist.txt
  ```

### Beklenen Çıktı:
Bulunan uç noktalar listelenir ve "Açık" (Public) veya "Korumalı" (Protected) olarak sınıflandırılır.

---

## 2. WebSocket Giriş Kapısı Keşфi (WebSocket Entry Point Discovery)

WebSocket bağlantılarını tespit etmek ve test etmek için `ws_scanner.py` modülü kullanılır.

### Test Süreci:
- **Yöntem**: Yaygın WebSocket yolları (`/ws`, `/socket.io`, vb.) üzerinden "Protocol Upgrade" denemesi yapılır.
- **Analiz**: Bağlantının kimlik doğrulama olmadan kurulup kurulamadığı (Open vs Auth Required) test edilir.
- **Çalıştırma**:
  ```bash
  python ws_scanner.py <URL>
  ```

### Beklenen Çıktı:
WebSocket yükseltmesine izin veren yollar ve bu yolların bağlantı durumu raporlanır.

---

## 3. Otomatik Raporlama (Automated Reporting)

Tüm test sonuçları `report_manager.py` tarafından birleştirilerek `security_report.md` dosyasına aktarılır.

### Rapor İçeriği:
- Toplam bulunan uç nokta sayısı.
- Zafiyet içeren (şifresiz erişilen) API listesi.
- Açık WebSocket kapıları.
- İlgili güvenlik referansları (RFC 6455, RFC 9110, OWASP).

---

## 🛡️ Özet
Bu araç seti, bir web uygulamasının saldırı yüzeyini anlamak ve "iki ana kapı" üzerindeki güvenlik kontrollerini doğrulamak için tasarlanmıştır.

> **"Discover and test both entry points of a web application: REST API and WebSocket."**
