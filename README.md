# 🗺️ SightseeingAI

**AI Destekli Akıllı Harita Gezgini**

Sıradan rotaların dışına çıkın! Bu uygulama, yapay zeka gücünü kullanarak size dünyanın az bilinen antik, metropol, yeşil, gastronomik ve manevi harikalarını keşfettirir.

---

## 🚀 Özellikler

- 🧠 **Akıllı Keşif:** AI her kategori için size özel, daha önce önerilmemiş yerler bulur
- 🌍 **İnteraktif Harita:** Leaflet.js ile hızlı ve etkileşimli harita
- 🚫 **Tekrara Son:** Ziyaret edilen yerler hafızada tutulur
- ⚡ **Modern Arayüz:** Light mode, minimal tasarım

---

## 🛠️ Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | `python_backend` (Gemini Gateway) — `POST /api/recommend-place`, `X-API-Key` |
| Harita | Leaflet.js, OpenStreetMap, CARTO Voyager |

---

## ⚙️ Kurulum

### 1. Frontend

```bash
git clone https://github.com/yucel-gumus/GeoGemini.git
cd GeoGemini
npm install
```

`.env` dosyası oluşturun (`.env.example` kopyalayın):
```
VITE_API_URL=http://localhost:8000
VITE_API_KEY=your_client_api_key
```

Canlı: https://yucel-gumus.github.io/GeoGemini/ — GitHub Actions build için repo **Variables**: `VITE_API_URL`, `VITE_API_KEY`.

Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

### 2. Backend

Gateway: `python_backend` (`https://api.yucelgumus.dev`). Yerel: `uvicorn` ile `:8000`. CORS’ta `https://yucel-gumus.github.io` gerekli.

---

## 💡 Nasıl Çalışır?

1. Kullanıcı kategori butonuna tıklar (Antik, Metropol, Yeşil, vb.)
2. Frontend, Backend API'ye istek gönderir
3. Backend, Gemini AI'dan öneri alır ve geocoding yapar
4. Harita yeni konuma animate ederek zoom olur

---

## 📄 Lisans

MIT Lisansı
