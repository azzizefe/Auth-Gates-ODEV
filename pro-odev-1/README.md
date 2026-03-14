# #01 Web App Gates (Web Uygulama Kapıları)

**"Bir web uygulamasının iki giriş kapısını (REST API + WebSocket) keşfet ve test et."**  
**"Discover and test both entry points of a web application: REST API and WebSocket."**

---

## 🎯 Projenin Amacı
Bu araç, modern web uygulamalarının en kritik giriş noktaları olan REST API ve WebSocket uç noktalarını otomatik olarak keşfetmek, yetkilendirme (authentication) açıklarını tespit etmek ve güvenlik durumunu raporlamak için geliştirilmiştir.

---

## ✅ Görevler (Tasks)
Proje, aşağıdaki temel güvenlik görevlerini tam olarak yerine getirmektedir:

1.  **REST API endpoint keşif tarayıcısı yaz**: Wordlist tabanlı dinamik uç nokta keşif motoru.
2.  **Her endpoint'in auth gereksinimini tespit et (401 vs 200)**: Bulunan uç noktaların kimlik doğrulama gereksinimlerini otomatik analiz eder.
3.  **WebSocket bağlantı testi ve auth kontrolü**: Uygulamanın WebSocket kapılarını arar ve bağlantı güvenliğini test eder.
4.  **Güvenlik durumu raporu oluştur**: Tüm bulguları `security_report.md` dosyasında profesyonelce özetler.

---

## 🛠️ Modüler Yapı (Proje Çıktıları)
Proje, her biri belirli bir görevi üstlenen modüllerden oluşur:
- `endpoint_scanner.py`: API keşfi ve Auth analizi aracı.
- `ws_scanner.py`: WebSocket test scripti.
- `report_manager.py`: Güvenlik raporu oluşturucu.
- `main.py`: Merkezi kontrol ve sloganla çalışan ana uygulama.

---

## 🚀 Kullanım

### Kurulum
```bash
python -m pip install -r requirements.txt
```

### Çalıştırma
```bash
python main.py <HEDEF_URL>
```

Örnek:
```bash
python main.py http://example.com -v
```

---

## 📁 Dosya Yapısı
- `main.py`: Ana giriş noktası.
- `endpoint_scanner.py`: API tarama modülü.
- `ws_scanner.py`: WebSocket test modülü.
- `report_manager.py`: Raporlama modülü.
- `wordlist.txt`: Keşif için kullanılan sözlük.
- `security_report.md`: Üretilen güvenlik raporu.

---
*Bu proje Web Güvenliği dersi kapsamında, "Açık Kapı" analizi gereksinimlerini karşılamak üzere geliştirilmiştir.*