# 🗺️ Serendipity Maps ✨

**Gemini AI Destekli Akıllı Harita Gezgini**

Sıradan rotaların dışına çıkın! Bu proje, Google Gemini AI'ın gücünü kullanarak size dünyanın az bilinen antik, metropol, yeşil, gastronomik ve manevi harikalarını keşfettirir. Her tıklamada yeni bir macera sizi bekliyor.

---

## 📸 Ekran Görüntüsü

*Projenizin çalışan bir GIF'ini veya ekran görüntüsünü buraya eklemeniz, ziyaretçilerin ilgisini çekmek için harika bir yoldur!*

![Serendipity Maps Demo](https://placehold.co/800x500/181a1b/c3c6c7?text=Proje+Ekran+G%C3%B6r%C3%BCnt%C3%BCs%C3%BC)
*<p align="center">Uygulamanın çalışan hali</p>*

---

## 🚀 Temel Özellikler

*   **🧠 Akıllı Keşif:** Google Gemini AI, her kategori için size özel, daha önce önerilmemiş yerler bulur.
*   **🌍 İnteraktif Harita:** Leaflet.js ile oluşturulmuş, hızlı ve etkileşimli harita üzerinde konumları anında görüntüleyin.
*   **🔄 Akıllı Yeniden Deneme:** AI'nın önerdiği bir konum haritalanamazsa veya daha önce ziyaret edilmişse, sistem size göstermeden arka planda yeni bir tane arar.
*   **🚫 Tekrara Son:** Uygulama, ziyaret ettiğiniz yerleri hafızasında tutar ve aynı yeri tekrar önermez.
*   **⚡ Modern Arayüz:** Hızlı, sade ve karanlık/aydınlık tema desteği sunan modern bir arayüz.
*   **🛡️ Sağlam Hata Yönetimi:** API limitlerine takılmayı önleyen `debounce` mekanizması ve kullanıcı dostu hata mesajları.

---

## 🛠️ Kullanılan Teknolojiler

*   **Frontend:** HTML5, CSS3, TypeScript
*   **AI:** Google Gemini API (gemini-2.0-flash-exp)
*   **Harita:** [Leaflet.js](https://leafletjs.com/) & [OpenStreetMap](https://www.openstreetmap.org/)
*   **Geliştirme Ortamı:** [Vite](https://vitejs.dev/)
*   **Asenkron Yönetim:** AbortController, Debounce

---

## ⚙️ Kurulum ve Başlatma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  **Depoyu Klonlayın:**
    ```bash
    git clone https://github.com/KULLANICI_ADINIZ/SerendipityMaps.git
    cd SerendipityMaps
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **API Anahtarını Ayarlayın:**
    *   Proje kök dizininde `.env` adında bir dosya oluşturun.
    *   İçine Google Gemini API anahtarınızı aşağıdaki gibi ekleyin:
        ```
        GEMINI_API_KEY=BURAYA_API_ANAHTARINIZI_YAPISTIRIN
        ```
    *   *Not: Proje, Vite kullanarak `process.env.GEMINI_API_KEY` değişkenini `.env` dosyasından otomatik olarak okuyacak şekilde yapılandırılmıştır.*

4.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    npm run dev
    ```
    Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

---

## 💡 Nasıl Çalışıyor?

Bu proje, modern web teknolojileri ile güçlü yapay zekanın birleşiminin harika bir örneğidir:

1.  **Kullanıcı Etkileşimi:** Kullanıcı bir kategori butonuna tıkladığında, `debounce` mekanizması API'ye aşırı yüklenmeyi önler.
2.  **İstem Mühendisliği (Prompt Engineering):** Seçilen kategoriye ve daha önce ziyaret edilen yerlerin listesine göre, AI'ya özel olarak tasarlanmış bir sistem talimatı (`systemInstructions`) ve dinamik bir istem (`enhancedPrompt`) gönderilir.
3.  **Gemini AI & Fonksiyon Çağırma:** Gemini, bu isteme göre az bilinen bir yer önerir ve sonucu `recommendPlace(location, caption)` fonksiyon çağrısı formatında döndürür.
4.  **Doğrulama ve Haritalama:** Uygulama, AI'dan gelen `location` adının OpenStreetMap üzerinde coğrafi olarak kodlanabilir (geocodable) olup olmadığını kontrol eder.
5.  **Akıllı Döngü:** Eğer konum geçersizse veya daha önce önerilmişse, uygulama kullanıcıya hiçbir şey göstermeden arka planda AI'dan yeni bir öneri ister (maksimum 3 deneme).
6.  **Sonuç:** Geçerli ve yeni bir konum bulunduğunda, Leaflet.js haritası güncellenir ve AI'nın açıklaması kullanıcıya gösterilir.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.
