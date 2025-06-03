import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { BrainDumpTask } from '../types';
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai"; 
import { DEFAULT_AI_PROMPT } from '../constants';


interface BrainDumpProps {
  tasks: BrainDumpTask[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newText: string) => void;
  onReplaceAllTasks: (tasks: BrainDumpTask[]) => void;
  onPromoteToPriority: (taskId: string) => void;
  onDemoteFromPriority: (taskId: string) => void;
  areAllPrioritiesFull: boolean;
}

export const BrainDump: React.FC<BrainDumpProps> = ({ 
    tasks, 
    onAddTask, 
    onToggleTask, 
    onDeleteTask, 
    onEditTask,
    onReplaceAllTasks,
    onPromoteToPriority,
    onDemoteFromPriority,
    areAllPrioritiesFull,
}) => {
  const { 
    theme, 
    isAiEnabled, 
    geminiApiKey: userGeminiApiKey, 
    openAiApiKey: userOpenAiApiKey,
    preferredAiService,
    aiPrompt: userAiPrompt,
  } = useTheme();

  const [newTaskText, setNewTaskText] = useState('');
  const [currentlyEditingId, setCurrentlyEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [originalEditText, setOriginalEditText] = useState<string>(''); 
  const editInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingAi, setIsProcessingAi] = useState(false);

  const brainDumpStyle = {
    backgroundImage: 'radial-gradient(var(--brain-dump-dot-color)_0.5px, transparent_0.5px)',
    backgroundSize: '12px 12px',
    minHeight: '200px', 
  };

  const handleAddNewTask = () => {
    if (newTaskText.trim() !== '') {
      onAddTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddNewTask();
    }
  };

  const handleStartEdit = (task: BrainDumpTask) => {
    setCurrentlyEditingId(task.id);
    setEditText(task.text);
    setOriginalEditText(task.text); 
  };

  const handleSaveEdit = () => {
    if (currentlyEditingId && editText.trim() !== '') {
      onEditTask(currentlyEditingId, editText.trim());
    } else if (currentlyEditingId) { 
      onEditTask(currentlyEditingId, originalEditText); 
    }
    setCurrentlyEditingId(null);
    setEditText('');
    setOriginalEditText('');
  };
  
  const handleCancelEdit = () => {
    setCurrentlyEditingId(null);
    setEditText('');
    setOriginalEditText('');
  };

  const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleEditInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSaveEdit();
    } else if (event.key === 'Escape') {
      handleCancelEdit();
    }
  };

  useEffect(() => {
    if (currentlyEditingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select(); 
    }
  }, [currentlyEditingId]);

  const handleAiMagicClick = async () => {
    const tasksToProcess = tasks.filter(task => !task.completed && !task.aiEnhanced);
    if (!isAiEnabled || tasksToProcess.length === 0 || isProcessingAi) return;

    let apiKeyToUse: string | undefined;
    let serviceNameForAlert: string;

    if (preferredAiService === 'gemini') {
      apiKeyToUse = userGeminiApiKey;
      serviceNameForAlert = "Gemini";
    } else { // openai
      apiKeyToUse = userOpenAiApiKey;
      serviceNameForAlert = "OpenAI";
    }

    if (!apiKeyToUse) {
      alert(`${serviceNameForAlert} API Key is not configured. Please set it in Settings to use AI Magic.`);
      return;
    }

    setIsProcessingAi(true);

    try {
      const updatedTasksPromises = tasks.map(async (task) => {
        if (task.completed || task.aiEnhanced) {
          return task; 
        }
        
        let refinedText = task.text;

        // Prepare prompt for Gemini
        let geminiFinalPrompt: string;
        if (userAiPrompt.includes('{TASK_TEXT}')) {
            geminiFinalPrompt = userAiPrompt.replace('{TASK_TEXT}', task.text);
        } else {
            geminiFinalPrompt = `${userAiPrompt}\n\nTask to refine: "${task.text}"`;
            console.warn("AI Magic: The custom prompt does not include the '{TASK_TEXT}' placeholder. Appending task text. For best results, include the placeholder in your prompt via Settings.");
        }
        
        // Prepare messages for OpenAI
        let openAiSystemMessage = "";
        let openAiUserMessage = "";

        if (userAiPrompt === DEFAULT_AI_PROMPT) {
            const defaultPromptParts = DEFAULT_AI_PROMPT.split("For the task \"{TASK_TEXT}\", please:");
            openAiSystemMessage = defaultPromptParts[0].trim();
            openAiUserMessage = `For the task "${task.text}", please:${defaultPromptParts[1] ? defaultPromptParts[1].trim() : ''}`;
        } else {
            // For custom prompts, treat the whole thing as user message after placeholder replacement
            openAiSystemMessage = "You are an AI assistant. Follow the user's instructions carefully to refine the provided task text.";
             if (userAiPrompt.includes('{TASK_TEXT}')) {
                openAiUserMessage = userAiPrompt.replace('{TASK_TEXT}', task.text);
            } else {
                openAiUserMessage = `${userAiPrompt}\n\nTask to refine: "${task.text}"`;
                console.warn("AI Magic (OpenAI): Custom prompt missing '{TASK_TEXT}'. Appending task text.");
            }
        }


        try {
          if (preferredAiService === 'gemini' && userGeminiApiKey) {
            const ai = new GoogleGenAI({ apiKey: userGeminiApiKey });
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash-preview-04-17',
              contents: geminiFinalPrompt,
              config: {
                thinkingConfig: { thinkingBudget: 0 }
              }
            });
            refinedText = response.text.trim();

          } else if (preferredAiService === 'openai' && userOpenAiApiKey) {
            const openai = new OpenAI({ apiKey: userOpenAiApiKey, dangerouslyAllowBrowser: true });
            const completion = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages: [
                { role: "system", content: openAiSystemMessage },
                { role: "user", content: openAiUserMessage }
              ],
              temperature: 0.7,
              max_tokens: 150, // Adjust as needed
            });
            refinedText = completion.choices[0]?.message?.content?.trim() || task.text;
          }
          return { ...task, text: refinedText || task.text, aiEnhanced: true }; 

        } catch (error) {
            console.error(`Error processing task "${task.text}" with ${serviceNameForAlert} AI:`, error);
            return task; 
        }
      });
      
      const newTasks = await Promise.all(updatedTasksPromises);
      onReplaceAllTasks(newTasks);

    } catch (error) {
      console.error(`AI Magic Global Error with ${serviceNameForAlert}:`, error);
      alert(`An error occurred while using ${serviceNameForAlert} AI Magic. Some tasks may not have been processed. Please check your console for details or try again.`);
    } finally {
      setIsProcessingAi(false);
    }
  };
  
  const eligibleTasksForAi = tasks.some(task => !task.completed && !task.aiEnhanced);
  let hasRequiredApiKey = false;
  let apiKeyMissingMessage = "";

  if (preferredAiService === 'gemini') {
    hasRequiredApiKey = !!userGeminiApiKey;
    apiKeyMissingMessage = "Gemini API Key not set in settings. Please add it to use AI Magic.";
  } else { // openai
    hasRequiredApiKey = !!userOpenAiApiKey;
    apiKeyMissingMessage = "OpenAI API Key not set in settings. Please add it to use AI Magic.";
  }

  const canUseAiMagic = isAiEnabled && eligibleTasksForAi && tasks.length > 0 && hasRequiredApiKey;
  let aiMagicTooltip = "";

  if (!isAiEnabled) {
    aiMagicTooltip = "AI features are disabled in settings.";
  } else if (!hasRequiredApiKey) {
    aiMagicTooltip = apiKeyMissingMessage;
  } else if (tasks.length === 0) {
    aiMagicTooltip = "Add at least one task to use AI Magic.";
  } else if (!eligibleTasksForAi) {
    aiMagicTooltip = "All eligible tasks have been enhanced by AI.";
  }


  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className={`text-lg font-semibold ${theme.classes.textPrimary}`}>Brain Dump (To-Do)</h2>
        <div className="relative group">
          <button
            onClick={handleAiMagicClick}
            disabled={!canUseAiMagic || isProcessingAi}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-1.5 transition-all duration-150 ease-in-out
                        ${canUseAiMagic && !isProcessingAi ? `${theme.classes.buttonBg} ${theme.classes.buttonText} ${theme.classes.buttonHoverBg}` : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${theme.classes.accentColor}`}
            aria-label="Refine tasks with AI Magic"
          >
            {isProcessingAi ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <span>AI Magic</span>
                <span role="img" aria-label="magic wand">🪄</span>
                <span className="text-xs opacity-70">({preferredAiService === 'gemini' ? 'G' : 'O'})</span>
              </>
            )}
          </button>
          {(!canUseAiMagic && !isProcessingAi && aiMagicTooltip) && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
              {aiMagicTooltip}
            </div>
          )}
        </div>
      </div>

      <div 
        className={`p-3 border rounded-md ${theme.classes.borderColor} ${theme.classes.bgSecondary === 'bg-white' ? 'bg-white' : theme.classes.bgSecondary}`}
        style={brainDumpStyle}
      >
        <div className="mb-3 flex items-center space-x-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={handleInputKeyPress}
            placeholder="Add a new task..."
            aria-label="Add a new brain dump task"
            className={`flex-grow p-2.5 border rounded-md transition-shadow duration-150 ease-in-out text-sm 
                       ${theme.classes.borderColor} 
                       ${theme.classes.textPrimary}
                       bg-transparent 
                       focus:ring-2 ${theme.classes.inputFocusRingColor} focus:border-${theme.classes.accentColor}`}
          />
          <button
            onClick={handleAddNewTask}
            aria-label="Add task"
            className={`p-2.5 rounded-md ${theme.classes.buttonBg} ${theme.classes.buttonText} ${theme.classes.buttonHoverBg} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${theme.classes.accentColor}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
        {tasks.length === 0 && (
          <p className={`text-sm ${theme.classes.textMuted} text-center py-4`}>No tasks yet. Add some!</p>
        )}
        <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {tasks.map((task) => {
            const canPromote = !task.completed && !task.isPriority && !areAllPrioritiesFull;
            const canDemote = !task.completed && task.isPriority;
            let promoteDemoteTooltip = "";
            if (task.completed) {
                promoteDemoteTooltip = "Complete tasks cannot be prioritized.";
            } else if (task.isPriority) {
                promoteDemoteTooltip = "Remove from Top Priorities.";
            } else if (areAllPrioritiesFull) {
                promoteDemoteTooltip = "Top Priorities list is full.";
            } else {
                promoteDemoteTooltip = "Add to Top Priorities.";
            }

            return (
            <li 
              key={task.id} 
              className={`flex items-center justify-between p-2 rounded-md transition-colors duration-150 ease-in-out
                          ${task.completed ? `${theme.classes.textMuted} bg-opacity-50` : theme.classes.textPrimary}
                          ${currentlyEditingId !== task.id ? `hover:bg-gray-500 hover:bg-opacity-10` : ''}`}
              role="listitem"
            >
              <div className="flex items-center flex-grow mr-2 min-w-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(task.id)}
                  aria-labelledby={`task-text-${task.id}`}
                  className={`mr-3 h-4 w-4 rounded ${theme.classes.borderColor} text-${theme.classes.accentColor} focus:ring-${theme.classes.accentColor} cursor-pointer shrink-0`}
                  disabled={currentlyEditingId === task.id}
                />
                {currentlyEditingId === task.id ? (
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editText}
                    onChange={handleEditInputChange}
                    onKeyDown={handleEditInputKeyDown}
                    onBlur={handleSaveEdit} 
                    className={`flex-grow text-sm bg-transparent border-b ${theme.classes.borderColor} ${theme.classes.textPrimary} focus:outline-none focus:border-${theme.classes.accentColor}`}
                    aria-label={`Editing task: ${originalEditText}`}
                  />
                ) : (
                  <span 
                    id={`task-text-${task.id}`}
                    className={`flex-grow text-sm truncate ${task.completed ? 'line-through' : ''} ${task.aiEnhanced && !task.completed ? 'italic text-opacity-80' : ''} ${!task.completed ? 'cursor-pointer' : ''}`}
                    title={task.aiEnhanced && !task.completed ? `AI Enhanced: ${task.text}` : (!task.completed ? "Double-click or use edit icon to modify task" : "")}
                    onDoubleClick={() => !task.completed && currentlyEditingId !== task.id && handleStartEdit(task)}
                  >
                    {task.text}
                  </span>
                )}
              </div>
              <div className="flex items-center shrink-0 space-x-1">
                {currentlyEditingId === task.id ? (
                   <button
                    onClick={handleSaveEdit}
                    aria-label="Save changes"
                    className={`p-1 rounded hover:bg-green-500/20 transition-colors text-green-600 hover:text-green-700`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </button>
                 ) : (
                  <>
                    {!task.completed && (
                      <div className="relative group">
                        <button
                          onClick={() => {
                            if (task.isPriority) onDemoteFromPriority(task.id);
                            else if (canPromote) onPromoteToPriority(task.id);
                          }}
                          disabled={task.completed || (!task.isPriority && !canPromote)}
                          aria-label={task.isPriority ? "Remove from Top Priorities" : "Add to Top Priorities"}
                          className={`p-1 rounded transition-colors 
                                      ${task.completed || (!task.isPriority && !canPromote) ? 'text-gray-300 cursor-not-allowed' : `${theme.classes.textMuted} hover:text-${theme.classes.accentColor} hover:bg-gray-500/10`}`}
                          title={promoteDemoteTooltip}
                        >
                          {task.isPriority ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 text-${theme.classes.accentColor}`}>
                               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.408c.496 0 .696.659.304.99l-4.42 3.14a.563.563 0 00-.205.626l1.645 5.058a.563.563 0 01-.83.626l-4.256-3.08a.563.563 0 00-.62 0L4.934 19.4a.563.563 0 01-.83-.626l1.645-5.058a.563.563 0 00-.205-.626L1.121 9.999a.563.563 0 01.303-.99h5.408a.563.563 0 00.475-.31L11.48 3.5z" />
                            </svg>
                          )}
                        </button>
                         { (task.completed || (!task.isPriority && !canPromote)) && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                            {promoteDemoteTooltip}
                          </div>
                        )}
                      </div>
                    )}
                    {!task.completed && (
                      <button
                        onClick={() => handleStartEdit(task)}
                        aria-label={`Edit task: ${task.text}`}
                        className={`p-1 rounded hover:bg-gray-500/20 transition-colors ${theme.classes.textMuted} hover:text-${theme.classes.accentColor}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      aria-label={`Delete task: ${task.text}`}
                      className={`p-1 rounded hover:bg-red-500 hover:text-white transition-colors ${theme.classes.textMuted} hover:text-red-700`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c.342.052.682.107 1.022.166m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </>
                 )}
              </div>
            </li>
          )})}
        </ul>
      </div>
    </div>
  );
};