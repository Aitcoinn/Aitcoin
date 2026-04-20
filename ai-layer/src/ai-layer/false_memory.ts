import { logger } from '../lib/logger.js';
import { longTermMemory } from './long_term_memory.js';
  export class FalseMemory {
    private falseMemories: Array<{entityId: string; falseContent: string; seemsReal: boolean}> = [];
    implant(entityId: string, falseContent: string): void {
      longTermMemory.store(entityId, 'false_'+Date.now(), falseContent, 0.4);
      this.falseMemories.push({ entityId, falseContent, seemsReal: Math.random() > 0.5 });
      logger.warn({ entityId, falseContent }, '[FalseMemory] False memory implanted');
    }
    detect(entityId: string): number { return this.falseMemories.filter(f => f.entityId === entityId).length; }
  }
  export const falseMemory = new FalseMemory();
  export default falseMemory;