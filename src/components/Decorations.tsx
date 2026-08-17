import { useAppStore } from '../store';
import { Heart, Star, Sparkles, Cloud } from 'lucide-react';

export default function Decorations() {
  const uiStyle = useAppStore(state => state.uiStyle);
  
  if (uiStyle !== 'cute') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* 漂浮装饰元素 */}
      <div className="absolute top-[10%] left-[10%] text-pink-300/40 animate-[bounce_4s_infinite]">
        <Heart className="w-8 h-8 fill-pink-300/40" />
      </div>
      <div className="absolute top-[30%] right-[10%] text-yellow-300/40 animate-[pulse_3s_infinite]">
        <Star className="w-6 h-6 fill-yellow-300/40" />
      </div>
      <div className="absolute bottom-[40%] left-[8%] text-rose-300/40 animate-[bounce_5s_infinite]">
        <Sparkles className="w-10 h-10" />
      </div>
      <div className="absolute top-[50%] right-[8%] text-pink-200/40 animate-[bounce_6s_infinite]">
        <Cloud className="w-12 h-12 fill-pink-200/40" />
      </div>
      <div className="absolute bottom-[20%] right-[20%] text-purple-300/40 animate-[pulse_4s_infinite]">
        <Heart className="w-6 h-6 fill-purple-300/40" />
      </div>
      <div className="absolute top-[15%] right-[40%] text-pink-300/30 animate-[bounce_7s_infinite] delay-1000">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="absolute bottom-[10%] left-[30%] text-pink-300/30 animate-[pulse_5s_infinite] delay-500">
        <Star className="w-7 h-7 fill-pink-300/30" />
      </div>
    </div>
  );
}
