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
| Backend | Python FastAPI, Google Gemini API |
| Harita | Leaflet.js, OpenStreetMap, CARTO Voyager |

---

## ⚙️ Kurulum

### 1. Frontend

```bash
git clone https://github.com/yucel-gumus/GeoGemini.git
cd GeoGemini
npm install
```

`.env` dosyası oluşturun:
```
VITE_API_URL=http://localhost:8000
```

Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

### 2. Backend

Backend API'yi ayrı bir terminal'de başlatın:
```bash
cd backend
pip install -r requirements.txt
python main.py
```

Backend `.env` dosyası:
```
GEMINI_API_KEY=your_api_key_here
ALLOWED_ORIGINS=http://localhost:5173
```

---

## 💡 Nasıl Çalışır?

1. Kullanıcı kategori butonuna tıklar (Antik, Metropol, Yeşil, vb.)
2. Frontend, Backend API'ye istek gönderir
3. Backend, Gemini AI'dan öneri alır ve geocoding yapar
4. Harita yeni konuma animate ederek zoom olur

---

## 📄 Lisans

MIT Lisansı
