import React, { useState, useMemo } from 'react';
import type { Notice } from '../types';
import Card from './Card';
import PdfIcon from './icons/PdfIcon';
import SortAscIcon from './icons/SortAscIcon';
import SortDescIcon from './icons/SortDescIcon';
import DateRangeFilter from './DateRangeFilter';

const bengaliMonths: string[] = [
    'জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const bengaliNumerals: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

function convertToBengaliNumerals(englishStr: string): string {
    return englishStr.split('').map(char => bengaliNumerals[char] || char).join('');
}

function formatBengaliDateTime(dateTimeStr: string): string {
    try {
        const date = new Date(dateTimeStr);
        
        // Date part
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        
        if (isNaN(day) || isNaN(year) || month === undefined) return dateTimeStr;

        const bengaliDay = convertToBengaliNumerals(day.toString());
        const bengaliMonth = bengaliMonths[month];
        const bengaliYear = convertToBengaliNumerals(year.toString());
        const formattedDate = `${bengaliDay} ${bengaliMonth}, ${bengaliYear}`;

        // Time part
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'বিকাল' : 'সকাল';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const bengaliHours = convertToBengaliNumerals(hours.toString());
        const bengaliMinutes = convertToBengaliNumerals(minutes.toString().padStart(2, '0'));
        
        const formattedTime = `${bengaliHours}:${bengaliMinutes} ${ampm}`;

        return `${formattedDate}, ${formattedTime}`;
    } catch (error) {
        console.error("Error formatting Bengali date and time:", dateTimeStr, error);
        return dateTimeStr;
    }
}

const NoticeCard: React.FC<{ notice: Notice }> = ({ notice }) => {
    const cardBorderClass = notice.isUrgent ? 'border-l-4 border-red-500' : 'border-l-4 border-teal-500';
    const cardBgClass = notice.isUrgent ? 'bg-red-50' : '';

    return (
        <Card className={`${cardBorderClass} ${cardBgClass} mb-4 transition-transform transform hover:scale-105`}>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold text-gray-800">{notice.title}</h3>
                        {notice.pdfUrl && notice.pdfUrl !== '#' && (
                            <span className="text-teal-500" title="পিডিএফ সংযুক্ত">
                                <PdfIcon />
                            </span>
                        )}
                    </div>
                    {notice.isUrgent && (
                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">জরুরী</span>
                    )}
                </div>
                <p className="text-sm text-gray-500 mb-3">{formatBengaliDateTime(notice.publishDateTime)} | লেখক: {notice.author}</p>
                <p className="text-base text-gray-700 leading-7 mb-4 whitespace-pre-wrap">{notice.content}</p>
                {notice.pdfUrl && notice.pdfUrl !== '#' && (
                    <a
                        href={notice.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-teal-100 text-teal-800 rounded-md font-semibold hover:bg-teal-200 transition-colors duration-300 text-sm"
                        aria-label={`${notice.title} এর পিডিএফ ডাউনলোড করুন`}
                    >
                        <PdfIcon />
                        <span>পিডিএফ কপি ডাউনলোড</span>
                    </a>
                )}
            </div>
        </Card>
    )
};


const NoticeBoardPage: React.FC<{ notices: Notice[] }> = ({ notices }) => {
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isFilterActive, setIsFilterActive] = useState(false);

    const handleSortToggle = () => {
        setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    };

    const handleFilter = () => {
        if (startDate && endDate) {
            setIsFilterActive(true);
        }
    };

    const handleClearFilter = () => {
        setStartDate('');
        setEndDate('');
        setIsFilterActive(false);
    };

    const displayedNotices = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const visibleNotices = notices.filter(notice => {
            const publishDate = new Date(notice.publishDateTime);
            
            // Check if notice is published
            if (publishDate > now) {
                return false;
            }

            // Check if notice has expired
            if (notice.expiryDate) {
                const expiry = new Date(notice.expiryDate);
                if (today > expiry) {
                    return false;
                }
            }

            // Apply date range filter if active
            if (isFilterActive && startDate && endDate) {
                const start = new Date(startDate + 'T00:00:00');
                const end = new Date(endDate + 'T23:59:59');
                if (publishDate < start || publishDate > end) {
                    return false;
                }
            }
            
            return true;
        });

        const sortedNotices = [...visibleNotices];

        sortedNotices.sort((a, b) => {
            const dateA = new Date(a.publishDateTime).getTime();
            const dateB = new Date(b.publishDateTime).getTime();
            if (sortOrder === 'asc') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });

        return sortedNotices;
    }, [notices, sortOrder, startDate, endDate, isFilterActive]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-center text-teal-700 mb-8">
                নোটিশ বোর্ড
            </h2>

            <DateRangeFilter 
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                onFilter={handleFilter}
                onClear={handleClearFilter}
            />

              <Card className="mb-8 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-sm font-medium text-gray-600">
                      মোট নোটিশ: {convertToBengaliNumerals(displayedNotices.length.toString())}
                    </span>
                    <button
                        onClick={handleSortToggle}
                        className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md font-semibold hover:bg-gray-200 transition-colors duration-300 text-sm w-full sm:w-auto"
                        aria-label={`সাজানোর ধরণ পরিবর্তন করুন, বর্তমান: ${sortOrder === 'desc' ? 'নতুন থেকে পুরাতন' : 'পুরাতন থেকে নতুন'}`}
                    >
                        {sortOrder === 'desc' ? <SortDescIcon /> : <SortAscIcon />}
                        <span>{sortOrder === 'desc' ? 'নতুন থেকে পুরাতন' : 'পুরাতন থেকে নতুন'}</span>
                    </button>
                </div>
            </Card>

            <div className="space-y-6">
                {displayedNotices.length > 0 ? (
                    displayedNotices.map((notice) => (
                        <NoticeCard key={notice.id} notice={notice} />
                    ))
                ) : (
                    <Card className="text-center p-6">
                        <p className="text-gray-600">কোনো নোটিশ পাওয়া যায়নি।</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default NoticeBoardPage;
