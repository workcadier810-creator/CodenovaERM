import React, { useState, useEffect } from 'react';
import { Zap, Lock, Unlock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface LockScreenProps {
  correctPassword: string;
  hint: string;
  onUnlock: () => void;
}

const LockScreen = ({ correctPassword, hint, onUnlock }: LockScreenProps) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleNumberClick = (num: string) => {
    if (input.length < 8) {
      setInput(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setInput(prev => prev.slice(0, -1));
    setError(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input === correctPassword) {
      onUnlock();
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setInput('');
    }
  };

  useEffect(() => {
    if (input.length === correctPassword.length && correctPassword.length > 0) {
      if (input === correctPassword) {
        onUnlock();
      } else {
        setError(true);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setInput('');
      }
    }
  }, [input, correctPassword, onUnlock]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#121212] flex items-center justify-center p-4 font-sans">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full" />

      <div className={cn(
        "w-full max-w-md space-y-8 transition-all duration-300",
        isShaking && "animate-bounce"
      )}>
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20 mb-2">
            <Lock className="text-black" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Codenova<span className="text-amber-500">ERM</span>
          </h1>
          <p className="text-gray-400">System Locked. Enter numeric access code.</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center gap-3">
            {[...Array(correctPassword.length || 4)].map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "w-4 h-4 rounded-full border-2 transition-all duration-200",
                  input.length > i 
                    ? "bg-amber-500 border-amber-500 scale-110" 
                    : "border-gray-700 bg-transparent",
                  error && "border-red-500 bg-red-500/20"
                )}
              />
            ))}
          </div>

          {hint && (
            <div className="bg-amber-900/10 border border-amber-900/20 rounded-xl p-3 flex items-center gap-3 justify-center">
              <AlertCircle size={14} className="text-amber-500" />
              <p className="text-xs text-amber-500/80 italic">Hint: {hint}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="h-16 w-16 rounded-2xl bg-[#1E1E1E] border border-amber-900/10 text-xl font-bold text-white hover:bg-amber-600 hover:border-amber-500 transition-all active:scale-90 flex items-center justify-center"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleDelete}
              className="h-16 w-16 rounded-2xl bg-[#1E1E1E] border border-amber-900/10 text-sm font-bold text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center"
            >
              DEL
            </button>
            <button
              onClick={() => handleNumberClick('0')}
              className="h-16 w-16 rounded-2xl bg-[#1E1E1E] border border-amber-900/10 text-xl font-bold text-white hover:bg-amber-600 hover:border-amber-500 transition-all flex items-center justify-center"
            >
              0
            </button>
            <button
              onClick={() => setInput('')}
              className="h-16 w-16 rounded-2xl bg-[#1E1E1E] border border-amber-900/10 text-sm font-bold text-gray-400 hover:bg-amber-900/10 hover:text-amber-500 transition-all flex items-center justify-center"
            >
              CLR
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">Secure Access Protocol v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;