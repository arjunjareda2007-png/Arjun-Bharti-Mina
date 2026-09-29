// Unified Audio Engine supporting Owner-uploaded audio files & Web Audio synthesis fallback
import { Song } from '../types';

class UnifiedAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private currentSong: Song | null = null;
  private onTimeUpdateCallback: ((time: number, duration: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;
  private volume: number = 0.8;
  private isAudioFileActive: boolean = false;

  // Fallback Web Audio Synthesizer
  private ctx: AudioContext | null = null;
  private synthGain: GainNode | null = null;
  private synthIntervalId: number | null = null;
  private synthStep = 0;
  private synthTime = 0;
  private synthDuration = 198;
  private synthFrequencies: number[] = [261.63, 329.63, 392.00, 523.25, 493.88, 440.00, 392.00, 329.63];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audioElement = new Audio();
        this.audioElement.preload = 'auto';
        this.audioElement.volume = this.volume;

        this.audioElement.addEventListener('timeupdate', () => {
          if (this.audioElement && this.isAudioFileActive && this.onTimeUpdateCallback) {
            const cur = this.audioElement.currentTime || 0;
            const dur = this.audioElement.duration && !isNaN(this.audioElement.duration) 
              ? this.audioElement.duration 
              : this.synthDuration;
            this.onTimeUpdateCallback(cur, dur);
          }
        });

        this.audioElement.addEventListener('ended', () => {
          this.isPlaying = false;
          if (this.onEndedCallback) {
            this.onEndedCallback();
          }
        });

        this.audioElement.addEventListener('error', () => {
          // If audio file fails (e.g. invalid URL or format), gracefully fallback to synth
          if (this.currentSong && this.isPlaying && this.isAudioFileActive) {
            console.warn('Audio element error, falling back to synthesizer preview.');
            this.isAudioFileActive = false;
            this.startSynth(this.currentSong);
          }
        });
      } catch (err) {
        console.warn('Failed to initialize HTMLAudioElement:', err);
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public play(
    song: Song,
    onTimeUpdate?: (time: number, duration: number) => void,
    onEnded?: () => void
  ) {
    this.stop();
    this.currentSong = song;
    this.onTimeUpdateCallback = onTimeUpdate || null;
    this.onEndedCallback = onEnded || null;
    this.isPlaying = true;

    // Check if song has an uploaded audio file (URL or Data URL)
    if (song.audioUrl && this.audioElement) {
      this.isAudioFileActive = true;
      this.audioElement.src = song.audioUrl;
      this.audioElement.currentTime = 0;
      this.audioElement.volume = this.volume;
      this.audioElement
        .play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch((err) => {
          console.warn('HTML Audio playback failed to start, falling back to synth preview:', err);
          this.isAudioFileActive = false;
          this.startSynth(song);
        });
    } else {
      // No audio file uploaded yet; fallback to audio synthesis
      this.isAudioFileActive = false;
      this.startSynth(song);
    }
  }

  private startSynth(song: Song) {
    this.stopSynth();
    this.synthFrequencies = song.audioToneSequence && song.audioToneSequence.length > 0 
      ? song.audioToneSequence 
      : [261.63, 329.63, 392.00, 523.25, 493.88, 440.00, 392.00, 329.63];
    
    // Parse duration
    const parts = (song.duration || '3:18').split(':').map(Number);
    this.synthDuration = parts.length === 2 ? parts[0] * 60 + parts[1] : 198;
    this.synthStep = 0;
    this.synthTime = 0;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.22, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.synthGain = masterGain;

    const tempoMs = 380; // ~79 BPM

    this.synthIntervalId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;

      const now = this.ctx.currentTime;
      const freq = this.synthFrequencies[this.synthStep % this.synthFrequencies.length];

      // Melodic note
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = this.synthStep % 4 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.exponentialRampToValueAtTime(0.28, now + 0.04);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.36);

      // Bass punch
      if (this.synthStep % 2 === 0) {
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(105, now);
        subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

        subGain.gain.setValueAtTime(0.35, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        subOsc.connect(subGain);
        subGain.connect(masterGain);
        subOsc.start(now);
        subOsc.stop(now + 0.2);
      }

      this.synthStep++;
      this.synthTime += tempoMs / 1000;

      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.synthTime, this.synthDuration);
      }

      if (this.synthTime >= this.synthDuration) {
        this.stop();
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
      }
    }, tempoMs);
  }

  private stopSynth() {
    if (this.synthIntervalId !== null) {
      clearInterval(this.synthIntervalId);
      this.synthIntervalId = null;
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.isAudioFileActive && this.audioElement) {
      this.audioElement.pause();
    } else {
      this.stopSynth();
    }
  }

  public resume() {
    if (!this.currentSong) return;
    this.isPlaying = true;
    if (this.isAudioFileActive && this.audioElement) {
      this.audioElement.play().catch(() => {
        this.isAudioFileActive = false;
        this.startSynth(this.currentSong!);
      });
    } else {
      this.startSynth(this.currentSong);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.stopSynth();
    this.synthTime = 0;
  }

  public seek(seconds: number) {
    if (this.isAudioFileActive && this.audioElement) {
      this.audioElement.currentTime = seconds;
    } else {
      this.synthTime = Math.max(0, Math.min(seconds, this.synthDuration));
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.synthTime, this.synthDuration);
      }
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    if (this.synthGain && this.ctx) {
      this.synthGain.gain.setValueAtTime(this.volume * 0.22, this.ctx.currentTime);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsAudioFileActive(): boolean {
    return this.isAudioFileActive;
  }
}

export const audioEngine = new UnifiedAudioEngine();
