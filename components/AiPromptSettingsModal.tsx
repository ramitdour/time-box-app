

import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
// Fix: Import DEFAULT_AI_PROMPT and MAX_PROMPT_HISTORY from constants
import { DEFAULT_AI_PROMPT, MAX_PROMPT_HISTORY } from '../constants';

interface AiPromptSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiPromptSettingsModal: React.FC<AiPromptSettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    theme: currentActiveTheme, 
    aiPrompt: activeAiPrompt, // Renamed for clarity, this is the currently active prompt
    aiPromptHistory,
    setActiveAiPrompt,
    addOrUpdateAiPromptInHistory,
    deleteAiPromptFromHistory,
  } = useTheme();

  const [editablePrompt, setEditablePrompt] = useState(activeAiPrompt);

  useEffect(() => {
    // Sync local editable prompt with context's active prompt changes
    // (e.g., after reset, direct activation from history, or initial load)
    setEditablePrompt(activeAiPrompt);
  }, [activeAiPrompt]);

  if (!isOpen) return null;

  const handleSaveAndActivatePrompt = () => {
    if (editablePrompt.trim() === "") {
      alert("Prompt cannot be empty.");
      return;
    }
    if (window.confirm("Are you sure you want to save and activate this prompt? It will be added to/updated in your history.")) {
      addOrUpdateAiPromptInHistory(editablePrompt);
    }
  };

  const handleResetActiveToDefault = () => {
    if (window.confirm("Are you sure you want to reset to the default prompt? This will become your active prompt and be added to history.")) {
      setActiveAiPrompt(DEFAULT_AI_PROMPT);
      setEditablePrompt(DEFAULT_AI_PROMPT); // Also update local editor state immediately
    }
  };
  
  const handleActivateFromHistory = (prompt: string) => {
    setActiveAiPrompt(prompt);
    // The useEffect for activeAiPrompt will update editablePrompt
  };

  const handleEditFromHistory = (prompt: string) => {
    setEditablePrompt(prompt); // Load into editor
  };

  const handleDeleteFromHistory = (prompt: string) => {
    if (window.confirm("Are you sure you want to delete this prompt from your history?")) {
      deleteAiPromptFromHistory(prompt);
       // If the deleted prompt was the one in the editor, and also the active one,
       // the editor will update via useEffect hooked to activeAiPrompt.
       // If it was just in the editor but not active, reset editor to current active.
      if(editablePrompt === prompt && activeAiPrompt !== prompt) {
        setEditablePrompt(activeAiPrompt);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[60] transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-prompt-settings-modal-title"
    >
      <div 
        className={`p-6 rounded-lg shadow-xl w-full max-w-2xl ${currentActiveTheme.classes.bgSecondary} ${currentActiveTheme.classes.textPrimary} overflow-y-auto max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 id="ai-prompt-settings-modal-title" className={`text-xl font-semibold ${currentActiveTheme.classes.textPrimary}`}>AI Magic Prompt Gallery</h2>
          <button 
            onClick={onClose} 
            className={`p-1 rounded-full ${currentActiveTheme.classes.textMuted} hover:bg-gray-500/20`}
            aria-label="Close AI prompt settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Prompt Editor Section */}
        <div className={`mb-6 pb-4 border-b ${currentActiveTheme.classes.borderColor} shrink-0`}>
          <h3 className={`text-md font-medium mb-1 ${currentActiveTheme.classes.textSecondary}`}>Edit or Create Prompt:</h3>
          <p className={`text-sm ${currentActiveTheme.classes.textMuted} mb-2`}>
            Ensure you include the placeholder <code className={`px-1.5 py-0.5 text-xs rounded ${currentActiveTheme.classes.bgPrimary} ${currentActiveTheme.classes.textSecondary}`}>{'{TASK_TEXT}'}</code>.
          </p>
          <textarea
            value={editablePrompt}
            onChange={(e) => setEditablePrompt(e.target.value)}
            rows={5}
            className={`w-full p-3 border rounded-md text-sm 
                        ${currentActiveTheme.classes.borderColor} 
                        ${currentActiveTheme.classes.textPrimary}
                        ${currentActiveTheme.classes.bgSecondary} 
                        focus:ring-2 ${currentActiveTheme.classes.inputFocusRingColor} focus:border-${currentActiveTheme.classes.accentColor}`}
            aria-label="AI Magic prompt editor"
          />
          <div className="mt-3 flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-2 sm:space-y-0">
            <button
              onClick={handleResetActiveToDefault}
              className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium border
                          ${currentActiveTheme.classes.borderColor} ${currentActiveTheme.classes.textSecondary} 
                          hover:bg-gray-500/10 transition-colors`}
            >
              Reset Active to Default
            </button>
            <button
              onClick={handleSaveAndActivatePrompt}
              className={`w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium 
                          ${currentActiveTheme.classes.buttonBg} ${currentActiveTheme.classes.buttonText} 
                          ${currentActiveTheme.classes.buttonHoverBg} transition-colors`}
            >
              Save and Activate Edited/New Prompt
            </button>
          </div>
        </div>

        {/* Prompt History Gallery */}
        <div className="flex-grow overflow-y-auto">
          {/* Fix: Use imported MAX_PROMPT_HISTORY */}
          <h3 className={`text-md font-medium mb-3 ${currentActiveTheme.classes.textSecondary}`}>Prompt History (Up to {MAX_PROMPT_HISTORY}):</h3>
          {aiPromptHistory.length === 0 ? (
            <p className={`text-sm ${currentActiveTheme.classes.textMuted}`}>No prompt history yet. Save a prompt to start building your gallery!</p>
          ) : (
            <ul className="space-y-3">
              {aiPromptHistory.map((histPrompt, index) => (
                <li 
                  key={index} 
                  className={`p-3 border rounded-md ${currentActiveTheme.classes.borderColor} ${currentActiveTheme.classes.bgPrimary === 'bg-white' ? 'bg-white' : currentActiveTheme.classes.bgPrimary } shadow-sm`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <p className={`text-xs font-semibold ${currentActiveTheme.classes.textMuted}`}>Prompt #{index + 1}</p>
                    {histPrompt === activeAiPrompt && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${currentActiveTheme.classes.accentColorContrast} ${currentActiveTheme.classes.accentColor.replace('-500', '-100').replace('-600', '-100').replace('-700', '-100')}`}>
                        Active
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${currentActiveTheme.classes.textPrimary} mb-2 whitespace-pre-wrap break-words max-h-28 overflow-y-auto`}>
                    {histPrompt}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-end items-center pt-2 border-t ${currentActiveTheme.classes.borderColor} mt-2">
                    <button
                      onClick={() => handleActivateFromHistory(histPrompt)}
                      disabled={histPrompt === activeAiPrompt}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors
                                  ${histPrompt === activeAiPrompt 
                                    ? `bg-gray-300 text-gray-500 cursor-not-allowed`
                                    : `${currentActiveTheme.classes.buttonBg} ${currentActiveTheme.classes.buttonText} ${currentActiveTheme.classes.buttonHoverBg}`}`}
                      aria-label={histPrompt === activeAiPrompt ? "This prompt is already active" : "Activate this prompt"}
                    >
                      {histPrompt === activeAiPrompt ? 'Activated' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEditFromHistory(histPrompt)}
                      className={`px-3 py-1.5 rounded text-xs font-medium border ${currentActiveTheme.classes.borderColor} ${currentActiveTheme.classes.textSecondary} hover:bg-gray-500/10 transition-colors`}
                      aria-label="Edit this prompt"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFromHistory(histPrompt)}
                       className={`px-3 py-1.5 rounded text-xs font-medium border border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors`}
                      aria-label="Delete this prompt from history"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};