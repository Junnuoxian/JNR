import { useAppStore } from '../store';
import { Sparkles, Zap } from 'lucide-react';

export default function OnboardingView() {
  const setOnboarded = useAppStore(state => state.setOnboarded);

  return (
    <div className="min-h-screen bg-surface dark:bg-stone-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-rose-300/30 blur-3xl rounded-full mix-blend-multiply dark:mix-blend-overlay"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-300/30 blur-3xl rounded-full mix-blend-multiply dark:mix-blend-overlay"></div>

      <div className="text-center mb-12 z-10 animate-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl font-black mb-3 text-stone-800 dark:text-stone-100 tracking-tight">你好，欢迎使用</h1>
        <p className="text-stone-500 dark:text-stone-400">选择属于你的专属界面风格</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl z-10">
        
        {/* Minimal Style (Male default) */}
        <button 
          onClick={() => setOnboarded('minimal')}
          className="group relative flex flex-col items-center p-8 bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all active:scale-95 animate-in slide-in-from-bottom-8 duration-700 delay-100"
        >
          <div className="w-20 h-20 bg-zinc-900 dark:bg-zinc-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:-translate-y-2 transition-transform">
            <Zap className="w-10 h-10 text-zinc-100 dark:text-zinc-900" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">极简质感风</h2>
          <p className="text-sm text-zinc-500 font-medium">适合男生 · 简洁、高效、克制</p>
          
          {/* Mini preview */}
          <div className="mt-8 w-full bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 opacity-80 group-hover:opacity-100 transition-opacity">
             <div className="h-4 w-1/3 bg-zinc-200 dark:bg-zinc-700 rounded-full mb-3"></div>
             <div className="flex gap-2 items-end">
               <span className="text-4xl font-black text-zinc-900 dark:text-zinc-100">100</span>
               <span className="text-sm text-zinc-400 font-bold pb-1">Days</span>
             </div>
          </div>
        </button>

        {/* Cute Style (Female default) */}
        <button 
          onClick={() => setOnboarded('cute')}
          className="group relative flex flex-col items-center p-8 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-rose-950/40 dark:to-pink-900/40 rounded-[2.5rem] border-2 border-pink-100 dark:border-rose-900/50 shadow-md hover:shadow-2xl hover:shadow-pink-200/50 dark:hover:shadow-rose-900/20 transition-all active:scale-95 animate-in slide-in-from-bottom-8 duration-700 delay-200"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-pink-400 to-rose-300 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-pink-300/40 group-hover:-translate-y-2 transition-transform">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-pink-900 dark:text-pink-100 mb-2 tracking-tight">元气可爱风</h2>
          <p className="text-sm text-pink-500/80 dark:text-pink-300 font-medium">适合女生 · 圆润、马卡龙、灵动</p>

          {/* Mini preview */}
          <div className="mt-8 w-full bg-white/60 dark:bg-black/20 backdrop-blur-md rounded-[2rem] p-4 shadow-sm opacity-80 group-hover:opacity-100 transition-opacity border border-white/50 dark:border-white/5">
             <div className="flex justify-between items-center mb-2">
                <span className="text-2xl">🧸</span>
                <span className="text-xs bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 px-2 py-1 rounded-full font-bold">正数</span>
             </div>
             <div className="flex gap-1 items-baseline">
               <span className="text-4xl font-black text-rose-500 dark:text-rose-400 tracking-tighter">100</span>
               <span className="text-sm text-pink-400 font-bold">天</span>
             </div>
          </div>
        </button>

      </div>
    </div>
  );
}
