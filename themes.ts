export interface ThemeClassNames {
  bgPrimary: string;
  bgSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentColor: string; // e.g., 'indigo-500'
  accentColorContrast: string; // e.g., 'indigo-700' for text on accent bg or darker accents
  borderColor: string;
  inputFocusRingColor: string; // e.g. 'indigo-500'
  scheduleHeaderBg: string;
  scheduleCellBorder: string;
  brainDumpDotCssColor: string; // Actual CSS color value, e.g., '#e2e8f0'
  buttonBg: string;
  buttonText: string;
  buttonHoverBg: string;
  settingsIconColor: string;
}

export interface Theme {
  name: string;
  classes: ThemeClassNames;
}

export const THEMES: Theme[] = [
  {
    name: 'Default',
    classes: {
      bgPrimary: 'bg-slate-100',
      bgSecondary: 'bg-white',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-500',
      accentColor: 'indigo-500',
      accentColorContrast: 'indigo-700',
      borderColor: 'border-gray-300',
      inputFocusRingColor: 'ring-indigo-500',
      scheduleHeaderBg: 'bg-gray-50',
      scheduleCellBorder: 'border-gray-200',
      brainDumpDotCssColor: '#e2e8f0', // slate-200
      buttonBg: 'bg-indigo-600',
      buttonText: 'text-white',
      buttonHoverBg: 'hover:bg-indigo-700',
      settingsIconColor: 'text-gray-600 hover:text-indigo-600',
    },
  },
  {
    name: 'Forest',
    classes: {
      bgPrimary: 'bg-emerald-50',
      bgSecondary: 'bg-white',
      textPrimary: 'text-green-900',
      textSecondary: 'text-green-800',
      textMuted: 'text-green-600',
      accentColor: 'green-600',
      accentColorContrast: 'green-800',
      borderColor: 'border-green-300',
      inputFocusRingColor: 'ring-green-500',
      scheduleHeaderBg: 'bg-green-100',
      scheduleCellBorder: 'border-green-200',
      brainDumpDotCssColor: '#a7f3d0', // emerald-200
      buttonBg: 'bg-green-600',
      buttonText: 'text-white',
      buttonHoverBg: 'hover:bg-green-700',
      settingsIconColor: 'text-green-700 hover:text-green-900',
    },
  },
  {
    name: 'Ocean',
    classes: {
      bgPrimary: 'bg-sky-50',
      bgSecondary: 'bg-white',
      textPrimary: 'text-blue-900',
      textSecondary: 'text-blue-800',
      textMuted: 'text-blue-600',
      accentColor: 'sky-500',
      accentColorContrast: 'sky-700',
      borderColor: 'border-sky-300',
      inputFocusRingColor: 'ring-sky-500',
      scheduleHeaderBg: 'bg-sky-100',
      scheduleCellBorder: 'border-sky-200',
      brainDumpDotCssColor: '#bae6fd', // sky-200
      buttonBg: 'bg-sky-600',
      buttonText: 'text-white',
      buttonHoverBg: 'hover:bg-sky-700',
      settingsIconColor: 'text-sky-700 hover:text-sky-900',
    },
  },
  {
    name: 'Sunset',
    classes: {
      bgPrimary: 'bg-rose-50',
      bgSecondary: 'bg-white',
      textPrimary: 'text-red-900',
      textSecondary: 'text-red-800',
      textMuted: 'text-orange-600',
      accentColor: 'rose-500',
      accentColorContrast: 'rose-700',
      borderColor: 'border-rose-300',
      inputFocusRingColor: 'ring-rose-500',
      scheduleHeaderBg: 'bg-rose-100',
      scheduleCellBorder: 'border-rose-200',
      brainDumpDotCssColor: '#fecdd3', // rose-200
      buttonBg: 'bg-rose-600',
      buttonText: 'text-white',
      buttonHoverBg: 'hover:bg-rose-700',
      settingsIconColor: 'text-rose-700 hover:text-rose-900',
    },
  },
  {
    name: 'Monochrome',
    classes: {
      bgPrimary: 'bg-gray-200',
      bgSecondary: 'bg-white',
      textPrimary: 'text-black',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-500',
      accentColor: 'gray-600',
      accentColorContrast: 'black',
      borderColor: 'border-gray-400',
      inputFocusRingColor: 'ring-gray-500',
      scheduleHeaderBg: 'bg-gray-100',
      scheduleCellBorder: 'border-gray-300',
      brainDumpDotCssColor: '#d1d5db', // gray-300
      buttonBg: 'bg-gray-700',
      buttonText: 'text-white',
      buttonHoverBg: 'hover:bg-gray-800',
      settingsIconColor: 'text-gray-700 hover:text-black',
    },
  },
];

export const DEFAULT_THEME_NAME = 'Default';

export const getThemeByName = (name: string): Theme => {
  return THEMES.find(theme => theme.name === name) || THEMES.find(theme => theme.name === DEFAULT_THEME_NAME)!;
};