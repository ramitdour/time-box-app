
import React, { useState, useCallback, useEffect } from 'react';
import { ScheduleData, BrainDumpTask, ScheduleHour, TopPriorityItem } from './types';
import { INITIAL_PRIORITIES_COUNT } from './constants';
import { generateScheduleHours } from './utils';
import { Logo } from './components/Logo';
import { TopPriorities } from './components/TopPriorities';
import { BrainDump } from './components/BrainDump';
import { Schedule } from './components/Schedule';
import { ThemeProvider, useTheme } from './ThemeContext';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { WelcomeModal } from './components/WelcomeModal'; // Import WelcomeModal

const AppContent: React.FC = () => {
  const { theme, dayStartTime, dayEndTime, timeFormat } = useTheme();
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [topPriorities, setTopPriorities] = useState<TopPriorityItem[]>(() => 
    Array(INITIAL_PRIORITIES_COUNT).fill(null).map((_, index) => ({
      id: `tp-${index + 1}`, // Assign a stable ID to each slot
      text: "",
      sourceTaskId: null,
    }))
  );
  const [brainDumpTasks, setBrainDumpTasks] = useState<BrainDumpTask[]>([]);
  
  const [currentScheduleHours, setCurrentScheduleHours] = useState<ScheduleHour[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(false); // State for Welcome Modal

  const [draggedPriorityIndex, setDraggedPriorityIndex] = useState<number | null>(null);
  const [priorityDropTargetIndex, setPriorityDropTargetIndex] = useState<number | null>(null);

  // Effect to check for first visit and show Welcome Modal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem('timeBoxHasVisited');
      if (!hasVisited) {
        setIsWelcomeModalOpen(true);
      }
    }
  }, []);

  const handleWelcomeModalClose = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timeBoxHasVisited', 'true');
    }
    setIsWelcomeModalOpen(false);
  };


  useEffect(() => {
    const newHours = generateScheduleHours(dayStartTime, dayEndTime, timeFormat); 
    setCurrentScheduleHours(newHours);

    setScheduleData(prevData => {
      const newScheduleState: ScheduleData = {};
      newHours.forEach(hour => {
        if (prevData[hour.key]) {
          newScheduleState[hour.key] = prevData[hour.key];
        } else {
          newScheduleState[hour.key] = { "00": "", "30": "" };
        }
      });
      return newScheduleState;
    });
  }, [dayStartTime, dayEndTime, timeFormat]);


  const handlePriorityTextChange = useCallback((prioritySlotId: string, value: string) => {
    setTopPriorities(prev =>
      prev.map(p => (p.id === prioritySlotId ? { ...p, text: value } : p))
    );
  }, []);

  const handleClearTopPriority = useCallback((prioritySlotId: string) => {
    setTopPriorities(prevPriorities =>
      prevPriorities.map(p => {
        if (p.id === prioritySlotId) {
          // If this priority was linked to a BrainDump task, update that task
          if (p.sourceTaskId) {
            setBrainDumpTasks(prevTasks =>
              prevTasks.map(bdTask =>
                bdTask.id === p.sourceTaskId ? { ...bdTask, isPriority: false } : bdTask
              )
            );
          }
          return { ...p, text: "", sourceTaskId: null };
        }
        return p;
      })
    );
  }, []);


  const handlePriorityDragStart = useCallback((index: number) => {
    setDraggedPriorityIndex(index);
  }, []);

  const handlePriorityDragEnter = useCallback((index: number) => {
    if (draggedPriorityIndex === null || draggedPriorityIndex === index) {
      setPriorityDropTargetIndex(null);
      return;
    }
    setPriorityDropTargetIndex(index);
  }, [draggedPriorityIndex]);
  
  const handlePriorityDragOver = useCallback((event: React.DragEvent, index: number) => {
    event.preventDefault(); 
    if (draggedPriorityIndex !== null && draggedPriorityIndex !== index) {
      setPriorityDropTargetIndex(index);
    }
  }, [draggedPriorityIndex]);

  const handlePriorityDrop = useCallback((targetIndex: number) => {
    if (draggedPriorityIndex === null || draggedPriorityIndex === targetIndex) {
      setDraggedPriorityIndex(null);
      setPriorityDropTargetIndex(null);
      return;
    }
    setTopPriorities(prev => {
      const newList = [...prev];
      const [draggedItem] = newList.splice(draggedPriorityIndex, 1);
      newList.splice(targetIndex, 0, draggedItem);
      return newList;
    });
    setDraggedPriorityIndex(null);
    setPriorityDropTargetIndex(null);
  }, [draggedPriorityIndex]);

  const handlePriorityDragEnd = useCallback(() => {
    setDraggedPriorityIndex(null);
    setPriorityDropTargetIndex(null);
  }, []);

  const handleMovePriorityUp = useCallback((prioritySlotId: string) => {
    setTopPriorities(prev => {
      const currentIndex = prev.findIndex(p => p.id === prioritySlotId);
      if (currentIndex > 0) {
        const newList = [...prev];
        const temp = newList[currentIndex];
        newList[currentIndex] = newList[currentIndex - 1];
        newList[currentIndex - 1] = temp;
        return newList;
      }
      return prev;
    });
  }, []);

  const handleMovePriorityDown = useCallback((prioritySlotId: string) => {
    setTopPriorities(prev => {
      const currentIndex = prev.findIndex(p => p.id === prioritySlotId);
      if (currentIndex < prev.length - 1 && currentIndex !== -1) {
        const newList = [...prev];
        const temp = newList[currentIndex];
        newList[currentIndex] = newList[currentIndex + 1];
        newList[currentIndex + 1] = temp;
        return newList;
      }
      return prev;
    });
  }, []);


  const handleAddBrainDumpTask = useCallback((text: string) => {
    if (text.trim() === "") return;
    const newTask: BrainDumpTask = {
      id: self.crypto.randomUUID(),
      text,
      completed: false,
      aiEnhanced: false,
      isPriority: false, // Initialize isPriority
    };
    setBrainDumpTasks(prev => [newTask, ...prev]); 
  }, []);

  const handleToggleBrainDumpTask = useCallback((id: string) => {
    setBrainDumpTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const handleDeleteBrainDumpTask = useCallback((idToDelete: string) => {
    const taskToDelete = brainDumpTasks.find(task => task.id === idToDelete);
    setBrainDumpTasks(prev => prev.filter(task => task.id !== idToDelete));

    // If the deleted task was a top priority, clear it from top priorities
    if (taskToDelete && taskToDelete.isPriority) {
      setTopPriorities(prevTop =>
        prevTop.map(pItem =>
          pItem.sourceTaskId === idToDelete
            ? { ...pItem, text: "", sourceTaskId: null }
            : pItem
        )
      );
    }
  }, [brainDumpTasks]);
  
  const handleEditBrainDumpTask = useCallback((id: string, newText: string) => {
    setBrainDumpTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          // If text changes, and it was a priority, update the priority text too
          if (task.isPriority) {
            setTopPriorities(prevTop => 
              prevTop.map(pItem => 
                pItem.sourceTaskId === id ? {...pItem, text: newText.trim()} : pItem
              )
            );
          }
          return { ...task, text: newText.trim() };
        }
        return task;
      })
    );
  }, []);

  const handleReplaceAllBrainDumpTasks = useCallback((newTasks: BrainDumpTask[]) => {
    setBrainDumpTasks(newTasks);
    // Ensure top priorities reflect any AI changes if tasks were linked
    newTasks.forEach(updatedTask => {
      if (updatedTask.isPriority && updatedTask.aiEnhanced) {
        setTopPriorities(prevTop =>
          prevTop.map(pItem =>
            pItem.sourceTaskId === updatedTask.id ? { ...pItem, text: updatedTask.text } : pItem
          )
        );
      }
    });
  }, []);

  const handlePromoteBrainDumpTaskToPriority = useCallback((taskId: string) => {
    const taskToPromote = brainDumpTasks.find(task => task.id === taskId);
    if (!taskToPromote || taskToPromote.isPriority) return;

    setTopPriorities(prevTop => {
      const newTopPriorities = [...prevTop];
      const firstEmptySlotIndex = newTopPriorities.findIndex(p => !p.text && !p.sourceTaskId);

      if (firstEmptySlotIndex !== -1) {
        newTopPriorities[firstEmptySlotIndex] = {
          ...newTopPriorities[firstEmptySlotIndex],
          text: taskToPromote.text,
          sourceTaskId: taskId,
        };
        setBrainDumpTasks(prevTasks =>
          prevTasks.map(bdTask =>
            bdTask.id === taskId ? { ...bdTask, isPriority: true } : bdTask
          )
        );
        return newTopPriorities;
      }
      // No empty slot, optionally alert user or do nothing (button should be disabled in UI)
      return prevTop; 
    });
  }, [brainDumpTasks]);

  const handleDemoteBrainDumpTaskFromPriority = useCallback((taskId: string) => {
    setBrainDumpTasks(prevTasks =>
      prevTasks.map(bdTask =>
        bdTask.id === taskId ? { ...bdTask, isPriority: false } : bdTask
      )
    );
    setTopPriorities(prevTop =>
      prevTop.map(pItem =>
        pItem.sourceTaskId === taskId ? { ...pItem, text: "", sourceTaskId: null } : pItem
      )
    );
  }, []);


  const handleScheduleChange = useCallback((hourKey: string, slot: '00' | '30', value: string) => {
    setScheduleData(prev => ({
      ...prev,
      [hourKey]: {
        ...prev[hourKey],
        [slot]: value
      }
    }));
  }, []);

  // Check if all priority slots are filled
  const areAllPrioritiesFull = topPriorities.every(p => p.text !== "" || p.sourceTaskId !== null);

  return (
    <div className={`min-h-screen ${theme.classes.bgPrimary} py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ease-in-out`}>
      <div className={`max-w-6xl mx-auto ${theme.classes.bgSecondary} shadow-xl rounded-lg p-6 md:p-8 transition-colors duration-300 ease-in-out`}>
        <div className="md:grid md:grid-cols-3 md:gap-x-8">
          {/* Left Column */}
          <div className="md:col-span-1 mb-8 md:mb-0">
            <Logo />
            <TopPriorities
              priorities={topPriorities}
              onPriorityTextChange={handlePriorityTextChange}
              onClearPriority={handleClearTopPriority}
              onDragStart={handlePriorityDragStart}
              onDragEnter={handlePriorityDragEnter}
              onDragOver={handlePriorityDragOver}
              onDrop={handlePriorityDrop}
              onDragEnd={handlePriorityDragEnd}
              draggedItemIndex={draggedPriorityIndex}
              dropTargetIndex={priorityDropTargetIndex}
              onMovePriorityUp={handleMovePriorityUp}
              onMovePriorityDown={handleMovePriorityDown}
            />
            <BrainDump
              tasks={brainDumpTasks}
              onAddTask={handleAddBrainDumpTask}
              onToggleTask={handleToggleBrainDumpTask}
              onDeleteTask={handleDeleteBrainDumpTask}
              onEditTask={handleEditBrainDumpTask}
              onReplaceAllTasks={handleReplaceAllBrainDumpTasks}
              onPromoteToPriority={handlePromoteBrainDumpTaskToPriority}
              onDemoteFromPriority={handleDemoteBrainDumpTaskFromPriority}
              areAllPrioritiesFull={areAllPrioritiesFull}
            />
          </div>

          {/* Right Column */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${theme.classes.textPrimary}`}>Daily Schedule</h2>
              <div className="flex items-center space-x-3">
                <label htmlFor="date-input" className={`text-sm font-medium ${theme.classes.textSecondary}`}>Date:</label>
                <input
                  id="date-input"
                  type="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  className={`p-2 border rounded-md text-sm ${theme.classes.borderColor} ${theme.classes.textPrimary} bg-transparent focus:ring-2 ${theme.classes.inputFocusRingColor} focus:border-${theme.classes.accentColor}`}
                  aria-label="Schedule date picker: select a date for the daily plan"
                />
                <button 
                  onClick={() => setIsHelpModalOpen(true)}
                  className={`p-2 rounded-full ${theme.classes.settingsIconColor} transition-colors duration-150`}
                  aria-label="Open user guide and help"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setIsSettingsModalOpen(true)} 
                  className={`p-2 rounded-full ${theme.classes.settingsIconColor} transition-colors duration-150`}
                  aria-label="Open settings"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 1.255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 010-1.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <Schedule scheduleHours={currentScheduleHours} scheduleData={scheduleData} onScheduleChange={handleScheduleChange} />
          </div>
        </div>
      </div>
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
      <WelcomeModal isOpen={isWelcomeModalOpen} onClose={handleWelcomeModalClose} /> {/* Conditionally render WelcomeModal */}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;