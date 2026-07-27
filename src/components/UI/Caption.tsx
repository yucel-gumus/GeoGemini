import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Location } from '@/types';
import { Compass, Copy, Check, Sparkles, MapPin, Navigation, Image as ImageIcon } from 'lucide-react';
import { imageService } from '@/services/image.service';
import { APP_CONFIG, formatCoordinates, copyToClipboard } from '@/constants';

interface CaptionProps {
  content: string;
  location: Location | null;
  isLoading?: boolean;
  onFlyToLocation?: () => void;
}

export const Caption = ({ content, location, isLoading, onFlyToLocation }: CaptionProps) => {
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  // Fetch location image whenever location changes
  useEffect(() => {
    let isMounted = true;
    if (location?.name) {
      setImageLoading(true);
      imageService.fetchLocationImage(location.name, location.lat, location.lng).then((url) => {
        if (isMounted) {
          setImageUrl(url);
          setImageLoading(false);
        }
      });
    } else {
      setImageUrl(null);
      setImageLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [location?.name, location?.lat, location?.lng]);

  if (!content && !isLoading) return null;

  const handleCopy = async () => {
    if (!location && !content) return;
    const textToCopy = location
      ? `${location.name}: ${location.caption} (${formatCoordinates(location.lat, location.lng)})`
      : content;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-2xl mx-auto p-4 md:p-5 rounded-3xl glass-panel shadow-2xl space-y-3 relative overflow-hidden border-2 border-[#FFB6A6]"
      >
        {/* Decorative Corner Glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-[#9BCEC1]/30 blur-2xl pointer-events-none" />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-3 space-y-2.5 text-center">
            {/* Animated Radar Pulse Ring */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#9BCEC1] animate-radar" />
              <div className="w-8 h-8 rounded-full bg-[#FFB6A6] flex items-center justify-center text-[#FFEBD3]">
                <Compass size={18} className="animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm md:text-base font-extrabold text-[#2D1810] tracking-wide flex items-center justify-center gap-2">
                <Sparkles size={15} className="text-[#FFB6A6]" />
                <span>{APP_CONFIG.name} Lokasyon Keşfediyor...</span>
              </h4>
              <p className="text-[11px] font-bold text-[#7A3A2D] max-w-md">
                Coğrafi veri tabanı taranıyor, koordinatlar ve hikaye derleniyor.
              </p>
            </div>

            <div className="w-48 h-1.5 rounded-full overflow-hidden bg-[#FFEBD3] border border-[#FFB6A6]/50">
              <div className="h-full rounded-full shimmer-bg" />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Location Title Header */}
            {location && (
              <div className="flex items-center justify-between gap-3 pb-2 border-b-2 border-[#FFB6A6]/30">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#FFB6A6] text-[#FFEBD3] flex items-center justify-center shadow-xs shrink-0">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <h3 className="font-black text-base md:text-lg text-[#2D1810] leading-tight">
                      {location.name}
                    </h3>
                    <span className="text-[11px] font-mono font-bold text-[#7A3A2D]">
                      {formatCoordinates(location.lat, location.lng)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onFlyToLocation && (
                    <button
                      onClick={onFlyToLocation}
                      className="p-2 px-3 rounded-xl bg-[#9BCEC1] text-[#2D1810] hover:bg-[#FFB6A6] hover:text-[#FFEBD3] transition-all text-xs font-extrabold flex items-center gap-1 shadow-xs border border-[#9BCEC1]"
                      title="Haritada Yakınlaş"
                    >
                      <Navigation size={14} />
                      <span className="hidden sm:inline">Odaklan</span>
                    </button>
                  )}
                  <button
                    onClick={handleCopy}
                    className="p-2 px-3 rounded-xl bg-[#FFEBD3] border-2 border-[#FFB6A6] text-[#2D1810] hover:bg-[#FFB6A6] hover:text-[#FFEBD3] transition-all text-xs font-extrabold flex items-center gap-1"
                    title="Detayları Kopyala"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-[#9BCEC1]" />
                        <span className="text-xs">Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span className="hidden sm:inline">Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Location Image & Narrative Body */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
              {/* Location Photograph Banner */}
              {location && (
                <div className="relative w-full sm:w-36 h-32 rounded-2xl overflow-hidden border-2 border-[#FFB6A6] shrink-0 bg-[#FFB6A6]/10 shadow-sm group">
                  {imageLoading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-1.5 shimmer-bg">
                      <ImageIcon size={20} className="text-[#FFB6A6] animate-pulse" />
                      <span className="text-[10px] font-bold text-[#7A3A2D]">Görsel Yükleniyor...</span>
                    </div>
                  ) : imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={location.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={() => setImageUrl(null)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-1 bg-[#FFB6A6]/20 text-[#2D1810]">
                      <MapPin size={24} className="text-[#FFB6A6]" />
                      <span className="text-[10px] font-bold">Harita Görünümü</span>
                    </div>
                  )}

                  {/* Photo Badge */}
                  <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#2D1810]/75 backdrop-blur-xs text-[9px] font-bold text-[#FFEBD3]">
                    Canlı Görsel
                  </div>
                </div>
              )}

              {/* Main Narrative Text */}
              <p className="text-xs md:text-sm font-bold text-[#2D1810] leading-relaxed flex-1 pt-0.5">
                {content}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
