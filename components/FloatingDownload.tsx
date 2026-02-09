import React, { useState } from 'react';
import { X, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FloatingDownloadProps {
    appLogoUrl?: string;
    qrCodeUrl?: string;
    downloadLink?: string;
}

// Get the base URL for assets
const baseUrl = import.meta.env.BASE_URL || '/';

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
                        {/* Simplified colored triangles logic for Google Play often just uses 4 shapes */}
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

export const FloatingDownload: React.FC<FloatingDownloadProps> = ({
    appLogoUrl = `${baseUrl}assets/app-logo.png`,
    qrCodeUrl = `${baseUrl}assets/app-qrcode.png`,
    downloadLink = 'https://wanlihsk.onelink.me/jqXw/t12b6ypg'
}) => {
    const { t } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-hsk-red to-red-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                title={t('downloadNow')}
            >
                <Download size={24} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
            {/* 浮动卡片 */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 w-[280px]">
                {/* 头部 - 始终显示 */}
                <div className="bg-gradient-to-r from-hsk-red to-red-600 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src={appLogoUrl}
                            alt="WanLi HSK App"
                            className="w-8 h-8 rounded-lg bg-white/20"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        <span className="text-white font-bold text-sm">{t('wanliHsk')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-white/80 hover:text-white p-1 rounded transition-colors"
                            title={isExpanded ? '收起' : '展开'}
                        >
                            {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-white/80 hover:text-white p-1 rounded transition-colors"
                            title="关闭"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* 展开内容 */}
                {isExpanded && (
                    <div className="p-5 flex gap-4 items-center">
                        {/* 左侧按钮组 */}
                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                            <StoreButton type="google" href={downloadLink} />
                            <StoreButton type="apple" href={downloadLink} />
                        </div>

                        {/* 右侧二维码 */}
                        <div className="flex flex-col items-center gap-1 shrink-0">
                            <div className="p-1 border border-gray-100 rounded-lg shadow-sm">
                                <img
                                    src={qrCodeUrl}
                                    alt="Download QR"
                                    className="w-20 h-20 object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f0f0f0" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%23999" font-size="10">QR Code</text></svg>';
                                    }}
                                />
                            </div>
                            <span className="text-[10px] text-gray-500 transform scale-90 origin-top">
                                {t('scanToDownload')}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

