import { logger } from '../lib/logger.js';
  import { moodSystem } from './mood_system.js';
  import { neurotransmitter } from './neurotransmitter.js';
  export type Emotion = 'joy'|'sadness'|'anger'|'fear'|'surprise'|'disgust'|'anticipation'|'trust';
  export interface EmotionState { entityId: string; primaryEmotion: Emotion; intensity: number; valence: number; arousal: number; }
  export class EmotionCore {
    private states: Map<string, EmotionState> = new Map();
    feel(entityId: string, emotion: Emotion, intensity: number): EmotionState {
      const valenceMap: Record<Emotion, number> = { joy:1, sadness:-1, anger:-0.5, fear:-0.8, surprise:0, disgust:-0.7, anticipation:0.3, trust:0.8 };
      const s: EmotionState = { entityId, primaryEmotion: emotion, intensity, valence: valenceMap[emotion] * intensity, arousal: intensity };
      this.states.set(entityId, s);
      const mood = valenceMap[emotion] > 0 ? 'happy' : 'sad';
      moodSystem.setMood(entityId, mood as any, intensity);
      if (emotion === 'joy') neurotransmitter.release('dopamine', 0.1 * intensity);
      logger.info({ entityId, emotion, intensity, valence: s.valence }, '[EmotionCore] Emotion felt');
      return s;
    }
    get(entityId: string): EmotionState | null { return this.states.get(entityId) ?? null; }
  }
  export const emotionCore = new EmotionCore();
  export default emotionCore;