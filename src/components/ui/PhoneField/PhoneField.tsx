import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Phone } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface PhoneFieldProps {
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
}

const countryCodes = [
  { value: '+91', label: '🇮🇳 +91', country: 'India' },
  { value: '+1', label: '🇺🇸 +1', country: 'USA' },
  { value: '+44', label: '🇬🇧 +44', country: 'UK' },
  { value: '+33', label: '🇫🇷 +33', country: 'France' },
  { value: '+49', label: '🇩🇪 +49', country: 'Germany' },
  { value: '+81', label: '🇯🇵 +81', country: 'Japan' },
  { value: '+86', label: '🇨🇳 +86', country: 'China' },
  { value: '+61', label: '🇦🇺 +61', country: 'Australia' },
  { value: '+55', label: '🇧🇷 +55', country: 'Brazil' },
  { value: '+7', label: '🇷🇺 +7', country: 'Russia' },
  { value: '+39', label: '🇮🇹 +39', country: 'Italy' },
  { value: '+34', label: '🇪🇸 +34', country: 'Spain' },
  { value: '+31', label: '🇳🇱 +31', country: 'Netherlands' },
  { value: '+46', label: '🇸🇪 +46', country: 'Sweden' },
  { value: '+47', label: '🇳🇴 +47', country: 'Norway' },
  { value: '+45', label: '🇩🇰 +45', country: 'Denmark' },
  { value: '+41', label: '🇨🇭 +41', country: 'Switzerland' },
  { value: '+43', label: '🇦🇹 +43', country: 'Austria' },
  { value: '+32', label: '🇧🇪 +32', country: 'Belgium' },
  { value: '+351', label: '🇵🇹 +351', country: 'Portugal' },
  { value: '+30', label: '🇬🇷 +30', country: 'Greece' },
  { value: '+48', label: '🇵🇱 +48', country: 'Poland' },
  { value: '+420', label: '🇨🇿 +420', country: 'Czech Republic' },
  { value: '+36', label: '🇭🇺 +36', country: 'Hungary' },
  { value: '+40', label: '🇷🇴 +40', country: 'Romania' },
  { value: '+359', label: '🇧🇬 +359', country: 'Bulgaria' },
  { value: '+385', label: '🇭🇷 +385', country: 'Croatia' },
  { value: '+386', label: '🇸🇮 +386', country: 'Slovenia' },
  { value: '+421', label: '🇸🇰 +421', country: 'Slovakia' },
  { value: '+370', label: '🇱🇹 +370', country: 'Lithuania' },
  { value: '+371', label: '🇱🇻 +371', country: 'Latvia' },
  { value: '+372', label: '🇪🇪 +372', country: 'Estonia' },
  { value: '+353', label: '🇮🇪 +353', country: 'Ireland' },
  { value: '+358', label: '🇫🇮 +358', country: 'Finland' },
  { value: '+354', label: '🇮🇸 +354', country: 'Iceland' },
  { value: '+352', label: '🇱🇺 +352', country: 'Luxembourg' },
  { value: '+356', label: '🇲🇹 +356', country: 'Malta' },
  { value: '+357', label: '🇨🇾 +357', country: 'Cyprus' },
  { value: '+90', label: '🇹🇷 +90', country: 'Turkey' },
  { value: '+998', label: '🇺🇿 +998', country: 'Uzbekistan' },
  { value: '+996', label: '🇰🇬 +996', country: 'Kyrgyzstan' },
  { value: '+992', label: '🇹🇯 +992', country: 'Tajikistan' },
  { value: '+993', label: '🇹🇲 +993', country: 'Turkmenistan' },
  { value: '+374', label: '🇦🇲 +374', country: 'Armenia' },
  { value: '+994', label: '🇦🇿 +994', country: 'Azerbaijan' },
  { value: '+995', label: '🇬🇪 +995', country: 'Georgia' },
  { value: '+375', label: '🇧🇾 +375', country: 'Belarus' },
  { value: '+380', label: '🇺🇦 +380', country: 'Ukraine' },
  { value: '+373', label: '🇲🇩 +373', country: 'Moldova' },
  { value: '+381', label: '🇷🇸 +381', country: 'Serbia' },
  { value: '+382', label: '🇲🇪 +382', country: 'Montenegro' },
  { value: '+387', label: '🇧🇦 +387', country: 'Bosnia and Herzegovina' },
  { value: '+389', label: '🇲🇰 +389', country: 'North Macedonia' },
  { value: '+355', label: '🇦🇱 +355', country: 'Albania' },
  { value: '+383', label: '🇽🇰 +383', country: 'Kosovo' },
  { value: '+377', label: '🇲🇨 +377', country: 'Monaco' },
  { value: '+378', label: '🇸🇲 +378', country: 'San Marino' },
  { value: '+376', label: '🇦🇩 +376', country: 'Andorra' },
  { value: '+423', label: '🇱🇮 +423', country: 'Liechtenstein' },
];

const PhoneField: React.FC<PhoneFieldProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder = 'Enter phone number',
  label,
  required = false,
  disabled = false,
  error,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState<'below' | 'above'>(
    'below'
  );
  const phoneFieldRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Parse the current value to extract country code and number
  const parsePhoneValue = (phoneValue: string) => {
    if (!phoneValue) return { countryCode: '+91', number: '' };

    // Find matching country code
    const matchedCode = countryCodes.find((code) =>
      phoneValue.startsWith(code.value)
    );
    if (matchedCode) {
      return {
        countryCode: matchedCode.value,
        number: phoneValue.substring(matchedCode.value.length),
      };
    }

    // Default to India if no match
    return { countryCode: '+91', number: phoneValue };
  };

  const { countryCode, number } = parsePhoneValue(value);
  const selectedCountry = countryCodes.find(
    (code) => code.value === countryCode
  );

  // ARIA attributes for accessibility

  const filteredCountries = countryCodes.filter(
    (country) =>
      country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.value.includes(searchTerm) ||
      country.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateDropdownPosition = () => {
    if (!phoneFieldRef.current) return 'below';

    const rect = phoneFieldRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 240; // Approximate height of dropdown
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // If there's not enough space below but enough space above, show above
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      return 'above';
    }

    return 'below';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        phoneFieldRef.current &&
        !phoneFieldRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    const handleResize = () => {
      if (isOpen) {
        setDropdownPosition(calculateDropdownPosition());
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setDropdownPosition(calculateDropdownPosition());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleCountrySelect = (selectedCountryCode: string) => {
    const newValue = selectedCountryCode + number;
    onChange(newValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleNumberChange = (newNumber: string) => {
    // Only allow digits and limit length based on country
    const numericNumber = newNumber.replace(/\D/g, '');
    const maxLength = getMaxLengthForCountry(countryCode);
    const limitedNumber = numericNumber.slice(0, maxLength);

    const newValue = countryCode + limitedNumber;
    onChange(newValue);
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value;
    handleNumberChange(newNumber);
  };

  const getMaxLengthForCountry = (code: string) => {
    // Common phone number lengths by country
    const lengths: { [key: string]: number } = {
      '+91': 10, // India
      '+1': 10, // USA/Canada
      '+44': 10, // UK
      '+33': 9, // France
      '+49': 11, // Germany
      '+81': 11, // Japan
      '+86': 11, // China
      '+61': 9, // Australia
      '+55': 11, // Brazil
      '+7': 10, // Russia
    };
    return lengths[code] || 10; // Default to 10 digits
  };

  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen) {
        // Calculate position before opening
        setDropdownPosition(calculateDropdownPosition());
      }
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleToggle();
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  return (
    <div className={cn('space-y-2', className)} ref={phoneFieldRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="flex">
          {/* Country Code Selector */}
          <div
            className={cn(
              'px-4 py-3 border border-gray-200 rounded-l-xl border-r-0',
              'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'transition-all duration-200',
              'text-sm text-gray-900',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
              'cursor-pointer flex items-center justify-between min-w-[120px] h-[52px]',
              error
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'hover:border-gray-300',
              isOpen && 'ring-2 ring-blue-500 border-blue-500'
            )}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            tabIndex={disabled ? -1 : 0}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-required={required}
            aria-controls={`${id}-listbox`}
            aria-label="Select country code"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {selectedCountry?.label.split(' ')[0]}
              </span>
              <span className="text-gray-600 font-medium">{countryCode}</span>
            </div>

            <ChevronDown
              className={cn(
                'w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0',
                isOpen && 'rotate-180'
              )}
            />
          </div>

          {/* Phone Number Input */}
          <div className="flex-1 relative">
            <input
              type="tel"
              value={number}
              onChange={handleNumberInputChange}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                'w-full px-4 py-3 border border-gray-200 rounded-r-xl h-[52px]',
                'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                'transition-all duration-200',
                'text-sm text-gray-900 placeholder-gray-500',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
                error
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'hover:border-gray-300'
              )}
              aria-label="Phone number"
              maxLength={getMaxLengthForCountry(countryCode)}
            />
            <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {isOpen && (
          <div
            className={cn(
              'absolute z-50 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden',
              dropdownPosition === 'above'
                ? 'bottom-full mb-1'
                : 'top-full mt-1',
              'w-80' // Fixed width for country dropdown
            )}
          >
            {/* Search input for filtering */}
            <div className="p-2 border-b border-gray-100">
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search countries..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search countries"
                title="Search countries"
              />
            </div>

            {/* Countries list */}
            <div
              id={`${id}-listbox`}
              className="max-h-48 overflow-y-auto"
              role="listbox"
            >
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => {
                  const isSelected = countryCode === country.value;
                  return (
                    <div
                      key={country.value}
                      className={cn(
                        'px-4 py-3 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between',
                        'hover:bg-gray-50',
                        isSelected && 'bg-blue-50 text-blue-700'
                      )}
                      onClick={() => handleCountrySelect(country.value)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">
                          {country.label.split(' ')[0]}
                        </span>
                        <div>
                          <div className="font-medium">{country.country}</div>
                          <div className="text-xs text-gray-500">
                            {country.value}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={value || ''}
        required={required}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default PhoneField;
