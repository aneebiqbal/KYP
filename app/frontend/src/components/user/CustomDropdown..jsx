'use client';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

const CustomDropdown = ({  selectedValue, onSelect, placeholder }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const options = [
    { value: '0', label: 'Name' },
    { value: '1', label: 'University' }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        style={{
          height: '72px',
          borderTopLeftRadius: '12px',
          borderBottomLeftRadius: '12px',
          width: '125px',
          backgroundColor: '#ffffff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'

        }}
        className="px-20 border-color-D9D9D9  mobile-px-10 mobile-width-dropdown"
      >
        <p className='text-18 mobile-text-13'> {options.find(option => option.value === selectedValue)?.label || placeholder}</p>
        <Image style={{ marginLeft: '8px' }} height={10} width={10} src="/arrowicon.svg" alt="searchIcon" />
        {/* <span style={{ marginLeft: '8px' }}>▼</span> */}
      </div>
      {isDropdownOpen && (
        <div
          style={{
            position: 'absolute',

            width: '200px',
            borderRadius: '12px',
            border: '1px solid #D9D9D9',
            backgroundColor: '#ffffff',
            zIndex: 10,
            maxHeight: '200px',

          }}
          className="px-10 border-color-D9D9D9"
        >
         {options.map(option => (
            <div
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsDropdownOpen(false);
              }}
              style={{

                cursor: 'pointer',

              }}
              className="px-10 py-12"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;