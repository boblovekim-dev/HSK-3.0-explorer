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
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 w-64">
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
                    <div className="p-4 space-y-4">
                        {/* QR Code */}
                        <div className="flex justify-center">
                            <div className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <img
                                    src={qrCodeUrl}
                                    alt="Download QR Code"
                                    className="w-32 h-32 object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f0f0f0" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%23999" font-size="10">QR Code</text></svg>';
                                    }}
                                />
                            </div>
                        </div>

                        {/* 扫码提示 */}
                        <p className="text-center text-xs text-gray-500">
                            {t('scanToDownload')}
                        </p>

                        {/* 下载按钮 */}
                        <a
                            href={downloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-2.5 px-4 bg-gradient-to-r from-hsk-red to-red-600 text-white text-center text-sm font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Download size={16} />
                                <span>{t('downloadNow')}</span>
                            </div>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

