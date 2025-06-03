
import React from 'react';
import { useTheme } from '../ThemeContext';
import { HelpContent } from './HelpContent'; // Import the new HelpContent component

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { theme: currentActiveTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[70] transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div 
        className={`p-6 rounded-lg shadow-xl w-full max-w-2xl ${currentActiveTheme.classes.bgSecondary} ${currentActiveTheme.classes.textPrimary} overflow-y-auto max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b ${currentActiveTheme.classes.borderColor} shrink-0">
          <h2 id="help-modal-title" className={`text-xl font-semibold ${currentActiveTheme.classes.textPrimary}`}>User Guide & Help</h2>
          <button 
            onClick={onClose} 
            className={`p-1 rounded-full ${currentActiveTheme.classes.textMuted} hover:bg-gray-500/20`}
            aria-label="Close help"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Use the HelpContent component here */}
        <HelpContent />

      </div>
    </div>
  );
};