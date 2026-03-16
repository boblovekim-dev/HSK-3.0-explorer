import React, { useState } from 'react';
import { Lock, Copy, Check, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { markGroupLinkClicked } from '../services/leadService';
import { trackActionClick } from '../services/analyticsService';

const GROUP_LINK = 'https://zalo.me/g/ojubrw550';

const texts = {
    zh: {
        title: '更多内容已锁定',
        desc: '加入Zalo学习群即可免费解锁全部内容',
        copy: '复制',
        copied: '已复制',
        join: '加入学习群',
        after: '加群后刷新页面即可解锁',
        refresh: '刷新解锁',
    },
    vi: {
        title: 'Nội dung bị khóa',
        desc: 'Tham gia nhóm Zalo để mở khóa toàn bộ nội dung miễn phí',
        copy: 'Sao chép',
        copied: 'Đã sao chép',
        join: 'Tham gia nhóm',
        after: 'Vào nhóm xong làm mới trang để mở khóa',
        refresh: 'Làm mới & mở khóa',
    },
    en: {
        title: 'Content Locked',
        desc: 'Join our Zalo study group to unlock all content for free',
        copy: 'Copy',
        copied: 'Copied!',
        join: 'Join Group',
        after: 'Join the group then refresh to unlock',
        refresh: 'Refresh & Unlock',
    },
};

export const ContentLockOverlay: React.FC = () => {
    const { language } = useLanguage();
    const [copied, setCopied] = useState(false);
    const [hasClicked, setHasClicked] = useState(false);

    const t = texts[language as keyof typeof texts] ?? texts.vi;

    const handleLinkClick = (source: 'join_group_link' | 'join_group_button') => {
        trackActionClick(source);
        markGroupLinkClicked();
        setHasClicked(true);
        window.open(GROUP_LINK, '_blank');
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(GROUP_LINK);
            trackActionClick('copy_group_link');
            markGroupLinkClicked();
            setCopied(true);
            setTimeout(() => {
                setHasClicked(true);
                setCopied(false);
            }, 1000);
        } catch {}
    };

    return (
        <div className="relative">
            {/* Gradient fade */}
            <div className="absolute -top-40 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />

            {/* Lock card */}
            <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-8 text-center shadow-lg">
                <div className="w-16 h-16 bg-hsk-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock size={32} className="text-hsk-red" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{t.title}</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">{t.desc}</p>

                {!hasClicked ? (
                    <div className="space-y-3 max-w-sm mx-auto">
                        {/* Link row */}
                        <div className="flex items-center gap-2 border border-gray-200 rounded-xl bg-white px-3 py-2">
                            <a
                                href={GROUP_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLinkClick('join_group_link');
                                }}
                                className="flex-1 text-hsk-red text-sm font-medium hover:underline truncate flex items-center gap-1.5 min-w-0"
                            >
                                <ExternalLink size={13} className="flex-shrink-0" />
                                <span className="truncate">{GROUP_LINK}</span>
                            </a>
                            <button
                                onClick={handleCopy}
                                className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                    copied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {copied ? <Check size={12} /> : <Copy size={12} />}
                                {copied ? t.copied : t.copy}
                            </button>
                        </div>

                        {/* Join button */}
                        <button
                            onClick={() => handleLinkClick('join_group_button')}
                            className="w-full py-3 bg-gradient-to-r from-hsk-red to-red-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <ExternalLink size={16} />
                            {t.join}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3 max-w-sm mx-auto">
                        <p className="text-sm text-green-600 font-medium flex items-center justify-center gap-1.5">
                            <Check size={16} />
                            {t.after}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 bg-gradient-to-r from-hsk-red to-red-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg"
                        >
                            {t.refresh}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
