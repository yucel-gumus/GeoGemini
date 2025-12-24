import clsx from 'clsx';

interface CaptionProps {
    content: string;
    isLoading?: boolean;
}

export const Caption = ({ content, isLoading }: CaptionProps) => {
    if (!content && !isLoading) return null;

    return (
        <div
            className={clsx(
                "w-full max-w-2xl mx-auto",
                "p-6 md:p-8 rounded-2xl",
                "glassmorphism",
                "text-center transition-all duration-500 ease-out transform",
                isLoading ? "scale-[0.98]" : "scale-100"
            )}
        >
            {isLoading ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-12 h-12">
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: 'var(--gradient-primary)',
                                opacity: 0.2
                            }}
                        />
                        <div
                            className="absolute inset-1 rounded-full border-3 border-transparent"
                            style={{
                                borderTopColor: '#6366f1',
                                borderRightColor: '#8b5cf6',
                                animation: 'spin 1s linear infinite'
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <p className="text-base font-medium tracking-wide gradient-text">
                            {content || "Keşif rotanız oluşturuluyor..."}
                        </p>
                        <div className="h-1.5 w-48 mx-auto rounded-full overflow-hidden bg-slate-200">
                            <div
                                className="h-full rounded-full shimmer-loading"
                                style={{
                                    background: 'var(--gradient-primary)',
                                    width: '60%'
                                }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed tracking-wide">
                    {content}
                </p>
            )}
        </div>
    );
};
