import { Location } from '@/types';

class MapService {
    private static readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

    async geocode(locationName: string): Promise<Location | null> {
        try {
            const params = new URLSearchParams({
                format: 'json',
                q: locationName,
                limit: '1',
            });

            const response = await fetch(`${MapService.NOMINATIM_BASE_URL}?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Geocoding error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data && data.length > 0) {
                return {
                    name: data[0].display_name,
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                    caption: '', // Caption will be filled by AI service
                };
            }

            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    }
}

export const mapService = new MapService();
