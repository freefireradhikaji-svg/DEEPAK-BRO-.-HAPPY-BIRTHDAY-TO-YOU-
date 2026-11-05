import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';
import { audioEngine } from '../services/audioService';

export const MusicPlayerBar: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [barHeights, setBarHeights] = useState<number[]>([15, 25, 40, 20, 35, 50, 30, 20]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const unsub = audioEngine.subscribe((playing) => {
      setIsPlaying(playing);
    });

    return () => {
      unsub();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update visualizer frequency bars
  useEffect(() => {
    if (!isPlaying) {
      setBarHeights([10, 10, 10, 10, 10, 10, 10, 10]);
      return;
    }

    const analyser = audioEngine.getAnalyser();
    const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

    const render = () => {
      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        // sample 8 frequency bands
        const sampled = [
          Math.max(12, (dataArray[1] / 255) * 45),
          Math.max(12, (dataArray[2] / 255) * 55),
          Math.max(12, (dataArray[3] / 255) * 60),
          Math.max(12, (dataArray[4] / 255) * 50),
          Math.max(12, (dataArray[6] / 255) * 45),
          Math.max(12, (dataArray[8] / 255) * 40),
          Math.max(12, (dataArray[10] / 255) * 35),
          Math.max(12, (dataArray[12] / 255) * 30),
        ];
        setBarHeights(sampled);
      } else {
        // Fallback procedural dance
        const t = Date.now() / 150;
        setBarHeights([
          15 + Math.sin(t) * 12,
          25 + Math.cos(t * 1.2) * 18,
          40 + Math.sin(t * 0.8) * 20,
          22 + Math.cos(t * 1.5) * 15,
          35 + Math.sin(t * 1.1) * 22,
          48 + Math.cos(t * 0.9) * 20,
          30 + Math.sin(t * 1.3) * 16,
          18 + Math.cos(t * 0.7) * 10,
        ]);
      }
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const handleToggle = () => {
    const active = audioEngine.toggleMute();
    setIsPlaying(active);
  };

  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/70 border border-amber-500/40 shadow-[0_0_20px_rgba(212,175,55,0.2)] backdrop-blur-md">
      {/* Icon & Label */}
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 text-xs font-semibold text-amber-300 hover:text-amber-100 transition active:scale-95"
        title={isPlaying ? 'Mute Music' : 'Play Music'}
        aria-label="Toggle birthday music"
      >
        <span className="p-1 rounded-full bg-amber-500/20 text-amber-400">
          {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
        </span>
        <span className="hidden sm:inline text-[11px] uppercase tracking-wider text-amber-200">
          {isPlaying ? 'Birthday BGM' : 'Muted'}
        </span>
      </button>

      {/* Visualizer Bars */}
      <div className="flex items-end gap-1 h-5 px-1">
        {barHeights.map((h, i) => (
          <div
            key={i}
            className="w-1 rounded-full transition-all duration-75"
            style={{
              height: `${Math.min(22, Math.max(4, h * 0.45))}px`,
              background: isPlaying
                ? 'linear-gradient(to top, #D4AF37, #FF4D6D)'
                : '#52525b',
            }}
          />
        ))}
      </div>
    </div>
  );
};
