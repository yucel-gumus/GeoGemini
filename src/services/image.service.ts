const BFF_URL =
  import.meta.env.VITE_BFF_URL ||
  (import.meta.env.PROD ? 'https://pages-bff.vercel.app' : 'http://127.0.0.1:3099');

/**
 * True if URL is a Google Maps/Places/Static/Street View URL that may embed key=
 * Never use these as <img src>.
 */
function isGoogleMapsKeyBearingUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (!u.hostname.endsWith('googleapis.com') && !u.hostname.endsWith('google.com')) {
      return false;
    }
    return (
      u.pathname.includes('/maps/') ||
      u.pathname.includes('/place/') ||
      u.searchParams.has('key')
    );
  } catch {
    return false;
  }
}

function testImageLoad(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    const done = (ok: boolean) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };
    const img = new Image();
    img.onload = () => done(true);
    img.onerror = () => done(false);
    img.src = url;
    setTimeout(() => done(false), 8000);
  });
}

export class ImageService {
  private cache: Map<string, string> = new Map();
  private inflight: Map<string, Promise<string | null>> = new Map();

  /**
   * Same-origin (or BFF) photo stream URL.
   * Edge function fetches Google server-side and returns image bytes only.
   */
  private buildPhotoStreamUrl(locationName: string, lat?: number, lng?: number): string {
    const queryParams = new URLSearchParams({
      name: locationName,
      mode: 'image',
    });
    if (lat !== undefined) queryParams.set('lat', String(lat));
    if (lng !== undefined) queryParams.set('lng', String(lng));
    return `${BFF_URL.replace(/\/$/, '')}/api/geo/places/photo?${queryParams.toString()}`;
  }

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

    if (this.inflight.has(cacheKey)) {
      return this.inflight.get(cacheKey)!;
    }

    const work = (async (): Promise<string | null> => {
      // Step 1: BFF image stream proxy (no Google key in browser)
      try {
        const streamUrl = this.buildPhotoStreamUrl(locationName, lat, lng);
        const ok = await testImageLoad(streamUrl);
        if (ok) {
          this.cache.set(cacheKey, streamUrl);
          return streamUrl;
        }
      } catch (err) {
        console.warn('BFF photo stream fetch error:', err);
      }

      // Step 2: Category visual fallback (public Unsplash — no secrets)
      const fallbackUrl = this.getCategoryFallbackImage(locationName);
      this.cache.set(cacheKey, fallbackUrl);
      return fallbackUrl;
    })();

    this.inflight.set(cacheKey, work);
    try {
      return await work;
    } finally {
      this.inflight.delete(cacheKey);
    }
  }

  /**
   * Guard for any external assignment of image URLs (AI etc.)
   */
  sanitizeImageUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    if (isGoogleMapsKeyBearingUrl(url)) return null;
    return url;
  }

  private getCategoryFallbackImage(locationName: string): string {
    const lower = locationName.toLowerCase();

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

    if (
      lower.includes('antik') ||
      lower.includes('harabe') ||
      lower.includes('petra') ||
      lower.includes('göbeklitepe') ||
      lower.includes('efes')
    ) {
      return 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80';
    }

    if (
      lower.includes('tokyo') ||
      lower.includes('seul') ||
      lower.includes('york') ||
      lower.includes('londra') ||
      lower.includes('metropol')
    ) {
      return 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=800&q=80';
    }

    return 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80';
  }
}

export const imageService = new ImageService();
