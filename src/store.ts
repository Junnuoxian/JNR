import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, CoupleEvent, DiaryEntry } from './types';
import { v4 as uuidv4 } from 'uuid'; // need to add uuid or use crypto.randomUUID

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      events: [
        {
          id: '1',
          name: '相恋纪念日',
          date: new Date('2023-05-20T00:00:00Z').toISOString(),
          type: 'anniversary',
          icon: '💕'
        },
        {
          id: '2',
          name: '下次旅行',
          date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString(),
          type: 'countdown',
          icon: '✈️'
        }
      ],
      diaries: [],
      user: null,
      theme: 'system',
      isOnboarded: false,
      uiStyle: 'minimal',
      backgroundImage: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1080&auto=format&fit=crop',
      bgBlur: 10,
      cardOpacity: 80,
      isPinSet: false,
      pin: null,
      remindersEnabled: false,
      reminderTime: '10:00',
      addEvent: (event) => set((state) => ({ events: [...state.events, { ...event, id: crypto.randomUUID() }] })),
      deleteEvent: (id) => set((state) => ({ events: state.events.filter(e => e.id !== id) })),
      updateEvent: (id, updatedEvent) => set((state) => ({ 
        events: state.events.map((e) => e.id === id ? { ...e, ...updatedEvent } : e) 
      })),
      addDiary: (diary) => set((state) => ({ diaries: [...state.diaries, { ...diary, id: crypto.randomUUID() }] })),
      deleteDiary: (id) => set((state) => ({ diaries: state.diaries.filter(d => d.id !== id) })),
      setUser: (user) => set({ user }),
      setTheme: (theme) => set({ theme }),
      setPin: (pin) => set({ isPinSet: true, pin }),
      setReminderSettings: (enabled, time) => set({ remindersEnabled: enabled, reminderTime: time }),
      setOnboarded: (style) => set({ isOnboarded: true, uiStyle: style }),
      setUiStyle: (style) => set({ uiStyle: style }),
      setBackgroundImage: (bg) => set({ backgroundImage: bg }),
      setBgBlur: (blur) => set({ bgBlur: blur }),
      setCardOpacity: (opacity) => set({ cardOpacity: opacity }),
    }),
    {
      name: 'love-days-storage',
    }
  )
);
