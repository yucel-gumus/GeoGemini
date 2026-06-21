import { Location } from '@/types';

const BFF_URL =
  import.meta.env.VITE_BFF_URL ||
  (import.meta.env.PROD ? 'https://pages-bff.vercel.app' : 'http://127.0.0.1:3099');

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

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

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

            if (data.error) {
                console.error('API Error:', data.error);
            }
        } catch (error) {
            console.error('AI Service Error:', error);
        }
        return null;
    }

    clearHistory(): void {
        this.visitedLocations = [];
    }
}

export const aiService = new AIService();