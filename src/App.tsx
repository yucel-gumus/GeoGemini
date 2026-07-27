import { useState, useEffect, useCallback } from 'react';
import { MapContainer } from '@/components/Map/MapContainer';
import { Header } from '@/components/UI/Header';
import { SidebarDeck } from '@/components/UI/SidebarDeck';
import { Caption } from '@/components/UI/Caption';
import { useDiscovery } from '@/hooks/useDiscovery';
import { PRESETS } from '@/constants';
import { Location, Preset } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { location: defaultLocation, caption, isLoading, discoverPlace } = useDiscovery();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [currentCaption, setCurrentCaption] = useState<string>('');
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

  // Keyboard Shortcuts (1-9 and 0 keys for presets)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      let presetIndex = -1;
      if (e.key >= '1' && e.key <= '9') {
        presetIndex = parseInt(e.key, 10) - 1;
      } else if (e.key === '0') {
        presetIndex = 9;
      }

      if (presetIndex >= 0 && presetIndex < PRESETS.length) {
        const selectedPreset = PRESETS[presetIndex];
        if (selectedPreset) {
          handlePresetSelect(selectedPreset);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePresetSelect]);

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
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col p-3 md:p-6 space-y-3">
        {/* Top Header */}
        <Header
          location={currentLocation}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Middle & Bottom Overlay Canvas Area */}
        <div className="relative flex-1 w-full overflow-hidden pointer-events-none">
          {/* Left Floating Sidebar Deck */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -340 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -340 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="absolute top-0 left-0 pointer-events-auto shrink-0 z-30 max-h-full flex flex-col"
              >
                <SidebarDeck
                  presets={PRESETS}
                  onSelectPreset={handlePresetSelect}
                  isLoading={isLoading}
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

          {/* Bottom Narrative Card (Floating at Bottom Center) */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none z-30 px-2 pb-1">
            <div className="w-full max-w-2xl pointer-events-auto">
              <Caption
                content={currentCaption || caption}
                location={currentLocation}
                isLoading={isLoading}
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
    </div>
  );
}

export default App;

