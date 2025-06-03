

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { Theme, THEMES, DEFAULT_THEME_NAME, getThemeByName } from './themes';
import { DEFAULT_AI_PROMPT, MAX_PROMPT_HISTORY } from './constants';

const DEFAULT_START_TIME = 5; // 5 AM
const DEFAULT_END_TIME = 23;  // 11 PM
const DEFAULT_TIME_FORMAT = '12h' as '12h' | '24h';
const DEFAULT_AI_ENABLED = true;
const DEFAULT_PREFERRED_AI_SERVICE = 'gemini' as 'gemini' | 'openai';

interface ThemeContextType {
  theme: Theme;
  setCurrentThemeName: (name: string) => void;
  dayStartTime: number;
  dayEndTime: number;
  setDayStartTime: (hour: number) => void;
  setDayEndTime: (hour: number) => void;
  timeFormat: '12h' | '24h';
  setTimeFormat: (format: '12h' | '24h') => void;
  isAiEnabled: boolean;
  toggleAiFeatures: () => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  openAiApiKey: string;
  setOpenAiApiKey: (key: string) => void;
  
  preferredAiService: 'gemini' | 'openai';
  setPreferredAiService: (service: 'gemini' | 'openai') => void;

  aiPrompt: string; // Currently active prompt
  aiPromptHistory: string[];
  setActiveAiPrompt: (prompt: string) => void;
  addOrUpdateAiPromptInHistory: (promptText: string) => void; // For saving from editor
  deleteAiPromptFromHistory: (promptToDelete: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentThemeName, setCurrentThemeNameState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('timeBoxTheme') || DEFAULT_THEME_NAME;
    }
    return DEFAULT_THEME_NAME;
  });

  const [dayStartTime, setDayStartTimeState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('timeBoxDayStartTime') || DEFAULT_START_TIME.toString(), 10);
    }
    return DEFAULT_START_TIME;
  });

  const [dayEndTime, setDayEndTimeState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('timeBoxDayEndTime') || DEFAULT_END_TIME.toString(), 10);
    }
    return DEFAULT_END_TIME;
  });

  const [timeFormat, setTimeFormatState] = useState<'12h' | '24h'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('timeBoxTimeFormat') as '12h' | '24h') || DEFAULT_TIME_FORMAT;
    }
    return DEFAULT_TIME_FORMAT;
  });

  const [isAiEnabled, setIsAiEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const storedVal = localStorage.getItem('timeBoxAiEnabled');
      return storedVal !== null ? JSON.parse(storedVal) : DEFAULT_AI_ENABLED;
    }
    return DEFAULT_AI_ENABLED;
  });

  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('timeBoxGeminiApiKey') || '';
    }
    return '';
  });

  const [openAiApiKey, setOpenAiApiKeyState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('timeBoxOpenAiApiKey') || '';
    }
    return '';
  });

  const [preferredAiService, setPreferredAiServiceState] = useState<'gemini' | 'openai'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('timeBoxPreferredAiService') as 'gemini' | 'openai') || DEFAULT_PREFERRED_AI_SERVICE;
    }
    return DEFAULT_PREFERRED_AI_SERVICE;
  });

  const [aiPrompt, setAiPromptState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('timeBoxActiveAiPrompt') || DEFAULT_AI_PROMPT;
    }
    return DEFAULT_AI_PROMPT;
  });

  const [aiPromptHistory, setAiPromptHistoryState] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const storedHistory = localStorage.getItem('timeBoxAiPromptHistory');
      let history = storedHistory ? JSON.parse(storedHistory) : [];
      const activePromptOnLoad = localStorage.getItem('timeBoxActiveAiPrompt') || DEFAULT_AI_PROMPT;
      if (!history.includes(activePromptOnLoad)) {
        history = [activePromptOnLoad, ...history.filter(p => p !== activePromptOnLoad)].slice(0, MAX_PROMPT_HISTORY);
         if (typeof window !== 'undefined') { 
            localStorage.setItem('timeBoxAiPromptHistory', JSON.stringify(history));
         }
      }
      return history;
    }
    return [DEFAULT_AI_PROMPT];
  });

  const theme = getThemeByName(currentThemeName);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timeBoxTheme', currentThemeName);
      localStorage.setItem('timeBoxDayStartTime', dayStartTime.toString());
      localStorage.setItem('timeBoxDayEndTime', dayEndTime.toString());
      localStorage.setItem('timeBoxTimeFormat', timeFormat);
      localStorage.setItem('timeBoxAiEnabled', JSON.stringify(isAiEnabled));
      localStorage.setItem('timeBoxGeminiApiKey', geminiApiKey);
      localStorage.setItem('timeBoxOpenAiApiKey', openAiApiKey);
      localStorage.setItem('timeBoxPreferredAiService', preferredAiService);
      localStorage.setItem('timeBoxActiveAiPrompt', aiPrompt);
      localStorage.setItem('timeBoxAiPromptHistory', JSON.stringify(aiPromptHistory));
      document.documentElement.style.setProperty('--brain-dump-dot-color', theme.classes.brainDumpDotCssColor);
    }
  }, [currentThemeName, theme, dayStartTime, dayEndTime, timeFormat, isAiEnabled, geminiApiKey, openAiApiKey, preferredAiService, aiPrompt, aiPromptHistory]);

  const setCurrentThemeName = useCallback((name: string) => {
    setCurrentThemeNameState(name);
  }, []);

  const setDayStartTime = useCallback((hour: number) => {
    setDayStartTimeState(hour);
  }, []);

  const setDayEndTime = useCallback((hour: number) => {
    setDayEndTimeState(hour);
  }, []);

  const setTimeFormat = useCallback((format: '12h' | '24h') => {
    setTimeFormatState(format);
  }, []);

  const toggleAiFeatures = useCallback(() => {
    setIsAiEnabledState(prev => !prev);
  }, []);

  const setGeminiApiKey = useCallback((key: string) => {
    setGeminiApiKeyState(key);
  }, []);

  const setOpenAiApiKey = useCallback((key: string) => {
    setOpenAiApiKeyState(key);
  }, []);

  const setPreferredAiService = useCallback((service: 'gemini' | 'openai') => {
    setPreferredAiServiceState(service);
  }, []);

  const setActiveAiPrompt = useCallback((promptToActivate: string) => {
    setAiPromptState(promptToActivate);
    setAiPromptHistoryState(prevHistory => {
      const filteredHistory = prevHistory.filter(p => p !== promptToActivate);
      const newHistory = [promptToActivate, ...filteredHistory].slice(0, MAX_PROMPT_HISTORY);
      return newHistory;
    });
  }, []);

  const addOrUpdateAiPromptInHistory = useCallback((promptText: string) => {
    setActiveAiPrompt(promptText);
  }, [setActiveAiPrompt]);

  const deleteAiPromptFromHistory = useCallback((promptToDelete: string) => {
    setAiPromptHistoryState(prevHistory => {
      const newHistory = prevHistory.filter(p => p !== promptToDelete);
      if (aiPrompt === promptToDelete) { 
        const nextActive = newHistory.length > 0 ? newHistory[0] : DEFAULT_AI_PROMPT;
        setAiPromptState(nextActive);
        if (!newHistory.includes(nextActive) && nextActive === DEFAULT_AI_PROMPT) {
            return [DEFAULT_AI_PROMPT, ...newHistory.filter(p => p !== DEFAULT_AI_PROMPT)].slice(0, MAX_PROMPT_HISTORY);
        } else if (newHistory.length === 0 && nextActive === DEFAULT_AI_PROMPT) {
             return [DEFAULT_AI_PROMPT];
        }
      }
      return newHistory.length > 0 ? newHistory : [DEFAULT_AI_PROMPT];
    });
     if (aiPrompt === promptToDelete && aiPromptHistory.filter(p => p !== promptToDelete).length === 0) {
        setAiPromptState(DEFAULT_AI_PROMPT);
        if (!aiPromptHistory.includes(DEFAULT_AI_PROMPT)) {
           setAiPromptHistoryState(prev => [DEFAULT_AI_PROMPT, ...prev.filter(p => p !== DEFAULT_AI_PROMPT)].slice(0, MAX_PROMPT_HISTORY))
        }
    }
  }, [aiPrompt, aiPromptHistory]);


  return (
    <ThemeContext.Provider value={{ 
      theme, setCurrentThemeName, 
      dayStartTime, dayEndTime, setDayStartTime, setDayEndTime, 
      timeFormat, setTimeFormat, 
      isAiEnabled, toggleAiFeatures,
      geminiApiKey, setGeminiApiKey,
      openAiApiKey, setOpenAiApiKey,
      preferredAiService, setPreferredAiService,
      aiPrompt, 
      aiPromptHistory,
      setActiveAiPrompt,
      addOrUpdateAiPromptInHistory,
      deleteAiPromptFromHistory
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};