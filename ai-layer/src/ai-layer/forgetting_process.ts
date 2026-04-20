import { logger } from '../lib/logger.js';
import { longTermMemory } from './long_term_memory.js';
  export class ForgettingProcess {
    private forgottenCount: Map<string, number> = new Map();
    forget(entityId: string, key: string): void { const c = this.forgottenCount.get(entityId) ?? 0; this.forgottenCount.set(entityId, c + 1); logger.info({ entityId, key }, '[ForgettingProcess] Memory forgotten'); }
    calculateDecay(initialStrength: number, timeElapsed: number): number { return initialStrength * Math.exp(-timeElapsed / 86400000); }
    getForgottenCount(entityId: string): number { return this.forgottenCount.get(entityId) ?? 0; }
  }
  export const forgettingProcess = new ForgettingProcess();
  export default forgettingProcess;