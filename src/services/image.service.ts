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

    const mapsApiKey =
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      import.meta.env.GOOGLE_MAPS_API_KEY;

    if (!mapsApiKey) {
      return null;
    }

    const cleanName = locationName.split(',')[0].replace(/\(.*?\)/g, '').trim();

    // Step 1: Check Google Street View Metadata API (Verify 360° coverage exists before calling Street View)
    if (lat !== undefined && lng !== undefined) {
      try {
        const metadataUrl = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lng}&key=${mapsApiKey}`;
        const metaRes = await fetch(metadataUrl);
        if (metaRes.ok) {
          const metaData = await metaRes.json();
          if (metaData.status === 'OK') {
            // Street View coverage exists! Return real 360° street view panorama
            const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=800x500&location=${lat},${lng}&fov=90&heading=0&pitch=0&key=${mapsApiKey}`;
            this.cache.set(cacheKey, streetViewUrl);
            return streetViewUrl;
          }
        }
      } catch {
        // Ignore metadata fetch errors and fallback to Places Photo API
      }
    }

    // Step 2: Try Google Places API (Find Place / Text Search) to fetch real place photo
    try {
      const placesSearchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
        cleanName
      )}&inputtype=textquery&fields=photos,geometry&key=${mapsApiKey}`;
      const placesRes = await fetch(placesSearchUrl);
      if (placesRes.ok) {
        const placesData = await placesRes.json();
        if (
          placesData.status === 'OK' &&
          placesData.candidates?.[0]?.photos?.[0]?.photo_reference
        ) {
          const photoRef = placesData.candidates[0].photos[0].photo_reference;
          const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${mapsApiKey}`;
          this.cache.set(cacheKey, photoUrl);
          return photoUrl;
        }
      }
    } catch {
      // Ignore Places API fetch errors and fallback to Static Maps Satellite View
    }

    // Step 3: Google Maps Static Maps API (Satellite View with Red Location Marker)
    const centerParam =
      lat !== undefined && lng !== undefined
        ? `${lat},${lng}`
        : encodeURIComponent(cleanName);
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerParam}&zoom=13&size=800x500&maptype=satellite&markers=color:red%7C${centerParam}&key=${mapsApiKey}`;
    this.cache.set(cacheKey, staticMapUrl);
    return staticMapUrl;
  }
}

export const imageService = new ImageService();



