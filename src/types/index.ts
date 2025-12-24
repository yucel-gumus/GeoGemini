import { ReactNode } from 'react';

export type Location = {
    name: string;
    lat: number;
    lng: number;
    caption: string;
};

export type PresetCategory = 'Antik' | 'Metropol' | 'Yeşil' | 'Gastronomik' | 'Manevi';

export interface Preset {
    id: string;
    label: string;
    prompt: string;
    icon?: ReactNode;
}

export type MapState = {
    center: [number, number];
    zoom: number;
    marker?: {
        position: [number, number];
        content: string;
    } | null;
};

export interface AIResponse {
    location: string;
    caption: string;
}
