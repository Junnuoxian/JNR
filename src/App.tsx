import { useState, useEffect } from 'react';
import HomeView from './components/HomeView';
import DiaryView from './components/DiaryView';
import SettingsView from './components/SettingsView';
import BottomNav from './components/BottomNav';
import OnboardingView from './components/OnboardingView';
import { useAppStore } from './store';
import { Lock } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [unlocked, setUnlocked] = useState(false);
  const theme = useAppStore(state => state.theme);
  const isOnboarded = useAppStore(state => state.isOnboarded);
  const uiStyle = useAppStore(state => state.uiStyle);
  const backgroundImage = useAppStore(state => state.backgroundImage);
  const isPinSet = useAppStore(state => state.isPinSet);
  const correctPin = useAppStore(state => state.pin);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  if (!isOnboarded) {
    return <OnboardingView />;
  }

  if (isPinSet && !unlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
        <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">请输入隐私密码</h2>
        <div className="flex gap-2">
          {[1,2,3,4].map(i => (
            <input 
              key={i} 
              type="password" 
              maxLength={1}
              className="w-12 h-14 text-center text-2xl font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-pink-400 outline-none"
              onChange={(e) => {
                const val = e.target.value;
                if (val && i < 4) {
                  (e.target.nextSibling as HTMLInputElement)?.focus();
                }
                if (i === 4) {
                  // Extremely basic check for demo
                  const inputs = Array.from(e.target.parentElement!.querySelectorAll('input'));
                  const entered = inputs.map(inp => inp.value).join('');
                  if (entered === correctPin) {
                    setUnlocked(true);
                  } else if (entered.length === 4) {
                    inputs.forEach(inp => inp.value = '');
                    inputs[0].focus();
                    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
                  }
                }
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Define global wrapper classes based on selected style
  const styleWrapperClass = uiStyle === 'cute' ? 'style-cute' : 'style-minimal';

  const bgClasses = backgroundImage
    ? 'bg-transparent'
    : (uiStyle === 'cute' ? 'bg-[#FFF5F7] dark:bg-[#1A1214]' : 'bg-zinc-50 dark:bg-zinc-950');

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans relative z-0 ${styleWrapperClass} ${bgClasses}`}>
      
      {backgroundImage && (
        <div 
          className="fixed inset-0 z-[-1] bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          {/* Translucent overlay to ensure text readability while seeing the background */}
          <div className={`absolute inset-0 backdrop-blur-[3px] transition-colors duration-300 ${
            uiStyle === 'cute' ? 'bg-[#FFF5F7]/50 dark:bg-[#1A1214]/60' : 'bg-zinc-50/60 dark:bg-zinc-950/80'
          }`} />
        </div>
      )}

      <main className="max-w-3xl mx-auto h-full relative">
        {currentTab === 'home' && <HomeView />}
        {currentTab === 'diary' && <DiaryView />}
        {currentTab === 'settings' && <SettingsView />}
      </main>
      
      <BottomNav currentTab={currentTab} onChange={setCurrentTab} />
    </div>
  );
}
