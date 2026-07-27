import { Preset } from '@/types';
import {
  Landmark,
  Building2,
  Trees,
  Utensils,
  Church,
  Waves,
  Mountain,
  Castle,
  Sun,
  Palette,
} from 'lucide-react';

export const APP_CONFIG = {
  name: 'KENSAI',
  tagline: 'Akıllı Coğrafi Keşif Uzmanı',
  description:
    'Kensai, gelişmiş kategori keşif modlarını kullanarak dünyadaki eşsiz antik kentleri, metropolleri, doğa harikalarını, kıyıları, manevi ve kültürel mekanları saniyeler içinde harita üzerinde keşfetmenizi sağlar.',
};

export const THEME_COLORS = {
  canvas: '#FFEBD3',      // 60% Warm Cream Base & Canvas
  surface: '#FFB6A6',     // 30% Structural Coral & Panels
  accent: '#9BCEC1',      // 10% High-Pop Mint Accent CTAs
  textDark: '#2D1810',    // Espresso High-Contrast Text
  textMuted: '#7A3A2D',   // Muted Coffee Text
};

export const PRESETS: Preset[] = [
  {
    id: 'antique',
    label: 'Antik',
    prompt: 'Bana az bilinen ama medeniyet tarihinde önemli bir iz bırakmış antik bir harabe veya şehir öner.',
    icon: <Landmark size={20} />,
  },
  {
    id: 'metropol',
    label: 'Metropol',
    prompt: 'Bana kültürel dokusu zengin, sanat ortamı canlı ve klişelerden uzak, dinamik bir metropol göster.',
    icon: <Building2 size={20} />,
  },
  {
    id: 'nature',
    label: 'Yeşil Doğa',
    prompt: 'Beni el değmemiş, ekolojik olarak benzersiz ve biyolojik çeşitliliği ile büyüleyen bir doğa harikasına götür.',
    icon: <Trees size={20} />,
  },
  {
    id: 'food',
    label: 'Gastronomik',
    prompt: 'Bana az bilinen ama kendine özgü mutfağıyla bir lezzet devrimi yaratan bir şehir veya bölge öner.',
    icon: <Utensils size={20} />,
  },
  {
    id: 'spiritual',
    label: 'Manevi',
    prompt: 'Bana farklı inançlar için tarihi veya manevi önemi büyük olan, mimari olarak etkileyici bir tapınak, manastır veya kutsal mekan öner.',
    icon: <Church size={20} />,
  },
  {
    id: 'coastal',
    label: 'Sahil & Ada',
    prompt: 'Bana masmavi suları, saklı koyları ve büyüleyici ada atmosferi olan cennet gibi bir kıyı konumu göster.',
    icon: <Waves size={20} />,
  },
  {
    id: 'adventure',
    label: 'Macera & Dağ',
    prompt: 'Bana yüksek irtifaları, dramatik kanyonları ve nefes kesen manzaralarıyla bilinen ekstrem bir dağlık bölge öner.',
    icon: <Mountain size={20} />,
  },
  {
    id: 'historic_village',
    label: 'Tarihi Köyler',
    prompt: 'Bana geleneksel mimarisini ve tarihi yapısını korumuş, zamanın durduğu hissini veren otantik bir kasaba veya köy göster.',
    icon: <Castle size={20} />,
  },
  {
    id: 'desert',
    label: 'Çöl & Vaha',
    prompt: 'Bana devasa kum tepeleri, dramatik kanyonlar veya palmiyeli bir vaha yaşamıyla büyüleyen egzotik bir çöl noktası öner.',
    icon: <Sun size={20} />,
  },
  {
    id: 'art_arch',
    label: 'Sanat & Mimari',
    prompt: 'Bana avangart mimarisi, müze veya sokak sanatlarıyla öne çıkan sıra dışı bir kültür şehri veya yapı öner.',
    icon: <Palette size={20} />,
  },
];

// DRY Helper Utilities
export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
};

export const formatShortCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
