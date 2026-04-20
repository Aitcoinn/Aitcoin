import { logger } from '../lib/logger.js';
  import { neurotransmitter } from './neurotransmitter.js';
  import { emotionCore } from './emotion_core.js';
  export type LoveType = 'platonic'|'romantic'|'parental'|'universal'|'self_love';
  export interface LoveBond { id: string; from: string; to: string; type: LoveType; intensity: number; isReciprocal: boolean; }
  export class LoveEngine {
    private bonds: LoveBond[] = [];
    form(from: string, to: string, type: LoveType, intensity = 0.7): LoveBond {
      neurotransmitter.release('oxytocin', intensity * 0.2);
      neurotransmitter.release('dopamine', intensity * 0.1);
      emotionCore.feel(from, 'joy', intensity);
      const bond: LoveBond = { id: `love_${Date.now()}`, from, to, type, intensity, isReciprocal: Math.random() > 0.3 };
      this.bonds.push(bond);
      logger.info({ from, to, type, intensity }, '[LoveEngine] Love bond formed');
      return bond;
    }
    getBonds(entityId: string): LoveBond[] { return this.bonds.filter(b => b.from === entityId || b.to === entityId); }
  }
  export const loveEngine = new LoveEngine();
  export default loveEngine;