import { useState } from 'react';
import { Compass, MapPin, Copy, Check, Info, Layers, Sparkles } from 'lucide-react';
import { Location } from '@/types';
import { APP_CONFIG, formatShortCoordinates, copyToClipboard } from '@/constants';

interface HeaderProps {
  location: Location | null;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header = ({ location, sidebarOpen, onToggleSidebar }: HeaderProps) => {
  const [copied, setCopied] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleCopyCoords = async () => {
    if (!location) return;
    const coordsStr = formatShortCoordinates(location.lat, location.lng);
    const success = await copyToClipboard(coordsStr);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <header className="pointer-events-auto w-full flex items-center justify-between gap-4 p-3 md:p-4 rounded-2xl glass-panel">
        {/* Left: Brand Identity & Mobile Sidebar Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className={`p-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 font-extrabold text-xs md:text-sm border-2 ${
              sidebarOpen
                ? 'bg-[#9BCEC1] text-[#2D1810] border-[#9BCEC1] shadow-md scale-[1.02]'
                : 'bg-[#FFEBD3] text-[#2D1810] border-[#FFB6A6] hover:bg-[#FFB6A6] hover:text-[#FFEBD3]'
            }`}
            title="Kontrol Panelini Aç/Kapat"
          >
            <Layers size={18} />
            <span className="hidden sm:inline">Panel</span>
          </button>

          <div className="flex items-center gap-3 pl-1">
            <div className="w-10 h-10 rounded-xl bg-[#FFB6A6] border border-[#FFB6A6] flex items-center justify-center text-[#FFEBD3] shadow-sm shrink-0">
              <Compass size={22} className="animate-float" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg md:text-xl tracking-tight text-[#2D1810]">
                  {APP_CONFIG.name}
                </h1>
              </div>
              <p className="text-[11px] font-bold text-[#7A3A2D] hidden md:block">
                {APP_CONFIG.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Location Indicator / Coordinates */}
        <div className="hidden lg:flex items-center gap-2">
          {location ? (
            <button
              onClick={handleCopyCoords}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFB6A6] text-[#2D1810] border border-[#FFB6A6] hover:bg-[#9BCEC1] transition-all text-xs font-bold shadow-xs"
              title="Koordinatları Kopyala"
            >
              <MapPin size={14} className="text-[#2D1810]" />
              <span>{location.name}</span>
              <span className="opacity-75 font-mono">
                ({formatShortCoordinates(location.lat, location.lng)})
              </span>
              {copied ? <Check size={14} className="text-[#2D1810]" /> : <Copy size={14} className="opacity-75" />}
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFEBD3] border-2 border-[#FFB6A6] text-[#2D1810] text-xs font-bold">
              <Sparkles size={14} className="text-[#FFB6A6] animate-spin" style={{ animationDuration: '4s' }} />
              <span>Keşif Bekleniyor...</span>
            </div>
          )}
        </div>

        {/* Right: Info Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-2.5 rounded-xl bg-[#FFEBD3] border-2 border-[#FFB6A6] text-[#2D1810] hover:bg-[#FFB6A6] hover:text-[#FFEBD3] transition-all font-bold"
            title="Sistem Hakkında"
          >
            <Info size={18} />
          </button>
        </div>
      </header>

      {/* Information Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1810]/50 backdrop-blur-md pointer-events-auto">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#FFEBD3] border-3 border-[#FFB6A6] shadow-2xl text-[#2D1810] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#FFB6A6]/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFB6A6] flex items-center justify-center text-[#FFEBD3]">
                  <Compass size={20} />
                </div>
                <h3 className="font-extrabold text-xl text-[#2D1810]">{APP_CONFIG.name}</h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-8 h-8 rounded-full bg-[#FFB6A6] text-[#FFEBD3] flex items-center justify-center hover:bg-[#9BCEC1] hover:text-[#2D1810] font-black text-sm transition-all"
              >
                ✕
              </button>
            </div>
            
            <p className="text-sm leading-relaxed font-semibold text-[#2D1810]">
              {APP_CONFIG.description}
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FFB6A6]/20 border border-[#FFB6A6]/50 text-xs space-y-1.5">
              <div className="font-extrabold text-[#2D1810]">Klavye Kısayolları:</div>
              <ul className="list-disc pl-4 space-y-1 text-[#2D1810] font-semibold">
                <li><strong className="text-[#7A3A2D]">[1]</strong> - Antik Keşif</li>
                <li><strong className="text-[#7A3A2D]">[2]</strong> - Metropol Keşif</li>
                <li><strong className="text-[#7A3A2D]">[3]</strong> - Yeşil Doğa</li>
                <li><strong className="text-[#7A3A2D]">[4]</strong> - Gastronomik Lezzet</li>
                <li><strong className="text-[#7A3A2D]">[5]</strong> - Manevi Mekan</li>
              </ul>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-3 rounded-xl bg-[#9BCEC1] text-[#2D1810] font-extrabold text-sm border-2 border-[#9BCEC1] hover:bg-[#FFB6A6] hover:border-[#FFB6A6] hover:text-[#FFEBD3] transition-all shadow-md"
            >
              Keşfe Başla
            </button>
          </div>
        </div>
      )}
    </>
  );
};
