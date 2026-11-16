import { useState } from 'react';
import { Preset, Location } from '@/types';
import { Sparkles, History, MapPin, Keyboard, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

interface SidebarDeckProps {
  presets: Preset[];
  onSelectPreset: (preset: Preset) => void;
  isLoading: boolean;
  activePresetId: string | null;
  history: Location[];
  onSelectHistoryLocation: (loc: Location) => void;
}

export const SidebarDeck = ({
  presets,
  onSelectPreset,
  isLoading,
  activePresetId,
  history,
  onSelectHistoryLocation,
}: SidebarDeckProps) => {
  const [activeTab, setActiveTab] = useState<'modes' | 'history'>('modes');

  return (
    <aside className="w-full max-w-sm flex flex-col gap-2.5 p-3.5 rounded-3xl glass-panel shadow-2xl overflow-hidden max-h-[calc(100vh-100px)] border-2 border-[#BCC7D2]">
      {/* Panel Top Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#EDF3EE] border border-[#BCC7D2] shrink-0">
        <button
          onClick={() => setActiveTab('modes')}
          className={clsx(
            'flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-black transition-all duration-200',
            activeTab === 'modes'
              ? 'bg-[#EC7D55] text-[#253341] shadow-sm'
              : 'text-[#253341] hover:bg-[#DBE6DD]'
          )}
        >
          <Sparkles size={15} />
          <span>Keşif Kategorileri</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={clsx(
            'flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-black transition-all duration-200 relative',
            activeTab === 'history'
              ? 'bg-[#EC7D55] text-[#253341] shadow-sm'
              : 'text-[#253341] hover:bg-[#DBE6DD]'
          )}
        >
          <History size={15} />
          <span>Geçmiş</span>
          {history.length > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-[#F2A488] text-[#253341] shadow-xs">
              {history.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: Keşif Kategorileri */}
      {activeTab === 'modes' && (
        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
          {/* Kısayol Bilgilendirmesi */}
          <div className="flex items-center justify-between px-1 shrink-0">
            <span className="text-[11px] font-extrabold text-[#3E5164]">
              Keşif Kategorisi Seçin:
            </span>
            <div className="flex items-center gap-1 text-[10px] font-black text-[#253341] bg-[#DBE6DD] px-2 py-0.5 rounded-md border border-[#BCC7D2]">
              <Keyboard size={12} />
              <span>[1-9, 0] Tuşları</span>
            </div>
          </div>

          {/* Preset Cards */}
          <div className="space-y-1.5">
            {presets.map((preset, index) => {
              const isActive = activePresetId === preset.id;
              const keyLabel = index < 9 ? `[${index + 1}]` : '[0]';
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  disabled={isLoading}
                  className={clsx(
                    'w-full flex items-center justify-between p-2 rounded-2xl transition-all duration-200 text-left border-2 group',
                    isActive
                      ? 'bg-[#EC7D55] text-[#253341] border-[#EC7D55] shadow-md scale-[1.01]'
                      : 'bg-[#EDF3EE] text-[#253341] border-[#BCC7D2] hover:bg-[#DBE6DD] hover:border-[#EC7D55]'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={clsx(
                        'w-7 h-7 rounded-xl flex items-center justify-center transition-colors duration-200 border shadow-xs shrink-0',
                        isActive
                          ? 'bg-[#F5F9F5] text-[#253341] border-[#F5F9F5]'
                          : 'bg-[#DCE3EA] text-[#253341] border-[#BCC7D2] group-hover:bg-[#EC7D55] group-hover:text-[#253341] group-hover:border-[#EC7D55]'
                      )}
                    >
                      {preset.icon}
                    </div>
                    <div>
                      <div className="font-extrabold text-xs tracking-tight leading-tight">
                        {preset.label}
                      </div>
                      <div
                        className={clsx(
                          'text-[10px] line-clamp-1 max-w-[170px] font-medium leading-tight',
                          isActive ? 'text-[#253341]' : 'text-[#3E5164]'
                        )}
                      >
                        {preset.prompt}
                      </div>
                    </div>
                  </div>

                  <span
                    className={clsx(
                      'text-[10px] font-black px-1.5 py-0.5 rounded-md border shrink-0 transition-colors duration-200',
                      isActive
                        ? 'bg-[#253341] text-[#F5F9F5] border-[#253341]'
                        : 'bg-[#DCE3EA] text-[#253341] border-[#BCC7D2] group-hover:bg-[#F5F9F5]'
                    )}
                  >
                    {keyLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Geçmiş Keşifler (Full Spacious History List) */}
      {activeTab === 'history' && (
        <div className="flex flex-col gap-2.5 overflow-hidden flex-1">
          <div className="flex items-center justify-between px-1 pb-1 border-b-2 border-[#BCC7D2] shrink-0">
            <span className="text-xs font-extrabold text-[#253341]">
              Keşif Geçmişiniz ({history.length})
            </span>
            <span className="text-[10px] font-bold text-[#3E5164]">
              Tek tıkla haritada konumlanın
            </span>
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-2 opacity-85">
              <History size={32} className="text-[#3E5164]" />
              <p className="text-xs font-extrabold text-[#253341]">
                Henüz yapılmış bir keşif yok.
              </p>
              <p className="text-[11px] font-semibold text-[#3E5164]">
                Sol sekmeden bir mod seçerek keşfe başlayın.
              </p>
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[calc(100vh-220px)]">
              {history.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectHistoryLocation(loc)}
                  className="w-full flex items-start justify-between p-3 rounded-2xl bg-[#EDF3EE] border-2 border-[#BCC7D2] text-[#253341] hover:bg-[#DBE6DD] hover:border-[#EC7D55] transition-all duration-200 text-left group shadow-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#F2A488] text-[#253341] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#EC7D55] transition-colors duration-200">
                      <MapPin size={16} />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-xs md:text-sm text-[#253341] line-clamp-1">
                        {loc.name}
                      </div>
                      <div className="text-[11px] font-mono font-bold text-[#3E5164] group-hover:text-[#253341]">
                        {loc.lat.toFixed(4)}°, {loc.lng.toFixed(4)}°
                      </div>
                      <p className="text-[10px] font-medium text-[#3E5164] line-clamp-2 pt-0.5">
                        {loc.caption}
                      </p>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-[#DCE3EA] text-[#253341] flex items-center justify-center shrink-0 group-hover:bg-[#AB421C] group-hover:text-[#F5F9F5] transition-all duration-200">
                    <ArrowRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
