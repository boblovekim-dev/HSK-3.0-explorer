
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const [inputPage, setInputPage] = useState(currentPage.toString());

    useEffect(() => {
        setInputPage(currentPage.toString());
    }, [currentPage]);

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputPage(e.target.value);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const page = parseInt(inputPage);
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                onPageChange(page);
            } else {
                // Reset to valid current page if invalid
                setInputPage(currentPage.toString());
            }
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-4 py-8">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 transition-colors"
                aria-label="Previous Page"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium font-mono">
                <span>Page</span>
                <input
                    type="text"
                    value={inputPage}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onBlur={() => setInputPage(currentPage.toString())} // Reset on blur
                    className="w-12 h-8 text-center border border-gray-200 rounded-md focus:ring-2 focus:ring-hsk-red/20 focus:border-hsk-red outline-none transition-all"
                />
                <span className="text-gray-400">/</span>
                <span>{totalPages}</span>
            </div>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 transition-colors"
                aria-label="Next Page"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};
