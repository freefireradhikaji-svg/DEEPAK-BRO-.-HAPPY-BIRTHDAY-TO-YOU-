import React, { useState } from 'react';
import { Gift, Sparkles, Heart, Crown, Stars } from 'lucide-react';
import { audioEngine } from '../services/audioService';
import { triggerGoldFireworks } from '../utils/confettiFireworks';

interface SecretEntryProps {
  onOpenSurprise: () => void;
}

export const SecretEntry: React.FC<SecretEntryProps> = ({ onOpenSurprise }) => {
  const [opening, setOpening] = useState(false);

  const handleClick = () => {
    if (opening) return;
    setOpening(true);

    // Audio context initialization and start music on user gesture
    audioEngine.playSparkleSFX();
    audioEngine.startMusic();
    triggerGoldFireworks();

    setTimeout(() => {
      onOpenSurprise();
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-black text-center select-none">
      
      {/* Background Starry Glow & Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18)_0%,rgba(136,8,21,0.22)_45%,rgba(0,0,0,1)_85%)] pointer-events-none" />

      {/* Floating Sparkles & Dust Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-300 opacity-60"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              top: `${(i * 19) % 100}%`,
              left: `${(i * 31) % 100}%`,
              boxShadow: '0 0 10px #ffe79a',
              animation: `floatGentle ${3 + (i % 4)}s ease-in-out infinite alternate`,
              animationDelay: `${(i * 0.2)}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content Box */}
      <div className={`relative z-10 max-w-lg w-full px-6 py-10 rounded-3xl bg-gradient-to-b from-zinc-950/90 via-black/90 to-zinc-950/90 border border-amber-500/40 shadow-[0_0_60px_rgba(212,175,55,0.25)] backdrop-blur-md transition-all duration-700 ${
        opening ? 'scale-95 opacity-0 blur-sm' : 'scale-100 opacity-100'
      }`}>

        {/* Crown & Date Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-6 shadow-sm">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>7 November • Bhai Ka Birthday</span>
          <Stars className="w-4 h-4 text-amber-400" />
        </div>

        {/* 3D-Like Gift Box Graphic */}
        <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 mb-6 flex items-center justify-center group cursor-pointer" onClick={handleClick}>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-300 opacity-30 blur-2xl group-hover:opacity-60 transition duration-500" />
          
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-b from-[#8B0000] via-[#5A0000] to-[#2B0000] border-2 border-amber-400 shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
            {/* Gold Cross Ribbons */}
            <div className="absolute inset-y-0 w-6 bg-gradient-to-r from-[#AA771C] via-[#FFE79A] to-[#D4AF37] shadow-md" />
            <div className="absolute inset-x-0 h-6 bg-gradient-to-b from-[#AA771C] via-[#FFE79A] to-[#D4AF37] shadow-md" />

            {/* Ribbon Bow */}
            <div className="absolute -top-4 text-4xl animate-bounce">
              🎀
            </div>

            <div className="relative z-10 text-3xl">
              🎁
            </div>
          </div>
        </div>

        {/* Exact User Requested Texts */}
        <h2 className="text-base sm:text-lg font-medium text-amber-200/90 tracking-wide mb-2 flex items-center justify-center gap-2">
          <span>Ek Special Insaan Ke Liye Special Surprise</span>
          <Heart className="w-4 h-4 fill-red-500 text-red-500 inline" />
        </h2>

        <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#FFF6BD] mb-4">
          DEEPAK BHAI, Aapke Liye Ek Gift Hai 🎁
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 mb-8 max-w-sm mx-auto leading-relaxed">
          Instagram se shuru hui pyari dosti ke naam ek cinematic aur royal birthday surprise!
        </p>

        {/* Requested Button: OPEN YOUR SURPRISE 💖 */}
        <button
          onClick={handleClick}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-cinzel font-black text-sm sm:text-base tracking-widest uppercase shadow-[0_0_35px_rgba(212,175,55,0.6)] transform hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <Sparkles className="w-5 h-5 text-black group-hover:rotate-12 transition-transform" />
          <span>OPEN YOUR SURPRISE 💖</span>
          <Heart className="w-5 h-5 fill-red-600 text-red-600 group-hover:scale-125 transition-transform" />
        </button>

        <div className="mt-8 text-[11px] text-zinc-500 tracking-wider flex items-center justify-center gap-2">
          <span>✦ Tap karte hi music & 3D world shuru hoga ✦</span>
        </div>
      </div>
    </div>
  );
};
