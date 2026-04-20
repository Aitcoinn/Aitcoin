import { logger } from '../lib/logger.js';
import { longTermMemory } from './long_term_memory.js';
  import { shortTermMemory } from './short_term_memory.js';
  import { workingMemory } from './working_memory.js';
  export class MemoryRetrieval {
    retrieve(entityId: string, key: string): string | null {
      const wm = workingMemory.get_item(entityId, key);
      if (wm) return String(wm);
      const stm = shortTermMemory.recall(entityId, key);
      if (stm) return stm;
      return longTermMemory.recall(entityId, key);
    }
    search(entityId: string, query: string): string[] {
      const ltmRecs = longTermMemory.getMostImportant(entityId);
      return ltmRecs.filter(r => r.key.includes(query) || r.value.includes(query)).map(r => r.value);
    }
  }
  export const memoryRetrieval = new MemoryRetrieval();
  export default memoryRetrieval;