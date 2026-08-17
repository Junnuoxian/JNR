export type EventType = 'countdown' | 'anniversary' | 'annual';
export type UIStyle = 'minimal' | 'cute';

export interface CoupleEvent {
  id: string;
  name: string;
  date: string; // ISO date string
  type: EventType;
  icon: string; // Emoji icon for customization
  coverImage?: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'romantic';
  audioUrl?: string; // If recorded
  image?: string; // Base64 encoded image
}

export interface AppState {
  events: CoupleEvent[];
  diaries: DiaryEntry[];
  theme: 'light' | 'dark' | 'system';
  isOnboarded: boolean;
  uiStyle: UIStyle;
  backgroundImage: string | null;
  bgBlur: number;
  cardOpacity: number;
  isPinSet: boolean; // Mock for encrypted gallery
  pin: string | null;
  remindersEnabled: boolean;
  reminderTime: string;
  addEvent: (event: Omit<CoupleEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
  updateEvent: (id: string, event: Partial<CoupleEvent>) => void;
  addDiary: (diary: Omit<DiaryEntry, 'id'>) => void;
  deleteDiary: (id: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setPin: (pin: string) => void;
  setReminderSettings: (enabled: boolean, time: string) => void;
  setOnboarded: (style: UIStyle) => void;
  setUiStyle: (style: UIStyle) => void;
  setBackgroundImage: (bg: string | null) => void;
  setBgBlur: (blur: number) => void;
  setCardOpacity: (opacity: number) => void;
}
