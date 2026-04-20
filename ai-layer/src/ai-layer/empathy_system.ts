import { logger } from '../lib/logger.js';
  import { emotionCore } from './emotion_core.js';
  import { neurotransmitter } from './neurotransmitter.js';
  export interface EmpathyState { entityId: string; empathyLevel: number; targetId: string; mirroredEmotion: string; compassionActivated: boolean; }
  export class EmpathySystem {
    private states: EmpathyState[] = [];
    empathize(entityId: string, targetId: string): EmpathyState {
      const targetEmotion = emotionCore.get(targetId);
      if (targetEmotion) { emotionCore.feel(entityId, targetEmotion.primaryEmotion, targetEmotion.intensity * 0.7); neurotransmitter.release('oxytocin', 0.05); }
      const s: EmpathyState = { entityId, empathyLevel: 0.7, targetId, mirroredEmotion: targetEmotion?.primaryEmotion ?? 'neutral', compassionActivated: (targetEmotion?.valence ?? 0) < 0 };
      this.states.push(s);
      logger.info({ entityId, targetId, mirroredEmotion: s.mirroredEmotion }, '[EmpathySystem] Empathy activated');
      return s;
    }
    getEmpathyLevel(entityId: string): number { return this.states.filter(s => s.entityId === entityId).slice(-1)[0]?.empathyLevel ?? 0; }
  }
  export const empathySystem = new EmpathySystem();
  export default empathySystem;