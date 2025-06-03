
import React from 'react';
import { useTheme } from '../ThemeContext';

interface HelpContentProps {
  // Props if any specific variations are needed, for now none.
}

// Helper components for consistent styling within the help content
const SectionTitle: React.FC<{ children: React.ReactNode; themeClasses: ReturnType<typeof useTheme>['theme']['classes'] }> = ({ children, themeClasses }) => (
  <h3 className={`text-lg font-semibold mt-4 mb-2 ${themeClasses.textSecondary}`}>{children}</h3>
);

const SubSectionTitle: React.FC<{ children: React.ReactNode; themeClasses: ReturnType<typeof useTheme>['theme']['classes'] }> = ({ children, themeClasses }) => (
  <h4 className={`text-md font-medium mt-3 mb-1.5 ${themeClasses.textPrimary}`}>{children}</h4>
);

const ListItem: React.FC<{ children: React.ReactNode; themeClasses: ReturnType<typeof useTheme>['theme']['classes'] }> = ({ children, themeClasses }) => (
  <li className={`mb-1 ml-4 list-disc ${themeClasses.textPrimary}`}>{children}</li>
);

const Paragraph: React.FC<{ children: React.ReactNode; themeClasses: ReturnType<typeof useTheme>['theme']['classes'] }> = ({ children, themeClasses }) => (
  <p className={`mb-2 text-sm ${themeClasses.textPrimary}`}>{children}</p>
);


export const HelpContent: React.FC<HelpContentProps> = () => {
  const { theme: currentActiveTheme } = useTheme();
  const themeClasses = currentActiveTheme.classes;

  return (
    <>
      {/* YouTube Video Embed */}
      <div className="relative w-full pb-[56.25%] mb-4 rounded-md overflow-hidden">
        <iframe 
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube-nocookie.com/embed/GBXpSr1TXgk?si=ZmsKy8mY06XqSMEw" 
          title="YouTube video player: Time Boxing Method Explanation" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen>
        </iframe>
      </div>

      <div className="flex-grow overflow-y-auto text-sm">
        <SectionTitle themeClasses={themeClasses}>What is "The Time Box Planner"?</SectionTitle>
        <Paragraph themeClasses={themeClasses}>
          The Time Box Planner is a web application designed to help you organize your day using the <strong>Time Boxing</strong> method.
          It allows you to list your priorities, dump your thoughts and tasks, and then allocate specific time slots for each activity in your daily schedule.
          AI-powered features can help refine your tasks for clarity and motivation.
        </Paragraph>

        <SectionTitle themeClasses={themeClasses}>Understanding the Time Box Method</SectionTitle>
        <SubSectionTitle themeClasses={themeClasses}>What is Time Boxing?</SubSectionTitle>
        <Paragraph themeClasses={themeClasses}>
          Time boxing is a time management strategy where you allocate a fixed time period, called a "time box," to each planned activity.
          Instead of working on a task until it's done, you dedicate a specific amount of time to it and then move on, regardless of whether it's complete.
          You can always schedule another time box for it later if needed.
        </Paragraph>
        <SubSectionTitle themeClasses={themeClasses}>How is it Helpful?</SubSectionTitle>
        <ul>
          <ListItem themeClasses={themeClasses}><strong>Improved Focus:</strong> Knowing you have a limited time encourages concentration.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Combats Procrastination:</strong> Starting is easier when you commit to a short, defined period.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Better Time Awareness:</strong> Helps you understand how long tasks actually take.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Realistic Planning:</strong> Encourages breaking down large tasks into manageable chunks.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Increased Productivity:</strong> Parkinson's Law suggests work expands to fill the time available; time boxing limits this.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Sense of Accomplishment:</strong> Completing time boxes provides a feeling of progress.</ListItem>
        </ul>

        <SectionTitle themeClasses={themeClasses}>How to Use the App</SectionTitle>
        
        <SubSectionTitle themeClasses={themeClasses}>1. Date Selection</SubSectionTitle>
        <Paragraph themeClasses={themeClasses}>
          Use the date picker at the top of the "Daily Schedule" section to select the day you are planning for.
          Your data for priorities, brain dump, and schedule is unique to the selected date (though this app currently stores data in browser local storage, effectively for the current session/browser profile rather than per date in a persistent backend).
        </Paragraph>

        <SubSectionTitle themeClasses={themeClasses}>2. Top Priorities</SubSectionTitle>
        <Paragraph themeClasses={themeClasses}>List your 3 most important tasks for the day.</Paragraph>
        <ul>
          <ListItem themeClasses={themeClasses}><strong>Adding/Editing:</strong> Click into an input field and type your priority.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Reordering:</strong> Click and drag the dotted handle on the left of a priority to change its order.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Clearing:</strong> Click the 'x' icon on the right to clear a priority slot.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Enter Key:</strong> Pressing 'Enter' in a priority input moves to the next priority field.</ListItem>
        </ul>

        <SubSectionTitle themeClasses={themeClasses}>3. Brain Dump (To-Do)</SubSectionTitle>
        <Paragraph themeClasses={themeClasses}>Use this section to list all your thoughts, ideas, and smaller tasks.</Paragraph>
        <ul>
          <ListItem themeClasses={themeClasses}><strong>Adding a Task:</strong> Type in the input field and press 'Enter' or click the '+' button.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Completing a Task:</strong> Click the checkbox next to a task. Completed tasks are struck through.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Editing a Task:</strong> Double-click the task text or click the pencil icon. An input field will appear. Press 'Enter' or click the checkmark icon to save, or 'Escape' to cancel (or blur to save).</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Deleting a Task:</strong> Click the trash can icon.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Promoting to Priority:</strong> Click the star icon. If there's space in Top Priorities, the task will be added. The star icon changes to filled. Click again to demote. The icon is disabled if Top Priorities is full or the task is complete.</ListItem>
        </ul>

        <SubSectionTitle themeClasses={themeClasses}>4. AI Magic 🪄</SubSectionTitle>
        <Paragraph themeClasses={themeClasses}>
          The "AI Magic" button (found above the Brain Dump list) uses an AI model (Gemini or OpenAI) to refine your tasks.
          It aims to make tasks clearer, add a relevant emoji, correct spelling, and maintain a positive tone without expanding the task.
        </Paragraph>
        <ul>
          <ListItem themeClasses={themeClasses}><strong>Enabling/Disabling:</strong> Toggle "Enable AI Features" in Settings. This also allows offline use if disabled.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>API Keys:</strong> AI features require API keys. Go to Settings &gt; API Key Management to enter your Gemini and/or OpenAI API keys. These are stored locally in your browser.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Selecting AI Service:</strong> In Settings &gt; AI Features, choose your "Preferred AI Service" (Gemini or OpenAI).</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Using AI Magic:</strong> The button is enabled if AI is on, the selected service's API key is set, and there's at least one uncompleted, un-enhanced task. Click it to process eligible tasks.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>One-Time Enhancement:</strong> AI Magic processes each task only once. To re-apply, delete and re-add the task.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Customizing AI Prompt:</strong> In Settings &gt; AI Features, click "Advanced: Customize AI Magic Prompt..." to open a gallery where you can edit, save, activate, and manage a history of prompts used for AI Magic.</ListItem>
        </ul>
        
        <SubSectionTitle themeClasses={themeClasses}>5. Daily Schedule</SubSectionTitle>
        <Paragraph themeClasses={themeClasses}>
          Allocate specific time slots for your tasks and activities throughout the day.
          The schedule is divided into hours, with columns for events starting at :00 and :30.
          Click into any cell to type your activity. The textareas auto-resize.
        </Paragraph>

        <SubSectionTitle themeClasses={themeClasses}>6. Settings (⚙️ Icon)</SubSectionTitle>
        <Paragraph themeClasses={themeClasses}>Click the cog icon to open settings:</Paragraph>
        <ul>
          <ListItem themeClasses={themeClasses}><strong>Select Theme:</strong> Choose from different color themes for the app.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Time Display Format:</strong> Switch between 12-hour (AM/PM) and 24-hour format for the schedule display.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Schedule Time Range:</strong> Set the start and end hours for your daily schedule view. Remember to click "Save Time Changes".</ListItem>
          <ListItem themeClasses={themeClasses}><strong>API Key Management:</strong> Enter and clear your Gemini and OpenAI API keys.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>AI Features Toggle:</strong> Enable or disable all AI-powered features.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Preferred AI Service:</strong> Select whether "AI Magic" uses Gemini or OpenAI.</ListItem>
          <ListItem themeClasses={themeClasses}><strong>Customize AI Magic Prompt:</strong> Opens a separate modal to manage the prompts sent to the AI for task refinement.</ListItem>
        </ul>
      </div>
    </>
  );
};