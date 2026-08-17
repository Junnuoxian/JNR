import { useAppStore } from '../store';
import { Moon, Sun, Lock, Cloud, Info, Download, Paintbrush, Image as ImageIcon, Upload, Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import PinPad from './PinPad';

const PRESET_BGS = [
  { id: 'pink-clouds', url: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1080&auto=format&fit=crop', label: '粉色云彩' },
  { id: 'minimal-sea', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1080&auto=format&fit=crop', label: '极简海面' },
  { id: 'night-stars', url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1080&auto=format&fit=crop', label: '星空璀璨' },
];

export default function SettingsView() {
  const theme = useAppStore(state => state.theme);
  const setTheme = useAppStore(state => state.setTheme);
  const uiStyle = useAppStore(state => state.uiStyle);
  const setUiStyle = useAppStore(state => state.setUiStyle);
  const backgroundImage = useAppStore(state => state.backgroundImage);
  const setBackgroundImage = useAppStore(state => state.setBackgroundImage);

  const [showPinSetup, setShowPinSetup] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [firstPin, setFirstPin] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  const handleExportPDF = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    window.print();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (navigator.vibrate) navigator.vibrate(50);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const blockClasses = uiStyle === 'cute'
    ? 'bg-white/80 dark:bg-[#2A1D20]/80 rounded-[2rem] overflow-hidden shadow-sm border-[3px] border-white/60 dark:border-white/5 font-medium'
    : 'bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 font-medium';

  const headerClasses = uiStyle === 'cute'
    ? 'text-sm font-black text-pink-400 dark:text-pink-600 tracking-wider mb-3 px-2'
    : 'text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3 px-2';

  return (
    <div className="pb-32">
      <div className={`pt-12 pb-4 px-6 sticky top-0 z-10 backdrop-blur-xl ${
        uiStyle === 'cute' ? 'bg-[#FFF5F7]/80 dark:bg-[#1A1214]/80' : 'bg-zinc-50/90 dark:bg-zinc-950/90'
      } flex justify-between items-center`}>
        <h1 className={`text-3xl font-black tracking-tight ${uiStyle === 'cute' ? 'text-rose-900 dark:text-rose-100' : 'text-zinc-900 dark:text-zinc-100'}`}>
          我的空间
        </h1>
      </div>

      <div className="px-6 space-y-8 mt-4">
        
        {/* Cloud Sync Status */}
        <section>
          <h2 className={headerClasses}>数据同步与账号</h2>
          <div className={`${blockClasses} p-5`}>
            {useAppStore(state => state.user) ? (
              <div className="flex items-center gap-4">
                <img src={useAppStore(state => state.user)?.headimgurl} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{useAppStore(state => state.user)?.nickname}</h3>
                  <p className={`text-xs mt-1 ${uiStyle === 'cute' ? 'text-pink-500' : 'text-zinc-500'}`}>已绑定微信</p>
                </div>
                <button 
                  onClick={() => useAppStore.getState().setUser(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${uiStyle === 'cute' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}
                >
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${uiStyle === 'cute' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'}`}>
                  <svg viewBox="0 0 1024 1024" className="w-8 h-8 fill-current" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M682.666667 362.666667a213.333333 213.333333 0 0 1 213.333333 213.333333c0 108.8-81.066667 198.4-187.733333 213.333333l19.2 59.733334-72.533334-42.666667a228.266667 228.266667 0 0 1-89.6 19.2c-117.333333 0-213.333333-89.6-213.333333-196.266667 0-113.066667 96-209.066667 213.333333-209.066667M394.666667 192a277.333333 277.333333 0 0 1 277.333333 277.333333c0 9.6-1.066667 19.2-2.133333 27.733334-20.266667-8.533333-42.666667-12.8-65.066667-12.8-129.066667 0-234.666667 99.2-234.666667 221.866666 0 33.066667 8.533333 65.066667 23.466667 92.8-8.533333 1.066667-18.133333 1.066667-27.733334 1.066667a296.533333 296.533333 0 0 1-118.4-25.6l-97.066666 56.533333 26.666666-80A266.666667 266.666667 0 0 1 117.333333 469.333333c0-149.333333 123.733333-277.333333 277.333334-277.333333M736 501.333333a32 32 0 1 0 0 64 32 32 0 0 0 0-64M629.333333 501.333333a32 32 0 1 0 0 64 32 32 0 0 0 0-64M458.666667 362.666667a42.666667 42.666667 0 1 0 0 85.333333 42.666667 42.666667 0 0 0 0-85.333333M330.666667 362.666667a42.666667 42.666667 0 1 0 0 85.333333 42.666667 42.666667 0 0 0 0-85.333333"/></svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">微信登录</h3>
                  <p className={`text-sm mt-1 ${uiStyle === 'cute' ? 'text-stone-500' : 'text-zinc-500'}`}>绑定后开启云端备份与同步</p>
                </div>
                <button 
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/wechat/login-url');
                      const data = await res.json();
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        alert(data.error || '获取登录链接失败');
                      }
                    } catch (e) {
                      alert('网络错误，请稍后重试');
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-transform active:scale-95 ${
                    uiStyle === 'cute' ? 'bg-[#07C160] text-white hover:bg-[#06ad56]' : 'bg-[#07C160] text-white hover:bg-[#06ad56]'
                  }`}
                >
                  去登录
                </button>
              </div>
            )}
          </div>
          <p className={`flex items-center gap-2 mt-3 px-2 text-xs font-medium ${uiStyle === 'cute' ? 'text-stone-400' : 'text-zinc-400'}`}>
            <Info className="w-4 h-4" /> 
            需在后端配置 WECHAT_APP_ID 和 APP_SECRET 后生效。
          </p>
        </section>

        {/* Reminders */}
        <section>
          <h2 className={headerClasses}>提醒设置</h2>
          <div className={blockClasses}>
            <div className={`w-full flex items-center justify-between p-5 transition-colors ${uiStyle === 'cute' ? 'border-b border-pink-50 dark:border-stone-800' : 'border-b border-zinc-100 dark:border-zinc-800'}`}>
              <div className="flex items-center gap-3">
                <Bell className={`w-5 h-5 ${uiStyle === 'cute' ? 'text-pink-500' : 'text-zinc-500'}`} />
                <span className="font-bold">开启纪念日提醒</span>
              </div>
              <button 
                onClick={() => {
                  const enabled = !useAppStore.getState().remindersEnabled;
                  useAppStore.getState().setReminderSettings(enabled, useAppStore.getState().reminderTime);
                  if (enabled && 'Notification' in window && Notification.permission !== 'granted') {
                    Notification.requestPermission();
                  }
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  useAppStore(state => state.remindersEnabled) 
                    ? (uiStyle === 'cute' ? 'bg-pink-400' : 'bg-zinc-900 dark:bg-zinc-100') 
                    : 'bg-stone-300 dark:bg-stone-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useAppStore(state => state.remindersEnabled) ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className={`w-full flex items-center justify-between p-5 ${!useAppStore(state => state.remindersEnabled) ? 'opacity-50 pointer-events-none' : ''}`}>
              <span className="font-bold">提醒时间</span>
              <input 
                type="time" 
                value={useAppStore(state => state.reminderTime)}
                onChange={(e) => useAppStore.getState().setReminderSettings(useAppStore.getState().remindersEnabled, e.target.value)}
                className={`px-3 py-1.5 rounded-lg font-bold outline-none ${uiStyle === 'cute' ? 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-100' : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'}`}
              />
            </div>
          </div>
        </section>

        {/* Style Switch */}
        <section>
          <h2 className={headerClasses}>界面风格</h2>
          <div className={blockClasses}>
             <button 
              onClick={() => setUiStyle('minimal')}
              className={`w-full flex items-center justify-between p-5 transition-colors ${uiStyle === 'cute' ? 'border-b border-pink-50 dark:border-stone-800 hover:bg-pink-50/50' : 'border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              <div className="flex items-center gap-3">
                <Paintbrush className="w-5 h-5 opacity-70" />
                <span className="font-bold">极简质感风 (男生推荐)</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${uiStyle === 'minimal' ? (uiStyle === 'cute' ? 'border-pink-400' : 'border-zinc-900 dark:border-zinc-100') : 'border-stone-300 dark:border-stone-700'}`}>
                {uiStyle === 'minimal' && <div className={`w-3 h-3 rounded-full ${uiStyle === 'cute' ? 'bg-pink-400' : 'bg-zinc-900 dark:bg-zinc-100'}`} />}
              </div>
            </button>
            <button 
              onClick={() => setUiStyle('cute')}
              className={`w-full flex items-center justify-between p-5 transition-colors ${uiStyle === 'cute' ? 'hover:bg-pink-50/50' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              <div className="flex items-center gap-3">
                <Paintbrush className="w-5 h-5 opacity-70" />
                <span className="font-bold">元气可爱风 (女生推荐)</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${uiStyle === 'cute' ? (uiStyle === 'cute' ? 'border-pink-400' : 'border-zinc-900 dark:border-zinc-100') : 'border-stone-300 dark:border-stone-700'}`}>
                {uiStyle === 'cute' && <div className={`w-3 h-3 rounded-full ${uiStyle === 'cute' ? 'bg-pink-400' : 'bg-zinc-900 dark:bg-zinc-100'}`} />}
              </div>
            </button>
          </div>
        </section>

        {/* Custom Background */}
        <section>
          <div className="flex justify-between items-end mb-3 px-2">
            <h2 className={headerClasses.replace('mb-3 px-2', '')}>个性化背景</h2>
            {backgroundImage && (
              <button 
                onClick={() => setBackgroundImage(null)}
                className={`text-xs font-bold transition-opacity hover:opacity-70 ${uiStyle === 'cute' ? 'text-pink-500' : 'text-zinc-500'}`}
              >
                清除背景
              </button>
            )}
          </div>
          
          <div className={`${blockClasses} p-4`}>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
              {/* Custom Upload Button */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`snap-start flex-shrink-0 w-24 h-32 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${
                  uiStyle === 'cute' 
                    ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-500 border-2 border-dashed border-pink-200 dark:border-pink-900/50 hover:bg-pink-100' 
                    : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <Upload className="w-6 h-6" />
                <span className="text-xs font-bold">上传照片</span>
              </button>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
              />

              {/* Presets */}
              {PRESET_BGS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(20);
                    setBackgroundImage(bg.url);
                  }}
                  className={`snap-start flex-shrink-0 w-24 h-32 rounded-2xl bg-cover bg-center relative transition-all active:scale-95 overflow-hidden ${
                    backgroundImage === bg.url 
                      ? (uiStyle === 'cute' ? 'ring-4 ring-pink-400 ring-offset-2 ring-offset-white dark:ring-offset-[#2A1D20]' : 'ring-4 ring-zinc-900 dark:ring-zinc-100 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900') 
                      : 'hover:opacity-80'
                  }`}
                  style={{ backgroundImage: `url(${bg.url})` }}
                >
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <span className="text-[10px] text-white font-bold block truncate">{bg.label}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Visual Adjustments */}
            {backgroundImage && (
              <div className={`mt-4 pt-4 border-t ${uiStyle === 'cute' ? 'border-pink-100 dark:border-pink-900/30' : 'border-zinc-200 dark:border-zinc-800'}`}>
                <div className="space-y-4">
                  {/* Blur Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm font-bold ${uiStyle === 'cute' ? 'text-pink-900 dark:text-pink-100' : 'text-zinc-900 dark:text-zinc-100'}`}>背景图片清晰度</span>
                      <span className={`text-xs font-bold ${uiStyle === 'cute' ? 'text-pink-400' : 'text-zinc-500'}`}>{useAppStore(state => state.bgBlur) === 0 ? '完全清晰' : '模糊'}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="20" 
                      value={20 - useAppStore(state => state.bgBlur)} 
                      onChange={(e) => useAppStore.getState().setBgBlur(20 - Number(e.target.value))}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${uiStyle === 'cute' ? 'bg-pink-100 dark:bg-pink-900/50 accent-pink-500' : 'bg-zinc-200 dark:bg-zinc-800 accent-zinc-900 dark:accent-zinc-100'}`}
                    />
                    <div className="flex justify-between text-[10px] mt-1 opacity-50 font-bold">
                      <span>模糊全貌</span>
                      <span>清晰原图</span>
                    </div>
                  </div>

                  {/* Card Opacity Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm font-bold ${uiStyle === 'cute' ? 'text-pink-900 dark:text-pink-100' : 'text-zinc-900 dark:text-zinc-100'}`}>卡片清晰度 (不透明度)</span>
                      <span className={`text-xs font-bold ${uiStyle === 'cute' ? 'text-pink-400' : 'text-zinc-500'}`}>{useAppStore(state => state.cardOpacity)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={useAppStore(state => state.cardOpacity)} 
                      onChange={(e) => useAppStore.getState().setCardOpacity(Number(e.target.value))}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${uiStyle === 'cute' ? 'bg-pink-100 dark:bg-pink-900/50 accent-pink-500' : 'bg-zinc-200 dark:bg-zinc-800 accent-zinc-900 dark:accent-zinc-100'}`}
                    />
                    <div className="flex justify-between text-[10px] mt-1 opacity-50 font-bold">
                      <span>晶莹剔透</span>
                      <span>清晰纯色</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Privacy & Security */}
        <section>
          <h2 className={headerClasses}>隐私与安全 (企业级功能演示)</h2>
          <div className={blockClasses}>
            <button 
              onClick={() => {
                const isPinSet = useAppStore.getState().isPinSet;
                if (isPinSet) {
                  useAppStore.getState().setPin('');
                  useAppStore.setState({ isPinSet: false });
                  alert('应用锁已关闭');
                } else {
                  setShowPinSetup(true);
                }
              }}
              className={`w-full flex items-center justify-between p-5 transition-colors ${uiStyle === 'cute' ? 'border-b border-pink-50 dark:border-stone-800 hover:bg-pink-50/50' : 'border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              <div className="flex items-center gap-3">
                <Lock className={`w-5 h-5 ${uiStyle === 'cute' ? 'text-pink-500' : 'text-zinc-500'}`} />
                <div className="text-left">
                  <span className="font-bold block">本地应用锁</span>
                  <span className="text-xs opacity-60">每次打开需验证密码</span>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${useAppStore(state => state.isPinSet) ? (uiStyle === 'cute' ? 'bg-pink-400' : 'bg-zinc-900 dark:bg-zinc-100') : 'bg-stone-200 dark:bg-stone-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${useAppStore(state => state.isPinSet) ? 'translate-x-6' : ''}`} />
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-5 opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <Cloud className={`w-5 h-5 ${uiStyle === 'cute' ? 'text-emerald-500' : 'text-zinc-500'}`} />
                <div className="text-left">
                  <span className="font-bold block">端到端加密同步</span>
                  <span className="text-xs opacity-60">云端备份，密钥本地保管</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded">PRO</span>
            </button>
          </div>
        </section>

        {/* Data Export */}
        <section>
          <h2 className={headerClasses}>数据管理</h2>
          <div className={blockClasses}>
             <button 
              onClick={handleExportPDF}
              className={`w-full flex items-center justify-between p-5 transition-colors ${uiStyle === 'cute' ? 'border-b border-pink-50 dark:border-stone-800 hover:bg-pink-50/50' : 'border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 opacity-70" />
                <span className="font-bold">导出年度回忆录 (PDF)</span>
              </div>
            </button>
          </div>
        </section>

        {/* Theme Settings */}
        <section>
          <h2 className={headerClasses}>明暗模式</h2>
          <div className={blockClasses}>
            <button 
              onClick={() => setTheme('light')}
              className={`w-full flex items-center justify-between p-5 transition-colors ${uiStyle === 'cute' ? 'border-b border-pink-50 dark:border-stone-800 hover:bg-pink-50/50' : 'border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 opacity-70" />
                <span className="font-bold">浅色模式</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${theme === 'light' ? (uiStyle === 'cute' ? 'border-pink-400' : 'border-zinc-900 dark:border-zinc-100') : 'border-stone-300 dark:border-stone-700'}`}>
                {theme === 'light' && <div className={`w-3 h-3 rounded-full ${uiStyle === 'cute' ? 'bg-pink-400' : 'bg-zinc-900 dark:bg-zinc-100'}`} />}
              </div>
            </button>
            
            <button 
              onClick={() => setTheme('dark')}
              className={`w-full flex items-center justify-between p-5 transition-colors ${uiStyle === 'cute' ? 'border-b border-pink-50 dark:border-stone-800 hover:bg-pink-50/50' : 'border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 opacity-70" />
                <span className="font-bold">深色模式</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${theme === 'dark' ? (uiStyle === 'cute' ? 'border-pink-400' : 'border-zinc-900 dark:border-zinc-100') : 'border-stone-300 dark:border-stone-700'}`}>
                {theme === 'dark' && <div className={`w-3 h-3 rounded-full ${uiStyle === 'cute' ? 'bg-pink-400' : 'bg-zinc-900 dark:bg-zinc-100'}`} />}
              </div>
            </button>

            <button 
              onClick={() => setTheme('system')}
              className={`w-full flex items-center justify-between p-5 transition-colors ${uiStyle === 'cute' ? 'hover:bg-pink-50/50' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center opacity-70">
                   <span className="font-black text-xs">A</span>
                </div>
                <span className="font-bold">跟随系统</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${theme === 'system' ? (uiStyle === 'cute' ? 'border-pink-400' : 'border-zinc-900 dark:border-zinc-100') : 'border-stone-300 dark:border-stone-700'}`}>
                {theme === 'system' && <div className={`w-3 h-3 rounded-full ${uiStyle === 'cute' ? 'bg-pink-400' : 'bg-zinc-900 dark:bg-zinc-100'}`} />}
              </div>
            </button>
          </div>
        </section>

      </div>

      {showPinSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-950 p-4">
          <div className="w-full relative">
            <button 
              onClick={() => {
                setShowPinSetup(false); 
                setSetupStep(1); 
                setFirstPin('');
              }} 
              className="absolute -top-12 left-4 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <PinPad
              key={setupStep} // reset input when step changes
              showBiometrics={false}
              title={setupStep === 1 ? "设置4位数字密码" : "再次确认密码"}
              onComplete={(pin) => {
                if (setupStep === 1) {
                  setFirstPin(pin);
                  setSetupStep(2);
                } else {
                  if (pin === firstPin) {
                    useAppStore.getState().setPin(pin);
                    setShowPinSetup(false);
                    setSetupStep(1);
                    setFirstPin('');
                  } else {
                    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
                    setSetupStep(1);
                    setFirstPin('');
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
