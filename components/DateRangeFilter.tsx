import React from 'react';
import Card from './Card';
import FilterIcon from './icons/FilterIcon';
import ClearIcon from './icons/ClearIcon';

interface DateRangeFilterProps {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onFilter: () => void;
  onClear: () => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onFilter,
  onClear,
}) => {
  return (
    <Card className="mb-8 p-4">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-grow">
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
            শুরুর তারিখ
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            aria-label="শুরুর তারিখ"
          />
        </div>
        <div className="flex-grow">
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
            শেষ তারিখ
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            aria-label="শেষ তারিখ"
          />
        </div>
        <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onFilter}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 bg-teal-600 text-white rounded-md font-semibold hover:bg-teal-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!startDate || !endDate}
              aria-label="ফিল্টার করুন"
            >
              <FilterIcon />
              <span>ফিল্টার</span>
            </button>
            <button
              onClick={onClear}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 bg-gray-500 text-white rounded-md font-semibold hover:bg-gray-600 transition-colors duration-300"
              aria-label="ফিল্টার মুছুন"
            >
              <ClearIcon />
              <span>মুছুন</span>
            </button>
        </div>
      </div>
    </Card>
  );
};

export default DateRangeFilter;
