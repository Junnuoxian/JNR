import { useState, useEffect } from 'react';
import { Delete, ScanFace } from 'lucide-react';
import { useAppStore } from '../store';

interface PinPadProps {
  onComplete: (pin: string) => void;
  title?: string;
  showBiometrics?: boolean;
}

export default function PinPad({ onComplete, title = "请输入隐私密码", showBiometrics = false }: PinPadProps) {
  const [pin, setPin] = useState("");
  const uiStyle = useAppStore(state => state.uiStyle);

  const handleInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        // slightly delay to show the last dot
        setTimeout(() => onComplete(newPin), 100);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleBiometrics = async () => {
    if (navigator.vibrate) navigator.vibrate(50);
    // Simulated or webauthn flow for biometrics.
    // Given the constraints of a web app running locally or in Capacitor without plugins,
    // we mock a success if the system supports credentials, or show an alert.
    try {
      if (window.PublicKeyCredential) {
        // We'll just alert for the web fallback, since real webauthn requires a backend challenge.
        alert("系统正在调起生物识别...");
        // For local mock:
        // onComplete("BIOMETRIC_SUCCESS"); // we'd handle this specifically.
      } else {
        alert("当前设备或环境不支持生物识别");
      }
    } catch (e) {
      alert("生物识别调用失败");
    }
  };

  useEffect(() => {
    // Reset pin when component mounts or onComplete is called incorrectly externally
    setPin("");
  }, []);

  const keys = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    showBiometrics ? 'bio' : '', '0', 'delete'
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
      <h2 className={`text-xl font-bold mb-8 ${uiStyle === 'cute' ? 'text-pink-900 dark:text-pink-100' : 'text-zinc-900 dark:text-zinc-100'}`}>
        {title}
      </h2>
      
      {/* Pin Dots */}
      <div className="flex gap-4 mb-12">
        {[0, 1, 2, 3].map(i => (
          <div 
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              pin.length > i 
                ? (uiStyle === 'cute' ? 'bg-pink-500 scale-100' : 'bg-zinc-800 dark:bg-zinc-200 scale-100')
                : (uiStyle === 'cute' ? 'bg-pink-200 dark:bg-pink-900/50 scale-75' : 'bg-zinc-200 dark:bg-zinc-800 scale-75')
            }`}
          />
        ))}
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-x-8 gap-y-6 w-full px-6">
        {keys.map((k, i) => {
          if (k === '') return <div key={i} />;
          
          if (k === 'delete') {
            return (
              <button 
                key={i}
                onClick={handleDelete}
                className="flex items-center justify-center h-16 rounded-full active:bg-zinc-200 dark:active:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300"
              >
                <Delete className="w-8 h-8" />
              </button>
            );
          }

          if (k === 'bio') {
            return (
              <button 
                key={i}
                onClick={handleBiometrics}
                className="flex items-center justify-center h-16 rounded-full active:bg-zinc-200 dark:active:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300"
              >
                <ScanFace className="w-8 h-8" />
              </button>
            );
          }

          return (
            <button
              key={i}
              onClick={() => handleInput(k)}
              className={`flex items-center justify-center text-3xl font-medium h-16 w-16 mx-auto rounded-full transition-all ${
                uiStyle === 'cute' 
                  ? 'active:bg-pink-100 dark:active:bg-pink-900/40 text-pink-900 dark:text-pink-100' 
                  : 'active:bg-zinc-200 dark:active:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {k}
            </button>
          );
        })}
      </div>
    </div>
  );
}
