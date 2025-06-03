
import React, { useRef } from 'react';
import { useTheme } from '../ThemeContext';
import { TopPriorityItem } from '../types';

interface TopPrioritiesProps {
  priorities: TopPriorityItem[];
  onPriorityTextChange: (prioritySlotId: string, value: string) => void;
  onClearPriority: (prioritySlotId: string) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void; 
  onDragOver: (event: React.DragEvent, index: number) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
  draggedItemIndex: number | null;
  dropTargetIndex: number | null;
  onMovePriorityUp: (prioritySlotId: string) => void; // New prop
  onMovePriorityDown: (prioritySlotId: string) => void; // New prop
}

export const TopPriorities: React.FC<TopPrioritiesProps> = ({
  priorities,
  onPriorityTextChange,
  onClearPriority,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDrop,
  onDragEnd,
  draggedItemIndex,
  dropTargetIndex,
  onMovePriorityUp,
  onMovePriorityDown,
}) => {
  const { theme } = useTheme();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (index < priorities.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  return (
    <div className="mb-6">
      <h2 className={`text-lg font-semibold ${theme.classes.textPrimary} mb-2`}>Top Priorities</h2>
      <div className="space-y-2">
        {priorities.map((priorityItem, index) => {
          const isBeingDragged = draggedItemIndex === index;
          const isDropTarget = dropTargetIndex === index && draggedItemIndex !== null && draggedItemIndex !== index;

          let borderStyle = `border ${theme.classes.borderColor}`;
          if (isDropTarget) {
            if (draggedItemIndex !== null && draggedItemIndex < index) {
              borderStyle = `border-b-2 border-${theme.classes.accentColor}`; 
            } else {
              borderStyle = `border-t-2 border-${theme.classes.accentColor}`; 
            }
          }
          
          return (
            <div
              key={priorityItem.id} // Use stable slot ID for key
              onDragEnter={() => onDragEnter(index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDrop={() => onDrop(index)}
              onDragEnd={onDragEnd}
              className={`
                flex items-center space-x-1.5 p-2.5 rounded-md transition-all duration-150 ease-in-out
                ${isBeingDragged ? 'opacity-50 shadow-lg' : 'shadow-sm'}
                ${borderStyle} 
                ${theme.classes.bgSecondary === 'bg-white' ? 'bg-white' : theme.classes.bgSecondary} 
              `}
              role="listitem"
            >
              <div 
                draggable
                onDragStart={() => onDragStart(index)}
                onDragEnd={onDragEnd}
                className={`p-1 cursor-grab active:cursor-grabbing ${theme.classes.textMuted}`}
                aria-label={`Drag to reorder priority ${index + 1}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="pointer-events-none">
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5-8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
              </div>
              <span className={`text-sm font-medium ${theme.classes.textMuted} select-none`}>{index + 1}.</span>
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                value={priorityItem.text}
                onChange={(e) => onPriorityTextChange(priorityItem.id, e.target.value)}
                onKeyDown={(e) => handleInputKeyDown(e, index)}
                placeholder={`Priority ${index + 1}`}
                className={`w-full bg-transparent text-sm 
                           ${theme.classes.textPrimary}
                           focus:outline-none`}
                aria-label={`Priority ${index + 1} text input`}
                aria-grabbed={isBeingDragged ? 'true' : 'false'}
              />
              <div className="flex items-center space-x-0.5">
                <button
                  onClick={() => onMovePriorityUp(priorityItem.id)}
                  disabled={index === 0}
                  aria-label={`Move priority ${index + 1} up`}
                  title="Move up"
                  className={`p-1 rounded-full transition-colors ${
                    index === 0 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : `${theme.classes.textMuted} hover:text-${theme.classes.accentColor} hover:bg-gray-500/10`
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                </button>
                <button
                  onClick={() => onMovePriorityDown(priorityItem.id)}
                  disabled={index === priorities.length - 1}
                  aria-label={`Move priority ${index + 1} down`}
                  title="Move down"
                  className={`p-1 rounded-full transition-colors ${
                    index === priorities.length - 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : `${theme.classes.textMuted} hover:text-${theme.classes.accentColor} hover:bg-gray-500/10`
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={() => onClearPriority(priorityItem.id)}
                  aria-label={`Clear priority ${index + 1}`}
                  className={`p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-100 transition-colors ${theme.classes.textMuted}`}
                  title="Clear this priority"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};