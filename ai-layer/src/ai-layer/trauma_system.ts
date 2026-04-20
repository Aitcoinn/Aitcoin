import { logger } from '../lib/logger.js';
import { episodicMemory } from './episodic_memory.js';
  export interface Trauma { entityId: string; event: string; severity: number; isProcessed: boolean; healingProgress: number; }
  export class TraumaSystem {
    private traumas: Trauma[] = [];
    record(entityId: string, event: string, severity: number): Trauma {
      episodicMemory.record(entityId, event, 'traumatic', ['fear','sadness','shock']);
      const t: Trauma = { entityId, event, severity, isProcessed: false, healingProgress: 0 };
      this.traumas.push(t);
      logger.warn({ entityId, event, severity }, '[TraumaSystem] Trauma recorded');
      return t;
    }
    heal(entityId: string, amount = 0.1): void { this.traumas.filter(t => t.entityId === entityId && !t.isProcessed).forEach(t => { t.healingProgress = Math.min(1, t.healingProgress + amount); if (t.healingProgress >= 1) t.isProcessed = true; }); }
    getUnprocessed(entityId: string): Trauma[] { return this.traumas.filter(t => t.entityId === entityId && !t.isProcessed); }
  }
  export const traumaSystem = new TraumaSystem();
  export default traumaSystem;