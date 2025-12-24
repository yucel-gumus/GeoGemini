import { MapContainer } from '@/components/Map/MapContainer';
import { ActionButtons } from '@/components/UI/ActionButtons';
import { Caption } from '@/components/UI/Caption';
import { useDiscovery } from '@/hooks/useDiscovery';
import { PRESETS } from '@/constants';

function App() {
    const { location, caption, isLoading, discoverPlace } = useDiscovery();

    return (
        <div className="relative w-full h-screen overflow-hidden bg-slate-100">
            <div className="absolute inset-0 z-0">
                <MapContainer location={location} />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(248, 250, 252, 0.3) 0%, transparent 20%, transparent 80%, rgba(248, 250, 252, 0.5) 100%)'
                    }}
                />
            </div>

            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 md:p-8">
                <header className="pointer-events-auto self-center">
                    <h1 className="text-xl font-semibold text-slate-600 tracking-wide flex items-center gap-2">
                        <span>🌍</span>
                        <span>SightseeingAI</span>
                    </h1>
                </header>

                <div className="flex flex-col items-center w-full gap-6 pb-6 md:pb-10">
                    <Caption content={caption} isLoading={isLoading} />

                    <div className="pointer-events-auto">
                        <ActionButtons
                            presets={PRESETS}
                            onSelect={discoverPlace}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
