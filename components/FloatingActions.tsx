import React, { useState, useEffect } from 'react';
import { Download, ChevronUp, Headphones, Smartphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Get the base URL for assets
const baseUrl = import.meta.env.BASE_URL || '/';

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    color?: string;
    children?: React.ReactNode;
}

const StoreButton = ({ type, href }: { type: 'apple' | 'google', href: string }) => {
    const isApple = type === 'apple';

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white text-black border border-gray-300 rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors w-full shadow-sm"
        >
            <div className="shrink-0">
                {isApple ? (
                    <svg viewBox="0 0 384 512" width="24" height="24" className="fill-current">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 48 48" width="24" height="24">
                        <path fill="#4DB6AC" d="M7 44V4L34 23.5L7 44Z" />
                        <path fill="#CE93D8" d="M34 23.5L7 4L42 21L34 23.5Z" />
                        <path fill="#F48FB1" d="M34 23.5L42 27L7 44L34 23.5Z" />
                        <path fill="#4DB6AC" d="M7 4v40L28 23.5L7 4Z" />
                        <path fill="#FFEB3B" d="M42 21l-8 2.5L7 4v40l27-19.5L42 27c1.7-1 2.3-3.3 1.2-5-.3-1-1-1-1.2-1Z" />
                        <path fill="#4CAF50" d="M7 4l27 19.5L42 21c.5-.3.8-.8.8-1.5L7 4Z" />
                        <path fill="#F44336" d="M34 23.5L7 44l35-17c.5-.3.8-.8.8-1.5L34 23.5Z" />
                        <path fill="#EA4335" d="M24 23.5L7 44c1.5 1.5 4 1.5 5.5 0L34 29.5 24 23.5Z" />
                        <path fill="#FBBC04" d="M42 21l-8 2.5L24 23.5 34 29.5 42 27c1.7-1 2.3-3.3 1.2-5-.3-1-1-1-1.2-1Z" />
                        <path fill="#34A853" d="M7 4c-1.5-1.5-4-1.5-5.5 0L24 23.5 34 17.5 7 4Z" />
                        <path fill="#4285F4" d="M24 23.5L7 4v40l17-19.5Z" />
                    </svg>
                )}
            </div>
            <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] uppercase font-medium text-gray-600">
                    {isApple ? 'Download on the' : 'GET IT ON'}
                </span>
                <span className="text-[13px] font-bold font-sans tracking-tight">
                    {isApple ? 'App Store' : 'Google Play'}
                </span>
            </div>
        </a>
    );
};

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick, color = 'bg-white text-gray-700 hover:text-hsk-red', children }) => {
    return (
        <div className="relative group flex items-center">
            {/* Popover Content (Left side) */}
            <div className="absolute right-full mr-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 z-50">
                {children ? (
                    children
                ) : (
                    <div className="bg-gray-800 text-white text-xs py-1 px-3 rounded shadow-lg whitespace-nowrap">
                        {label}
                        {/* Arrow */}
                        <div className="absolute top-1/2 -right-1 w-2 h-2 bg-gray-800 transform -translate-y-1/2 rotate-45"></div>
                    </div>
                )}
            </div>

            {/* Button */}
            <button
                onClick={onClick}
                className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${color}`}
                aria-label={label}
            >
                {icon}
            </button>
        </div>
    );
};

export const FloatingActions: React.FC = () => {
    const { t } = useLanguage();
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const downloadLink = 'https://wanlihsk.onelink.me/jqXw/t12b6ypg';
    const qrCodeUrl = `${baseUrl}assets/app-qrcode.png`;
    const zaloQrUrl = `${baseUrl}assets/zalo-qr.png`;

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-50">
            {/* App Download Button */}
            <ActionButton
                icon={<Smartphone size={24} />}
                label={t('downloadApp')}
                color="bg-yellow-400 text-white hover:bg-yellow-500"
            >
                <div className="bg-white p-5 rounded-xl shadow-xl border border-gray-100 w-[280px] relative">
                    {/* Arrow */}
                    <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white transform -translate-y-1/2 rotate-45 border-t border-r border-gray-100"></div>

                    <div className="flex gap-4 items-center">
                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                            <StoreButton type="google" href={downloadLink} />
                            <StoreButton type="apple" href={downloadLink} />
                        </div>
                        <div className="flex flex-col items-center gap-1 shrink-0">
                            <div className="p-1 border border-gray-100 rounded-lg shadow-sm">
                                <img
                                    src={qrCodeUrl}
                                    alt="Download QR"
                                    className="w-20 h-20 object-contain"
                                />
                            </div>
                            <span className="text-[10px] text-gray-500 transform scale-90 origin-top">
                                {t('scanToDownload')}
                            </span>
                        </div>
                    </div>
                </div>
            </ActionButton>

            {/* Customer Service Button */}
            <ActionButton
                icon={<Headphones size={24} />}
                label={t('customerService')}
            >
                <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100 w-48 relative flex flex-col items-center gap-2">
                    {/* Arrow */}
                    <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white transform -translate-y-1/2 rotate-45 border-t border-r border-gray-100"></div>

                    <h4 className="font-bold text-gray-800 text-sm whitespace-nowrap">{t('customerService')}</h4>
                    <div className="p-1 border border-gray-100 rounded-lg shadow-sm">
                        <img
                            src={zaloQrUrl}
                            alt="Zalo QR"
                            className="w-32 h-32 object-contain"
                        />
                    </div>
                    <span className="text-xs text-gray-500">{t('scanToAdd')}</span>
                </div>
            </ActionButton>

            {/* Back to Top */}
            <div className={`transition-all duration-500 transform ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <ActionButton
                    icon={<ChevronUp size={24} />}
                    label={t('backToTop')}
                    onClick={scrollToTop}
                />
            </div>
        </div>
    );
};
