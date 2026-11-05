/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SecretEntry } from './components/SecretEntry';
import { ThreeCakeScene } from './components/ThreeCakeScene';
import { MusicPlayerBar } from './components/MusicPlayerBar';
import { EmotionalLetter } from './components/EmotionalLetter';
import { WishModal } from './components/WishModal';
import { QRCodeModal } from './components/QRCodeModal';
import { FinalScreen } from './components/FinalScreen';
import {
  triggerGoldFireworks,
  startCelebrationFireworks,
  triggerHeartShower,
} from './utils/confettiFireworks';
import { audioEngine } from './services/audioService';
import {
  Crown,
  Sparkles,
  Heart,
  QrCode,
  Flame,
  MessageCircleHeart,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  Gift,
} from 'lucide-react';

type AppStage = 'secret' | 'celebration' | 'final';

export default function App() {
  const [stage, setStage] = useState<AppStage>('secret');
  const [isCakeCut, setIsCakeCut] = useState<boolean>(false);
  const [candlesBlown, setCandlesBlown] = useState<boolean>(false);
  const [showPartyToast, setShowPartyToast] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'cake' | 'letter'>('cake');
  const [isWishOpen, setIsWishOpen] = useState<boolean>(false);
  const [isQROpen, setIsQROpen] = useState<boolean>(false);
  const [hudCollapsed, setHudCollapsed] = useState<boolean>(false);
  const [recentWishes, setRecentWishes] = useState<Array<{ text: string; sender: string }>>([
    {
      text: 'Bhai ka swag alag hai! Happy Birthday Deepak Bhai 👑🔥',
      sender: 'Amar',
    },
    {
      text: 'Instagram par mile the, lekin dil se sage bhai jaise ho! ❤️',
      sender: 'Bhai-Charah',
    },
  ]);

  // Stage 1 -> Stage 2: Open Surprise
  const handleOpenSurprise = () => {
    setStage('celebration');
    triggerGoldFireworks();
    startCelebrationFireworks(4500);
  };

  // Stage 3: Cake Cutting Interaction
  const handleCutCake = () => {
    if (isCakeCut) return;

    // Trigger haptic vibration if supported on Android / mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([100, 50, 150]);
      } catch {
        // Ignore if restricted
      }
    }

    setIsCakeCut(true);
    setCandlesBlown(true);

    // Audio SFX
    audioEngine.playCakeCutSFX();
    setTimeout(() => {
      audioEngine.playCandleBlowSFX();
      audioEngine.playPartyHornSFX();
    }, 450);

    // Massive fireworks & confetti
    triggerGoldFireworks();
    startCelebrationFireworks(6000);

    // Show comic celebratory dialogue: "AREY BHAI! PARTY TO BANTI HAI 😂🔥"
    setShowPartyToast(true);
  };

  const handleWishSent = (wishText: string, sender: string) => {
    setRecentWishes((prev) => [{ text: wishText, sender }, ...prev]);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans select-none">
      
      {/* 1. SECRET ENTRY SCREEN */}
      {stage === 'secret' && (
        <SecretEntry onOpenSurprise={handleOpenSurprise} />
      )}

      {/* 2. CINEMATIC 3D CELEBRATION WORLD */}
      {stage === 'celebration' && (
        <div className="relative w-full h-full">
          {/* Background Ambient Color Wash */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(180,8,25,0.18)_0%,rgba(212,175,55,0.12)_40%,rgba(0,0,0,1)_90%)] pointer-events-none" />

          {/* 3D Cake Scene Viewport */}
          <ThreeCakeScene
            isCut={isCakeCut}
            candlesBlown={candlesBlown}
            onSliceComplete={() => {
              // Slice complete callback
            }}
          />

          {/* TOP BAR: Cinematic Intro Title & Audio Bar */}
          <header className="absolute top-0 inset-x-0 z-30 p-3 sm:p-5 flex items-start justify-between gap-3 pointer-events-none">
            {/* Cinematic Headings */}
            <div className="pointer-events-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] sm:text-xs font-semibold uppercase tracking-widest backdrop-blur-md mb-1 shadow-sm">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>7 NOVEMBER - YOUR SPECIAL DAY ❤️</span>
              </div>

              <h1 className="font-cinzel text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#FFF6BD] tracking-wider drop-shadow-[0_2px_15px_rgba(212,175,55,0.4)]">
                HAPPY BIRTHDAY DEEPAK BHAI 🎂👑
              </h1>
              <p className="text-[11px] sm:text-xs text-zinc-300 font-medium">
                {isCakeCut
                  ? 'Cake kat chuka hai! Ab party shuru! 🔥'
                  : '3D Cake ko touch karke ghumayein & inspect karein ✨'}
              </p>
            </div>

            {/* Music Player & QR Shortcut */}
            <div className="flex items-center gap-2 pointer-events-auto shrink-0">
              <MusicPlayerBar />
              <button
                onClick={() => setIsQROpen(true)}
                className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-black/70 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold backdrop-blur-md shadow-md active:scale-95"
                title="Surprise QR Code"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">QR Code</span>
              </button>
            </div>
          </header>

          {/* PARTY CELEBRATION TOAST ("AREY BHAI! PARTY TO BANTI HAI 😂🔥") */}
          {showPartyToast && (
            <div className="absolute top-24 sm:top-28 inset-x-0 z-40 flex justify-center px-4 pointer-events-none animate-in zoom-in-90 slide-in-from-top-6 duration-300">
              <div className="pointer-events-auto max-w-md w-full p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#2a0808]/95 via-[#1a1205]/95 to-[#2a0808]/95 border-2 border-amber-400 shadow-[0_0_50px_rgba(239,68,68,0.5)] backdrop-blur-md text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600/30 text-2xl border border-red-500/40 mb-2 animate-bounce">
                  🎉
                </div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-black text-amber-300 tracking-wide">
                  AREY BHAI! PARTY TO BANTI HAI 😂🔥
                </h3>
                <p className="text-xs sm:text-sm text-zinc-200 mt-1">
                  Cake kat gaya hai! Deepak Bhai ki taraf se shaandaar treat pakki hai! 🍕🍔🍻
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setShowPartyToast(false);
                      setActiveTab('letter');
                    }}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-black uppercase tracking-wider shadow-md hover:from-amber-400 hover:to-amber-500 transition active:scale-95"
                  >
                    Dil Ki Baat Suno ❤️
                  </button>
                  <button
                    onClick={() => setShowPartyToast(false)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 text-xs transition"
                  >
                    Bhai Oye! 😉
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EMOTIONAL LETTER OVERLAY IF ACTIVE TAB IS 'LETTER' */}
          {activeTab === 'letter' && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300">
              <div className="w-full max-w-xl">
                <div className="flex justify-end mb-2 pr-2">
                  <button
                    onClick={() => setActiveTab('cake')}
                    className="px-3 py-1 rounded-full bg-black/80 border border-amber-500/40 text-amber-300 text-xs hover:bg-amber-500/20 transition flex items-center gap-1"
                  >
                    <span>🎂 3D Cake Par Wapas Jao</span>
                  </button>
                </div>
                <EmotionalLetter
                  onContinue={() => {
                    setStage('final');
                  }}
                />
              </div>
            </div>
          )}

          {/* RECENT BROTHERHOOD WISHES TICKER (Small corner pill) */}
          <div className="hidden md:flex absolute top-28 left-5 z-20 max-w-xs flex-col gap-2 pointer-events-none">
            {recentWishes.slice(0, 2).map((w, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-2xl bg-black/75 border border-amber-500/25 shadow-lg backdrop-blur-md text-left pointer-events-auto animate-in fade-in duration-300"
              >
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                  <span>{w.sender} Ki Wish</span>
                </div>
                <p className="text-xs text-zinc-200 mt-0.5 line-clamp-2">
                  {w.text}
                </p>
              </div>
            ))}
          </div>

          {/* 5. COLLAPSIBLE BOTTOM CONTROL DOCK (Three.js skill compliant: zero central viewport occlusion) */}
          <div
            className={`absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 w-full max-w-md sm:max-w-2xl px-3 transition-transform duration-300 ${
              hudCollapsed ? 'translate-y-[calc(100%-2.5rem)]' : 'translate-y-0'
            }`}
          >
            {/* Collapse/Expand Toggle Tab */}
            <div className="flex justify-center mb-1">
              <button
                onClick={() => setHudCollapsed(!hudCollapsed)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md shadow-md transition active:scale-95"
              >
                {hudCollapsed ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                    <span>Controls Dikhao (Tap)</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hide Controls (Full 3D View)</span>
                  </>
                )}
              </button>
            </div>

            {/* Unified Dock Container */}
            <div className="p-3 sm:p-4 rounded-3xl bg-gradient-to-r from-[#17120a]/95 via-[#0e0a06]/95 to-[#17120a]/95 border-2 border-amber-500/40 shadow-[0_0_40px_rgba(212,175,55,0.3)] backdrop-blur-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                
                {/* Main Hero Action: CAKE CUTTING BUTTON */}
                <button
                  onClick={handleCutCake}
                  disabled={isCakeCut}
                  className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 py-3 px-5 rounded-2xl font-cinzel font-black text-sm tracking-wider uppercase shadow-lg transition-all duration-300 transform active:scale-95 ${
                    isCakeCut
                      ? 'bg-zinc-800 text-amber-400 border border-amber-500/30 cursor-default'
                      : 'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-black shadow-[0_0_30px_rgba(212,175,55,0.6)] animate-pulse'
                  }`}
                >
                  {isCakeCut ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      <span>CAKE KAT CHUKA HAI 🍰</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-black" />
                      <span>CAKE KAT KARO 🎂</span>
                    </>
                  )}
                </button>

                {/* Sub-actions in Dock */}
                <div className="w-full sm:w-auto flex items-center justify-center gap-2">
                  {/* EK WISH BHEJO 💌 */}
                  <button
                    onClick={() => setIsWishOpen(true)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-red-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider transition active:scale-95"
                  >
                    <MessageCircleHeart className="w-4 h-4 text-amber-400" />
                    <span>WISH BHEJO 💌</span>
                  </button>

                  {/* Emotional Message toggle */}
                  <button
                    onClick={() => setActiveTab(activeTab === 'letter' ? 'cake' : 'letter')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition active:scale-95 ${
                      activeTab === 'letter'
                        ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                        : 'bg-white/5 hover:bg-white/10 border-amber-500/30 text-amber-200'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span>DIL KI BAAT ❤️</span>
                  </button>

                  {/* Next: Final Screen */}
                  <button
                    onClick={() => setStage('final')}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-400 hover:text-white transition active:scale-95"
                    title="Final Celebration Screen"
                  >
                    <Crown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. FINAL SCREEN */}
      {stage === 'final' && (
        <FinalScreen
          onOpenQR={() => setIsQROpen(true)}
          onOpenWish={() => setIsWishOpen(true)}
          onRevisitCake={() => {
            setStage('celebration');
            setActiveTab('cake');
          }}
        />
      )}

      {/* MODALS: WISH & QR CODE */}
      <WishModal
        isOpen={isWishOpen}
        onClose={() => setIsWishOpen(false)}
        onWishSent={handleWishSent}
      />

      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
      />
    </main>
  );
}
