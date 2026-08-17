import { differenceInDays, parseISO, setYear, isBefore, startOfDay, differenceInYears } from 'date-fns';
import { useAppStore } from '../store';
import { CoupleEvent, UIStyle } from '../types';
import { Calendar, Plus, Sparkles, Clock, MoreHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const PRESET_ICONS = ['💕', '🎂', '✈️', '💍', '🎉', '🐶', '🎓', '🎬', '🥂', '🎮', '🏠', '🚗'];

export default function HomeView() {
  const events = useAppStore(state => state.events);
  const addEvent = useAppStore(state => state.addEvent);
  const updateEvent = useAppStore(state => state.updateEvent);
  const deleteEvent = useAppStore(state => state.deleteEvent);
  const uiStyle = useAppStore(state => state.uiStyle);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CoupleEvent | null>(null);

  // Bento layout logic: first item is big, rest are smaller grid
  return (
    <div className="pb-32">
      {/* Top App Bar */}
      <div className={`pt-12 pb-4 px-6 sticky top-0 z-10 backdrop-blur-xl ${
        uiStyle === 'cute' ? 'bg-[#FFF5F7]/80 dark:bg-[#1A1214]/80' : 'bg-zinc-50/90 dark:bg-zinc-950/90'
      } flex justify-between items-center`}>
        <h1 className={`text-3xl font-black tracking-tight ${uiStyle === 'cute' ? 'text-rose-900 dark:text-rose-100' : 'text-zinc-900 dark:text-zinc-100'}`}>
          记录重要瞬间
        </h1>
      </div>

      <div className="px-6 mt-4">
        {events.length === 0 ? (
          <div className="text-center py-20 text-stone-400 flex flex-col items-center">
            <Clock className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-medium">宇宙空空如也，</p>
            <p className="font-medium text-sm mt-1 opacity-70">点击下方按钮添加一个日子吧。</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {events.map((event, index) => (
              <div key={event.id} className={index === 0 ? 'col-span-2' : 'col-span-1'}>
                <EventCard 
                  event={event} 
                  isLarge={index === 0} 
                  uiStyle={uiStyle} 
                  onEdit={() => setEditingEvent(event)} 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB - Adjusted based on style */}
      <button 
        onClick={() => {
          if (navigator.vibrate) navigator.vibrate(50);
          setIsAdding(true);
        }}
        className={`fixed bottom-24 right-6 w-16 h-16 flex items-center justify-center shadow-lg transition-all active:scale-90 z-20 ${
          uiStyle === 'cute' 
            ? 'bg-gradient-to-tr from-pink-400 to-rose-400 text-white rounded-[2rem] hover:shadow-pink-300/50 hover:shadow-xl' 
            : 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-2xl hover:shadow-xl'
        }`}
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Add Modal */}
      {isAdding && (
        <EventFormModal 
          onClose={() => setIsAdding(false)} 
          onSave={(data) => addEvent(data as Omit<CoupleEvent, 'id'>)} 
          uiStyle={uiStyle} 
        />
      )}

      {/* Edit Modal */}
      {editingEvent && (
        <EventFormModal 
          initialData={editingEvent}
          onClose={() => setEditingEvent(null)} 
          onSave={(data) => {
            updateEvent(editingEvent.id, data);
            setEditingEvent(null);
          }} 
          onDelete={() => {
            deleteEvent(editingEvent.id);
            setEditingEvent(null);
          }}
          uiStyle={uiStyle} 
        />
      )}
    </div>
  );
}

function EventCard({ event, isLarge, uiStyle, onEdit }: { event: CoupleEvent, isLarge: boolean, uiStyle: UIStyle, onEdit: () => void }) {
  const eventDate = parseISO(event.date);
  const today = startOfDay(new Date());
  const eventStart = startOfDay(eventDate);
  
  let daysDiff = 0;
  let label = '';
  let tag = '';
  let extraInfo = '';
  let past = false;

  if (event.type === 'annual') {
    let nextDate = setYear(eventStart, today.getFullYear());
    if (isBefore(nextDate, today)) {
      nextDate = setYear(eventStart, today.getFullYear() + 1);
    }
    daysDiff = Math.abs(differenceInDays(nextDate, today));
    const years = differenceInYears(nextDate, eventStart);
    label = daysDiff === 0 ? '就在' : '还有';
    tag = '每年';
    extraInfo = years > 0 ? `第 ${years} 年` : '';
  } else if (event.type === 'countdown') {
    daysDiff = Math.abs(differenceInDays(eventStart, today));
    past = isBefore(eventStart, today);
    label = past ? '已过' : '还有';
    tag = past ? '已达成' : '期待日';
  } else {
    daysDiff = Math.abs(differenceInDays(today, eventStart));
    label = '相伴';
    tag = '纪念日';
  }

  const isCountdown = event.type === 'countdown' || event.type === 'annual';

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  const fetchAiSuggestion = async () => {
    if (navigator.vibrate) navigator.vibrate(50);
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: event.name,
          date: event.date,
          isCountdown,
          days: daysDiff
        })
      });
      const data = await res.json();
      setAiSuggestion(data.result);
    } catch (e) {
      console.error(e);
      setAiSuggestion('获取建议失败，请稍后再试。');
    } finally {
      setAiLoading(false);
    }
  };

  // 00s Style Variables
  const cardClasses = uiStyle === 'cute' 
    ? `glass-card rounded-[2.5rem] p-5 shadow-sm border-[3px] border-white/60 dark:border-white/5 relative overflow-hidden transition-all ${isLarge ? 'shadow-pink-100 dark:shadow-rose-950 shadow-xl' : ''}`
    : `glass-card rounded-3xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 relative transition-all ${isLarge ? 'shadow-md' : ''}`;

  const tagClasses = uiStyle === 'cute'
    ? 'px-3 py-1 bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 rounded-full text-[10px] font-black tracking-wider uppercase'
    : 'px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-md text-[10px] font-bold tracking-wider uppercase border border-zinc-200 dark:border-zinc-700';

  const titleClasses = uiStyle === 'cute'
    ? 'font-black text-stone-800 dark:text-stone-100 mt-2 tracking-tight line-clamp-1'
    : 'font-bold text-zinc-900 dark:text-zinc-100 mt-2 tracking-tight line-clamp-1';

  const numberClasses = uiStyle === 'cute'
    ? 'font-black text-rose-500 dark:text-rose-400 tracking-tighter'
    : 'font-bold text-zinc-900 dark:text-zinc-100 tracking-tighter font-mono';

  return (
    <div className={cardClasses}>
      
      {/* Decorative Blob for Cute Style */}
      {uiStyle === 'cute' && isLarge && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-200 to-rose-100 dark:from-pink-900/30 dark:to-rose-800/30 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
      )}

      <div className="flex justify-between items-start z-10 relative">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-sm">{event.icon || '📌'}</span>
            <span className={tagClasses}>
              {tag}
            </span>
          </div>
          <h3 className={`${isLarge ? 'text-2xl' : 'text-lg'} ${titleClasses}`}>{event.name}</h3>
        </div>
        
        {isLarge ? (
          <div className="flex gap-2">
            <button 
              onClick={fetchAiSuggestion}
              className={`p-3 transition-colors ${
                uiStyle === 'cute' 
                  ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-500 rounded-[1.5rem] hover:bg-pink-100' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
              title="AI 智能策划"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button 
              onClick={onEdit}
              className={`p-3 transition-colors ${
                uiStyle === 'cute' 
                  ? 'bg-white/50 dark:bg-stone-800/50 text-stone-500 rounded-[1.5rem] hover:bg-white' 
                  : 'bg-transparent text-zinc-400 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              title="编辑"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={onEdit}
            className={`p-2 -mr-2 -mt-2 transition-colors ${
              uiStyle === 'cute' 
                ? 'text-stone-400 hover:text-stone-600' 
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
            title="编辑"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className={`mt-4 flex items-baseline gap-1 z-10 relative ${isLarge ? '' : 'flex-col gap-0'}`}>
        <span className={`font-medium ${isLarge ? 'text-sm' : 'text-xs'} ${uiStyle === 'cute' ? 'text-stone-500 dark:text-stone-300' : 'text-zinc-500 dark:text-zinc-400'}`}>
          {label}
        </span>
        {daysDiff === 0 && event.type === 'annual' ? (
          <div className="flex items-baseline gap-1">
            <span className={`${isLarge ? 'text-4xl' : 'text-2xl'} ${numberClasses} text-pink-500 dark:text-pink-400`}>今天！</span>
            {extraInfo && (
              <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider ${uiStyle === 'cute' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                {extraInfo}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className={`${isLarge ? 'text-6xl' : 'text-4xl'} ${numberClasses}`}>{daysDiff}</span>
            <span className={`font-bold ${uiStyle === 'cute' ? 'text-stone-500 dark:text-stone-300' : 'text-zinc-500 dark:text-zinc-400'}`}>天</span>
            {extraInfo && (
              <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider ${uiStyle === 'cute' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                {extraInfo}
              </span>
            )}
          </div>
        )}
      </div>

      <div className={`mt-3 flex items-center gap-1.5 ${isLarge ? 'text-sm' : 'text-[10px]'} ${uiStyle === 'cute' ? 'text-stone-400' : 'text-zinc-500 font-medium'}`}>
        <Calendar className={isLarge ? 'w-4 h-4' : 'w-3 h-3'} /> 
        {eventDate.toLocaleDateString()}
      </div>

      {/* AI Suggestion Area (Only expands in Large cards or opens modal/expand in future) */}
      {isLarge && (aiLoading || aiSuggestion) && (
        <div className={`mt-5 pt-4 border-t ${uiStyle === 'cute' ? 'border-pink-100 dark:border-stone-800' : 'border-zinc-200 dark:border-zinc-800'} relative z-10`}>
          {aiLoading ? (
            <div className="flex items-center gap-2 text-stone-500 animate-pulse text-sm font-medium">
              <Sparkles className="w-4 h-4" /> AI策划中...
            </div>
          ) : (
            <div className="text-sm prose prose-stone dark:prose-invert max-w-none">
              <ReactMarkdown>{aiSuggestion}</ReactMarkdown>
              <button 
                onClick={() => setAiSuggestion('')} 
                className={`mt-2 font-bold text-xs ${uiStyle === 'cute' ? 'text-pink-500' : 'text-zinc-900 dark:text-zinc-100'}`}
              >
                收起建议
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EventFormModal({ onClose, onSave, onDelete, initialData, uiStyle }: { 
  onClose: () => void, 
  onSave: (e: Partial<CoupleEvent>) => void, 
  onDelete?: () => void,
  initialData?: CoupleEvent,
  uiStyle: UIStyle 
}) {
  const defaultDateStr = initialData ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0];
  const [name, setName] = useState(initialData?.name || '');
  const [year, setYear] = useState(defaultDateStr.split('-')[0]);
  const [month, setMonth] = useState(defaultDateStr.split('-')[1]);
  const [day, setDay] = useState(defaultDateStr.split('-')[2]);
  const [type, setType] = useState<'countdown' | 'anniversary' | 'annual'>(initialData?.type || 'annual');
  const [icon, setIcon] = useState(initialData?.icon || '💕');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !year || !month || !day) return;
    
    const selectedDate = new Date(`${year}-${month}-${day}T00:00:00`);
    if (isNaN(selectedDate.getTime())) {
      alert("日期无效");
      return;
    }

    onSave({
      name,
      date: selectedDate.toISOString(),
      type,
      icon
    });
    onClose();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 101}, (_, i) => currentYear - 80 + i);
  const months = Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, '0'));
  const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
  const days = Array.from({length: daysInMonth || 31}, (_, i) => String(i + 1).padStart(2, '0'));

  const modalClasses = uiStyle === 'cute'
    ? 'bg-[#FFF5F7] dark:bg-[#1A1214] rounded-t-[2.5rem] sm:rounded-[2.5rem]'
    : 'bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800';

  const inputClasses = uiStyle === 'cute'
    ? 'w-full bg-white dark:bg-[#2A1D20] border-[3px] border-transparent focus:border-pink-200 dark:focus:border-pink-900/50 rounded-2xl p-4 outline-none transition-all shadow-sm font-medium'
    : 'w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100 rounded-xl p-4 outline-none transition-all font-medium';

  const btnClasses = uiStyle === 'cute'
    ? 'w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-[2rem] p-4 font-black text-lg hover:shadow-lg hover:shadow-pink-300/50 active:scale-95 transition-all mt-6'
    : 'w-full bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-xl p-4 font-bold text-lg active:scale-95 transition-all mt-6';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div className={`w-full max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 shadow-2xl max-h-[90dvh] overflow-y-auto ${modalClasses}`} onClick={e => e.stopPropagation()}>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl ${uiStyle === 'cute' ? 'font-black text-rose-900 dark:text-rose-100' : 'font-bold text-zinc-900 dark:text-zinc-100'}`}>
            {initialData ? '编辑纪念日' : '自定义纪念日'}
          </h2>
          <button onClick={onClose} className={`p-2 rounded-full ${uiStyle === 'cute' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'}`}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Icon Picker */}
          <div>
            <label className={`block text-sm font-bold mb-3 ${uiStyle === 'cute' ? 'text-stone-600 dark:text-stone-400' : 'text-zinc-600 dark:text-zinc-400'}`}>选择专属图标</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_ICONS.map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if(navigator.vibrate) navigator.vibrate(20);
                    setIcon(i);
                  }}
                  className={`text-2xl p-2 transition-all ${
                    icon === i 
                      ? (uiStyle === 'cute' ? 'bg-white dark:bg-stone-800 scale-110 rounded-2xl shadow-sm border border-pink-100 dark:border-stone-700' : 'bg-zinc-100 dark:bg-zinc-800 scale-110 rounded-xl border border-zinc-300 dark:border-zinc-600')
                      : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${uiStyle === 'cute' ? 'text-stone-600 dark:text-stone-400' : 'text-zinc-600 dark:text-zinc-400'}`}>标签名称</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
              placeholder="例如：第一次一起看海..."
            />
          </div>
          
          <div>
            <label className={`block text-sm font-bold mb-2 ${uiStyle === 'cute' ? 'text-stone-600 dark:text-stone-400' : 'text-zinc-600 dark:text-zinc-400'}`}>目标日期</label>
            <div className="flex gap-2">
              <div className="flex-[2] relative">
                <select 
                  value={year} 
                  onChange={(e) => setYear(e.target.value)}
                  className={`${inputClasses} appearance-none pr-8`}
                >
                  {years.map(y => <option key={y} value={y}>{y}年</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
              <div className="flex-[1.5] relative">
                <select 
                  value={month} 
                  onChange={(e) => setMonth(e.target.value)}
                  className={`${inputClasses} appearance-none pr-8`}
                >
                  {months.map(m => <option key={m} value={m}>{m}月</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
              <div className="flex-[1.5] relative">
                <select 
                  value={day} 
                  onChange={(e) => setDay(e.target.value)}
                  className={`${inputClasses} appearance-none pr-8`}
                >
                  {days.map(d => <option key={d} value={d}>{d}日</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${uiStyle === 'cute' ? 'text-stone-600 dark:text-stone-400' : 'text-zinc-600 dark:text-zinc-400'}`}>事件类型</label>
            <div className="flex flex-col gap-2">
              {[
                { id: 'annual', label: '🎂 每年过 (如生日、周年)' },
                { id: 'anniversary', label: '💖 纪念日 (如相爱多少天)' },
                { id: 'countdown', label: '⏳ 期待日 (如约定的旅行)' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setType(opt.id as 'annual' | 'countdown' | 'anniversary')}
                  className={`w-full p-3 text-left transition-all font-bold ${
                    type === opt.id 
                      ? (uiStyle === 'cute' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 rounded-[1.2rem] border-[3px] border-pink-200 dark:border-pink-800' : 'bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 rounded-xl border border-transparent') 
                      : (uiStyle === 'cute' ? 'bg-white/50 dark:bg-[#2A1D20]/50 text-stone-500 rounded-[1.2rem] border-[3px] border-transparent hover:bg-white dark:hover:bg-[#2A1D20]' : 'bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-500 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800')
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            {showConfirm && onDelete ? (
              <div className="flex gap-2 p-3 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30">
                <div className="flex-1 text-sm font-bold text-red-600 dark:text-red-400 flex items-center justify-center">确定删除吗？</div>
                <button type="button" onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 font-bold text-zinc-600 dark:text-zinc-300">取消</button>
                <button type="button" onClick={onDelete} className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold shadow-sm hover:bg-red-600">删除</button>
              </div>
            ) : (
              <div className="flex gap-3">
                {onDelete && (
                  <button 
                    type="button" 
                    onClick={() => setShowConfirm(true)}
                    className={`flex-none px-6 rounded-xl sm:rounded-[2rem] font-bold transition-all ${
                      uiStyle === 'cute' 
                        ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 hover:bg-rose-200' 
                        : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100'
                    }`}
                  >
                    删除
                  </button>
                )}
                <button type="submit" className={`flex-1 ${btnClasses} !mt-0`}>
                  {initialData ? '保存修改' : '生成专属卡片'}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
