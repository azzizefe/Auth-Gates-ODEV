# 🛡️ RBAC System with Escalation Testing

Bu proje, OWASP Access Control ve NIST RBAC standartlarına uygun katmanlı bir yetkilendirme (RBAC) sistemi ve güvenlik laboratuvarıdır.

## 🚀 Başlıca Modüller

### 1. Kimlik Doğrulama (Auth)
- JWT tabanlı oturum yönetimi.
- Admin, Editor ve Viewer rolleri için önceden tanımlı test kullanıcıları.

### 2. İzin Matrisi (Matrix)
- Tüm kaynaklar ve eylemler üzerindeki yetki dağılımını gösteren interaktif tablo.
- Gerçek zamanlı API erişim testi imkanı.

### 3. Güvenlik Denetimi (Escalation Lab)
3 temel saldırı senaryosunu test eder:
- **Vertical Escalation**: Düşük yetkili bir kullanıcının (Viewer), yüksek yetkili işlemleri (Admin) denemesi.
- **Horizontal Escalation**: Bir kullanıcının başka bir kullanıcının verilerine (Tenant Isolation) erişmeye çalışması.
- **Token Manipulation**: Değiştirilmiş veya geçersiz kılınmış jetonlarla sızma girişimi.

## 🛠 Teknik Altyapı
- **Backend**: Node.js, Express, TypeScript, JWT.
- **Veritabanı**: SQLite (In-memory) - Tüm yetkisiz erişimler `audit_logs` tablosuna kaydedilir.
- **Frontend**: Vanilla HTML/CSS/JS - Profesyonel Dashboard.

## ⚙️ Kurulum ve Çalıştırma

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
2. Sunucuyu başlatın:
   ```bash
   npm run dev
   ```
3. Otomatik güvenlik testlerini çalıştırın:
   ```bash
   npm run test:escalation
   ```
4. Dashboard'a erişin: `http://localhost:3000`

## 👥 Test Kullanıcıları
- **Admin**: `admin` / `admin123`
- **Editor**: `editor` / `edit123`
- **Viewer**: `viewer` / `view123`

---
*Bu sistem, her türlü yetkisiz erişim denemesini loglar ve siber güvenlik denetimleri için kapsamlı bir temel sunar.*
