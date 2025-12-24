import { Preset } from '@/types';
import clsx from 'clsx';
import { useState } from 'react';

interface ActionButtonsProps {
    presets: Preset[];
    onSelect: (preset: Preset) => void;
    isLoading: boolean;
    disabled?: boolean;
}

export const ActionButtons = ({ presets, onSelect, isLoading, disabled }: ActionButtonsProps) => {
    const [activeId, setActiveId] = useState<string | null>(null);

    const handleClick = (preset: Preset) => {
        setActiveId(preset.id);
        onSelect(preset);
    };

    return (
        <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl glassmorphism mx-auto max-w-fit">
            {presets.map((preset) => (
                <button
                    key={preset.id}
                    onClick={() => handleClick(preset)}
                    disabled={disabled || isLoading}
                    className={clsx(
                        "relative group flex items-center justify-center",
                        "w-10 h-10 rounded-lg",
                        "transition-all duration-200 ease-out",
                        "hover:scale-105 active:scale-95",
                        "disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed",
                        "bg-white/60 border border-slate-200/80",
                        "hover:bg-white hover:border-indigo-200 hover:shadow-md",
                        activeId === preset.id && isLoading && "bg-indigo-50 border-indigo-300"
                    )}
                    title={preset.label}
                >
                    <span className="text-lg">{preset.icon}</span>
                </button>
            ))}
        </div>
    );
};
