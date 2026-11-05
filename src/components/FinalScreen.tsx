import React, { useEffect } from 'react';
import { Heart, Crown, Sparkles, QrCode, Share2, RotateCcw, MessageCircleHeart, Flame } from 'lucide-react';
import { startCelebrationFireworks, triggerHeartShower } from '../utils/confettiFireworks';
import { getPublicShareUrl } from './QRCodeModal';

interface FinalScreenProps {
  onOpenQR: () => void;
  onOpenWish: () => void;
  onRevisitCake: () => void;
}

export const FinalScreen: React.FC<FinalScreenProps> = ({
  onOpenQR,
  onOpenWish,
  onRevisitCake,
}) => {
  useEffect(() => {
    // Launch continuous fireworks on mounting final screen
    startCelebrationFireworks(4000);
    triggerHeartShower();
  }, []);

  const handleShareStory = () => {
    const url = getPublicShareUrl();
    const shareText = `Happy Birthday Deepak Bhai 🎂👑! Bhai ke liye ek special 3D Birthday Surprise link: ${url}`;
    if (navigator.share) {
      navigator.share({
        title: 'Deepak Bhai Birthday Surprise 3D 🎂👑',
        text: shareText,
        url: url,
      }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-black text-center overflow-x-hidden select-none">
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.2)_0%,rgba(136,8,21,0.25)_50%,rgba(0,0,0,1)_90%)] pointer-events-none" />

      {/* Floating Gold & Heart Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xl opacity-40 select-none animate-float"
            style={{
              top: `${(i * 13) % 100}%`,
              left: `${(i * 17) % 100}%`,
              animationDelay: `${i * 0.25}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          >
            {i % 3 === 0 ? '✨' : i % 3 === 1 ? '💛' : '❤️'}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-xl w-full px-6 py-8 sm:py-10 rounded-3xl bg-gradient-to-b from-[#1c150c]/90 via-[#110e0a]/90 to-[#080605]/95 border-2 border-amber-500/50 shadow-[0_0_70px_rgba(212,175,55,0.35)] backdrop-blur-md animate-in zoom-in-95 duration-500">
        
        {/* Royal Crest / Instagram Brotherhood Stamp */}
        <div className="relative mx-auto w-24 h-24 mb-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 to-red-600 blur-lg opacity-60 animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-amber-400 via-amber-600 to-yellow-700 border-2 border-white/60 flex items-center justify-center shadow-xl">
            <span className="text-4xl">👑</span>
          </div>
          <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 border border-white/40 text-[10px] font-black uppercase tracking-wider text-white shadow">
            DEEPAK BHAI
          </div>
        </div>

        {/* User's Exact Final Screen Texts */}
        <p className="text-sm sm:text-base font-semibold tracking-widest text-amber-300 uppercase mb-2 flex items-center justify-center gap-1.5">
          <span>MADE WITH LOVE</span>
          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
        </p>

        <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#FFF6BD] tracking-wider mb-2">
          FOR DEEPAK BHAI 👑
        </h1>

        <div className="my-4 py-3 px-5 rounded-2xl bg-gradient-to-r from-red-950/60 via-amber-950/60 to-red-950/60 border border-amber-500/30">
          <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-amber-200 tracking-wide">
            BHAI HO TO AAP JAISA! 🫂🎂
          </h2>
          <p className="text-xs text-zinc-300 mt-1">
            Instagram par mile the, lekin dil me hamesha ke liye jagah bana li.
          </p>
        </div>

        {/* Highlight Highlights */}
        <div className="grid grid-cols-2 gap-3 my-5 text-left">
          <div className="p-3 rounded-2xl bg-black/50 border border-amber-500/20">
            <div className="text-xs text-amber-400 font-bold flex items-center gap-1">
              <span>📅 Special Tareekh</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              7 November • Birthday
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-black/50 border border-amber-500/20">
            <div className="text-xs text-red-400 font-bold flex items-center gap-1">
              <span>🔥 Brotherhood</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              100% Asli Bhai Chaara
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onOpenQR}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-cinzel font-black text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(212,175,55,0.5)] transition transform active:scale-95"
          >
            <QrCode className="w-5 h-5 text-black" />
            <span>SURPRISE KA QR CODE DIKHAO 📱</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onOpenWish}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95"
            >
              <MessageCircleHeart className="w-4 h-4" />
              <span>Wish Bhejo 💌</span>
            </button>

            <button
              onClick={handleShareStory}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-amber-500/30 text-amber-200 font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Karo 📸</span>
            </button>
          </div>

          <button
            onClick={onRevisitCake}
            className="text-xs text-zinc-400 hover:text-amber-300 underline underline-offset-4 transition pt-2 block mx-auto"
          >
            🎂 3D Cake & Cake Cutting Dobara Dekho
          </button>
        </div>
      </div>
    </div>
  );
};
