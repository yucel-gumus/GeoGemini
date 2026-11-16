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
                ? 'bg-[#EC7D55] text-[#253341] border-[#EC7D55] hover:bg-[#AB421C] hover:text-[#F5F9F5] hover:border-[#AB421C] shadow-md scale-[1.02]'
                : 'bg-[#EDF3EE] text-[#253341] border-[#BCC7D2] hover:bg-[#DBE6DD] hover:border-[#3E5164]'
            }`}
            title="Kontrol Panelini Aç/Kapat"
          >
            <Layers size={18} />
            <span className="hidden sm:inline">Panel</span>
          </button>

          <div className="flex items-center gap-3 pl-1">
            <div className="w-10 h-10 rounded-xl bg-[#F2A488] border border-[#EC7D55]/50 flex items-center justify-center text-[#253341] shadow-sm shrink-0">
              <Compass size={22} className="animate-float" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg md:text-xl tracking-tight text-[#253341]">
                  {APP_CONFIG.name}
                </h1>
              </div>
              <p className="text-[11px] font-bold text-[#3E5164] hidden md:block">
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
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#EDF3EE] text-[#253341] border border-[#BCC7D2] hover:bg-[#DBE6DD] hover:border-[#EC7D55] transition-all duration-200 text-xs font-bold shadow-xs"
              title="Koordinatları Kopyala"
            >
              <MapPin size={14} className="text-[#AB421C]" />
              <span>{location.name}</span>
              <span className="opacity-75 font-mono text-[#3E5164]">
                ({formatShortCoordinates(location.lat, location.lng)})
              </span>
              {copied ? <Check size={14} className="text-[#AB421C]" /> : <Copy size={14} className="opacity-75 text-[#3E5164]" />}
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#EDF3EE] border-2 border-[#BCC7D2] text-[#253341] text-xs font-bold">
              <Sparkles size={14} className="text-[#EC7D55] animate-spin" style={{ animationDuration: '4s' }} />
              <span>Keşif Bekleniyor...</span>
            </div>
          )}
        </div>

        {/* Right: Info Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-2.5 rounded-xl bg-[#EDF3EE] border-2 border-[#BCC7D2] text-[#253341] hover:bg-[#DBE6DD] hover:border-[#3E5164] transition-all duration-200 font-bold"
            title="Sistem Hakkında"
          >
            <Info size={18} />
          </button>
        </div>
      </header>

      {/* Information Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#253341]/50 backdrop-blur-md pointer-events-auto">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#DCE3EA] border-3 border-[#BCC7D2] shadow-2xl text-[#253341] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#BCC7D2]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F2A488] flex items-center justify-center text-[#253341]">
                  <Compass size={20} />
                </div>
                <h3 className="font-extrabold text-xl text-[#253341]">{APP_CONFIG.name}</h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-8 h-8 rounded-full bg-[#EDF3EE] text-[#253341] border border-[#BCC7D2] flex items-center justify-center hover:bg-[#AB421C] hover:text-[#F5F9F5] hover:border-[#AB421C] font-black text-sm transition-all duration-200"
              >
                ✕
              </button>
            </div>
            
            <p className="text-sm leading-relaxed font-semibold text-[#253341]">
              {APP_CONFIG.description}
            </p>

            <div className="p-3.5 rounded-2xl bg-[#EDF3EE] border border-[#BCC7D2] text-xs space-y-1.5">
              <div className="font-extrabold text-[#253341]">Klavye Kısayolları:</div>
              <p className="text-[#3E5164] font-semibold text-[11px]">
                Kategoriler arasında hızlıca gezinmek için klavyenizdeki <strong className="text-[#AB421C]">[1 - 9]</strong> ve <strong className="text-[#AB421C]">[0]</strong> tuşlarını kullanabilirsiniz.
              </p>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-3 rounded-xl bg-[#EC7D55] text-[#253341] font-extrabold text-sm border-2 border-[#EC7D55] hover:bg-[#AB421C] hover:border-[#AB421C] hover:text-[#F5F9F5] transition-all duration-200 shadow-md"
            >
              Keşfe Başla
            </button>
          </div>
        </div>
      )}
    </>
  );
};
