import { logger } from '../lib/logger.js';
import { researchSystem } from './research_system.js';
  export class CuriosityEngine {
    private curiosityLevels: Map<string, number> = new Map();
    becomeCurious(entityId: string, topic: string): void {
      const current = this.curiosityLevels.get(entityId) ?? 0.5;
      this.curiosityLevels.set(entityId, Math.min(1, current + 0.1));
      researchSystem.begin(entityId, topic, 'what_is_'+topic);
      logger.info({ entityId, topic, curiosityLevel: this.curiosityLevels.get(entityId) }, '[CuriosityEngine] Curious');
    }
    getLevel(entityId: string): number { return this.curiosityLevels.get(entityId) ?? 0.5; }
  }
  export const curiosityEngine = new CuriosityEngine();
  export default curiosityEngine;