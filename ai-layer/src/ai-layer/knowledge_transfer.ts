import { logger } from '../lib/logger.js';
import { longTermMemory } from './long_term_memory.js';
  export class KnowledgeTransfer {
    transfer(fromId: string, toId: string, knowledge: string): void {
      const data = longTermMemory.recall(fromId, knowledge);
      if (data) { longTermMemory.store(toId, knowledge, data, 0.6); logger.info({ fromId, toId, knowledge }, '[KnowledgeTransfer] Transferred'); }
      else logger.warn({ fromId, knowledge }, '[KnowledgeTransfer] Knowledge not found');
    }
    broadcast(sourceId: string, recipients: string[], knowledge: string): void { recipients.forEach(r => this.transfer(sourceId, r, knowledge)); }
  }
  export const knowledgeTransfer = new KnowledgeTransfer();
  export default knowledgeTransfer;