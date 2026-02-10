import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Get the base URL for assets
const baseUrl = import.meta.env.BASE_URL || '/';

export const BottomBanner: React.FC = () => {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const appQrUrl = `${baseUrl}assets/app-qrcode.png`;
    const logoUrl = `${baseUrl}assets/wanli-logo.png`;

    return (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg overflow-hidden">
            {/* Close Button */}
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 p-1 bg-black/20 hover:bg-black/30 rounded-full z-50 transition-colors"
            >
                <X size={16} />
            </button>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between relative">

                {/* Background Decor (Cloud pattern simulation) */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute top-10 right-20 w-32 h-32 bg-purple-300 rounded-full blur-3xl"></div>
                </div>

                {/* Left Side: Logo + Text */}
                <div className="flex items-center gap-4 z-10">
                    <div className="hidden md:block w-16 h-16 bg-white/10 rounded-xl p-2 backdrop-blur-sm border border-white/20">
                        <img src={logoUrl} alt="WanLi Logo" className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-lg md:text-2xl font-bold leading-tight shadow-black/10 drop-shadow-md">
                            {t('bannerTitle')}
                        </h3>
                        <p className="text-xs md:text-sm opacity-90 font-light mt-1">
                            {t('bannerSubtitle')}
                        </p>
                    </div>
                </div>

                {/* Right Side: QR Code (Desktop) / Button (Mobile) */}
                <div className="flex items-center gap-4 z-10">
                    {/* Desktop QR */}
                    <div className="hidden md:flex items-center gap-3 bg-white p-2 rounded-xl text-blue-900 shadow-xl">
                        <img src={appQrUrl} alt="App QR" className="w-20 h-20 object-contain" />
                        <div className="flex flex-col items-start pr-2">
                            <span className="font-bold text-lg">WanLi HSK</span>
                            <span className="text-[10px] text-gray-500">{t('bannerScanText')}</span>
                        </div>
                    </div>

                    {/* Mobile Button */}
                    <a
                        href="https://wanlihsk.onelink.me/jqXw/t12b6ypg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="md:hidden bg-white text-blue-600 px-4 py-2 rounded-full font-bold text-sm shadow-md hover:bg-gray-50 transition-colors"
                    >
                        {t('downloadApp')}
                    </a>
                </div>
            </div>
        </div>
    );
};
