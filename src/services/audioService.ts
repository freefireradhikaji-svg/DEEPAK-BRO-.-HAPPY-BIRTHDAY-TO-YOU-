/**
 * Web Audio API synthesized background music & sound effects.
 * 100% procedural with zero external 404 dependencies!
 * Produces an emotional, warm grand piano & strings instrumental version of "Happy Birthday"
 * and realistic birthday celebration sound effects.
 */

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingMusic: boolean = false;
  private musicInterval: number | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private listeners: Set<(isPlaying: boolean) => void> = new Set();

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.8;

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.7;

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.9;

      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(listener: (isPlaying: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlayingMusic));
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getIsPlaying(): boolean {
    return this.isPlayingMusic && !this.isMuted;
  }

  public toggleMute(): boolean {
    this.initContext();
    if (!this.masterGain) return false;
    this.isMuted = !this.isMuted;
    this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.8, this.ctx!.currentTime, 0.05);
    this.notify();
    return !this.isMuted;
  }

  /**
   * Procedural emotional grand piano synthesis with warm envelope and soft harmonics
   */
  private playPianoNote(freq: number, time: number, duration: number, velocity: number = 0.6) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    oscHarmonic.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    oscHarmonic.frequency.setValueAtTime(freq * 2, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.frequency.exponentialRampToValueAtTime(300, time + duration);

    // Warm piano attack and long decay
    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.linearRampToValueAtTime(velocity * 0.45, time + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    oscHarmonic.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.musicGain);

    osc.start(time);
    oscHarmonic.start(time);
    osc.stop(time + duration);
    oscHarmonic.stop(time + duration);
  }

  /**
   * Warm orchestral strings / pad chord behind piano for cinematic emotion
   */
  private playPadChord(freqs: number[], time: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;

    freqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const padGain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, time);

      padGain.gain.setValueAtTime(0.0001, time);
      padGain.gain.linearRampToValueAtTime(0.04, time + 0.6);
      padGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(padGain);
      padGain.connect(this.musicGain!);

      osc.start(time);
      osc.stop(time + duration);
    });
  }

  /**
   * Starts looping emotional instrumental birthday theme
   */
  public startMusic() {
    this.initContext();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;
    this.notify();

    // Notes frequencies (C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88, C5=523.25)
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00, Bb5 = 932.33;
    const C3 = 130.81, F3 = 174.61, G3 = 196.00, A3 = 220.00;

    // Melody: Happy Birthday to Deepak Bhai
    // G4 G4 A4 G4 C5 B4
    // G4 G4 A4 G4 D5 C5
    // G4 G4 G5 E5 C5 B4 A4
    // F5 F5 E5 C5 D5 C5
    const melody: Array<{ freq: number; dur: number; delay: number }> = [
      { freq: G4, dur: 0.4, delay: 0 },
      { freq: G4, dur: 0.4, delay: 0.5 },
      { freq: A4, dur: 0.8, delay: 1.0 },
      { freq: G4, dur: 0.8, delay: 2.0 },
      { freq: C5, dur: 0.8, delay: 3.0 },
      { freq: B4, dur: 1.5, delay: 4.0 },

      { freq: G4, dur: 0.4, delay: 6.0 },
      { freq: G4, dur: 0.4, delay: 6.5 },
      { freq: A4, dur: 0.8, delay: 7.0 },
      { freq: G4, dur: 0.8, delay: 8.0 },
      { freq: D5, dur: 0.8, delay: 9.0 },
      { freq: C5, dur: 1.5, delay: 10.0 },

      { freq: G4, dur: 0.4, delay: 12.0 },
      { freq: G4, dur: 0.4, delay: 12.5 },
      { freq: G5, dur: 0.8, delay: 13.0 },
      { freq: E5, dur: 0.8, delay: 14.0 },
      { freq: C5, dur: 0.8, delay: 15.0 },
      { freq: B4, dur: 0.8, delay: 16.0 },
      { freq: A4, dur: 1.5, delay: 17.0 },

      { freq: F5, dur: 0.4, delay: 19.0 },
      { freq: F5, dur: 0.4, delay: 19.5 },
      { freq: E5, dur: 0.8, delay: 20.0 },
      { freq: C5, dur: 0.8, delay: 21.0 },
      { freq: D5, dur: 0.8, delay: 22.0 },
      { freq: C5, dur: 2.2, delay: 23.0 },
    ];

    const chords: Array<{ freqs: number[]; delay: number; dur: number }> = [
      { freqs: [C3, G3, C4, E4], delay: 0, dur: 5.5 },
      { freqs: [G3, D4, G4, B4], delay: 6, dur: 5.5 },
      { freqs: [C3, G3, C4, E4], delay: 12, dur: 3.5 },
      { freqs: [F3, C4, F4, A4], delay: 16, dur: 2.8 },
      { freqs: [C3, G3, C4, E4], delay: 19, dur: 2.8 },
      { freqs: [G3, D4, G4, B4], delay: 22, dur: 1.5 },
      { freqs: [C3, G3, C4, E4, G4], delay: 23, dur: 3.5 },
    ];

    const totalDuration = 27; // seconds per cycle

    const scheduleCycle = (startOffset: number) => {
      const now = this.ctx!.currentTime + startOffset;
      
      melody.forEach((note) => {
        this.playPianoNote(note.freq, now + note.delay, note.dur, 0.65);
      });

      chords.forEach((chord) => {
        this.playPadChord(chord.freqs, now + chord.delay, chord.dur);
      });
    };

    scheduleCycle(0.1);

    this.musicInterval = window.setInterval(() => {
      if (!this.isPlayingMusic) return;
      scheduleCycle(0);
    }, totalDuration * 1000);
  }

  public stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.notify();
  }

  /**
   * Sound effect: Cake Cutting Knife Slice & Joyful Chime
   */
  public playCakeCutSFX() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Slice swoosh sound
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.35, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.35);

    const sliceGain = this.ctx.createGain();
    sliceGain.gain.setValueAtTime(0.001, now);
    sliceGain.gain.linearRampToValueAtTime(0.4, now + 0.05);
    sliceGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    whiteNoise.connect(filter);
    filter.connect(sliceGain);
    sliceGain.connect(this.sfxGain);
    whiteNoise.start(now);

    // Celebratory magical golden arpeggio
    const chimePitches = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    chimePitches.forEach((p, idx) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      const t = now + 0.1 + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p, t);

      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.3, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(t);
      osc.stop(t + 0.8);
    });
  }

  /**
   * Sound effect: Candle blow out whoosh
   */
  public playCandleBlowSFX() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.6, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(900, now + 0.2);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.6);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  /**
   * Sound effect: Party horn & cheer
   */
  public playPartyHornSFX() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.25);
    osc.frequency.setValueAtTime(440, now + 0.4);
    osc.frequency.exponentialRampToValueAtTime(392, now + 0.7);

    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.25, now + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    osc.connect(filter);
    filter.connect(g);
    g.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.8);
  }

  /**
   * Sound effect: Golden sparkle / wish pop
   */
  public playSparkleSFX() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const tones = [880, 1046.5, 1318.5, 1760];
    tones.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      const t = now + i * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.2, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }
}

export const audioEngine = new BirthdayAudioEngine();
