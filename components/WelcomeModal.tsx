
import React from 'react';
import { useTheme } from '../ThemeContext';
import { HelpContent } from './HelpContent';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const { theme: currentActiveTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[80] transition-opacity duration-300" // Higher z-index
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      <div 
        className={`p-6 rounded-lg shadow-xl w-full max-w-2xl ${currentActiveTheme.classes.bgSecondary} ${currentActiveTheme.classes.textPrimary} overflow-y-auto max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="text-center mb-4 shrink-0">
          <h2 id="welcome-modal-title" className={`text-2xl font-bold ${currentActiveTheme.classes.accentColorContrast}`}>Welcome to The Time Box Planner!</h2>
          <p className={`mt-2 text-md ${currentActiveTheme.classes.textSecondary}`}>
            Here's a quick guide to help you get started with planning your day effectively.
          </p>
        </div>
        
        <div className="flex-grow overflow-y-auto mb-6">
          <HelpContent />
        </div>

        <div className="shrink-0 text-center">
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-md font-semibold text-lg
                        ${currentActiveTheme.classes.buttonBg} 
                        ${currentActiveTheme.classes.buttonText} 
                        ${currentActiveTheme.classes.buttonHoverBg} 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${currentActiveTheme.classes.accentColor}`}
          >
            Get Started!
          </button>
        </div>
      </div>
    </div>
  );
};