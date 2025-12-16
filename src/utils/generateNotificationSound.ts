/**
 * Utility to generate notification sounds using Web Audio API
 * This can be used as a fallback when audio files are not available
 */

export class NotificationSoundGenerator {
  private audioContext: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  /**
   * Play a simple notification beep
   */
  playSimpleBeep(frequency: number = 800, duration: number = 150) {
    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }

  /**
   * Play a double beep notification (more noticeable)
   */
  playDoubleBeep() {
    try {
      this.playSimpleBeep(800, 100);
      setTimeout(() => {
        this.playSimpleBeep(1000, 100);
      }, 150);
    } catch (error) {
      console.error('Error playing double beep:', error);
    }
  }

  /**
   * Play a success sound
   */
  playSuccess() {
    try {
      const ctx = this.getAudioContext();
      
      // First tone (lower)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.frequency.value = 523.25; // C5
      osc1.type = 'sine';
      gain1.gain.setValueAtTime(0.2, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.1);

      // Second tone (higher)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 659.25; // E5
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.2);
    } catch (error) {
      console.error('Error playing success sound:', error);
    }
  }

  /**
   * Play a warning sound
   */
  playWarning() {
    try {
      this.playSimpleBeep(600, 200);
      setTimeout(() => {
        this.playSimpleBeep(600, 200);
      }, 250);
    } catch (error) {
      console.error('Error playing warning sound:', error);
    }
  }

  /**
   * Play an error/alert sound
   */
  playError() {
    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 400;
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.error('Error playing error sound:', error);
    }
  }
}

export const soundGenerator = new NotificationSoundGenerator();

