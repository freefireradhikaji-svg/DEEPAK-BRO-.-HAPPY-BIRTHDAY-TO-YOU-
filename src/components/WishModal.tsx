import React, { useState } from 'react';
import { Heart, Send, Sparkles, X, Gift, Smile, Star, Flame, Trophy } from 'lucide-react';
import { triggerGoldFireworks, triggerHeartShower } from '../utils/confettiFireworks';
import { audioEngine } from '../services/audioService';

interface WishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWishSent?: (wishText: string, senderName: string) => void;
}

const PRESET_WISHES = [
  {
    icon: '👑',
    title: 'Instagram Ka King',
    text: 'Bhai ka swag alag hai! Happy Birthday Deepak Bhai 👑🔥 Hamesha aise hi chamakte raho!',
  },
  {
    icon: '🫂',
    title: 'Brothers for Life',
    text: 'Instagram par mile the, lekin dil se sage bhai jaise ho. Love you hamesha Deepak Bhai! ❤️',
  },
  {
    icon: '🍕',
    title: 'Party To Banti Hai',
    text: 'Arey Bhai! Party to banti hai 😂🔥 Chahe bill jo bhi aaye, treat Deepak Bhai denge!',
  },
  {
    icon: '🚀',
    title: 'Success & Dreams',
    text: 'Dua hai Deepak Bhai aapke saare dreams poore ho aur life me sirf tarakki mile! 🌟',
  },
  {
    icon: '💍',
    title: 'Funny Blessing',
    text: 'Dua hai agle birthday tak BMW bhi aa jaye aur bhabhi bhi! 😜🎂',
  },
];

export const WishModal: React.FC<WishModalProps> = ({ isOpen, onClose, onWishSent }) => {
  const [customWish, setCustomWish] = useState('');
  const [senderName, setSenderName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSendWish = (text: string, name?: string) => {
    audioEngine.playSparkleSFX();
    triggerGoldFireworks();
    triggerHeartShower();

    if (onWishSent) {
      onWishSent(text, name || senderName || 'Aapka Bhai');
    }

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2200);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWish.trim()) return;
    handleSendWish(`${selectedEmoji} ${customWish.trim()}`);
    setCustomWish('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#1b140d] via-[#120d08] to-[#080605] border border-amber-500/50 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(212,175,55,0.35)] text-left animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-amber-400 transition-colors rounded-full hover:bg-white/5"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {sentSuccess ? (
          <div className="py-10 text-center animate-in zoom-in-95">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-4xl shadow-lg mb-4 animate-bounce">
              🎉
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-amber-300 mb-2">
              WISH SEND HO GAYI! ❤️
            </h3>
            <p className="text-zinc-300 text-sm max-w-xs mx-auto">
              Deepak Bhai ke paas aapki pyari wish aur dua pahuch gayi hai! 🫂🎂
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Gift className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-200">
                  EK WISH BHEJO 💌
                </h3>
                <p className="text-xs text-amber-400/80">
                  DEEPAK BHAI Ke Birthday Par Ek Khaas Sandesh!
                </p>
              </div>
            </div>

            {/* Quick 1-tap Wishes */}
            <div className="mt-4">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Tap Ready-Made Wishes</span>
              </div>
              <div className="space-y-2">
                {PRESET_WISHES.map((w, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendWish(w.text, senderName)}
                    className="w-full text-left p-3 rounded-2xl bg-zinc-900/80 hover:bg-gradient-to-r hover:from-amber-950/40 hover:to-red-950/40 border border-amber-500/20 hover:border-amber-400/60 transition group flex items-start gap-3"
                  >
                    <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      {w.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200">
                        {w.title}
                      </div>
                      <p className="text-xs text-zinc-300 line-clamp-2 mt-0.5">
                        {w.text}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Wish Form */}
            <div className="mt-5 pt-4 border-t border-amber-500/20">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-red-500" />
                <span>Apna Khud Ka Message Likho</span>
              </div>

              <form onSubmit={handleCustomSubmit} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Aapka Naam (e.g. Amar / Bhai)"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex items-center gap-1 bg-black/60 border border-amber-500/30 px-2 py-1 rounded-xl justify-around">
                    {['❤️', '👑', '🔥', '🫂', '🎂'].map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`text-base p-1 rounded transition ${
                          selectedEmoji === emoji ? 'bg-amber-500/30 scale-125' : 'hover:scale-110 opacity-70'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={customWish}
                  onChange={(e) => setCustomWish(e.target.value)}
                  placeholder="Deepak Bhai ke liye dil ki baat likho..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-400 resize-none"
                />

                <button
                  type="submit"
                  disabled={!customWish.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 hover:from-amber-400 hover:to-red-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] transition transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>DEEPAK BHAI KO BHEJO 💌</span>
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
