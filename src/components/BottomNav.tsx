import { Home, BookHeart, Settings } from 'lucide-react';
import { useAppStore } from '../store';

interface BottomNavProps {
  currentTab: string;
  onChange: (tab: string) => void;
}

export default function BottomNav({ currentTab, onChange }: BottomNavProps) {
  const uiStyle = useAppStore(state => state.uiStyle);

  const tabs = [
    { id: 'home', label: '倒数', icon: Home },
    { id: 'diary', label: '日记', icon: BookHeart },
    { id: 'settings', label: '我的', icon: Settings },
  ];

  const containerClasses = uiStyle === 'cute'
    ? 'fixed bottom-4 left-4 right-4 h-16 bg-white/90 dark:bg-[#2A1D20]/90 backdrop-blur-xl border border-white/50 dark:border-white/5 rounded-full flex justify-around items-center px-4 z-40 shadow-xl shadow-pink-100/50 dark:shadow-black/50'
    : 'fixed bottom-0 left-0 right-0 h-20 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 flex justify-around items-center px-6 z-40';

  return (
    <div className={containerClasses}>
      {tabs.map(tab => {
        const active = currentTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(50);
              onChange(tab.id);
            }}
            className={`flex flex-col items-center justify-center min-w-[64px] transition-all ${active ? 'scale-110' : 'scale-100 opacity-70 hover:opacity-100'}`}
          >
            <div className={`
              ${uiStyle === 'cute' 
                ? (active ? 'text-pink-500 dark:text-pink-400 drop-shadow-md' : 'text-stone-400')
                : (active ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500')
              }
            `}>
              <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 2} />
            </div>
            {uiStyle === 'minimal' && (
              <span className={`text-[10px] font-bold transition-colors mt-1 ${active ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}>
                {tab.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
