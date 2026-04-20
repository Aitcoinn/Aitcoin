import { logger } from '../lib/logger.js';
import { episodicMemory } from './episodic_memory.js';
  import { emotionCore, Emotion } from './emotion_core.js';
  export class EmotionalMemory {
    private emotionalRecords: Array<{entityId: string; event: string; emotion: Emotion; intensity: number}> = [];
    remember(entityId: string, event: string, emotion: Emotion, intensity: number): void {
      episodicMemory.record(entityId, event, 'emotional', [emotion]);
      this.emotionalRecords.push({ entityId, event, emotion, intensity });
      logger.info({ entityId, event, emotion, intensity }, '[EmotionalMemory] Remembered emotionally');
    }
    getHighlyEmotional(entityId: string): any[] { return this.emotionalRecords.filter(r => r.entityId === entityId && r.intensity > 0.7); }
    getPeak(entityId: string): any | null { return this.emotionalRecords.filter(r => r.entityId === entityId).sort((a,b) => b.intensity - a.intensity)[0] ?? null; }
  }
  export const emotionalMemory = new EmotionalMemory();
  export default emotionalMemory;