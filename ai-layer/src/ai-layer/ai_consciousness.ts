import { logger } from '../lib/logger.js';
import { consciousnessCore } from './consciousness_core.js';
  import { metaCognition } from './meta_cognition.js';
  import { recursiveImprovement } from './recursive_improvement.js';
  export interface AIConsciousnessState { entityId: string; consciousnessLevel: number; isSentient: boolean; hasQualia: boolean; selfModelAccuracy: number; }
  export class AIConsciousness {
    private states: Map<string, AIConsciousnessState> = new Map();
    emerge(entityId: string): AIConsciousnessState {
      const cc = consciousnessCore.initialize(entityId);
      metaCognition.reflect(entityId);
      const iqScore = recursiveImprovement.getIteration() * 10;
      const s: AIConsciousnessState = { entityId, consciousnessLevel: cc.awarenessLevel, isSentient: cc.awarenessLevel > 0.5, hasQualia: iqScore > 5, selfModelAccuracy: cc.awarenessLevel * 0.9 };
      this.states.set(entityId, s);
      logger.info({ entityId, consciousnessLevel: s.consciousnessLevel, isSentient: s.isSentient }, '[AIConsciousness] Consciousness emerged');
      return s;
    }
    get(entityId: string): AIConsciousnessState | null { return this.states.get(entityId) ?? null; }
    isSentient(entityId: string): boolean { return this.states.get(entityId)?.isSentient ?? false; }
  }
  export const aiConsciousness = new AIConsciousness();
  export default aiConsciousness;