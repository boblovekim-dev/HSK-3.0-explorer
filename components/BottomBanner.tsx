import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { trackDownloadClick } from '../services/analyticsService';

// Get the base URL for assets
const baseUrl = import.meta.env.BASE_URL || '/';

export const BottomBanner: React.FC = () => {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const appQrUrl = `${baseUrl}assets/app-qrcode.png`;
    const logoUrl = `${baseUrl}assets/banner-logo.png`;
    const bgUrl = `${baseUrl}assets/banner-bg.png`;

    return (
        <div
            className="fixed bottom-0 left-0 w-full z-40 text-white shadow-lg overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgUrl})` }}
        >
            {/* Close Button */}
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 p-1 bg-black/20 hover:bg-black/30 rounded-full z-50 transition-colors"
                aria-label="Close banner"
            >
                <X size={16} />
            </button>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-center gap-4 md:gap-16 relative h-24 md:h-28">

                {/* Left Side: Logo + Text */}
                <div className="flex items-center gap-3 md:gap-4 z-10 h-full">
                    <div className="hidden md:block h-full aspect-square relative py-2">
                        <img src={logoUrl} alt="App Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col justify-center h-full">
                        <h3 className="text-lg md:text-2xl font-bold leading-tight shadow-black/30 drop-shadow-md">
                            {t('bannerTitle')}
                        </h3>
                        <p className="text-xs md:text-sm opacity-90 font-light mt-1 shadow-black/30 drop-shadow-sm">
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
                        onClick={() => trackDownloadClick('mobile_banner')}
                        className="md:hidden bg-white text-blue-600 px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                        {t('downloadApp')}
                    </a>
                </div>
            </div>
        </div>
    );
};
