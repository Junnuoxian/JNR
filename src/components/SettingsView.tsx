import { useAppStore } from '../store';
import { Moon, Sun, Lock, Cloud, Info, Download, Paintbrush, Image as ImageIcon, Upload } from 'lucide-react';
import { useEffect, useRef } from 'react';

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
          <h2 className={headerClasses}>数据同步</h2>
          <div className={`${blockClasses} p-5 flex items-center gap-4`}>
            <div className={`p-4 rounded-2xl ${uiStyle === 'cute' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'}`}>
              <Cloud className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">云端备份未开启</h3>
              <p className={`text-sm mt-1 ${uiStyle === 'cute' ? 'text-stone-500' : 'text-zinc-500'}`}>开启多设备实时同步功能。</p>
            </div>
          </div>
          <p className={`flex items-center gap-2 mt-3 px-2 text-xs font-medium ${uiStyle === 'cute' ? 'text-stone-400' : 'text-zinc-400'}`}>
            <Info className="w-4 h-4" /> 
            如需开启，请在演示后请求管理员配置 Firebase。
          </p>
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
                  const p = window.prompt('设置4位数字密码:');
                  if (p && p.length === 4 && /^\d+$/.test(p)) {
                    useAppStore.getState().setPin(p);
                    alert('密码设置成功！下次进入应用将要求输入密码。');
                  } else if (p) {
                    alert('密码必须是4位纯数字');
                  }
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
            <div className="relative overflow-hidden group">
              <button 
                onClick={(e) => {
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
                className={`w-full flex items-center justify-between p-5 transition-colors ${uiStyle === 'cute' ? 'text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-900/10' : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'}`}
              >
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  <div className="text-left">
                    <span className="font-bold block">恢复出厂设置</span>
                    <span className="text-xs opacity-60">清空所有本地数据</span>
                  </div>
                </div>
              </button>
              
              <div className="hidden absolute inset-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm z-10 flex flex-col justify-center items-center p-4 animate-in fade-in">
                <span className="text-sm font-bold text-red-500 mb-3 text-center">将清除所有纪念日、日记与密码，确定吗？</span>
                <div className="flex gap-3 w-full max-w-[200px]">
                  <button 
                    onClick={(e) => e.currentTarget.parentElement?.parentElement?.classList.add('hidden')} 
                    className="flex-1 py-2 rounded-xl text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('love-days-storage');
                      window.location.reload();
                    }}
                    className="flex-1 py-2 rounded-xl text-sm font-bold bg-red-500 text-white"
                  >
                    确定清除
                  </button>
                </div>
              </div>
            </div>
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
    </div>
  );
}
