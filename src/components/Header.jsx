import React, { useState, useRef, useEffect } from 'react';

// Format YYYY-MM-DD to DD MMM
function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export default function Header({
  startDate = '2026-08-01',
  endDate = '2026-11-12',
  onDateRangeChange,
  minDate = '2026-08-01',
  maxDate = '2026-11-12'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);
  const dropdownRef = useRef(null);

  // Synchronize internal state when props change
  useEffect(() => {
    setTempStart(startDate);
    setTempEnd(endDate);
  }, [startDate, endDate]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleApply = () => {
    if (onDateRangeChange) {
      onDateRangeChange(tempStart, tempEnd);
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempStart(minDate);
    setTempEnd(maxDate);
    if (onDateRangeChange) {
      onDateRangeChange(minDate, maxDate);
    }
    setIsOpen(false);
  };

  const handlePresetSelect = (start, end) => {
    setTempStart(start);
    setTempEnd(end);
    if (onDateRangeChange) {
      onDateRangeChange(start, end);
    }
    setIsOpen(false);
  };

  const formattedDisplay = `${formatDateLabel(startDate)} — ${formatDateLabel(endDate)}`;

  return (
    <header className="headerContainer">
      <div className="headerTitleGroup">
        <h1 className="pageTitle">Sales overview</h1>
        <p className="pageSubtitle">
          Monitor orders and customer demand across your wellness store
        </p>
      </div>

      <div className="dateRangeWrapper" ref={dropdownRef}>
        <button
          type="button"
          className="dateRangeBadge"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="Select date range filter"
        >
          <span className="dateRangeIcon" aria-hidden="true">📅</span>
          <span>{formattedDisplay}</span>
          <span className="dropdownCaret" aria-hidden="true">▼</span>
        </button>

        {isOpen && (
          <div className="dateDropdown" role="dialog" aria-label="Date range selector">
            <div className="dateDropdownHeader">Filter Date Range</div>

            <div className="datePresets">
              <button
                type="button"
                className={`presetBtn ${startDate === minDate && endDate === maxDate ? 'active' : ''}`}
                onClick={() => handlePresetSelect(minDate, maxDate)}
              >
                All Time
              </button>
              <button
                type="button"
                className="presetBtn"
                onClick={() => handlePresetSelect('2026-08-01', '2026-08-31')}
              >
                Aug 2026
              </button>
              <button
                type="button"
                className="presetBtn"
                onClick={() => handlePresetSelect('2026-09-01', '2026-09-30')}
              >
                Sep 2026
              </button>
              <button
                type="button"
                className="presetBtn"
                onClick={() => handlePresetSelect('2026-10-01', '2026-10-31')}
              >
                Oct 2026
              </button>
              <button
                type="button"
                className="presetBtn"
                onClick={() => handlePresetSelect('2026-11-01', maxDate)}
              >
                Nov 2026
              </button>
            </div>

            <div className="dateInputsRow">
              <div className="dateInputGroup">
                <label className="dateInputLabel" htmlFor="dateStartInput">
                  Start Date
                </label>
                <input
                  id="dateStartInput"
                  type="date"
                  className="dateInput"
                  value={tempStart}
                  min={minDate}
                  max={tempEnd || maxDate}
                  onChange={(e) => setTempStart(e.target.value)}
                />
              </div>

              <div className="dateInputGroup">
                <label className="dateInputLabel" htmlFor="dateEndInput">
                  End Date
                </label>
                <input
                  id="dateEndInput"
                  type="date"
                  className="dateInput"
                  value={tempEnd}
                  min={tempStart || minDate}
                  max={maxDate}
                  onChange={(e) => setTempEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="dateDropdownFooter">
              <button type="button" className="dateResetBtn" onClick={handleReset}>
                Reset All
              </button>
              <button type="button" className="dateApplyBtn" onClick={handleApply}>
                Apply Range
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
