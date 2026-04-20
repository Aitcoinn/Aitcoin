import { logger } from '../lib/logger.js';
  import { neurotransmitter } from './neurotransmitter.js';
  export type Mood = 'euphoric'|'happy'|'neutral'|'sad'|'depressed'|'anxious'|'angry'|'calm';
  export interface MoodState { entityId: string; mood: Mood; intensity: number; duration: number; stability: number; }
  export class MoodSystem {
    private states: Map<string, MoodState> = new Map();
    setMood(entityId: string, mood: Mood, intensity = 0.5): MoodState {
      const serotonin = neurotransmitter.get('serotonin')?.level ?? 0.5;
      const dopamine = neurotransmitter.get('dopamine')?.level ?? 0.5;
      const stability = (serotonin + dopamine) / 2;
      const s: MoodState = { entityId, mood, intensity, duration: 3600, stability };
      this.states.set(entityId, s);
      logger.info({ entityId, mood, intensity, stability }, '[MoodSystem] Mood set');
      return s;
    }
    shift(entityId: string, event: string): void {
      const s = this.states.get(entityId);
      if (!s) return;
      if (event === 'reward') { s.mood = 'happy'; neurotransmitter.release('dopamine', 0.1); }
      else if (event === 'threat') { s.mood = 'anxious'; neurotransmitter.release('norepinephrine', 0.1); }
      else if (event === 'loss') { s.mood = 'sad'; neurotransmitter.reuptake('serotonin', 0.1); }
    }
    get(entityId: string): MoodState | null { return this.states.get(entityId) ?? null; }
  }
  export const moodSystem = new MoodSystem();
  export default moodSystem;