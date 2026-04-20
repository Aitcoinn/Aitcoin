import { logger } from '../lib/logger.js';
export class ReadingSpeed {
    private speeds: Map<string, number> = new Map();
    setWPM(entityId: string, wpm: number): void { this.speeds.set(entityId, wpm); }
    getWPM(entityId: string): number { return this.speeds.get(entityId) ?? 250; }
    calculateReadingTime(entityId: string, wordCount: number): number { return wordCount / this.getWPM(entityId); }
    improve(entityId: string, amount: number): void { const wpm = this.getWPM(entityId); this.speeds.set(entityId, wpm + amount); }
  }
  export const readingSpeed = new ReadingSpeed();
  export default readingSpeed;