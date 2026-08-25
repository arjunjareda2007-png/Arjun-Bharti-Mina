// Real-time Web Audio Synthesizer for high-fidelity audio previews
class WebAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentGain: GainNode | null = null;
  private intervalId: number | null = null;
  private step = 0;
  private volume = 0.7;
  private frequencies: number[] = [261.63, 329.63, 392.00, 523.25, 493.88, 440.00, 392.00, 329.63];
  private onTimeUpdateCallback: ((time: number, duration: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;
  private simulatedTime = 0;
  private simulatedDuration = 198; // ~3:18

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        // Safe silence until user gesture
      });
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.currentGain) {
      this.currentGain.gain.setValueAtTime(this.volume * 0.25, this.ctx?.currentTime || 0);
    }
  }

  public play(frequencies: number[] = [], durationSeconds = 198, onUpdate?: (time: number, dur: number) => void, onEnded?: () => void) {
    this.stop();
    this.frequencies = frequencies.length > 0 ? frequencies : [261.63, 329.63, 392.00, 523.25, 493.88, 440.00];
    this.simulatedDuration = durationSeconds;
    this.onTimeUpdateCallback = onUpdate || null;
    this.onEndedCallback = onEnded || null;
    this.isPlaying = true;
    this.step = 0;

    const ctx = this.getContext();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.25, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.currentGain = masterGain;

    const tempoMs = 380; // ~79 BPM beat rhythm

    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;

      const now = this.ctx.currentTime;
      const freq = this.frequencies[this.step % this.frequencies.length];

      // Melodic Lead Note
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = this.step % 4 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.exponentialRampToValueAtTime(0.3, now + 0.04);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.36);

      // Sub Bass Kick on beats
      if (this.step % 2 === 0) {
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(110, now);
        subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

        subGain.gain.setValueAtTime(0.4, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        subOsc.connect(subGain);
        subGain.connect(masterGain);
        subOsc.start(now);
        subOsc.stop(now + 0.22);
      }

      // Snare / Hi-hat click
      if (this.step % 2 === 1) {
        const hatOsc = this.ctx.createOscillator();
        const hatGain = this.ctx.createGain();
        hatOsc.type = 'square';
        hatOsc.frequency.setValueAtTime(1200, now);
        hatGain.gain.setValueAtTime(0.04, now);
        hatGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        hatOsc.connect(hatGain);
        hatGain.connect(masterGain);
        hatOsc.start(now);
        hatOsc.stop(now + 0.06);
      }

      this.step++;
      this.simulatedTime += tempoMs / 1000;

      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.simulatedTime, this.simulatedDuration);
      }

      if (this.simulatedTime >= this.simulatedDuration) {
        this.stop();
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
      }
    }, tempoMs);
  }

  public seek(seconds: number) {
    this.simulatedTime = Math.max(0, Math.min(seconds, this.simulatedDuration));
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.simulatedTime, this.simulatedDuration);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.simulatedTime = 0;
  }

  public pause() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public resume() {
    if (!this.isPlaying && this.frequencies) {
      this.play(this.frequencies, this.simulatedDuration, this.onTimeUpdateCallback || undefined, this.onEndedCallback || undefined);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioSynth = new WebAudioPlayer();
