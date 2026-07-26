export class ImageService {
  private cache: Map<string, string> = new Map();

  async fetchLocationImage(locationName: string): Promise<string | null> {
    if (!locationName) return null;

    const cacheKey = locationName.trim().toLowerCase();
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Clean location name (remove country suffix or parentheses if needed)
    const cleanName = locationName.split(',')[0].replace(/\(.*?\)/g, '').trim();

    try {
      // 1. Try Wikipedia REST API
      const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanName)}`;
      const res = await fetch(wikiUrl);
      if (res.ok) {
        const data = await res.json();
        const imgUrl = data.originalimage?.source || data.thumbnail?.source;
        if (imgUrl) {
          this.cache.set(cacheKey, imgUrl);
          return imgUrl;
        }
      }
    } catch {
      // Ignore network errors for Wikipedia API
    }

    // 2. Fallback: High quality Unsplash source image based on place name query
    const unsplashUrl = `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80`;
    this.cache.set(cacheKey, unsplashUrl);
    return unsplashUrl;
  }
}

export const imageService = new ImageService();
