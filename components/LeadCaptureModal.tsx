import React, { useState } from 'react';
import { X, Users, Copy, Check, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { markGroupLinkClicked } from '../services/leadService';

const GROUP_LINK = 'https://zalo.me/g/ojubrw550';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const texts = {
    zh: {
        title: '加入学习群解锁全部内容',
        subtitle: '加入我们的Zalo学习群，即可免费获取全部HSK备考资料',
        instruction: '点击下方链接加入Zalo学习群，加群后刷新页面即可解锁全部内容',
        link_label: '加群链接',
        copy: '复制',
        copied: '已复制！',
        join: '点击加入学习群',
        after_click_title: '已点击加群链接！',
        after_click_desc: '请加入Zalo群组后，点击下方按钮刷新页面，即可解锁全部内容',
        refresh: '刷新解锁',
        close: '稍后再说',
    },
    vi: {
        title: 'Tham gia nhóm để mở khóa nội dung',
        subtitle: 'Tham gia nhóm Zalo để truy cập miễn phí toàn bộ tài liệu luyện thi HSK',
        instruction: 'Nhấn vào đường link bên dưới để tham gia nhóm Zalo. Sau khi vào nhóm, làm mới trang để mở khóa toàn bộ nội dung',
        link_label: 'Link tham gia nhóm',
        copy: 'Sao chép',
        copied: 'Đã sao chép!',
        join: 'Nhấn để tham gia nhóm',
        after_click_title: 'Đã nhấn vào link!',
        after_click_desc: 'Hãy tham gia nhóm Zalo, sau đó nhấn nút bên dưới để làm mới trang và mở khóa toàn bộ nội dung',
        refresh: 'Làm mới & mở khóa',
        close: 'Để sau',
    },
    en: {
        title: 'Join the Study Group to Unlock',
        subtitle: 'Join our Zalo study group to access all HSK learning materials for free',
        instruction: 'Click the link below to join the Zalo study group. After joining, refresh the page to unlock all content',
        link_label: 'Group join link',
        copy: 'Copy',
        copied: 'Copied!',
        join: 'Click to Join Group',
        after_click_title: 'Link Clicked!',
        after_click_desc: 'After joining the Zalo group, click the button below to refresh and unlock all content',
        refresh: 'Refresh & Unlock',
        close: 'Maybe later',
    },
};

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose }) => {
    const { language } = useLanguage();
    const [copied, setCopied] = useState(false);
    const [hasClicked, setHasClicked] = useState(false);

    const t = texts[language as keyof typeof texts] ?? texts.vi;

    const handleLinkClick = () => {
        markGroupLinkClicked();
        setHasClicked(true);
        window.open(GROUP_LINK, '_blank');
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(GROUP_LINK);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback: select text
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/20 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-hsk-red to-red-600 px-6 pt-8 pb-6 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users size={20} />
                        </div>
                        <h2 className="text-xl font-bold leading-tight">{t.title}</h2>
                    </div>
                    <p className="text-white/90 text-sm">{t.subtitle}</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {!hasClicked ? (
                        <>
                            <p className="text-gray-600 text-sm">{t.instruction}</p>

                            {/* Link card */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{t.link_label}</span>
                                </div>
                                <div className="flex items-center gap-2 p-3">
                                    <a
                                        href={GROUP_LINK}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={handleLinkClick}
                                        className="flex-1 text-hsk-red text-sm font-medium hover:underline truncate flex items-center gap-1.5 min-w-0"
                                    >
                                        <ExternalLink size={14} className="flex-shrink-0" />
                                        <span className="truncate">{GROUP_LINK}</span>
                                    </a>
                                    <button
                                        onClick={handleCopy}
                                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                            copied
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {copied ? <Check size={13} /> : <Copy size={13} />}
                                        {copied ? t.copied : t.copy}
                                    </button>
                                </div>
                            </div>

                            {/* Main join button */}
                            <button
                                onClick={handleLinkClick}
                                className="w-full py-3 bg-gradient-to-r from-hsk-red to-red-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
                            >
                                <ExternalLink size={18} />
                                {t.join}
                            </button>

                            {/* Skip */}
                            <button
                                onClick={onClose}
                                className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition-colors"
                            >
                                {t.close}
                            </button>
                        </>
                    ) : (
                        /* After clicking the link */
                        <div className="text-center py-2 space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <Check size={32} className="text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{t.after_click_title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{t.after_click_desc}</p>
                            </div>
                            <button
                                onClick={handleRefresh}
                                className="w-full py-3 bg-gradient-to-r from-hsk-red to-red-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                            >
                                {t.refresh}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
