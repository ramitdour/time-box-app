
export const INITIAL_PRIORITIES_COUNT = 3;

export const DEFAULT_AI_PROMPT = `You are an assistant that refines to-do list items. For the task "{TASK_TEXT}", please:
1. Make it clear and concise.
2. NO EXTRA WORDS !
3. Correct any spelling or grammatical errors.
4. Start the refined task with a single, relevant emoji.
5. VERY IMPORTANT: Do NOT add new information, sub-tasks, or expand the original task. The goal is refinement, not expansion.
Refined Task:`;

// Added MAX_PROMPT_HISTORY constant
export const MAX_PROMPT_HISTORY = 5;