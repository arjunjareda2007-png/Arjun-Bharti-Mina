// Unified Audio Engine supporting Hosted Audio URLs, uploaded files & Web Audio synthesis fallback
import { Song } from '../types';

export interface AudioEngineCallbacks {
  onTimeUpdate?: (time: number, duration: number) => void;
  onEnded?: () => void;
  onError?: (err: Error) => void;
  onBuffering?: (isBuffering: boolean) => void;
}

class UnifiedAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private currentSong: Song | null = null;
  private onTimeUpdateCallback: ((time: number, duration: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;
  private onErrorCallback: ((err: Error) => void) | null = null;
  private onBufferingCallback: ((isBuffering: boolean) => void) | null = null;
  private volume: number = 0.85;
  private playbackRate: number = 1.0;
  private isLoop: boolean = false;
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

        // Native audio event listeners
        this.audioElement.addEventListener('timeupdate', () => {
          if (this.audioElement && this.isAudioFileActive && this.onTimeUpdateCallback) {
            const cur = this.audioElement.currentTime || 0;
            const dur = this.audioElement.duration && !isNaN(this.audioElement.duration) && this.audioElement.duration > 0
              ? this.audioElement.duration 
              : this.synthDuration;
            this.onTimeUpdateCallback(cur, dur);
          }
        });

        this.audioElement.addEventListener('loadedmetadata', () => {
          if (this.audioElement && this.isAudioFileActive && this.onTimeUpdateCallback) {
            const dur = this.audioElement.duration;
            if (dur && !isNaN(dur) && dur > 0) {
              this.onTimeUpdateCallback(this.audioElement.currentTime || 0, dur);
            }
          }
        });

        this.audioElement.addEventListener('waiting', () => {
          if (this.onBufferingCallback) this.onBufferingCallback(true);
        });

        this.audioElement.addEventListener('playing', () => {
          if (this.onBufferingCallback) this.onBufferingCallback(false);
          this.isPlaying = true;
          this.updateMediaSessionState();
        });

        this.audioElement.addEventListener('pause', () => {
          if (this.audioElement && !this.audioElement.ended) {
            this.updateMediaSessionState();
          }
        });

        this.audioElement.addEventListener('ended', () => {
          if (this.isLoop && this.audioElement) {
            this.audioElement.currentTime = 0;
            this.audioElement.play().catch(() => {});
            return;
          }
          this.isPlaying = false;
          if (this.onEndedCallback) {
            this.onEndedCallback();
          }
        });

        this.audioElement.addEventListener('error', (e) => {
          console.warn('Audio element playback notice:', e);
          if (this.onBufferingCallback) this.onBufferingCallback(false);
          if (this.onErrorCallback) {
            this.onErrorCallback(new Error('Audio stream error'));
          }
          // If hosted audio fails (e.g. invalid URL, CORS issue), seamlessly fall back to synth
          if (this.currentSong && this.isPlaying) {
            this.isAudioFileActive = false;
            this.startSynth(this.currentSong);
          }
        });
      } catch (err) {
        console.warn('Audio initialization notice:', err);
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

  private updateMediaSessionMetadata(song: Song) {
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: song.title,
          artist: song.artist,
          album: 'Arjun Bharti Mina Discography',
          artwork: [
            { src: song.cover, sizes: '512x512', type: 'image/jpeg' }
          ]
        });
      } catch (e) {
        // Safe ignore
      }
    }
  }

  private updateMediaSessionState() {
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = this.isPlaying ? 'playing' : 'paused';
      } catch (e) {
        // Safe ignore
      }
    }
  }

  public setMediaSessionActionHandlers(actions: {
    onPlay?: () => void;
    onPause?: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    onSeek?: (details: MediaSessionActionDetails) => void;
  }) {
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      try {
        if (actions.onPlay) navigator.mediaSession.setActionHandler('play', actions.onPlay);
        if (actions.onPause) navigator.mediaSession.setActionHandler('pause', actions.onPause);
        if (actions.onNext) navigator.mediaSession.setActionHandler('nexttrack', actions.onNext);
        if (actions.onPrev) navigator.mediaSession.setActionHandler('previoustrack', actions.onPrev);
        if (actions.onSeek) navigator.mediaSession.setActionHandler('seekto', actions.onSeek);
      } catch (e) {
        // Safe ignore
      }
    }
  }

  public play(
    song: Song,
    onTimeUpdate?: (time: number, duration: number) => void,
    onEnded?: () => void,
    onError?: (err: Error) => void,
    onBuffering?: (isBuffering: boolean) => void
  ) {
    this.stop();
    this.currentSong = song;
    this.onTimeUpdateCallback = onTimeUpdate || null;
    this.onEndedCallback = onEnded || null;
    this.onErrorCallback = onError || null;
    this.onBufferingCallback = onBuffering || null;
    this.isPlaying = true;

    this.updateMediaSessionMetadata(song);

    // If song has a hosted audio URL or data URL
    if (song.audioUrl && song.audioUrl.trim().length > 0 && this.audioElement) {
      this.isAudioFileActive = true;
      if (this.onBufferingCallback) this.onBufferingCallback(true);

      this.audioElement.src = song.audioUrl.trim();
      this.audioElement.playbackRate = this.playbackRate;
      this.audioElement.volume = this.volume;
      this.audioElement.loop = this.isLoop;
      this.audioElement.currentTime = 0;

      this.audioElement
        .play()
        .then(() => {
          this.isPlaying = true;
          if (this.onBufferingCallback) this.onBufferingCallback(false);
          this.updateMediaSessionState();
        })
        .catch((err) => {
          console.warn('Hosted audio playback failed or CORS restricted, falling back to synth preview:', err);
          this.isAudioFileActive = false;
          if (this.onBufferingCallback) this.onBufferingCallback(false);
          if (this.onErrorCallback) {
            this.onErrorCallback(err);
          }
          this.startSynth(song);
        });
    } else {
      // No audio URL attached; use synthesized audio tone preview
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

    const tempoMs = Math.round(380 / (this.playbackRate || 1));

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
      oscGain.gain.exponentialRampToValueAtTime(0.26, now + 0.04);
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
        if (this.isLoop) {
          this.synthTime = 0;
          this.synthStep = 0;
        } else {
          this.stop();
          if (this.onEndedCallback) {
            this.onEndedCallback();
          }
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
    this.updateMediaSessionState();
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
    this.updateMediaSessionState();
  }

  public stop() {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.stopSynth();
    this.synthTime = 0;
    this.updateMediaSessionState();
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

  public setPlaybackRate(rate: number) {
    this.playbackRate = Math.max(0.25, Math.min(2.5, rate));
    if (this.audioElement) {
      this.audioElement.playbackRate = this.playbackRate;
    }
  }

  public setLoop(loop: boolean) {
    this.isLoop = loop;
    if (this.audioElement) {
      this.audioElement.loop = loop;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsAudioFileActive(): boolean {
    return this.isAudioFileActive;
  }

  public getCurrentTime(): number {
    if (this.isAudioFileActive && this.audioElement) {
      return this.audioElement.currentTime || 0;
    }
    return this.synthTime;
  }

  public getDuration(): number {
    if (this.isAudioFileActive && this.audioElement) {
      return this.audioElement.duration || this.synthDuration;
    }
    return this.synthDuration;
  }
}

export const audioEngine = new UnifiedAudioEngine();
