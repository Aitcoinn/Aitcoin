import { logger } from '../lib/logger.js';
import { longTermMemory } from './long_term_memory.js';
  import { learningCore } from './learning_core.js';
  export class KnowledgeGain {
    private gainHistory: Array<{entityId: string; knowledge: string; amount: number; timestamp: number}> = [];
    gain(entityId: string, knowledge: string, amount = 0.1): void {
      longTermMemory.store(entityId, knowledge, 'knowledge_'+knowledge, Math.min(1, amount * 2));
      learningCore.learn(entityId, knowledge, 'assimilation');
      this.gainHistory.push({ entityId, knowledge, amount, timestamp: Date.now() });
      logger.info({ entityId, knowledge, amount }, '[KnowledgeGain] Gained');
    }
    getTotalGain(entityId: string): number { return this.gainHistory.filter(h => h.entityId === entityId).reduce((s,h) => s+h.amount, 0); }
  }
  export const knowledgeGain = new KnowledgeGain();
  export default knowledgeGain;