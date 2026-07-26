import { useState, useEffect, useCallback } from 'react';
import { MapContainer } from '@/components/Map/MapContainer';
import { Header } from '@/components/UI/Header';
import { SidebarDeck } from '@/components/UI/SidebarDeck';
import { Caption } from '@/components/UI/Caption';
import { useDiscovery } from '@/hooks/useDiscovery';
import { PRESETS } from '@/constants';
import { Location, Preset } from '@/types';
import { aiService } from '@/services/ai.service';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { location: defaultLocation, caption, isLoading, discoverPlace } = useDiscovery();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [currentCaption, setCurrentCaption] = useState<string>('');
  const [customLoading, setCustomLoading] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [history, setHistory] = useState<Location[]>([]);

  // Sync default location from hook
  useEffect(() => {
    if (defaultLocation) {
      setCurrentLocation(defaultLocation);
      setCurrentCaption(defaultLocation.caption);
      setHistory((prev) => {
        if (prev.some((item) => item.name === defaultLocation.name)) return prev;
        return [defaultLocation, ...prev];
      });
    }
  }, [defaultLocation]);

  // Handle Preset Discovery
  const handlePresetSelect = useCallback(
    (preset: Preset) => {
      setActivePresetId(preset.id);
      discoverPlace(preset);
    },
    [discoverPlace]
  );

  // Handle Custom Prompt Search
  const handleCustomSearch = useCallback(async (prompt: string) => {
    setCustomLoading(true);
    setActivePresetId(null);
    setCurrentCaption('Özel konum aranıyor...');

    try {
      const result = await aiService.generateRecommendation(prompt);
      if (result) {
        setCurrentLocation(result);
        setCurrentCaption(result.caption);
        setHistory((prev) => [result, ...prev.filter((i) => i.name !== result.name)]);
      } else {
        setCurrentCaption('Arama sonucunda uygun bir konum bulunamadı.');
      }
    } catch (err) {
      console.error(err);
      setCurrentCaption('Arama yapılırken bir hata oluştu.');
    } finally {
      setCustomLoading(false);
    }
  }, []);

  // Keyboard Shortcuts (1-5 keys for presets)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const keyIndex = parseInt(e.key, 10);
      if (keyIndex >= 1 && keyIndex <= PRESETS.length) {
        const selectedPreset = PRESETS[keyIndex - 1];
        if (selectedPreset) {
          handlePresetSelect(selectedPreset);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePresetSelect]);

  const activeLoading = isLoading || customLoading;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#9BCEC1] font-sans">
      {/* Background Map Component */}
      <div className="absolute inset-0 z-0">
        <MapContainer location={currentLocation} />

        {/* Ambient Top & Bottom Gradients using 60-30-10 palette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(to bottom, rgba(155, 206, 193, 0.45) 0%, transparent 18%, transparent 80%, rgba(155, 206, 193, 0.6) 100%)',
          }}
        />
      </div>

      {/* Main Overlay UI Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-3 md:p-6 space-y-4">
        {/* Top Header */}
        <Header
          location={currentLocation}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Middle Body Container (Sidebar & Main Display) */}
        <div className="flex-1 flex gap-4 items-start overflow-hidden pointer-events-none">
          {/* Left Floating Sidebar Deck */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -320 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -320 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="pointer-events-auto shrink-0 z-30"
              >
                <SidebarDeck
                  presets={PRESETS}
                  onSelectPreset={handlePresetSelect}
                  onCustomSearch={handleCustomSearch}
                  isLoading={activeLoading}
                  activePresetId={activePresetId}
                  history={history}
                  onSelectHistoryLocation={(loc) => {
                    setCurrentLocation(loc);
                    setCurrentCaption(loc.caption);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Narrative Card */}
        <div className="w-full flex flex-col items-center gap-3 pb-2 pointer-events-none z-30">
          <div className="w-full max-w-2xl pointer-events-auto">
            <Caption
              content={currentCaption || caption}
              location={currentLocation}
              isLoading={activeLoading}
              onFlyToLocation={() => {
                if (currentLocation) {
                  setCurrentLocation({ ...currentLocation });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
