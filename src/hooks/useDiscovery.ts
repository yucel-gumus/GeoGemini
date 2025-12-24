import { useState, useCallback } from 'react';
import { aiService } from '@/services/ai.service';
import { Location, Preset } from '@/types';

export const useDiscovery = () => {
    const [location, setLocation] = useState<Location | null>(null);
    const [caption, setCaption] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const discoverPlace = useCallback(async (preset: Preset) => {
        setIsLoading(true);
        setCaption('Yeni bir lokasyon aranıyor...');
        setError(null);

        try {
            const result = await aiService.generateRecommendation(preset.prompt);

            if (result) {
                setLocation(result);
                setCaption(result.caption);
            } else {
                setError('Uygun bir konum bulunamadı. Lütfen tekrar deneyin.');
                setCaption('Konum bulunamadı.');
            }
        } catch (err) {
            console.error(err);
            setError('Bir hata oluştu.');
            setCaption('Hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        location,
        caption,
        isLoading,
        error,
        discoverPlace
    };
};
