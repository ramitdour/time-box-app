
export interface ScheduleEntry {
  "00": string;
  "30": string;
}

export interface ScheduleData {
  [key: string]: ScheduleEntry; // key is like "h5", "h13" etc.
}

export interface ScheduleHour {
  display: string; // "5", "12", "1"
  key: string;     // "h5", "h12", "h13" (unique key for 24h format)
}

export interface BrainDumpTask {
  id: string;
  text: string;
  completed: boolean;
  aiEnhanced: boolean;
  isPriority: boolean; // Added to track if task is a Top Priority
}

export interface TopPriorityItem {
  id: string; // Stable ID for the priority slot itself (e.g., 'tp-1')
  text: string;
  sourceTaskId: string | null; // ID of the BrainDumpTask if promoted, otherwise null
}