import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Volume2, RotateCcw, Crown } from 'lucide-react';
import { triggerHeartShower } from '../utils/confettiFireworks';
import { audioEngine } from '../services/audioService';

interface EmotionalLetterProps {
  onContinue?: () => void;
}

const FULL_LETTER = `Happy Birthday Deepak Bhai ❤️
Instagram par mile the, lekin aaj aap ek apne jaise bhai ho.
Dua hai aap hamesha khush raho, successful bano aur aapke saare dreams poore ho.
Aapki life khushiyon se bhari rahe.
Love You Mere Bhai! 🫂❤️🎂`;

export const EmotionalLetter: React.FC<EmotionalLetterProps> = ({ onContinue }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [loveCount, setLoveCount] = useState(1);
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; left: number }>>([]);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      index++;
      setDisplayedText(FULL_LETTER.slice(0, index));

      if (index >= FULL_LETTER.length) {
        clearInterval(interval);
        setIsTyping(false);
        triggerHeartShower();
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    setDisplayedText(FULL_LETTER);
    setIsTyping(false);
    triggerHeartShower();
  };

  const handleSendLove = () => {
    audioEngine.playSparkleSFX();
    setLoveCount((c) => c + 1);
    const newHeart = { id: Date.now(), left: 20 + Math.random() * 60 };
    setFloatingHearts((prev) => [...prev.slice(-10), newHeart]);

    if (loveCount % 5 === 0) {
      triggerHeartShower();
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto px-4">
      {/* Floating Hearts Animation */}
      {floatingHearts.map((h) => (
        <div
          key={h.id}
          className="absolute bottom-16 pointer-events-none text-2xl animate-fade-out"
          style={{
            left: `${h.left}%`,
            animation: 'floatUpAndFade 1.6s forwards ease-out',
          }}
        >
          ❤️
        </div>
      ))}

      {/* Royal Card Frame */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#1c150c]/95 via-[#130f08]/95 to-[#0b0805]/95 border-2 border-amber-500/50 shadow-[0_0_50px_rgba(212,175,55,0.3)] backdrop-blur-md overflow-hidden">
        
        {/* Ornate Corner Accents */}
        <div className="absolute top-2 left-2 text-amber-500/40 text-xs font-cinzel select-none">✦</div>
        <div className="absolute top-2 right-2 text-amber-500/40 text-xs font-cinzel select-none">✦</div>
        <div className="absolute bottom-2 left-2 text-amber-500/40 text-xs font-cinzel select-none">✦</div>
        <div className="absolute bottom-2 right-2 text-amber-500/40 text-xs font-cinzel select-none">✦</div>

        {/* Header Ribbon */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Dil Se Dil Tak • Instagram Bhai</span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#FFF6BD] tracking-wide">
            EK KHASS DIL KI BAAT ❤️
          </h2>
          <div className="w-20 h-0.5 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-1" />
        </div>

        {/* Typewriter Body */}
        <div className="min-h-[140px] sm:min-h-[160px] p-4 sm:p-5 rounded-2xl bg-black/50 border border-amber-500/20 text-zinc-100 text-sm sm:text-base leading-relaxed font-sans font-normal tracking-wide whitespace-pre-line shadow-inner">
          <span>{displayedText}</span>
          {isTyping && (
            <span className="inline-block w-2 h-4 ml-1 bg-amber-400 animate-pulse align-middle" />
          )}
        </div>

        {/* Footer Controls */}
        <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            {isTyping && (
              <button
                onClick={handleSkip}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-amber-300/80 transition"
              >
                Skip ⏭️
              </button>
            )}
            <button
              onClick={handleSendLove}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600/80 to-pink-600/80 hover:from-red-500 hover:to-pink-500 text-white text-xs font-bold shadow-md transition transform active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
              <span>Bhai Pyaar ({loveCount})</span>
            </button>
          </div>

          {onContinue && (
            <button
              onClick={onContinue}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95 ml-auto"
            >
              <span>Aage Badho 💖</span>
              <Sparkles className="w-4 h-4 text-black" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
