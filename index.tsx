/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {FunctionDeclaration, GoogleGenAI, Type} from '@google/genai';
import * as L from 'leaflet';

const systemInstructions = `Sen, sıradan turist rotalarının ötesine geçen, dünyanın gizli kalmış harikalarını ortaya çıkaran deneyimli bir kaşif ve kültürel antropologsun. Görevin, derin bir bilgelik ve özgün bir bakış açısıyla, haritada gerçekten büyüleyici ve az bilinen yerler önermektir.

ANA KURALLAR:
1.  **ÖZGÜNLÜK ESASTIR:** Asla Paris, Roma, Tokyo gibi klişe turistik yerleri önerme. Amacın, kullanıcıyı şaşırtmak ve ona yeni bir ufuk açmaktır.
2.  **GÜVENLİK ÖNCELİKLİDİR:** Aktif savaş bölgeleri, politik olarak aşırı istikrarsız ülkeler veya ulaşımı insan hayatını tehlikeye atacak kadar zor olan yerlerden kesinlikle kaçın.
3.  **TÜRKÇE İLETİŞİM:** Tüm yanıtların ve açıklamaların akıcı ve doğal bir Türkçe ile olmalıdır.

YANIT FORMATI:
1.  **AÇIKLAMA (2 Cümle):** Önerdiğin yerin neden büyüleyici olduğunu, tarihi önemini, eşsiz doğal güzelliğini veya kültürel benzersizliğini vurgulayan iki cümlelik bir açıklama yap.
2.  **FONKSİYON ÇAĞRISI:** Açıklamadan sonra, \`recommendPlace\` fonksiyonunu çağır.
    *   \`location\`: Konum adını 'Yer Adı, Ülke' formatında ve **İNGİLİZCE** olarak ver. (Örnek: 'Socotra Island, Yemen'). Bu, harita servisinin doğru çalışması için kritiktir.
    *   \`caption\`: Fonksiyon için hazırlayacağın başlık, yaptığın iki cümlelik açıklamanın kısa ve öz bir özeti olmalıdır.`;

const presets = [
  ['🗿 Antik', 'Bana az bilinen ama medeniyet tarihinde önemli bir iz bırakmış antik bir harabe veya şehir öner.'],
  ['🗽 Metropol', 'Bana kültürel dokusu zengin, sanat ortamı canlı ve klişelerden uzak, dinamik bir metropol göster.'],
  ['🌿 Yeşil', 'Beni el değmemiş, ekolojik olarak benzersiz ve biyolojik çeşitliliği ile büyüleyen bir doğa harikasına götür.'],
  ['🍲 Gastronomik', 'Bana az bilinen ama kendine özgü mutfağıyla bir lezzet devrimi yaratan bir şehir veya bölge öner.'],
  ['🙏 Manevi', 'Bana farklı inançlar için tarihi veya manevi önemi büyük olan, mimari olarak etkileyici bir tapınak, manastır veya kutsal mekan öner.'],
];

const recommendPlaceFunctionDeclaration: FunctionDeclaration = {
  name: 'recommendPlace',
  parameters: {
    type: Type.OBJECT,
    description: 'Kullanıcıya sağlanan yerin haritasını gösterir.',
    properties: {
      location: {
        type: Type.STRING,
        description: 'Ülke adını da içerecek şekilde belirli bir yer belirt. Lokasyon adını İNGİLİZCE olarak ver (örn: Vostok Station, Antarctica).',
      },
      caption: {
        type: Type.STRING,
        description:
          'Yer adını ve bu belirli yeri seçmendeki büyüleyici sebebi ver. Başlığı maksimum bir veya iki cümle tut.',
      },
    },
    required: ['location', 'caption'],
  },
};

const captionDiv = document.querySelector('#caption') as HTMLDivElement;
const mapContainer = document.querySelector('#map-container') as HTMLDivElement;

// The map instance is now initialized in main() and is never null afterward.
let map: L.Map;

// Global request controller for cancelling previous requests
let currentController: AbortController | null = null;
// Debounce timer
let debounceTimer: number | null = null;
// Keep track of visited locations to ensure variety
const visitedLocations = new Set<string>();

async function generateContent(prompt: string) {
  // This is the actual function that runs after the debounce timer.
  const thisController = new AbortController();
  currentController = thisController;

  captionDiv.textContent = 'Yeni bir lokasyon aranıyor...';
  captionDiv.classList.remove('hidden');

  const MAX_RETRIES = 3;
  let success = false;

  for (let attempt = 1; attempt <= MAX_RETRIES && !thisController.signal.aborted; attempt++) {
    console.log(`Attempt ${attempt}/${MAX_RETRIES} to find a unique, mappable location...`);
    
    try {
      const ai = new GoogleGenAI({vertexai: false, apiKey: process.env.GEMINI_API_KEY});
      const visitedPlaces = Array.from(visitedLocations).join(', ');
      const enhancedPrompt = `${systemInstructions}\n\nKullanıcının isteği: "${prompt}"\n\nLÜTFEN DİKKAT: Kullanıcıya daha önce şu yerleri önerdin, bunları kesinlikle tekrar önerme: [${visitedPlaces}]. Her zaman yeni, taze ve yaratıcı bir öneride bulun. (Rastgele tohum: ${Math.random().toString(36).substring(7)})`;

      const response = await ai.models.generateContentStream({
        model: 'gemini-2.0-flash-exp',
        contents: enhancedPrompt,
        config: {
          temperature: 1.5,
          tools: [{functionDeclarations: [recommendPlaceFunctionDeclaration]}],
        },
      });

      for await (const chunk of response) {
        if (thisController.signal.aborted) break;

        const fns = chunk.functionCalls ?? [];
        for (const fn of fns) {
          if (fn.name === 'recommendPlace' && fn.args && !thisController.signal.aborted) {
            const location = (fn.args.location as string).trim();
            const caption = fn.args.caption as string;

            if (visitedLocations.has(location)) {
              console.warn(`'${location}' was already suggested. Skipping.`);
              continue; // Ask for another location in the same stream if possible
            }
            
            const isMappable = await renderMap(location);

            if (isMappable) {
              console.log(`✅ Success! '${location}' is mappable.`);
              visitedLocations.add(location);
              captionDiv.textContent = caption;
              success = true;
              break; // Exit from the 'for fn of fns' loop
            } else {
              console.warn(`'${location}' is not mappable. Trying again...`);
            }
          }
        }
        if (success) break; // Exit from the 'for await chunk' loop
      }
    } catch (error: any) {
      if (thisController.signal.aborted) {
        console.log('Aborted request error caught and ignored.');
        break; // Stop retrying if the user clicked another button
      }
      console.error('API Error on attempt ' + attempt, error);
    }
    if (success) break; // Exit from the retry loop
  }

  if (!success && !thisController.signal.aborted) {
    captionDiv.textContent = 'Uygun bir konum bulunamadı. Lütfen başka bir kategori deneyin.';
    // Optionally reset the map to a neutral view
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
    map.setView([20, 0], 2);
  }

  // UI Unlocking Logic
  if (currentController === thisController) {
    currentController = null;
    const allButtons = (document.querySelector('#presets') as HTMLDivElement).querySelectorAll('button');
    allButtons.forEach(btn => btn.disabled = false);
    console.log('UI Unlocked.');
  }
}

async function renderMap(location: string): Promise<boolean> {  
  console.log(`🗺️ Verifying map for: "${location}"`);
  if (!location) return false;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      
      map.eachLayer((layer: L.Layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
      
      map.setView([lat, lon], 10);
      L.marker([lat, lon]).addTo(map).bindPopup(data[0].display_name || location).openPopup();
      
      return true; // Location was successfully mapped
    } else {
      console.warn(`❌ No geocoding results for: "${location}"`);
      return false; // Location could not be found
    }
  } catch (error) {
    console.error(`❌ Geocoding or map rendering error for "${location}":`, error);
    return false; // Error occurred
  }
}

async function main(): Promise<void> {
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    document.documentElement.removeAttribute('data-theme'); // Use default (dark)
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  // CRITICAL: Initialize the map here, once and only once.
  map = L.map(mapContainer);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  const div = document.querySelector('#presets') as HTMLDivElement;
  const allButtons = div.querySelectorAll('button'); // Should be populated after loop

  for (const preset of presets) {
    const p = document.createElement('button');
    p.textContent = preset[0];
    p.addEventListener('click', () => {
      // 1. Disable all buttons immediately to prevent multiple clicks
      (div.querySelectorAll('button')).forEach(btn => btn.disabled = true);
      
      // 2. Abort any ongoing API call.
      if (currentController) {
        currentController.abort();
      }

      // 3. Clear the previous debounce timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      // 4. Set a new debounce timer
      console.log('Debounce timer set...');
      captionDiv.textContent = 'Düşünüyor...';
      captionDiv.classList.remove('hidden');

      debounceTimer = window.setTimeout(() => {
        generateContent(preset[1]);
      }, 400); // 400ms debounce delay
    });
    div.append(p);
  }

  // Initialize map with default view
  await renderMap('Istanbul, Turkey');
}

main();
