class AudioController {
  private ctx: AudioContext | null = null;
  private soundNodes: (OscillatorNode | GainNode)[] = [];
  private isSoundOn = false;
  private isVoiceOn = false;
  private masterGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playPop() {
    if (!this.isSoundOn) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(680, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch {
      // Audio fallback
    }
  }

  public playStinger() {
    if (!this.isSoundOn) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      [260, 330, 392, 523.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.04);
        gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + i * 0.04 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.04 + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.04);
        osc.stop(ctx.currentTime + i * 0.04 + 0.75);
      });
    } catch {
      // Ignore audio error
    }
  }

  public toggleAmbientSound(enable?: boolean): boolean {
    const shouldEnable = enable !== undefined ? enable : !this.isSoundOn;
    const ctx = this.getContext();
    if (!ctx) return false;

    if (shouldEnable) {
      if (this.soundNodes.length === 0) {
        this.masterGain = ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        this.masterGain.connect(ctx.destination);

        // Ambient chord
        const chords = [130.81, 164.81, 196.00, 261.63];
        chords.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = freq * (i === 1 ? 1.002 : 1);

          const gain = ctx.createGain();
          gain.gain.value = 0.015;
          osc.connect(gain);
          if (this.masterGain) gain.connect(this.masterGain);

          osc.start();
          this.soundNodes.push(osc);
        });

        // Slow LFO for organic breathing atmosphere
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.08;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.01;
        lfo.connect(lfoGain);
        if (this.masterGain) lfoGain.connect(this.masterGain.gain);
        lfo.start();
        this.soundNodes.push(lfo);

        this.masterGain.gain.setTargetAtTime(0.12, ctx.currentTime, 1.2);
        this.soundNodes.push(this.masterGain);
      }
      this.isSoundOn = true;
    } else {
      this.soundNodes.forEach((node) => {
        try {
          if ('stop' in node && typeof node.stop === 'function') {
            node.stop();
          }
        } catch {
          // Clean up
        }
      });
      this.soundNodes = [];
      this.isSoundOn = false;
    }

    return this.isSoundOn;
  }

  public toggleVoice(enable?: boolean): boolean {
    this.isVoiceOn = enable !== undefined ? enable : !this.isVoiceOn;
    if (!this.isVoiceOn && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return this.isVoiceOn;
  }

  public speakText(text: string, speakerType: 'a' | 's' | 'n' = 'a') {
    if (!this.isVoiceOn || !text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      // Remove glossary token tags from speech
      const cleanText = text.replace(/\[\[(\w+)\]\]/g, '$1');
      const utterance = new SpeechSynthesisUtterance(cleanText);

      const voices = window.speechSynthesis.getVoices();

      if (speakerType === 's') {
        // Mohamed - Farmer perspective: select a clear male voice
        utterance.pitch = 0.82;
        utterance.rate = 0.92;

        if (voices.length > 0) {
          // Look for male voice profiles
          const maleKeywords = [
            'male', 'david', 'mark', 'george', 'james', 'daniel', 'aaron', 'arthur',
            'alex', 'guy', 'fred', 'oliver', 'matthew', 'tom', 'grandpa', 'uk english male',
            'en-us-standard-b', 'en-us-standard-c', 'en-us-standard-d', 'en-us-standard-j',
            'neural2-a', 'neural2-d', 'neural2-j'
          ];
          
          const maleVoice = voices.find((v) => {
            const name = v.name.toLowerCase();
            return maleKeywords.some((keyword) => name.includes(keyword));
          }) || voices.find((v) => v.lang.startsWith('en') && !v.name.toLowerCase().includes('female') && !v.name.toLowerCase().includes('zira') && !v.name.toLowerCase().includes('samantha'));

          if (maleVoice) {
            utterance.voice = maleVoice;
          }
        }
      } else if (speakerType === 'a') {
        // Dr. Amira - Policy/scientific lead: select a female voice
        utterance.pitch = 1.05;
        utterance.rate = 0.98;

        if (voices.length > 0) {
          const femaleKeywords = [
            'female', 'samantha', 'zira', 'victoria', 'karen', 'moira', 'fiona',
            'jenny', 'ava', 'emma', 'aria', 'uk english female', 'neural2-f', 'neural2-c'
          ];
          
          const femaleVoice = voices.find((v) => {
            const name = v.name.toLowerCase();
            return femaleKeywords.some((keyword) => name.includes(keyword));
          }) || voices.find((v) => v.lang.startsWith('en'));

          if (femaleVoice) {
            utterance.voice = femaleVoice;
          }
        }
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 0.95;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech fallback
    }
  }

  public getSoundState() {
    return {
      isSoundOn: this.isSoundOn,
      isVoiceOn: this.isVoiceOn
    };
  }
}

export const audioController = new AudioController();
