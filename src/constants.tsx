import { Preset } from '@/types';
import { Landmark, Building2, Trees, Utensils, Church } from 'lucide-react';

export const PRESETS: Preset[] = [
  { 
    id: 'antique', 
    label: 'Antik', 
    prompt: 'Bana az bilinen ama medeniyet tarihinde önemli bir iz bırakmış antik bir harabe veya şehir öner.',
    icon: <Landmark size={24} />
  },
  { 
    id: 'metropol', 
    label: 'Metropol', 
    prompt: 'Bana kültürel dokusu zengin, sanat ortamı canlı ve klişelerden uzak, dinamik bir metropol göster.',
    icon: <Building2 size={24} />
  },
  { 
    id: 'nature', 
    label: 'Yeşil', 
    prompt: 'Beni el değmemiş, ekolojik olarak benzersiz ve biyolojik çeşitliliği ile büyüleyen bir doğa harikasına götür.',
    icon: <Trees size={24} />
  },
  { 
    id: 'food', 
    label: 'Gastronomik', 
    prompt: 'Bana az bilinen ama kendine özgü mutfağıyla bir lezzet devrimi yaratan bir şehir veya bölge öner.',
    icon: <Utensils size={24} />
  },
  { 
    id: 'spiritual', 
    label: 'Manevi', 
    prompt: 'Bana farklı inançlar için tarihi veya manevi önemi büyük olan, mimari olarak etkileyici bir tapınak, manastır veya kutsal mekan öner.',
    icon: <Church size={24} />
  },
];
