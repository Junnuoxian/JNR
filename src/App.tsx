import { useState, useEffect } from 'react';
import HomeView from './components/HomeView';
import DiaryView from './components/DiaryView';
import SettingsView from './components/SettingsView';
import BottomNav from './components/BottomNav';
import OnboardingView from './components/OnboardingView';
import PinPad from './components/PinPad';
import Decorations from './components/Decorations';
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
  
  const bgBlur = useAppStore(state => state.bgBlur);
  const cardOpacity = useAppStore(state => state.cardOpacity);

  const [pinError, setPinError] = useState(0);
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });

  // Handle WeChat OAuth Callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wechatUser = params.get('wechat_user');
    const wechatError = params.get('error');

    if (wechatUser) {
      try {
        const user = JSON.parse(decodeURIComponent(wechatUser));
        useAppStore.getState().setUser(user);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error('Failed to parse wechat user', e);
      }
    } else if (wechatError) {
      alert(`微信登录失败: ${wechatError}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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

  // Reminder logic
  useEffect(() => {
    const checkReminder = () => {
      const state = useAppStore.getState();
      if (!state.remindersEnabled || !state.reminderTime) return;

      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      if (currentTimeStr === state.reminderTime && now.getSeconds() === 0) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('碎碎念日记', {
            body: '今天是特别的一天吗？来看看你们的纪念日和日记吧！',
            icon: '/vite.svg'
          });
        }
      }
    };

    const interval = setInterval(checkReminder, 1000);
    return () => clearInterval(interval);
  }, []);

  // Parallax effect using DeviceOrientation API
  useEffect(() => {
    if (!window.DeviceOrientationEvent) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let gamma = event.gamma || 0; // left/right
      let beta = event.beta || 0;   // front/back

      // constrain and dampen
      const maxTilt = 25;
      const panAmount = 20;

      gamma = Math.max(-maxTilt, Math.min(maxTilt, gamma));
      beta = Math.max(-maxTilt, Math.min(maxTilt, beta));

      // smooth calculation
      const x = (gamma / maxTilt) * panAmount;
      const y = (beta / maxTilt) * panAmount;

      setBgOffset({ x, y });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  if (!isOnboarded) {
    return <OnboardingView />;
  }

  if (isPinSet && !unlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors ${pinError > 0 ? 'bg-red-100 text-red-500' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-500'}`}>
          <Lock className="w-8 h-8" />
        </div>
        <PinPad 
          key={pinError} // remounts PinPad on error to clear input
          showBiometrics={true}
          title={pinError > 0 ? "密码错误，请重试" : "请输入隐私密码"}
          onComplete={(entered) => {
            if (entered === correctPin) {
              setUnlocked(true);
              setPinError(0);
            } else {
              if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
              setPinError(prev => prev + 1);
            }
          }} 
        />
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
      <style>{`
        :root {
          --card-opacity: ${cardOpacity / 100};
        }
        .glass-card {
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
        }
        .style-cute .glass-card {
          background-color: rgba(255, 255, 255, var(--card-opacity)) !important;
        }
        .dark .style-cute .glass-card {
          background-color: rgba(42, 29, 32, var(--card-opacity)) !important;
        }
        .style-minimal .glass-card {
          background-color: rgba(255, 255, 255, var(--card-opacity)) !important;
        }
        .dark .style-minimal .glass-card {
          background-color: rgba(24, 24, 27, var(--card-opacity)) !important;
        }
      `}</style>
      
      {backgroundImage && (
        <div 
          className="fixed inset-[-30px] z-[-1] bg-cover bg-center transition-transform duration-75 ease-out"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            transform: `translate3d(${bgOffset.x}px, ${bgOffset.y}px, 0) scale(1.05)`
          }}
        >
          {/* Translucent overlay to ensure text readability while seeing the background */}
          <div className={`absolute inset-0 transition-colors duration-300 ${
            uiStyle === 'cute' ? 'bg-[#FFF5F7] dark:bg-[#1A1214]' : 'bg-zinc-50 dark:bg-zinc-950'
          }`} style={{
            backdropFilter: `blur(${bgBlur}px)`,
            WebkitBackdropFilter: `blur(${bgBlur}px)`,
            opacity: cardOpacity / 100
          }} />
        </div>
      )}

      <Decorations />

      <main className="max-w-3xl mx-auto h-full relative z-10">
        {currentTab === 'home' && <HomeView />}
        {currentTab === 'diary' && <DiaryView />}
        {currentTab === 'settings' && <SettingsView />}
      </main>
      
      <BottomNav currentTab={currentTab} onChange={setCurrentTab} />
    </div>
  );
}
