import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { sfx } from '../utils/audio';

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

export default function DarkDatePicker({
  value, // e.g. "2000-05-12"
  onChange,
  className = '',
  placeholder = 'YYYY-MM-DD',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('days'); // 'days' | 'months' | 'years'
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const yearScrollRef = useRef(null);

  // Parse current value or fallback
  const parseDate = (str) => {
    if (!str) return new Date(2000, 4, 12);
    const parts = str.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m, d);
      }
    }
    return new Date(2000, 4, 12);
  };

  const initialDate = parseDate(value);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [typedText, setTypedText] = useState(value || '');

  // Keep typedText in sync if value changes externally
  useEffect(() => {
    setTypedText(value || '');
    const d = parseDate(value);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }, [value]);

  // Click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target) &&
          dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (isOpen) {
          sfx.modalClose();
          setIsOpen(false);
          setViewMode('days');
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Scroll active year into view when opening year selector
  useEffect(() => {
    if (viewMode === 'years' && yearScrollRef.current) {
      const activeEl = yearScrollRef.current.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'center' });
      }
    }
  }, [viewMode]);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const dropdownHeight = 350; // Approximate max height

      // Position below input, but flip to above if not enough space below
      let top = rect.bottom + 8;
      if (top + dropdownHeight > windowHeight - 20) {
        top = rect.top - dropdownHeight - 8;
      }

      setDropdownPosition({
        top,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Handle typing directly into input
  const handleInputChange = (e) => {
    sfx.typeKey();
    const val = e.target.value;
    setTypedText(val);

    // Validate if it matches YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (regex.test(val)) {
      const parts = val.split('-');
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (y >= 1900 && y <= 2026 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        onChange(val);
        setViewYear(y);
        setViewMonth(m - 1);
        sfx.calendarDay();
      }
    }
  };

  const handlePrevMonth = () => {
    sfx.hoverBlip();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    sfx.hoverBlip();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day) => {
    sfx.calendarDay();
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const formatted = `${viewYear}-${mStr}-${dStr}`;
    setTypedText(formatted);
    onChange(formatted);
    setIsOpen(false);
    setViewMode('days');
    sfx.modalClose();
  };

  const handleSelectMonth = (idx) => {
    sfx.click();
    setViewMonth(idx);
    setViewMode('days');
  };

  const handleSelectYear = (y) => {
    sfx.click();
    setViewYear(y);
    setViewMode('days');
  };

  // Generate days for viewMonth and viewYear
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Selected date components
  const activeDate = parseDate(value);
  const isSelectedDay = (d) =>
    activeDate.getFullYear() === viewYear &&
    activeDate.getMonth() === viewMonth &&
    activeDate.getDate() === d;

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear; y >= 1920; y--) {
    yearOptions.push(y);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Direct Type Input + Calendar Icon Toggle */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={typedText}
          onChange={handleInputChange}
          onFocus={() => sfx.hoverBlip()}
          placeholder={placeholder}
          className="w-full bg-white/[0.03] border border-white/15 focus:border-[#FF4B2B] focus:bg-white/[0.06] rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 pr-11 text-white font-mono text-xs sm:text-sm tracking-wider outline-none transition-all placeholder:text-neutral-600"
        />
        <button
          type="button"
          onClick={() => {
            if (!isOpen) {
              sfx.modalOpen();
              setIsOpen(true);
              setViewMode('days');
            } else {
              sfx.modalClose();
              setIsOpen(false);
            }
          }}
          onMouseEnter={() => sfx.hoverBlip()}
          className="absolute right-3 p-1.5 rounded-lg text-neutral-400 hover:text-[#FF8C00] hover:bg-white/10 transition-colors cursor-pointer"
          title="Toggle Cyberpunk Date Picker"
        >
          <CalendarIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Custom Dark Cyberpunk Calendar Dropdown Popover - Portal to render outside modal */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[100] rounded-2xl bg-[#0c0c16]/98 border border-white/15 p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl animate-fadeup select-none"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${Math.max(dropdownPosition.width, 280)}px`,
              maxWidth: '320px',
            }}
          >
          {/* Top Bar: Month & Year Selector Buttons (Bespoke UI, NO OS native select) */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={viewMode !== 'days'}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Custom Interactive Selectors */}
            <div className="flex items-center gap-2 font-mono text-xs">
              {/* Month Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  sfx.hoverBlip();
                  setViewMode(viewMode === 'months' ? 'days' : 'months');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  viewMode === 'months'
                    ? 'border-[#FF8C00] bg-[#FF8C00]/20 text-[#FF8C00] shadow-[0_0_10px_rgba(255,140,0,0.3)] font-bold'
                    : 'border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:text-[#FF8C00]'
                }`}
              >
                <span>{MONTH_NAMES[viewMonth].slice(0, 3)}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {/* Year Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  sfx.hoverBlip();
                  setViewMode(viewMode === 'years' ? 'days' : 'years');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  viewMode === 'years'
                    ? 'border-[#FF4B2B] bg-[#FF4B2B]/20 text-[#FF4B2B] shadow-[0_0_10px_rgba(255,75,43,0.3)] font-bold'
                    : 'border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:text-white'
                }`}
              >
                <span>{viewYear}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              disabled={viewMode !== 'days'}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* MODE 1: CUSTOM MONTHS GRID */}
          {viewMode === 'months' && (
            <div className="grid grid-cols-3 gap-2 py-2 animate-fadeup">
              {MONTH_NAMES.map((m, idx) => {
                const isSelected = viewMonth === idx;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSelectMonth(idx)}
                    onMouseEnter={() => sfx.hoverBlip()}
                    className={`py-2 px-1 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#FF8C00] text-black border-[#FF8C00] shadow-[0_0_12px_rgba(255,140,0,0.5)]'
                        : 'bg-white/[0.03] text-neutral-300 border-white/10 hover:border-[#FF8C00]/50 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    {m.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          )}

          {/* MODE 2: CUSTOM YEARS SCROLL GRID */}
          {viewMode === 'years' && (
            <div
              ref={yearScrollRef}
              className="grid grid-cols-4 gap-1.5 max-h-56 overflow-y-auto py-1 pr-1 custom-scrollbar animate-fadeup"
            >
              {yearOptions.map((y) => {
                const isSelected = viewYear === y;
                return (
                  <button
                    key={y}
                    type="button"
                    data-selected={isSelected}
                    onClick={() => handleSelectYear(y)}
                    onMouseEnter={() => sfx.hoverBlip()}
                    className={`py-2 px-1 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#FF4B2B] text-black border-[#FF4B2B] shadow-[0_0_12px_rgba(255,75,43,0.5)]'
                        : 'bg-white/[0.03] text-neutral-300 border-white/10 hover:border-[#FF4B2B]/50 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          )}

          {/* MODE 3: NORMAL DAYS GRID */}
          {viewMode === 'days' && (
            <>
              {/* Days of Week Row */}
              <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] text-neutral-500 font-bold mb-1.5">
                <span>SU</span>
                <span>MO</span>
                <span>TU</span>
                <span>WE</span>
                <span>TH</span>
                <span>FR</span>
                <span>SA</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
                {/* Empty slots before first day */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8" />
                ))}

                {/* Days of Month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const selected = isSelectedDay(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      onMouseEnter={() => sfx.hoverBlip()}
                      className={`h-8 rounded-lg flex items-center justify-center font-mono transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#FF4B2B] text-black font-extrabold shadow-[0_0_12px_rgba(255,75,43,0.5)]'
                          : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Quick Era Presets */}
              <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-4 gap-1 sm:gap-1.5 text-[7px] sm:text-[8px] font-mono">
                {[
                  { label: 'GEN Z', year: 2002 },
                  { label: 'MILLENNIAL', year: 1994 },
                  { label: 'GEN X', year: 1978 },
                  { label: 'ALPHA', year: 2014 },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      sfx.click();
                      setViewYear(p.year);
                    }}
                    className={`py-1 sm:py-1.5 px-0.5 sm:px-1 rounded-lg border transition-colors text-center cursor-pointer truncate ${
                      viewYear === p.year
                        ? 'border-[#FF8C00] bg-[#FF8C00]/20 text-[#FF8C00] font-bold'
                        : 'border-white/5 bg-white/[0.03] text-neutral-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </>
          )}
          </div>,
          document.body
        )
      }
    </div>
  );
}
