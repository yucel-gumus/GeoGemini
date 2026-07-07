# 🗺️ GeoGemini (AI Destekli Akıllı Coğrafi Keşif Platformu)

GeoGemini; kullanıcıların sıradan rotaların dışına çıkmasını sağlayan, Google Gemini yapay zeka modelinin gücüyle dünya üzerindeki saklı kalmış antik, metropol, yeşil, gastronomi ve manevi harikaları harita üzerinde interaktif olarak keşfettiren modern bir **React 19 & Vite 6** web uygulamasıdır.

---

## 🌟 Öne Çıkan Özellikler

* 🧠 **Kategori Bazlı AI Keşif:** Kullanıcılar 5 farklı tematik kategori arasından seçim yapabilir:
  * **Antik:** Tarihî, arkeolojik ve antik çağ kalıntıları.
  * **Metropol:** Şehir simgeleri, gökdelenler ve modern mimarî yapılar.
  * **Yeşil:** Doğa harikaları, milli parklar ve eşsiz manzaralar.
  * **Gastronomi:** Yerel mutfak durakları ve meşhur lezzet noktaları.
  * **Manevi:** Kültürel, dini ve kutsal/spiritüel mekânlar.
* 🚫 **Tekrar Önleyici Ziyaret Mekanizması (`visited` list):** Kullanıcının daha önce keşfettiği konumlar tarayıcı hafızasında (`visited[]` dizisi) tutulur ve her yeni istekte yapay zekaya hariç tutulacaklar listesi olarak gönderilir. Bu sayede her tıklamada **tamamen yeni ve keşfedilmemiş** yerler önerilir.
* 🌍 **Leaflet & CARTO Voyager Harita Tasarımı:** Keşfedilen yerler, CARTO Voyager harita katmanı üzerinde şık işaretçiler (markers) ile gösterilir ve harita `flyTo` akıcı zum animasyonu ile o konuma odaklanır.
* ⚡ **Next-Gen React 19 Altyapısı:** React 19'un yeni performans özellikleri, Framer Motion animasyonları ve TailwindCSS v4 ile pürüzsüz bir UI/UX deneyimi.
* 🛡️ **BFF (Backend for Frontend) Güvenlik Katmanı:** Canlı sürümde API anahtarlarını güvenli tutmak için doğrudan API ile konuşmak yerine **pages-bff** proxy'si üzerinden çalışır.

---

## 🏗️ Veri Akışı ve RAG Yapısı

```
[ Kullanıcı Kategori Seçer ] 
           │
           ▼
[ POST /api/recommend-place ] ──► Girdiler: { category, visited_locations[] }
           │
           ▼
[ Gemini 3.5 Flash Model ] ──► (visited_locations'ları dışlayarak yeni bir konum üretir)
           │
           ▼
[ Nominatim Geocoding ] ──► (İsmi koordinatlara [lat, lng] dönüştürür)
           │
           ▼
[ JSON Yanıtı ] ──► { name, lat, lng, description, country, category }
           │
           ▼
[ Lit/React Arayüzü ] ──► Haritada flyTo() animasyonu + Popup ve Bilgi Kartı gösterimi
```

---

## 🛠️ Teknoloji Stack

* **Frontend:** React 19, Vite 6, TypeScript, TailwindCSS v4.
* **Harita & Harita Karoları:** Leaflet, React Leaflet, CARTO Voyager Tiles (OpenStreetMap tabanlı).
* **Animasyonlar:** Framer Motion (pürüzsüz geçişler, kart animasyonları).
* **Yapay Zeka API:** Google Gemini API (via [llm_api Gateway](https://github.com/yucel-gumus/llm_api)).
* **BFF Proxy:** [pages-bff](https://github.com/yucel-gumus/pages-bff).

---

## 🚀 Kurulum ve Yerel Çalıştırma

### 1. Bağımlılıkları Yükleyin
```bash
git clone https://github.com/yucel-gumus/GeoGemini.git
cd GeoGemini
npm install
```

### 2. Ortam Değişkenleri (`.env`)
Proje kök dizininde `.env` dosyası oluşturun ve geçit adreslerini tanımlayın:

```env
# Geliştirme Ortamı (Doğrudan Gateway bağlantısı için)
VITE_API_URL=http://localhost:8000
VITE_API_KEY=your_development_client_key

# Üretim (Production) BFF bağlantısı (Pages için)
VITE_BFF_URL=https://pages-bff.vercel.app
```

### 3. Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```
Uygulama `http://localhost:5173` adresinde başlayacaktır.

### 4. GitHub Pages Dağıtımı (Deploy)
Proje yerleşik `gh-pages` desteği barındırır. Dist sürümünü derlemek ve GitHub Pages'e yüklemek için:
```bash
npm run build
npm run deploy
```

---

## 🔗 Canlı Bağlantılar
* **Canlı Demo:** [https://yucel-gumus.github.io/GeoGemini/](https://yucel-gumus.github.io/GeoGemini/)
* **API Gateway Kaynak Kodu:** [yucel-gumus/llm_api](https://github.com/yucel-gumus/llm_api)