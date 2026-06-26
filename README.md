# 🗺️ GeoGemini (SightseeingAI)

**AI destekli akıllı harita gezgini** — antik, metropol, yeşil, gastronomi ve manevi kategorilerde dünyadan benzersiz yer önerileri. Tekrarlayan önerileri önlemek için ziyaret edilen noktalar istemci tarafında tutulur; backend **Gemini Gateway** ile konum üretir ve geocoding yapar.

**Canlı:** [yucel-gumus.github.io/GeoGemini](https://yucel-gumus.github.io/GeoGemini/)  
**GitHub:** [yucel-gumus/GeoGemini](https://github.com/yucel-gumus/GeoGemini)

---

## Özellikler

- 🧠 Kategori bazlı AI keşif (daha önce önerilmeyen yerler)
- 🌍 Leaflet + OpenStreetMap / CARTO Voyager karoları
- 🚫 `visited` listesi ile tekrar önleme
- ⚡ Vite + React 18 + TypeScript + Tailwind
- 🔒 Production’da API key’siz mod: **pages-bff** proxy

---

## Veri akışı

```
Kullanıcı kategori seçer
        │
        ▼
POST { category, visited[], ... }
        │
        ├─► VITE_BFF_URL/api/geo/recommend-place  (önerilen, Pages)
        │         └─► pages-bff → gateway /api/recommend-place
        │
        └─► VITE_API_URL + X-API-Key            (doğrudan, dev)
        │
        ▼
{ name, lat, lng, description, ... }
        │
        ▼
Harita flyTo + marker + kart UI
```

Gateway tarafında Gemini prompt + Nominatim / geocoding birleşimi çalışır.

---

## Kurulum

```bash
git clone https://github.com/yucel-gumus/GeoGemini.git
cd GeoGemini
npm install
cp .env.example .env
```

```env
# Geliştirme (doğrudan gateway)
VITE_API_URL=http://localhost:8000
VITE_API_KEY=your_client_key

# GitHub Pages build (BFF)
VITE_BFF_URL=https://pages-bff.vercel.app
```

```bash
npm run dev
```

---

## GitHub Pages deploy

- `main` push → GitHub Actions
- Repo **Variables:** `VITE_API_URL`, `VITE_API_KEY` veya `VITE_BFF_URL`
- Base path: `https://yucel-gumus.github.io/GeoGemini/`

Gateway CORS: `https://yucel-gumus.github.io` origin izinli olmalı (BFF kullanıldığında tarayıcı yalnızca BFF’e konuşur).

---

## Kategoriler (örnek)

| Kategori | Amaç |
|----------|------|
| Antik | Tarihî ve arkeolojik noktalar |
| Metropol | Şehir simgeleri, modern mimari |
| Yeşil | Doğa, parklar, manzaralar |
| Gastronomi | Yerel mutfak durakları |
| Manevi | Kutsal / kültürel mekânlar |

Tam liste UI ve gateway prompt şablonlarında tanımlıdır.

---

## Teknoloji

| Katman | Stack |
|--------|--------|
| Frontend | React, Vite, Tailwind, Leaflet |
| Backend | [llm_api](https://github.com/yucel-gumus/llm_api) — `/api/recommend-place` |
| BFF | [pages-bff](https://github.com/yucel-gumus/pages-bff) |

---

## Sorun giderme

| Belirti | Çözüm |
|---------|--------|
| 403 gateway | Client key düz metin mi; base64 encode etmeyin |
| CORS | BFF origin veya `ALLOWED_ORIGINS` |
| Boş harita | Geocoding hatası — gateway logları |

---

## Lisans

MIT