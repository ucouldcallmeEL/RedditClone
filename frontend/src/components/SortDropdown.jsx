import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

function SortDropdown({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="sort-dropdown" ref={dropdownRef}>
      <button
        className="sort-dropdown__button"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {options.find(opt => opt.value === value)?.label || 'Select'}
        <ChevronDown size={16} className={`sort-dropdown__arrow ${isOpen ? 'open' : ''}`} />
      </button>
      {isOpen && (
        <ul className="sort-dropdown__menu">
          <li className="sort-dropdown__header">Sort By</li>
          {options.map(option => (
            <li
              key={option.value}
              className={`sort-dropdown__option ${option.value === value ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SortDropdown;