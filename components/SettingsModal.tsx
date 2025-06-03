import React, { useState, useEffect } from 'react';
import { THEMES } from '../themes';
import { useTheme } from '../ThemeContext';
import { AiPromptSettingsModal } from './AiPromptSettingsModal'; 

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    theme: currentActiveTheme, 
    setCurrentThemeName,
    dayStartTime: contextDayStartTime,
    dayEndTime: contextDayEndTime,
    setDayStartTime: contextSetDayStartTime,
    setDayEndTime: contextSetDayEndTime,
    timeFormat: contextTimeFormat,
    setTimeFormat: contextSetTimeFormat,
    isAiEnabled,
    toggleAiFeatures,
    geminiApiKey: contextGeminiApiKey,
    setGeminiApiKey: contextSetGeminiApiKey,
    openAiApiKey: contextOpenAiApiKey,
    setOpenAiApiKey: contextSetOpenAiApiKey,
    preferredAiService: contextPreferredAiService,
    setPreferredAiService: contextSetPreferredAiService,
  } = useTheme();

  const [pendingStartTime, setPendingStartTime] = useState(contextDayStartTime);
  const [pendingEndTime, setPendingEndTime] = useState(contextDayEndTime);
  const [hasTimeChanges, setHasTimeChanges] = useState(false);
  const [isAiPromptModalOpen, setIsAiPromptModalOpen] = useState(false);

  useEffect(() => {
    setPendingStartTime(contextDayStartTime);
    setPendingEndTime(contextDayEndTime);
  }, [contextDayStartTime, contextDayEndTime]);

  useEffect(() => {
    if (pendingStartTime !== contextDayStartTime || pendingEndTime !== contextDayEndTime) {
      setHasTimeChanges(true);
    } else {
      setHasTimeChanges(false);
    }
  }, [pendingStartTime, pendingEndTime, contextDayStartTime, contextDayEndTime]);
  

  if (!isOpen) return null;

  const handleThemeSelection = (themeName: string) => {
    setCurrentThemeName(themeName);
  };

  const hoursOptions = Array.from({ length: 24 }, (_, i) => i); 

  const handlePendingStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStartTime = parseInt(e.target.value, 10);
    setPendingStartTime(newStartTime);
  };

  const handlePendingEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEndTime = parseInt(e.target.value, 10);
    setPendingEndTime(newEndTime);
  };

  const handleSaveTimeChanges = () => {
    if (pendingStartTime >= pendingEndTime) {
        alert("Start time must be before end time.");
        return;
    }
    contextSetDayStartTime(pendingStartTime);
    contextSetDayEndTime(pendingEndTime);
    setHasTimeChanges(false); 
  };

  const handleDiscardTimeChanges = () => {
    setPendingStartTime(contextDayStartTime);
    setPendingEndTime(contextDayEndTime);
    setHasTimeChanges(false);
  };
  
  const handleTimeFormatChange = (format: '12h' | '24h') => {
    contextSetTimeFormat(format);
  };

  const handlePreferredAiServiceChange = (service: 'gemini' | 'openai') => {
    contextSetPreferredAiService(service);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div 
          className={`p-6 rounded-lg shadow-xl w-full max-w-lg ${currentActiveTheme.classes.bgSecondary} ${currentActiveTheme.classes.textPrimary} overflow-y-auto max-h-[90vh]`}
          onClick={(e) => e.stopPropagation()} 
        >
          <div className="flex justify-between items-center mb-6">
            <h2 id="settings-modal-title" className={`text-xl font-semibold ${currentActiveTheme.classes.textPrimary}`}>Settings</h2>
            <button 
              onClick={onClose} 
              className={`p-1 rounded-full ${currentActiveTheme.classes.textMuted} hover:bg-gray-500/20`}
              aria-label="Close settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Theme Selection */}
          <div className={`mb-6 border-b pb-6 ${currentActiveTheme.classes.borderColor}`}>
            <h3 className={`text-md font-medium mb-3 ${currentActiveTheme.classes.textSecondary}`}>Select Theme:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {THEMES.map((themeOption) => (
                <button
                  key={themeOption.name}
                  onClick={() => handleThemeSelection(themeOption.name)}
                  className={`
                    p-3 rounded-md text-sm font-medium border transition-all duration-150 ease-in-out
                    ${themeOption.name === currentActiveTheme.name 
                      ? `${currentActiveTheme.classes.buttonBg} ${currentActiveTheme.classes.buttonText} border-transparent ring-2 ring-offset-2 ring-${currentActiveTheme.classes.accentColor}`
                      : `${currentActiveTheme.classes.bgPrimary} ${currentActiveTheme.classes.textPrimary} ${currentActiveTheme.classes.borderColor} hover:${currentActiveTheme.classes.borderColor.replace('border-', 'border-')} hover:bg-opacity-50`}
                  `}
                  aria-pressed={themeOption.name === currentActiveTheme.name}
                >
                  {themeOption.name}
                </button>
              ))}
            </div>
          </div>

          {/* Time Display Format */}
          <div className={`mb-6 border-b pb-6 ${currentActiveTheme.classes.borderColor}`}>
            <h3 className={`text-md font-medium mb-3 ${currentActiveTheme.classes.textSecondary}`}>Time Display Format:</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleTimeFormatChange('12h')}
                className={`flex-1 p-2.5 rounded-md text-sm font-medium border transition-all duration-150 ease-in-out
                  ${contextTimeFormat === '12h' 
                    ? `${currentActiveTheme.classes.buttonBg} ${currentActiveTheme.classes.buttonText} border-transparent ring-1 ring-offset-1 ring-${currentActiveTheme.classes.accentColor}`
                    : `${currentActiveTheme.classes.bgPrimary} ${currentActiveTheme.classes.textPrimary} ${currentActiveTheme.classes.borderColor} hover:bg-opacity-50`}
                `}
                aria-pressed={contextTimeFormat === '12h'}
              >
                12-hour (AM/PM)
              </button>
              <button
                onClick={() => handleTimeFormatChange('24h')}
                className={`flex-1 p-2.5 rounded-md text-sm font-medium border transition-all duration-150 ease-in-out
                  ${contextTimeFormat === '24h' 
                    ? `${currentActiveTheme.classes.buttonBg} ${currentActiveTheme.classes.buttonText} border-transparent ring-1 ring-offset-1 ring-${currentActiveTheme.classes.accentColor}`
                    : `${currentActiveTheme.classes.bgPrimary} ${currentActiveTheme.classes.textPrimary} ${currentActiveTheme.classes.borderColor} hover:bg-opacity-50`}
                `}
                aria-pressed={contextTimeFormat === '24h'}
              >
                24-hour
              </button>
            </div>
          </div>
          
          {/* Schedule Time Range */}
          <div className={`mb-6 border-b pb-6 ${currentActiveTheme.classes.borderColor}`}>
              <h3 className={`text-md font-medium mb-3 ${currentActiveTheme.classes.textSecondary}`}>Schedule Time Range:</h3>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="start-time-select" className={`block text-sm font-medium mb-1 ${currentActiveTheme.classes.textMuted}`}>Day Start Time</label>
                      <select
                          id="start-time-select"
                          value={pendingStartTime}
                          onChange={handlePendingStartTimeChange}
                          className={`w-full p-2.5 border rounded-md text-sm ${currentActiveTheme.classes.borderColor} ${currentActiveTheme.classes.textPrimary} ${currentActiveTheme.classes.bgSecondary} focus:ring-2 ${currentActiveTheme.classes.inputFocusRingColor} focus:border-${currentActiveTheme.classes.accentColor}`}
                      >
                          {hoursOptions.map(hour => (
                              <option key={`start-${hour}`} value={hour} disabled={hour >= pendingEndTime}>{String(hour).padStart(2, '0')}:00</option>
                          ))}
                      </select>
                  </div>
                  <div>
                      <label htmlFor="end-time-select" className={`block text-sm font-medium mb-1 ${currentActiveTheme.classes.textMuted}`}>Day End Time</label>
                      <select
                          id="end-time-select"
                          value={pendingEndTime}
                          onChange={handlePendingEndTimeChange}
                          className={`w-full p-2.5 border rounded-md text-sm ${currentActiveTheme.classes.borderColor} ${currentActiveTheme.classes.textPrimary} ${currentActiveTheme.classes.bgSecondary} focus:ring-2 ${currentActiveTheme.classes.inputFocusRingColor} focus:border-${currentActiveTheme.classes.accentColor}`}
                      >
                          {hoursOptions.map(hour => (
                              <option key={`end-${hour}`} value={hour} disabled={hour <= pendingStartTime}>{String(hour).padStart(2, '0')}:00</option>
                          ))}
                      </select>
                  </div>
              </div>
               <p className={`text-xs ${currentActiveTheme.classes.textMuted} mt-2`}>Schedule will display hours from start time up to (but not including) the end time hour.</p>
              {hasTimeChanges && (
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={handleDiscardTimeChanges}
                    className={`px-4 py-2 rounded-md text-sm font-medium border
                      ${currentActiveTheme.classes.borderColor} ${currentActiveTheme.classes.textSecondary} 
                      hover:bg-gray-500/10 transition-colors`}
                  >
                    Discard Changes
                  </button>
                  <button
                    onClick={handleSaveTimeChanges}
                    className={`px-4 py-2 rounded-md text-sm font-medium 
                      ${currentActiveTheme.classes.buttonBg} ${currentActiveTheme.classes.buttonText} 
                      ${currentActiveTheme.classes.buttonHoverBg} transition-colors`}
                  >
                    Save Time Changes
                  </button>
                </div>
              )}
          </div>
          
          {/* API Key Management */}
          <div className={`mb-6 border-b pb-6 ${currentActiveTheme.classes.borderColor}`}>
            <h3 className={`text-md font-medium mb-3 ${currentActiveTheme.classes.textSecondary}`}>API Key Management</h3>
            <p className={`text-xs ${currentActiveTheme.classes.textMuted} mb-1`}>
              API keys are stored locally in your browser. Get Gemini keys from Google AI Studio, OpenAI keys from OpenAI Platform.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="gemini-api-key" className={`block text-sm font-medium mb-1 ${currentActiveTheme.classes.textPrimary}`}>Gemini API Key</label>
                <div className="flex items-center space-x-2">
                  <input
                    id="gemini-api-key"
                    type="password"
                    value={contextGeminiApiKey}
                    onChange={(e) => contextSetGeminiApiKey(e.target.value)}
                    placeholder="Enter your Gemini API Key"
                    className={`flex-grow p-2.5 border rounded-md text-sm 
                                ${currentActiveTheme.classes.borderColor} 
                                ${currentActiveTheme.classes.textPrimary}
                                ${currentActiveTheme.classes.bgSecondary} 
                                focus:ring-2 ${currentActiveTheme.classes.inputFocusRingColor} focus:border-${currentActiveTheme.classes.accentColor}`}
                  />
                  <button
                    onClick={() => contextSetGeminiApiKey('')}
                    aria-label="Clear Gemini API Key"
                    className={`p-2.5 rounded-md text-xs border ${currentActiveTheme.classes.borderColor} ${currentActiveTheme.classes.textSecondary} hover:bg-gray-500/10 transition-colors`}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="openai-api-key" className={`block text-sm font-medium mb-1 ${currentActiveTheme.classes.textPrimary}`}>OpenAI API Key</label>
                <div className="flex items-center space-x-2">
                <input
                  id="openai-api-key"
                  type="password"
                  value={contextOpenAiApiKey}
                  onChange={(e) => contextSetOpenAiApiKey(e.target.value)}
                  placeholder="Enter your OpenAI API Key"
                  className={`flex-grow p-2.5 border rounded-md text-sm 
                              ${currentActiveTheme.classes.borderColor} 
                              ${currentActiveTheme.classes.textPrimary}
                              ${currentActiveTheme.classes.bgSecondary} 
                              focus:ring-2 ${currentActiveTheme.classes.inputFocusRingColor} focus:border-${currentActiveTheme.classes.accentColor}`}
                />
                <button
                    onClick={() => contextSetOpenAiApiKey('')}
                    aria-label="Clear OpenAI API Key"
                    className={`p-2.5 rounded-md text-xs border ${currentActiveTheme.classes.borderColor} ${currentActiveTheme.classes.textSecondary} hover:bg-gray-500/10 transition-colors`}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Features Section */}
          <div className="mb-4">
            <h3 className={`text-md font-medium mb-3 ${currentActiveTheme.classes.textSecondary}`}>AI Features</h3>
            {/* AI Enabled Toggle */}
            <div className={`flex items-center justify-between p-3 mb-3 rounded-md border ${currentActiveTheme.classes.borderColor} ${currentActiveTheme.classes.bgPrimary === 'bg-white' ? currentActiveTheme.classes.bgPrimary : currentActiveTheme.classes.bgSecondary }`}>
              <div>
                <label htmlFor="ai-toggle" className={`block text-sm font-medium ${currentActiveTheme.classes.textPrimary}`}>
                  Enable AI Magic & Enhancements
                </label>
                <p className={`text-xs ${currentActiveTheme.classes.textMuted}`}>
                  Uses selected AI service. Disable to keep application fully offline. Requires user-provided API Key for the selected service.
                </p>
              </div>
              <button
                id="ai-toggle"
                onClick={toggleAiFeatures}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${currentActiveTheme.classes.accentColor}`}
                role="switch"
                aria-checked={isAiEnabled}
              >
                <span className="sr-only">Enable AI Features</span>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${isAiEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                <span className={`absolute inset-0 h-full w-full rounded-full transition-colors ${isAiEnabled ? currentActiveTheme.classes.accentColor : 'bg-gray-300'}`} />
              </button>
            </div>

            {/* Preferred AI Service */}
            <div className={`p-3 mb-3 rounded-md border ${currentActiveTheme.classes.borderColor} ${currentActiveTheme.classes.bgPrimary === 'bg-white' ? currentActiveTheme.classes.bgPrimary : currentActiveTheme.classes.bgSecondary }`}>
              <label className={`block text-sm font-medium mb-2 ${currentActiveTheme.classes.textPrimary}`}>
                Preferred AI Service for "AI Magic"
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePreferredAiServiceChange('gemini')}
                  className={`flex-1 p-2.5 rounded-md text-sm font-medium border transition-all duration-150 ease-in-out
                    ${contextPreferredAiService === 'gemini' 
                      ? `${currentActiveTheme.classes.buttonBg} ${currentActiveTheme.classes.buttonText} border-transparent ring-1 ring-offset-1 ring-${currentActiveTheme.classes.accentColor}`
                      : `${currentActiveTheme.classes.bgPrimary} ${currentActiveTheme.classes.textPrimary} ${currentActiveTheme.classes.borderColor} hover:bg-opacity-50`}
                  `}
                  aria-pressed={contextPreferredAiService === 'gemini'}
                >
                  Gemini
                </button>
                <button
                  onClick={() => handlePreferredAiServiceChange('openai')}
                  className={`flex-1 p-2.5 rounded-md text-sm font-medium border transition-all duration-150 ease-in-out
                    ${contextPreferredAiService === 'openai' 
                      ? `${currentActiveTheme.classes.buttonBg} ${currentActiveTheme.classes.buttonText} border-transparent ring-1 ring-offset-1 ring-${currentActiveTheme.classes.accentColor}`
                      : `${currentActiveTheme.classes.bgPrimary} ${currentActiveTheme.classes.textPrimary} ${currentActiveTheme.classes.borderColor} hover:bg-opacity-50`}
                  `}
                  aria-pressed={contextPreferredAiService === 'openai'}
                >
                  OpenAI
                </button>
              </div>
            </div>

            {/* Customize Prompt Button */}
            <button
              onClick={() => setIsAiPromptModalOpen(true)}
              className={`w-full p-2.5 rounded-md text-sm font-medium border transition-all duration-150 ease-in-out
                ${currentActiveTheme.classes.bgPrimary} ${currentActiveTheme.classes.textPrimary} ${currentActiveTheme.classes.borderColor} 
                hover:bg-opacity-50 hover:${currentActiveTheme.classes.borderColor.replace('border-', 'border-')}`}
            >
              Advanced: Customize AI Magic Prompt...
            </button>
          </div>

        </div>
      </div>
      {isAiPromptModalOpen && (
        <AiPromptSettingsModal 
          isOpen={isAiPromptModalOpen} 
          onClose={() => setIsAiPromptModalOpen(false)} 
        />
      )}
    </>
  );
};