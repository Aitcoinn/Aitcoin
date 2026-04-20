import { logger } from '../lib/logger.js';
import { longTermMemory } from './long_term_memory.js';
  import { shortTermMemory } from './short_term_memory.js';
  export class MemoryStorage {
    storeToLTM(entityId: string, key: string, value: string, importance = 0.5): void { longTermMemory.store(entityId, key, value, importance); }
    storeToSTM(entityId: string, key: string, value: string): void { shortTermMemory.store_item(entityId, key, value); }
    consolidate(entityId: string): void {
      const stmItems = shortTermMemory.getAll(entityId);
      stmItems.filter(i => Math.random() > 0.5).forEach(i => longTermMemory.store(entityId, i.key, i.value, 0.3));
      logger.info({ entityId, consolidated: stmItems.length }, '[MemoryStorage] Consolidated');
    }
  }
  export const memoryStorage = new MemoryStorage();
  export default memoryStorage;