import React, { useState } from 'react';
import { X, User, Phone, MessageSquare, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { submitLead } from '../services/leadService';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// 常用国家区号
const countryCodes = [
    { code: '+86', country: '中国', flag: '🇨🇳' },
    { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
    { code: '+84', country: 'Việt Nam', flag: '🇻🇳' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+81', country: '日本', flag: '🇯🇵' },
    { code: '+82', country: '한국', flag: '🇰🇷' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
    { code: '+66', country: 'Thailand', flag: '🇹🇭' },
    { code: '+63', country: 'Philippines', flag: '🇵🇭' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
];

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { t, language } = useLanguage();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+86');
    const [learningPurpose, setLearningPurpose] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const getModalTitle = () => {
        switch (language) {
            case 'zh': return '解锁全部内容';
            case 'vi': return 'Mở khóa tất cả nội dung';
            default: return 'Unlock All Content';
        }
    };

    const getModalSubtitle = () => {
        switch (language) {
            case 'zh': return '填写以下信息即可免费查看全部HSK学习资料';
            case 'vi': return 'Điền thông tin bên dưới để xem miễn phí tất cả tài liệu HSK';
            default: return 'Fill in the form below to access all HSK learning materials for free';
        }
    };

    const getNamePlaceholder = () => {
        switch (language) {
            case 'zh': return '怎么称呼您？';
            case 'vi': return 'Tên của bạn?';
            default: return 'Your name?';
        }
    };

    const getPhonePlaceholder = () => {
        switch (language) {
            case 'zh': return '手机号码';
            case 'vi': return 'Số điện thoại';
            default: return 'Phone number';
        }
    };

    const getPurposePlaceholder = () => {
        switch (language) {
            case 'zh': return '学中文的目的是？（选填）';
            case 'vi': return 'Mục đích học tiếng Trung? (Tùy chọn)';
            default: return 'Why are you learning Chinese? (Optional)';
        }
    };

    const getSubmitText = () => {
        switch (language) {
            case 'zh': return '立即解锁';
            case 'vi': return 'Mở khóa ngay';
            default: return 'Unlock Now';
        }
    };

    const getSkipText = () => {
        switch (language) {
            case 'zh': return '稍后再说';
            case 'vi': return 'Để sau';
            default: return 'Maybe later';
        }
    };

    // 验证手机号格式 - 至少6位数字
    const validatePhone = (phoneNumber: string): boolean => {
        const digitsOnly = phoneNumber.replace(/\D/g, '');
        return digitsOnly.length >= 6 && digitsOnly.length <= 15;
    };

    const getPhoneError = () => {
        switch (language) {
            case 'zh': return '请输入有效的手机号码（至少6位数字）';
            case 'vi': return 'Vui lòng nhập số điện thoại hợp lệ (ít nhất 6 chữ số)';
            default: return 'Please enter a valid phone number (at least 6 digits)';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 验证称呼
        if (!name.trim()) {
            setError(language === 'zh' ? '请输入您的称呼' : language === 'vi' ? 'Vui lòng nhập tên' : 'Please enter your name');
            return;
        }

        // 验证称呼长度
        if (name.trim().length < 2) {
            setError(language === 'zh' ? '称呼至少需要2个字符' : language === 'vi' ? 'Tên phải có ít nhất 2 ký tự' : 'Name must be at least 2 characters');
            return;
        }

        // 验证手机号非空
        if (!phone.trim()) {
            setError(language === 'zh' ? '请输入手机号码' : language === 'vi' ? 'Vui lòng nhập số điện thoại' : 'Please enter your phone number');
            return;
        }

        // 验证手机号格式
        if (!validatePhone(phone)) {
            setError(getPhoneError());
            return;
        }

        setIsSubmitting(true);

        const result = await submitLead({
            name: name.trim(),
            phone: phone.trim(),
            country_code: countryCode,
            learning_purpose: learningPurpose.trim() || undefined
        });

        setIsSubmitting(false);

        if (result.success) {
            onSuccess();
        } else {
            // 提交失败时显示错误，不自动解锁
            setError(language === 'zh' ? '提交失败，请重试' : language === 'vi' ? 'Gửi thất bại, vui lòng thử lại' : 'Submission failed, please try again');
        }
    };

    const handleClose = () => {
        // 只关闭弹窗，不解锁
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-hsk-red to-red-600 px-6 pt-8 pb-6 text-white">
                    <h2 className="text-2xl font-bold mb-2">{getModalTitle()}</h2>
                    <p className="text-white/90 text-sm">{getModalSubtitle()}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={getNamePlaceholder()}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hsk-red/20 focus:border-hsk-red transition-all text-gray-700 placeholder-gray-400"
                        />
                    </div>

                    {/* Phone with Country Code */}
                    <div className="flex gap-2">
                        <div className="relative w-28 flex-shrink-0">
                            <select
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="w-full appearance-none pl-3 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hsk-red/20 focus:border-hsk-red transition-all text-gray-700 bg-white cursor-pointer"
                            >
                                {countryCodes.map((item) => (
                                    <option key={item.code} value={item.code}>
                                        {item.flag} {item.code}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="relative flex-1">
                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder={getPhonePlaceholder()}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hsk-red/20 focus:border-hsk-red transition-all text-gray-700 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Learning Purpose (Optional) */}
                    <div className="relative">
                        <MessageSquare size={18} className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                            value={learningPurpose}
                            onChange={(e) => setLearningPurpose(e.target.value)}
                            placeholder={getPurposePlaceholder()}
                            rows={2}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hsk-red/20 focus:border-hsk-red transition-all text-gray-700 placeholder-gray-400 resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-gradient-to-r from-hsk-red to-red-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Loading...
                            </span>
                        ) : (
                            getSubmitText()
                        )}
                    </button>

                    {/* Skip Link */}
                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition-colors"
                    >
                        {getSkipText()}
                    </button>
                </form>
            </div>
        </div>
    );
};
