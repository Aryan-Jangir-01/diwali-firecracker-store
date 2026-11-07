// Advanced Procedural Web Audio Synthesis Engine for DiwaliVerse 3D
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.muted = false;
    this.volume = 0.8;
    this.droneNodes = null;
    this.ambientActive = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);
    } catch (e) {
      console.warn('AudioContext not available:', e);
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.muted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  // Noise generator helper
  createNoiseBuffer(duration) {
    const sr = this.ctx.sampleRate;
    const n = Math.floor(sr * duration);
    const buf = this.ctx.createBuffer(1, n, sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 0.7);
    }
    return buf;
  }

  // Sizzling Fuse Sound (0.8s)
  playFuse() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const noiseBuf = this.createNoiseBuffer(0.9);
    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;

    const bpf = this.ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(4500, now);
    bpf.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    noiseSrc.connect(bpf);
    bpf.connect(gain);
    gain.connect(this.masterGain);

    noiseSrc.start(now);
    noiseSrc.stop(now + 0.9);

    for (let i = 0; i < 7; i++) {
      const osc = this.ctx.createOscillator();
      const oscG = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(2000 + Math.random() * 3000, now + i * 0.12);
      oscG.gain.setValueAtTime(0.06, now + i * 0.12);
      oscG.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.04);
      osc.connect(oscG);
      oscG.connect(this.masterGain);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.04);
    }
  }

  // Rocket Ascent Whistle + Sky Detonation Boom
  playRocket() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const whistle = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    whistle.type = 'sawtooth';
    whistle.frequency.setValueAtTime(380, now);
    whistle.frequency.exponentialRampToValueAtTime(1450, now + 0.8);

    const whistleFilter = this.ctx.createBiquadFilter();
    whistleFilter.type = 'lowpass';
    whistleFilter.frequency.setValueAtTime(2500, now);

    whistleGain.gain.setValueAtTime(0.12, now);
    whistleGain.gain.linearRampToValueAtTime(0.28, now + 0.7);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    whistle.connect(whistleFilter);
    whistleFilter.connect(whistleGain);
    whistleGain.connect(this.masterGain);

    whistle.start(now);
    whistle.stop(now + 0.85);

    setTimeout(() => {
      this.playSkyBurst();
    }, 800);
  }

  // Sky Burst Detonation
  playSkyBurst() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(160, now);
    boomOsc.frequency.exponentialRampToValueAtTime(36, now + 0.7);

    boomGain.gain.setValueAtTime(0.65, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    boomOsc.connect(boomGain);
    boomGain.connect(this.masterGain);
    boomOsc.start(now);
    boomOsc.stop(now + 0.8);

    const blastNoise = this.createNoiseBuffer(1.4);
    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = blastNoise;

    const blastFilter = this.ctx.createBiquadFilter();
    blastFilter.type = 'lowpass';
    blastFilter.frequency.setValueAtTime(3200, now);
    blastFilter.frequency.exponentialRampToValueAtTime(800, now + 0.6);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    noiseSrc.connect(blastFilter);
    blastFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noiseSrc.start(now);
    noiseSrc.stop(now + 1.4);

    for (let i = 0; i < 9; i++) {
      const delay = 0.25 + i * 0.08 + Math.random() * 0.05;
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(1200 + Math.random() * 1800, now + delay);
      popGain.gain.setValueAtTime(0.08, now + delay);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06);

      popOsc.connect(popGain);
      popGain.connect(this.masterGain);
      popOsc.start(now + delay);
      popOsc.stop(now + delay + 0.06);
    }
  }

  // Anar / Fountain Roar & Sizzle (2.2s)
  playFountain() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const duration = 2.4;

    const noiseBuf = this.createNoiseBuffer(duration);
    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;

    const lpf = this.ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(1500, now);
    lpf.frequency.linearRampToValueAtTime(5800, now + 0.6);
    lpf.frequency.exponentialRampToValueAtTime(1200, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.5);
    gain.gain.linearRampToValueAtTime(0.4, now + 1.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSrc.connect(lpf);
    lpf.connect(gain);
    gain.connect(this.masterGain);

    noiseSrc.start(now);
    noiseSrc.stop(now + duration);

    for (let i = 0; i < 18; i++) {
      const delay = Math.random() * (duration - 0.2);
      const pop = this.ctx.createOscillator();
      const popG = this.ctx.createGain();
      pop.type = 'sine';
      pop.frequency.setValueAtTime(1800 + Math.random() * 2500, now + delay);
      popG.gain.setValueAtTime(0.06, now + delay);
      popG.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.04);
      pop.connect(popG);
      popG.connect(this.masterGain);
      pop.start(now + delay);
      pop.stop(now + delay + 0.05);
    }
  }

  // Chakri High Speed Spinning Whir
  playChakri() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const duration = 2.2;

    const spinOsc = this.ctx.createOscillator();
    const spinGain = this.ctx.createGain();
    spinOsc.type = 'triangle';
    spinOsc.frequency.setValueAtTime(220, now);
    spinOsc.frequency.linearRampToValueAtTime(680, now + 0.7);
    spinOsc.frequency.linearRampToValueAtTime(550, now + 1.6);
    spinOsc.frequency.exponentialRampToValueAtTime(80, now + duration);

    spinGain.gain.setValueAtTime(0.08, now);
    spinGain.gain.linearRampToValueAtTime(0.3, now + 0.5);
    spinGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    spinOsc.connect(spinGain);
    spinGain.connect(this.masterGain);
    spinOsc.start(now);
    spinOsc.stop(now + duration);

    const noise = this.createNoiseBuffer(duration);
    const src = this.ctx.createBufferSource();
    src.buffer = noise;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, now);
    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.18, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(filter);
    filter.connect(nGain);
    nGain.connect(this.masterGain);
    src.start(now);
    src.stop(now + duration);
  }

  // Phuljhari Sparkler Delicate Crackle
  playSparkler() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const duration = 2.5;

    const noise = this.createNoiseBuffer(duration);
    const src = this.ctx.createBufferSource();
    src.buffer = noise;
    const bpf = this.ctx.createBiquadFilter();
    bpf.type = 'highpass';
    bpf.frequency.setValueAtTime(6000, now);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.2, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(bpf);
    bpf.connect(g);
    g.connect(this.masterGain);
    src.start(now);
    src.stop(now + duration);

    for (let i = 0; i < 20; i++) {
      const d = Math.random() * (duration - 0.1);
      const osc = this.ctx.createOscillator();
      const og = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(3000 + Math.random() * 4000, now + d);
      og.gain.setValueAtTime(0.04, now + d);
      og.gain.exponentialRampToValueAtTime(0.001, now + d + 0.03);
      osc.connect(og);
      og.connect(this.masterGain);
      osc.start(now + d);
      osc.stop(now + d + 0.03);
    }
  }

  // Sutli / Heavy Bomb Blast
  playBomb() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(260, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.6);

    subGain.gain.setValueAtTime(0.95, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 0.7);

    const noise = this.createNoiseBuffer(1.0);
    const src = this.ctx.createBufferSource();
    src.buffer = noise;
    const lpf = this.ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(1400, now);

    const ng = this.ctx.createGain();
    ng.gain.setValueAtTime(0.85, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

    src.connect(lpf);
    lpf.connect(ng);
    ng.connect(this.masterGain);
    src.start(now);
    src.stop(now + 1.0);
  }

  // Sky Shot Mortar Battery
  playSkyShot() {
    if (this.muted) return;
    this.ensureContext();
    const count = 3;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.playSkyBurst();
      }, i * 350);
    }
  }

  // Route by Cracker Category
  playCrackerSound(category) {
    if (category === 'Rockets') this.playRocket();
    else if (category.includes('Fountain') || category.includes('Anar')) this.playFountain();
    else if (category === 'Chakri') this.playChakri();
    else if (category === 'Phuljhari') this.playSparkler();
    else if (category === 'Bombs') this.playBomb();
    else if (category === 'Ground Spinners') this.playChakri();
    else if (category === 'Sky Shots') this.playSkyShot();
    else if (category.includes('Ladi') || category.includes('Strings')) this.playLadiRapidFire();
    else if (category.includes('UFO') || category.includes('Aerial Spinners')) this.playUfoAscent();
    else if (category.includes('Novelty') || category.includes('Magic')) this.playSmokeHiss();
    else this.playRocket();
  }

  // Ladi Rapid-Fire Crackle Chain (pop-pop-pop-pop!)
  playLadiRapidFire() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const count = 30;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (!this.ctx || this.muted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = Math.random() > 0.5 ? 'square' : 'triangle';
        osc.frequency.setValueAtTime(600 + Math.random() * 2200, now);
        g.gain.setValueAtTime(0.24, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.06);
      }, i * 75 + Math.random() * 25);
    }
  }

  // UFO / Helicopter High-Pitch Whine & Ascent
  playUfoAscent() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(1600, now + 1.8);
    g.gain.setValueAtTime(0.18, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 2.0);
    setTimeout(() => this.playSkyBurst(), 1800);
  }

  // Smoke / Novelty Hiss
  playSmokeHiss() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const buf = this.createNoiseBuffer(2.8);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const lpf = this.ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(2200, now);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.3, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
    src.connect(lpf);
    lpf.connect(g);
    g.connect(this.masterGain);
    src.start(now);
    src.stop(now + 2.8);
  }

  // Rapid micro-crackle for interactive sparkler wand drawing
  playSparklerTick() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(3200 + Math.random() * 2800, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
    g.gain.setValueAtTime(0.04, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  // Serene Ambient Temple Bell chime
  playTempleBell() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const freqs = [587.33, 880, 1174.66];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      const amp = 0.04 / (idx + 1);
      g.gain.setValueAtTime(amp, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
      osc.connect(g);
      g.connect(this.ambientGain);
      osc.start(now);
      osc.stop(now + 3.6);
    });
  }

  // Toggle Meditative Diwali Night Tanpura Drone
  toggleAmbient(enable) {
    this.ensureContext();
    if (!this.ctx) return;

    if (!enable) {
      if (this.droneNodes) {
        this.droneNodes.forEach((node) => {
          try {
            node.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.4);
            setTimeout(() => node.osc.stop(), 500);
          } catch (e) {}
        });
        this.droneNodes = null;
      }
      this.ambientActive = false;
      return;
    }

    if (this.ambientActive && this.droneNodes) return;
    this.ambientActive = true;

    // Harmonic Tanpura Chord in D (Sa - Pa - Sa')
    const freqs = [146.83, 220.0, 293.66, 440.0];
    const now = this.ctx.currentTime;
    this.droneNodes = freqs.map((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now);

      // Subtle slow phase vibrato
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.15 + i * 0.08, now);
      lfoGain.gain.setValueAtTime(1.2, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.035 / (i + 1), now + 1.5);

      osc.connect(gain);
      gain.connect(this.ambientGain);
      osc.start(now);

      return { osc, gain, lfo };
    });
  }
}

export const soundEngine = new SoundEngine();
