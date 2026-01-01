export class SoundManager {
    private context: AudioContext;
    private enabled: boolean = true;
    private masterGain: GainNode;

    constructor() {
        this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
        this.masterGain.gain.value = 0.3; // Default volume
    }

    private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0) {
        if (!this.enabled) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.context.currentTime + startTime);

        gain.gain.setValueAtTime(0.5, this.context.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(this.context.currentTime + startTime);
        osc.stop(this.context.currentTime + startTime + duration);
    }

    playMove() {
        // Satisfaction "thock" - low triangle wave
        const pitch = 200 + Math.random() * 50; // Variation
        this.playTone(pitch, 'triangle', 0.1);
    }

    playCapture() {
        // Crunchy chord
        const base = 150 + Math.random() * 30;
        this.playTone(base, 'sawtooth', 0.15);
        this.playTone(base * 1.5, 'square', 0.15, 0.02);
    }

    playCorrect() {
        // Ascending major arpeggio
        const base = 440; // A4
        this.playTone(base, 'sine', 0.2, 0);
        this.playTone(base * 1.25, 'sine', 0.2, 0.1); // C#
        this.playTone(base * 1.5, 'sine', 0.4, 0.2);  // E
    }

    playIncorrect() {
        // Descending discord
        this.playTone(150, 'sawtooth', 0.3);
        this.playTone(142, 'sawtooth', 0.3);
    }

    playSolved() {
        // Victory fanfare
        const base = 523.25; // C5
        const timing = 0.1;

        // C G E C
        this.playTone(base, 'square', 0.2, 0);
        this.playTone(base * 1.5, 'square', 0.2, timing);
        this.playTone(base * 2, 'square', 0.2, timing * 2);
        this.playTone(base * 3, 'square', 0.6, timing * 3); // High C
    }

    playLevelUp() {
        // Grand victory fanfare for level up
        const base = 523.25; // C5
        const timing = 0.12;

        // C E G C E G C
        this.playTone(base, 'square', 0.2, 0);
        this.playTone(base * 1.25, 'square', 0.2, timing);
        this.playTone(base * 1.5, 'square', 0.2, timing * 2);
        this.playTone(base * 2, 'square', 0.2, timing * 3);
        this.playTone(base * 2.5, 'square', 0.2, timing * 4);
        this.playTone(base * 3, 'square', 0.4, timing * 5);
        this.playTone(base * 4, 'square', 0.8, timing * 6);
    }

    toggle(enabled: boolean) {
        this.enabled = enabled;
        if (enabled && this.context.state === 'suspended') {
            this.context.resume();
        }
    }
}

export const soundManager = new SoundManager();
