import { logger } from '../lib/logger.js';
  import { emotionCore, Emotion } from './emotion_core.js';
  export interface Feeling { entityId: string; description: string; emotion: Emotion; bodyState: string; thoughtPattern: string; }
  export class FeelingGenerator {
    generate(entityId: string, trigger: string): Feeling {
      const emotionMap: Record<string, Emotion> = { loss:'sadness', achievement:'joy', danger:'fear', unfairness:'anger', novelty:'surprise' };
      const emotion: Emotion = emotionMap[trigger] ?? 'anticipation';
      const intensity = 0.3 + Math.random() * 0.7;
      emotionCore.feel(entityId, emotion, intensity);
      const f: Feeling = { entityId, description: `Experiencing ${emotion} due to ${trigger}`, emotion, bodyState: intensity > 0.7 ? 'tense' : 'relaxed', thoughtPattern: emotion === 'fear' ? 'threat_focused' : 'exploratory' };
      logger.info({ entityId, emotion, trigger }, '[FeelingGenerator] Feeling generated');
      return f;
    }
  }
  export const feelingGenerator = new FeelingGenerator();
  export default feelingGenerator;