import { useState, useRef } from 'react';
import { useAppStore } from '../store';
import { DiaryEntry } from '../types';
import { Mic, Send, BookHeart, Plus, Image as ImageIcon, X } from 'lucide-react';

export default function DiaryView() {
  const diaries = useAppStore(state => state.diaries);
  const addDiary = useAppStore(state => state.addDiary);
  const deleteDiary = useAppStore(state => state.deleteDiary);
  const uiStyle = useAppStore(state => state.uiStyle);
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG to save space in LocalStorage
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setImage(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Web Speech API for voice input
  const handleVoiceInput = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support voice input.');
      return;
    }
    
    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setContent(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.onerror = (e: any) => {
      console.error(e);
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;
    
    addDiary({
      content,
      date: new Date().toISOString(),
      mood: 'romantic',
      image: image || undefined
    });
    setContent('');
    setImage(null);
  };

  return (
    <div className="pb-32 flex flex-col h-screen">
      {/* Top App Bar */}
      <div className={`pt-12 pb-4 px-6 sticky top-0 z-10 backdrop-blur-xl ${
        uiStyle === 'cute' ? 'bg-[#FFF5F7]/80 dark:bg-[#1A1214]/80' : 'bg-zinc-50/90 dark:bg-zinc-950/90'
      } flex justify-between items-center`}>
        <h1 className={`text-3xl font-black tracking-tight ${uiStyle === 'cute' ? 'text-rose-900 dark:text-rose-100' : 'text-zinc-900 dark:text-zinc-100'}`}>
          碎碎念日记
        </h1>
      </div>

      <div className="px-6 flex-1 overflow-y-auto space-y-4 pt-4 pb-4">
        {diaries.length === 0 ? (
          <div className="text-center py-20 text-stone-400 flex flex-col items-center">
            <BookHeart className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-medium">一本空白的日记，</p>
            <p className="font-medium text-sm mt-1 opacity-70">记录你们的点点滴滴吧。</p>
          </div>
        ) : (
          diaries.slice().reverse().map(diary => (
            <div 
              key={diary.id} 
              className={uiStyle === 'cute' 
                ? "glass-card rounded-[2rem] p-6 shadow-sm border-[3px] border-white/60 dark:border-white/5 relative group transition-all"
                : "glass-card rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 relative group transition-all"
              }
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`text-xs font-bold ${uiStyle === 'cute' ? 'text-pink-400 dark:text-pink-600' : 'text-zinc-400'}`}>
                  {new Date(diary.date).toLocaleString()}
                </div>
                <button
                  onClick={(e) => {
                    e.currentTarget.nextElementSibling?.classList.toggle('hidden');
                  }}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 -m-1.5 rounded-lg ${
                    uiStyle === 'cute' ? 'text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30' : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                  title="删除"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
                {/* Inline delete confirmation */}
                <div className="hidden absolute top-4 right-4 z-10 flex items-center gap-2 bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-lg border border-red-100 dark:border-red-900/30 animate-in fade-in zoom-in-95">
                  <span className="text-xs font-bold text-red-500 px-2">删除?</span>
                  <button 
                    onClick={(e) => e.currentTarget.parentElement?.classList.add('hidden')} 
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => useAppStore.getState().deleteDiary(diary.id)} 
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500 text-white"
                  >
                    确定
                  </button>
                </div>
              </div>
              {diary.image && (
                <div 
                  className="mb-3 overflow-hidden rounded-xl cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => setFullScreenImage(diary.image || null)}
                >
                  <img src={diary.image} alt="Diary attachment" className="w-full h-auto object-cover max-h-64" />
                </div>
              )}
              <p className={`leading-relaxed whitespace-pre-wrap font-medium ${uiStyle === 'cute' ? 'text-stone-800 dark:text-stone-200' : 'text-zinc-800 dark:text-zinc-200'}`}>
                {diary.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Fullscreen Image Viewer */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setFullScreenImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            onClick={() => setFullScreenImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={fullScreenImage} 
            alt="Fullscreen view" 
            className="max-w-[95vw] max-h-[90vh] object-contain transition-transform duration-300 animate-in zoom-in-95" 
            onClick={(e) => e.stopPropagation()} // Let user pan/zoom if they pinch on mobile (native behavior for img)
          />
        </div>
      )}

      {/* Input Area anchored to bottom (above nav) */}
      <div className={`fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t z-20 ${
        uiStyle === 'cute' 
          ? 'from-[#FFF5F7] via-[#FFF5F7] dark:from-[#1A1214] dark:via-[#1A1214] to-transparent'
          : 'from-zinc-50 via-zinc-50 dark:from-zinc-950 dark:via-zinc-950 to-transparent'
      }`}>
        {image && (
          <div className="max-w-2xl mx-auto mb-2 px-2 relative">
            <div className="relative inline-block">
              <img src={image} alt="Preview" className={`h-24 w-auto object-cover ${uiStyle === 'cute' ? 'rounded-2xl border-2 border-pink-200' : 'rounded-xl border border-zinc-300'}`} />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute -top-2 -right-2 bg-black/60 text-white p-1 rounded-full backdrop-blur-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        <form 
          onSubmit={handleSubmit} 
          className={`flex gap-2 max-w-2xl mx-auto items-end p-2 shadow-lg ${
            uiStyle === 'cute'
              ? 'bg-white dark:bg-[#2A1D20] rounded-[2rem] border-[3px] border-pink-100 dark:border-stone-800 shadow-pink-100/50 dark:shadow-rose-950/20'
              : 'bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800'
          }`}
        >
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImagePick} 
            className="hidden" 
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-3 transition-colors flex-shrink-0 ${
              uiStyle === 'cute' ? 'rounded-[1.5rem] text-pink-500 bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-100' : 'rounded-xl text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200'
            }`}
          >
            <ImageIcon className="w-6 h-6" />
          </button>
          <button 
            type="button"
            onClick={handleVoiceInput}
            className={`p-3 transition-colors flex-shrink-0 ${
              uiStyle === 'cute' ? 'rounded-[1.5rem]' : 'rounded-xl'
            } ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : uiStyle === 'cute' ? 'text-pink-500 bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-100' : 'text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200'
            }`}
          >
            <Mic className="w-6 h-6" />
          </button>
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="今天有什么想说的..."
            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 min-h-[48px] py-3 px-2 dark:text-stone-100 font-medium"
            rows={1}
          />
          
          <button 
            type="submit"
            disabled={!content.trim() && !image}
            className={`p-3 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex-shrink-0 ${
              uiStyle === 'cute'
                ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-[1.5rem]'
                : 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-xl'
            }`}
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}
