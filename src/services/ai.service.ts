import { Location } from '@/types';

const BFF_URL = import.meta.env.VITE_BFF_URL || 'https://pages-bff.vercel.app';

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
  ],
};

class AIService {
  private visitedLocations: string[] = [];

  async generateRecommendation(prompt: string): Promise<Location | null> {
    try {
      const response = await fetch(`${BFF_URL}/api/geo/recommend-place`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          visited_locations: this.visitedLocations,
        }),
      });

      if (response.ok) {
        const data: RecommendPlaceResponse = await response.json();
        if (data.success && data.location) {
          this.visitedLocations.push(data.location.name);
          return {
            name: data.location.name,
            lat: data.location.lat,
            lng: data.location.lng,
            caption: data.location.caption,
          };
        }
      }
    } catch {
      // If network fails (e.g. offline), use smart offline dataset
      console.warn('Network request failed. Using offline fallback dataset.');
    }

    // Offline / Fallback
    const fallbackLocation = this.getOfflineFallback(prompt);
    this.visitedLocations.push(fallbackLocation.name);
    return fallbackLocation;
  }

  private getOfflineFallback(prompt: string): Location {
    const promptLower = prompt.toLowerCase();
    let categoryKey = 'antique';

    if (promptLower.includes('metropol') || promptLower.includes('şehir')) categoryKey = 'metropol';
    else if (promptLower.includes('doğa') || promptLower.includes('yeşil')) categoryKey = 'nature';
    else if (promptLower.includes('lezzet') || promptLower.includes('mutfak')) categoryKey = 'food';
    else if (promptLower.includes('manevi') || promptLower.includes('tapınak')) categoryKey = 'spiritual';

    const pool = MOCK_LOCATIONS[categoryKey] || MOCK_LOCATIONS.antique;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  clearHistory(): void {
    this.visitedLocations = [];
  }
}

export const aiService = new AIService();