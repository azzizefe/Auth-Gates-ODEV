# JWT ve Güvenlik Referansları

Bu döküman, **pro-odev-5 (JWT Token Forge & Cache Battle Lab)** projesinde kullanılan temel standartları ve araçları içermektedir.

## 1. RFC 7519 - JSON Web Token (JWT)
JWT, iki taraf arasında güvenli bir şekilde iddiaları (claims) temsil etmek için kullanılan JSON tabanlı bir açık standarttır.
- **Yapı**: `Header.Payload.Signature`
- **Kapsam**: Jetonların nasıl oluşturulacağı, taşınacağı ve doğrulanacağı bu standartta tanımlanmıştır.
- **Referans**: [tools.ietf.org/html/rfc7519](https://tools.ietf.org/html/rfc7519)

## 2. RFC 7515 - JSON Web Signature (JWS)
JWS, JSON veri yapılarının dijital olarak imzalanması için kullanılan bir standarttır. JWT'nin "Signature" (imza) bölümü bu standarta dayanır.
- **Amaç**: Verinin bütünlüğünü (integrity) ve kaynağının doğruluğunu (authenticity) garanti eder.
- **Algoritmalar**: HMAC (HS256 vb.) ve RSA (RS256 vb.) gibi imzalama yöntemlerini tanımlar.
- **Referans**: [tools.ietf.org/html/rfc7515](https://tools.ietf.org/html/rfc7515)

## 3. JWT.io
JWT jetonlarını görsel olarak incelemek, hata ayıklamak ve doğrulamak için kullanılan en popüler web aracıdır.
- **Kullanımı**: Projemizde oluşturduğunuz jetonları (Token Forge panelinden kopyalayarak) jwt.io üzerinde test edebilir ve projemizdeki "Live Decoder" ile karşılaştırabilirsiniz.
- **Bağlantı**: [https://jwt.io](https://jwt.io)

---
*Bu laboratuvar, yukarıdaki standartlara tam uyumlu (RFC-compliant) olarak geliştirilmiştir.*
