const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://python-backend-270384591051.europe-west3.run.app';
const API_KEY =
  import.meta.env.VITE_API_KEY ||
  'a9c0347c273b6e94df81d6734fd6735a645d0f36ef0e5ea553901a95bc47de5f';

export class ImageService {
  private cache: Map<string, string> = new Map();

  async fetchLocationImage(
    locationName: string,
    lat?: number,
    lng?: number
  ): Promise<string | null> {
    if (!locationName) return null;

    const cacheKey = `${locationName.trim().toLowerCase()}_${lat}_${lng}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Step 1: Call Python Backend Google Maps Places Photo / Street View API
    try {
      const queryParams = new URLSearchParams({ name: locationName });
      if (lat !== undefined) queryParams.append('lat', lat.toString());
      if (lng !== undefined) queryParams.append('lng', lng.toString());

      const res = await fetch(`${API_URL}/api/places/photo?${queryParams.toString()}`, {
        headers: {
          'X-API-Key': API_KEY,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          this.cache.set(cacheKey, data.url);
          return data.url;
        }
      }
    } catch (err) {
      console.warn('Backend photo API fetch error:', err);
    }

    // Step 2: Fallback to Google Maps Static Maps Satellite API if API Key is in frontend env
    const mapsApiKey =
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      import.meta.env.GOOGLE_MAPS_API_KEY;

    if (mapsApiKey) {
      const cleanName = encodeURIComponent(
        locationName.split(',')[0].replace(/\(.*?\)/g, '').trim()
      );
      const centerParam =
        lat !== undefined && lng !== undefined
          ? `${lat},${lng}`
          : cleanName;
      const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerParam}&zoom=13&size=800x500&maptype=satellite&markers=color:red%7C${centerParam}&key=${mapsApiKey}`;
      this.cache.set(cacheKey, staticMapUrl);
      return staticMapUrl;
    }

    // Step 3: High resolution category visual fallback if offline or no key available
    const fallbackUrl = this.getCategoryFallbackImage(locationName);
    this.cache.set(cacheKey, fallbackUrl);
    return fallbackUrl;
  }

  private getCategoryFallbackImage(locationName: string): string {
    const lower = locationName.toLowerCase();

    // Desert / Çöl / Vaha
    if (
      lower.includes('çöl') ||
      lower.includes('vaha') ||
      lower.includes('desert') ||
      lower.includes('wadi') ||
      lower.includes('atacama') ||
      lower.includes('salar')
    ) {
      return 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80';
    }

    // Coastal / Sahil / Ada / Amalfi
    if (
      lower.includes('sahil') ||
      lower.includes('ada') ||
      lower.includes('kıyı') ||
      lower.includes('amalfi') ||
      lower.includes('santorini') ||
      lower.includes('zanzibar')
    ) {
      return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
    }

    // Antique / Antik / Ruin
    if (
      lower.includes('antik') ||
      lower.includes('harabe') ||
      lower.includes('petra') ||
      lower.includes('göbeklitepe') ||
      lower.includes('efes')
    ) {
      return 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80';
    }

    // Metropolis / Metropol / City
    if (
      lower.includes('tokyo') ||
      lower.includes('seul') ||
      lower.includes('york') ||
      lower.includes('londra') ||
      lower.includes('metropol')
    ) {
      return 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=800&q=80';
    }

    // Default nature landscape
    return 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80';
  }
}

export const imageService = new ImageService();



