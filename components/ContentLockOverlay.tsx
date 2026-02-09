import React from 'react';
import { Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ContentLockOverlayProps {
    onUnlockClick: () => void;
}

export const ContentLockOverlay: React.FC<ContentLockOverlayProps> = ({ onUnlockClick }) => {
    const { language } = useLanguage();

    const getTitle = () => {
        switch (language) {
            case 'zh': return '更多内容已锁定';
            case 'vi': return 'Nội dung bị khóa';
            default: return 'Content Locked';
        }
    };

    const getDescription = () => {
        switch (language) {
            case 'zh': return '填写简单信息即可免费查看全部内容';
            case 'vi': return 'Điền thông tin đơn giản để xem tất cả nội dung miễn phí';
            default: return 'Fill in a simple form to view all content for free';
        }
    };

    const getButtonText = () => {
        switch (language) {
            case 'zh': return '立即解锁';
            case 'vi': return 'Mở khóa ngay';
            default: return 'Unlock Now';
        }
    };

    return (
        <div className="relative">
            {/* Gradient fade overlay */}
            <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />

            {/* Lock overlay */}
            <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-8 text-center shadow-lg">
                <div className="w-16 h-16 bg-hsk-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock size={32} className="text-hsk-red" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {getTitle()}
                </h3>

                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    {getDescription()}
                </p>

                <button
                    onClick={onUnlockClick}
                    className="px-8 py-3 bg-gradient-to-r from-hsk-red to-red-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    {getButtonText()}
                </button>
            </div>
        </div>
    );
};
