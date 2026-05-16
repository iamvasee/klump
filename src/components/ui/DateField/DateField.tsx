import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DateFieldProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  minYear?: number;
  maxYear?: number;
  minAge?: number; // Minimum age in years
}

const DateField: React.FC<DateFieldProps> = ({
  id,
  value,
  onChange,
  placeholder = "Select date",
  label,
  required = false,
  disabled = false,
  error,
  className,
  minYear = 1900,
  maxYear = 2100,
  minAge
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [viewMode, setViewMode] = useState<'calendar' | 'month' | 'year'>('calendar');
  const dateFieldRef = useRef<HTMLDivElement>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateFieldRef.current && !dateFieldRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    if (!isDateValid(newDate)) {
      return; // Don't select invalid dates
    }
    
    setSelectedDate(newDate);
    onChange(newDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleYearSelect = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setViewMode('month');
  };

  const handleMonthSelect = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    setViewMode('calendar');
  };

  const generateYears = () => {
    const years = [];
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year);
    }
    return years;
  };

  const toggleViewMode = () => {
    if (viewMode === 'calendar') {
      setViewMode('year');
    } else if (viewMode === 'year') {
      setViewMode('month');
    } else {
      setViewMode('calendar');
    }
  };

  const isDateValid = (date: Date) => {
    if (!minAge) return true;
    
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      return age - 1 >= minAge;
    }
    
    return age >= minAge;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };


  const formatDisplayValue = () => {
    if (selectedDate) {
      return selectedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
    return '';
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className={cn('space-y-2', className)} ref={dateFieldRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div
          className={cn(
            'w-full px-4 py-3 border border-gray-200 rounded-xl',
            'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'transition-all duration-200',
            'text-sm text-gray-900 placeholder-gray-500',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
            'cursor-pointer flex items-center justify-between',
            error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'hover:border-gray-300',
            isOpen && 'ring-2 ring-blue-500 border-blue-500'
          )}
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
            }
          }}
        >
          <span className={cn(
            'block truncate',
            !selectedDate && 'text-gray-500'
          )}>
            {selectedDate ? formatDisplayValue() : placeholder}
          </span>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              {viewMode === 'calendar' ? (
                <>
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Previous month"
                    title="Previous month"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={toggleViewMode}
                    className="flex items-center space-x-1 px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Toggle selection mode"
                    title="Click to change selection mode"
                  >
                    <div className="text-lg font-semibold text-gray-900">
                      {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Next month"
                    title="Next month"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={toggleViewMode}
                  className="flex items-center space-x-1 px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors mx-auto"
                  aria-label="Toggle selection mode"
                  title="Click to change selection mode"
                >
                  <div className="text-lg font-semibold text-gray-900">
                    {viewMode === 'year' 
                      ? `Select Year (${currentDate.getFullYear()})`
                      : `Select Month (${months[currentDate.getMonth()]})`
                    }
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>

            {/* Year Selection View */}
            {viewMode === 'year' && (
              <div className="max-h-60 overflow-y-auto">
                <div className="grid grid-cols-4 gap-2">
                  {generateYears().map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearSelect(year)}
                      className={cn(
                        'px-3 py-2 text-sm rounded-lg transition-colors',
                        'hover:bg-blue-50 hover:text-blue-700',
                        currentDate.getFullYear() === year && 'bg-blue-600 text-white hover:bg-blue-700',
                        currentDate.getFullYear() !== year && 'text-gray-900'
                      )}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Month Selection View */}
            {viewMode === 'month' && (
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => handleMonthSelect(index)}
                    className={cn(
                      'px-3 py-2 text-sm rounded-lg transition-colors',
                      'hover:bg-blue-50 hover:text-blue-700',
                      currentDate.getMonth() === index && 'bg-blue-600 text-white hover:bg-blue-700',
                      currentDate.getMonth() !== index && 'text-gray-900'
                    )}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}

            {/* Calendar View */}
            {viewMode === 'calendar' && (
              <>
                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    const dayDate = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
                    const isValidDay = dayDate ? isDateValid(dayDate) : true;
                    
                    return (
                      <div key={index} className="aspect-square">
                        {day ? (
                          <button
                            type="button"
                            onClick={() => handleDateSelect(day)}
                            disabled={!isValidDay}
                            className={cn(
                              'w-full h-full flex items-center justify-center text-sm rounded-lg transition-colors',
                              isValidDay 
                                ? 'hover:bg-blue-50 hover:text-blue-700 cursor-pointer'
                                : 'opacity-30 cursor-not-allowed',
                              isToday(day) && isValidDay && 'bg-blue-100 text-blue-700 font-semibold',
                              isSelected(day) && 'bg-blue-600 text-white hover:bg-blue-700',
                              !isSelected(day) && !isToday(day) && isValidDay && 'text-gray-900',
                              !isValidDay && 'text-gray-400'
                            )}
                          >
                            {day}
                          </button>
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default DateField;