import { Location } from '@/types';

const BFF_URL =
  import.meta.env.VITE_BFF_URL ||
  (import.meta.env.PROD ? 'https://pages-bff.vercel.app' : 'http://127.0.0.1:3099');

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY || '';

const isLocalhostUrl = (url?: string) =>
  !!url && (url.includes('127.0.0.1') || url.includes('localhost'));


interface RecommendPlaceResponse {
  success: boolean;
  location?: {
    name: string;
    lat: number;
    lng: number;
    caption: string;
  };
  error?: string;
}

// Client-side fallback dataset when offline or BFF unreachable
const MOCK_LOCATIONS: Record<string, Location[]> = {
  antique: [
    {
      name: 'Göbeklitepe, Şanlıurfa',
      lat: 37.2233,
      lng: 38.9206,
      caption: 'İnsanlık tarihinin bilinen en eski tapınak kompleksi. Tarihi M.Ö. 9600 yıllarına kadar uzanır.',
    },
    {
      name: 'Petra Antik Kenti, Ürdün',
      lat: 30.3289,
      lng: 35.4444,
      caption: 'Pembe kayalıklara oyulmuş görkemli Nabati krallığı başkenti.',
    },
    {
      name: 'Persepolis, İran',
      lat: 29.9356,
      lng: 52.8914,
      caption: 'Pers İmparatorluğu\'nun görkemli törensel başkenti ve antik mimari harikası.',
    },
    {
      name: 'Machu Picchu, Peru',
      lat: -13.1631,
      lng: -72.545,
      caption: 'And Dağları\'nın sisli zirvelerine gizlenmiş efsanevi İnka şehri.',
    },
    {
      name: 'Efes Antik Kenti, İzmir',
      lat: 37.9409,
      lng: 27.3417,
      caption: 'Celsus Kütüphanesi ve antik tiyatrosuyla Roma döneminin en ihtişamlı liman kenti.',
    },
  ],
  metropol: [
    {
      name: 'Tokyo (Shibuya & Shinjuku), Japonya',
      lat: 35.6762,
      lng: 139.6503,
      caption: 'Geleneksel kültür ile yüksek teknolojinin buluştuğu dünyanın en dinamik metropolü.',
    },
    {
      name: 'Seul, Güney Kore',
      lat: 37.5665,
      lng: 126.978,
      caption: 'Gece hayatı, K-pop ritmi ve tarihi saraylarıyla kesintisiz yaşayan şehir.',
    },
    {
      name: 'New York City (Manhattan), ABD',
      lat: 40.7128,
      lng: -74.006,
      caption: 'Gökdelenleri, Broadway sahneleri ve 24 saat yaşayan enerjisiyle dünya finans ve kültür başkenti.',
    },
    {
      name: 'Londra, Birleşik Krallık',
      lat: 51.5074,
      lng: -0.1278,
      caption: 'Thames Nehri kıyısında tarihi müzeleri, kraliyet parkları ve cosmopolit dokusuyla ikonik metropol.',
    },
    {
      name: 'Şanghay, Çin',
      lat: 31.2304,
      lng: 121.4737,
      caption: 'The Bund tarihi binaları ile Pudong gökdelenlerinin oluşturduğu büyüleyici zıtlık.',
    },
  ],
  nature: [
    {
      name: 'Plitvice Gölleri, Hırvatistan',
      lat: 44.8654,
      lng: 15.582,
      caption: 'Turkuaz rengi gölleri ve doğal şelaleleriyle masalsı bir milli park.',
    },
    {
      name: 'Banff Milli Parkı, Kanada',
      lat: 51.4968,
      lng: -115.9281,
      caption: 'Kayalık Dağlar\'ın gölgesinde buzulları ve el değmemiş doğasıyla büyüleyici bir cennet.',
    },
    {
      name: 'Jiuzhaigou Vadisi, Çin',
      lat: 33.26,
      lng: 103.9167,
      caption: 'Çok renkli gölleri, katmanlı şelaleleri ve karlı dağ fonu ile bilinen doğa harikası.',
    },
    {
      name: 'Iguazu Şelaleleri, Arjantin/Brezilya',
      lat: -25.6953,
      lng: -54.4367,
      caption: 'Devasa yağmur ormanları ortasında kükreyen 275 ayrı şelaleden oluşan doğa mucizesi.',
    },
    {
      name: 'Ha Long Bay, Vietnam',
      lat: 20.9101,
      lng: 107.1839,
      caption: 'Zümrüt yeşili sular üzerinde yükselen binlerce kireçtaşı adası ve saklı mağaralar.',
    },
  ],
  food: [
    {
      name: 'Oaxaca, Meksika',
      lat: 17.0732,
      lng: -96.7266,
      caption: 'Zengin baharatları, Mole sosları ve mezcal lezzetleriyle gastronomik bir devrim.',
    },
    {
      name: 'San Sebastián, İspanya',
      lat: 43.3183,
      lng: -1.9812,
      caption: 'Dünyanın en yüksek Michelin yıldızı yoğunluğuna sahip Pintxos başkenti.',
    },
    {
      name: 'Osaka, Japonya',
      lat: 34.6937,
      lng: 135.5023,
      caption: 'Takoyaki, Okonomiyaki ve canlı Dotonbori sokak lezzetleri ile Japonya\'nın mutfak kalbi.',
    },
    {
      name: 'Bologna, İtalya',
      lat: 44.4949,
      lng: 11.3426,
      caption: 'El yapımı taze makarnaları, ragù sosu ve köklü gastronomi geleneğiyle İtalya\'nın lezzet başkenti.',
    },
    {
      name: 'Bangkok, Tayland',
      lat: 13.7563,
      lng: 100.5018,
      caption: 'Pad Thai\'den Michelin ödüllü sokak tezgahlarına, keskin lezzetleriyle ünlü gastronomi noktası.',
    },
  ],
  spiritual: [
    {
      name: 'Taktsang Manastırı (Kaplan Yuvası), Butan',
      lat: 27.4919,
      lng: 89.3634,
      caption: 'Uçurum kenarında 3000 metre yükseklikte konumlanmış kutsal Budist manastırı.',
    },
    {
      name: 'Meteora, Yunanistan',
      lat: 39.7217,
      lng: 21.6306,
      caption: 'Devasa kayalık pillars üzerine inşa edilmiş antik Ortodoks manastırları.',
    },
    {
      name: 'Fushimi Inari Taisha, Kyoto, Japonya',
      lat: 34.9671,
      lng: 135.7727,
      caption: 'Binlerce turuncu Torii kapısından oluşan büyüleyici dağ yolu ve antik Şinto tapınağı.',
    },
    {
      name: 'Varanasi, Hindistan',
      lat: 25.3176,
      lng: 82.9739,
      caption: 'Ganj Nehri kıyısında binlerce yıllık ritüelleri ve manevi atmosferiyle Hinduizmin kalbi.',
    },
    {
      name: 'Mont-Saint-Michel, Fransa',
      lat: 48.6361,
      lng: -1.5115,
      caption: 'Gelgit sularıyla çevrili kayalık ada üzerine kurulu gotik manastır ve tarihi kale.',
    },
  ],
  coastal: [
    {
      name: 'Santorini, Yunanistan',
      lat: 36.3932,
      lng: 25.4615,
      caption: 'Volkanik krater manzaralı bembeyaz evleri ve büyüleyici Ege gün batımları.',
    },
    {
      name: 'Amalfi Kıyıları, İtalya',
      lat: 40.634,
      lng: 14.6027,
      caption: 'Dik kayalıklara tutunmuş renkli kasabaları ve büyüleyici Tiren Denizi manzarası.',
    },
    {
      name: 'Fernando de Noronha, Brezilya',
      lat: -3.8576,
      lng: -32.4297,
      caption: 'Kristal berraklığında suları, yunusları ve koruma altındaki el değmemiş plajlarıyla tropikal cennet.',
    },
    {
      name: 'Zanzibar, Tanzanya',
      lat: -6.1659,
      lng: 39.2026,
      caption: 'Turkuaz Hint Okyanusu suları, baharat kokulu sokakları ve büyüleyici kumsalları.',
    },
  ],
  adventure: [
    {
      name: 'Fitz Roy Zirvesi, Patagonya, Arjantin',
      lat: -49.2714,
      lng: -72.887,
      caption: 'Granit kuleleri, buzulları ve zorlu tırmanış rotalarıyla trekking tutkunlarının mekka adresi.',
    },
    {
      name: 'Lauterbrunnen Vadisi, İsviçre',
      lat: 46.5935,
      lng: 7.9077,
      caption: '72 adete varan dramatik şelalesi ve karlı dağ zirveleriyle doğa sporları cenneti.',
    },
    {
      name: 'Queenstown, Yeni Zelanda',
      lat: -45.0312,
      lng: 168.6626,
      caption: 'Bungee jumping, yamaç paraşütü ve fiyord turlarıyla dünyanın macera başkenti.',
    },
    {
      name: 'Zhangjiajie Ulusal Parkı, Çin',
      lat: 29.3177,
      lng: 110.4354,
      caption: 'Avatar filmine ilham veren sisler içindeki kuvarsit kumtaşı sütunları.',
    },
  ],
  historic_village: [
    {
      name: 'Shirakawa-go, Japonya',
      lat: 36.2563,
      lng: 136.9038,
      caption: 'Gassho-zukuri tarzı dik saman çatılı evleriyle UNESCO mirası masalsı dağ köyü.',
    },
    {
      name: 'Hallstatt, Avusturya',
      lat: 47.5622,
      lng: 13.6493,
      caption: 'Göl kenarında dik dağ eteklerine kurulmuş, kartpostal güzelliğinde büyüleyici alp kasabası.',
    },
    {
      name: 'Chefchaouen (Mavi Şehir), Fas',
      lat: 35.1713,
      lng: -5.2697,
      caption: 'Rif Dağları eteklerinde maviye boyanmış labirent sokaklarıyla büyüleyici tarihi yerleşim.',
    },
    {
      name: 'Giethoorn, Hollanda',
      lat: 52.74,
      lng: 6.0772,
      caption: 'Araba yolu bulunmayan, saz çatılı evleri ve kanallarıyla bilinen "Kuzeyin Venedik\'i".',
    },
  ],
  desert: [
    {
      name: 'Wadi Rum Vadisi, Ürdün',
      lat: 29.58,
      lng: 35.42,
      caption: 'Kızıl kum tepeleri ve granit kayalıklarıyla Mars yüzeyini andıran büyüleyici çöl coğrafyası.',
    },
    {
      name: 'Atacama Çölü, Şili',
      lat: -23.8634,
      lng: -69.1328,
      caption: 'Dünyanın en kurak çölü, tuz gölleri, gayzerleri ve berrak gece gökyüzü gözlem noktası.',
    },
    {
      name: 'Salar de Uyuni, Bolivya',
      lat: -20.1338,
      lng: -67.4891,
      caption: 'Yağmur sezonunda devasa bir aynaya dönüşen dünyanın en büyük tuz düzlüğü.',
    },
  ],
  art_arch: [
    {
      name: 'Barselona (Gaudi Mimarisi), İspanya',
      lat: 41.3851,
      lng: 2.1734,
      caption: 'Sagrada Familia ve Park Güell gibi Gaudi eserleriyle modernizmin açık hava müzesi.',
    },
    {
      name: 'Bilbao (Guggenheim Müzesi), İspanya',
      lat: 43.2687,
      lng: -2.934,
      caption: 'Frank Gehry imzalı titanyum kaplama ikonik müze binasıyla kentsel dönüşüm harikası.',
    },
    {
      name: 'Brasilia, Brezilya',
      lat: -15.7975,
      lng: -47.8919,
      caption: 'Oscar Niemeyer\'in futurist tasarımlarıyla şekillenen UNESCO korumasındaki modernist başkent.',
    },
  ],
};

class AIService {
  private visitedLocations: string[] = [];

  private isAlreadyVisited(name: string): boolean {
    const targetLower = name.toLowerCase().trim();
    return this.visitedLocations.some((visited) => {
      const visitedLower = visited.toLowerCase().trim();
      if (visitedLower === targetLower) return true;

      // Check key city/place token matches (e.g., "Tokyo", "Seul", "Petra", "Göbeklitepe")
      const visitedTokens = visitedLower.split(/[\s,()/-]+/).filter((t) => t.length > 3);
      const targetTokens = targetLower.split(/[\s,()/-]+/).filter((t) => t.length > 3);

      return visitedTokens.some((vt) => targetTokens.includes(vt));
    });
  }

  async generateRecommendation(prompt: string): Promise<Location | null> {
    // Inject explicit restriction directly into the prompt sent to Gemini
    let fullPrompt = prompt;
    if (this.visitedLocations.length > 0) {
      fullPrompt += `\n\nÖNEMLİ KISITLAMA VE KURAL: Daha önce şu konumlar ziyaret edildi/önerildi: [${this.visitedLocations.join(
        ', '
      )}]. Kesinlikle bu listede geçen yerleri, şehirleri veya ülkeleri TEKRAR ÖNERME. Tamamen FARKLI ve bu listede bulunmayan YENİ bir konum öner!`;
    }

    try {
      const endpointUrl =
        import.meta.env.PROD || !API_URL || isLocalhostUrl(API_URL)
          ? `${BFF_URL}/api/geo/recommend-place`
          : `${API_URL}/api/recommend-place`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (API_KEY) {
        headers['X-API-Key'] = API_KEY;
      }

      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: fullPrompt,
          visited_locations: this.visitedLocations,
        }),
      });

      if (response.ok) {
        const data: RecommendPlaceResponse = await response.json();
        if (data.success && data.location && !this.isAlreadyVisited(data.location.name)) {
          this.visitedLocations.push(data.location.name);
          return {
            name: data.location.name,
            lat: data.location.lat,
            lng: data.location.lng,
            caption: data.location.caption,
          };
        }
      }
    } catch (err) {
      console.warn('Network request failed. Using offline fallback dataset.', err);
    }

    // Fallback to offline dataset guarantee non-visited pick
    const fallbackLocation = this.getOfflineFallback(prompt);
    if (fallbackLocation) {
      this.visitedLocations.push(fallbackLocation.name);
      return fallbackLocation;
    }

    return null;
  }

  private getOfflineFallback(prompt: string): Location | null {
    const promptLower = prompt.toLowerCase();
    let categoryKey = 'antique';

    if (promptLower.includes('antik') || promptLower.includes('harabe') || promptLower.includes('tarih')) {
      categoryKey = 'antique';
    } else if (promptLower.includes('metropol') || promptLower.includes('şehir') || promptLower.includes('sanat ortamı')) {
      categoryKey = 'metropol';
    } else if (promptLower.includes('doğa') || promptLower.includes('yeşil') || promptLower.includes('ekolojik')) {
      categoryKey = 'nature';
    } else if (promptLower.includes('lezzet') || promptLower.includes('mutfak') || promptLower.includes('gastronomik')) {
      categoryKey = 'food';
    } else if (promptLower.includes('manevi') || promptLower.includes('tapınak') || promptLower.includes('kutsal')) {
      categoryKey = 'spiritual';
    } else if (promptLower.includes('sahil') || promptLower.includes('ada') || promptLower.includes('kıyı')) {
      categoryKey = 'coastal';
    } else if (promptLower.includes('macera') || promptLower.includes('dağ') || promptLower.includes('irtifa')) {
      categoryKey = 'adventure';
    } else if (promptLower.includes('köy') || promptLower.includes('kasaba')) {
      categoryKey = 'historic_village';
    } else if (promptLower.includes('çöl') || promptLower.includes('vaha')) {
      categoryKey = 'desert';
    } else if (promptLower.includes('sanat') || promptLower.includes('mimari')) {
      categoryKey = 'art_arch';
    }

    // 1. Try selected category pool for unvisited places
    const pool = MOCK_LOCATIONS[categoryKey] || MOCK_LOCATIONS.antique;
    const unvisited = pool.filter((loc) => !this.isAlreadyVisited(loc.name));

    if (unvisited.length > 0) {
      const randomIndex = Math.floor(Math.random() * unvisited.length);
      return unvisited[randomIndex];
    }

    // 2. If selected category pool is exhausted, search ALL categories for any unvisited location
    const allLocations = Object.values(MOCK_LOCATIONS).flat();
    const anyUnvisited = allLocations.filter((loc) => !this.isAlreadyVisited(loc.name));

    if (anyUnvisited.length > 0) {
      const randomIndex = Math.floor(Math.random() * anyUnvisited.length);
      return anyUnvisited[randomIndex];
    }

    // 3. Absolute emergency fallback if literally every single mock location has been visited
    return {
      name: 'Kyoto Antik Tapınakları, Japonya',
      lat: 35.0116,
      lng: 135.7681,
      caption: 'Tarihi Zen bahçeleri ve ahşap tapınaklarıyla Japonya\'nın kadim kültürel kalbi.',
    };
  }

  clearHistory(): void {
    this.visitedLocations = [];
  }

  getVisitedCount(): number {
    return this.visitedLocations.length;
  }
}

export const aiService = new AIService();