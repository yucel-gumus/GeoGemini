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
    <aside className="w-full max-w-sm flex flex-col gap-2.5 p-3.5 rounded-3xl glass-panel shadow-2xl overflow-hidden max-h-[calc(100vh-100px)] border-2 border-[#FFB6A6]">
      {/* Panel Top Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#FFB6A6]/20 border border-[#FFB6A6]/40 shrink-0">
        <button
          onClick={() => setActiveTab('modes')}
          className={clsx(
            'flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-black transition-all',
            activeTab === 'modes'
              ? 'bg-[#9BCEC1] text-[#2D1810] shadow-sm'
              : 'text-[#2D1810] hover:bg-[#FFB6A6]/30'
          )}
        >
          <Sparkles size={15} />
          <span>Keşif Kategorileri</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={clsx(
            'flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-black transition-all relative',
            activeTab === 'history'
              ? 'bg-[#9BCEC1] text-[#2D1810] shadow-sm'
              : 'text-[#2D1810] hover:bg-[#FFB6A6]/30'
          )}
        >
          <History size={15} />
          <span>Geçmiş</span>
          {history.length > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-[#FFB6A6] text-[#FFEBD3] shadow-xs">
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
            <span className="text-[11px] font-extrabold text-[#7A3A2D]">
              Keşif Kategorisi Seçin:
            </span>
            <div className="flex items-center gap-1 text-[10px] font-black text-[#2D1810] bg-[#FFB6A6]/30 px-2 py-0.5 rounded-md border border-[#FFB6A6]/40">
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
                      ? 'bg-[#9BCEC1] text-[#2D1810] border-[#9BCEC1] shadow-md scale-[1.01]'
                      : 'bg-[#FFB6A6]/20 text-[#2D1810] border-[#FFB6A6]/50 hover:bg-[#FFB6A6] hover:text-[#FFEBD3] hover:border-[#FFB6A6]'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={clsx(
                        'w-7 h-7 rounded-xl flex items-center justify-center transition-colors border shadow-xs shrink-0',
                        isActive
                          ? 'bg-[#FFEBD3] text-[#2D1810] border-[#FFEBD3]'
                          : 'bg-[#FFB6A6] text-[#FFEBD3] border-[#FFB6A6] group-hover:bg-[#9BCEC1] group-hover:text-[#2D1810]'
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
                          isActive ? 'text-[#2D1810]/90' : 'text-[#5C2E23] group-hover:text-[#FFEBD3]'
                        )}
                      >
                        {preset.prompt}
                      </div>
                    </div>
                  </div>

                  <span
                    className={clsx(
                      'text-[10px] font-black px-1.5 py-0.5 rounded-md border shrink-0',
                      isActive
                        ? 'bg-[#2D1810] text-[#FFEBD3] border-[#2D1810]'
                        : 'bg-[#FFB6A6]/30 text-[#2D1810] border-[#FFB6A6]/40 group-hover:bg-[#FFEBD3] group-hover:text-[#2D1810]'
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
          <div className="flex items-center justify-between px-1 pb-1 border-b-2 border-[#FFB6A6]/30 shrink-0">
            <span className="text-xs font-extrabold text-[#2D1810]">
              Keşif Geçmişiniz ({history.length})
            </span>
            <span className="text-[10px] font-bold text-[#7A3A2D]">
              Tek tıkla haritada konumlanın
            </span>
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-2 opacity-80">
              <History size={32} className="text-[#FFB6A6]" />
              <p className="text-xs font-extrabold text-[#2D1810]">
                Henüz yapılmış bir keşif yok.
              </p>
              <p className="text-[11px] font-semibold text-[#7A3A2D]">
                Sol sekmeden bir mod seçerek keşfe başlayın.
              </p>
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[calc(100vh-220px)]">
              {history.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectHistoryLocation(loc)}
                  className="w-full flex items-start justify-between p-3 rounded-2xl bg-[#FFB6A6]/20 border-2 border-[#FFB6A6]/60 text-[#2D1810] hover:bg-[#9BCEC1] hover:border-[#9BCEC1] transition-all text-left group shadow-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#FFB6A6] text-[#FFEBD3] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#FFEBD3] group-hover:text-[#2D1810]">
                      <MapPin size={16} />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-xs md:text-sm text-[#2D1810] line-clamp-1">
                        {loc.name}
                      </div>
                      <div className="text-[11px] font-mono font-bold text-[#7A3A2D] group-hover:text-[#2D1810]">
                        {loc.lat.toFixed(4)}°, {loc.lng.toFixed(4)}°
                      </div>
                      <p className="text-[10px] font-medium text-[#2D1810]/80 line-clamp-2 pt-0.5">
                        {loc.caption}
                      </p>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-[#FFEBD3] text-[#2D1810] flex items-center justify-center shrink-0 group-hover:bg-[#2D1810] group-hover:text-[#FFEBD3] transition-all">
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
