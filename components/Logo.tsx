import React from 'react';
import { useTheme } from '../ThemeContext';

export const Logo: React.FC = () => {
  const { theme } = useTheme();
  const accentMainColor = theme.classes.accentColor; // e.g., 'indigo-500'
  const accentContrastColor = theme.classes.accentColorContrast; // e.g., 'indigo-700'

  return (
    <div className="flex items-center space-x-3 mb-6">
      <div className={`w-12 h-12 border-[3px] border-${accentMainColor} flex items-center justify-center shrink-0`}>
        <svg className={`w-7 h-7 text-${accentContrastColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <div>
        <div className={`text-xs font-semibold text-${accentContrastColor} uppercase tracking-wider leading-none`}>The</div>
        <div className={`text-2xl font-bold text-${accentContrastColor} leading-tight`}>Time Box.</div>
      </div>
    </div>
  );
};