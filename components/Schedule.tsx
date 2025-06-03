
import React from 'react';
import { ScheduleData, ScheduleHour } from '../types';
// import { SCHEDULE_HOURS } from '../constants'; // No longer used
import { useTheme } from '../ThemeContext';

interface ScheduleProps {
  scheduleHours: ScheduleHour[]; // Now accepts dynamic hours
  scheduleData: ScheduleData;
  onScheduleChange: (hourKey: string, slot: '00' | '30', value: string) => void;
}

const AutoResizeTextarea: React.FC<{
  value: string;
  onChange: (value: string) => void;
  'aria-label': string;
  className?: string;
  textAreaClassName?: string;
}> = ({ value, onChange, 'aria-label': ariaLabel, className, textAreaClassName }) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();

  React.useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
    }
  }, [value]); 

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className={`p-2 focus:outline-none focus:ring-1 ${theme.classes.inputFocusRingColor} focus:bg-opacity-50 focus:bg-${theme.classes.accentColor} bg-transparent ${theme.classes.textPrimary} text-sm resize-none overflow-hidden ${className || ''} ${textAreaClassName || ''}`}
      rows={1}
    />
  );
};


export const Schedule: React.FC<ScheduleProps> = ({ scheduleHours, scheduleData, onScheduleChange }) => {
  const { theme } = useTheme();
  return (
    <div className={`border ${theme.classes.borderColor} rounded-md shadow-sm overflow-hidden`}>
      {/* Header */}
      <div className={`grid grid-cols-[60px_1fr_1fr] border-b-2 ${theme.classes.borderColor} ${theme.classes.scheduleHeaderBg} sticky top-0 z-10`}>
        <div className={`p-2 py-2.5 border-r ${theme.classes.borderColor} text-center font-medium text-xs ${theme.classes.textMuted} uppercase`}>Time</div>
        <div className={`p-2 py-2.5 border-r ${theme.classes.borderColor} text-center font-semibold ${theme.classes.textSecondary} text-sm`}>:00</div>
        <div className={`p-2 py-2.5 text-center font-semibold ${theme.classes.textSecondary} text-sm`}>:30</div>
      </div>
      {/* Rows */}
      <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
        {scheduleHours.map((hour: ScheduleHour, index: number) => (
          <div 
            key={hour.key} 
            className={`grid grid-cols-[60px_1fr_1fr] items-stretch ${index < scheduleHours.length - 1 ? `border-b ${theme.classes.scheduleCellBorder}` : ''}`}
          >
            <div className={`p-2 border-r ${theme.classes.scheduleCellBorder} font-semibold text-sm ${theme.classes.textSecondary} flex items-center justify-center ${theme.classes.scheduleHeaderBg}`}>
              {hour.display}
            </div>
            <AutoResizeTextarea
              value={scheduleData[hour.key]?.["00"] || ""}
              onChange={(val) => onScheduleChange(hour.key, "00", val)}
              aria-label={`Schedule for ${hour.display}:00`}
              textAreaClassName={`border-r ${theme.classes.scheduleCellBorder}`}
            />
            <AutoResizeTextarea
              value={scheduleData[hour.key]?.["30"] || ""}
              onChange={(val) => onScheduleChange(hour.key, "30", val)}
              aria-label={`Schedule for ${hour.display}:30`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};