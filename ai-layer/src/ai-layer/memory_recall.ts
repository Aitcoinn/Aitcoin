import { logger } from '../lib/logger.js';
import { memoryRetrieval } from './memory_retrieval.js';
  import { episodicMemory } from './episodic_memory.js';
  export class MemoryRecall {
    recall(entityId: string, cue: string): { semantic: string | null; episodic: string | null } {
      return { semantic: memoryRetrieval.retrieve(entityId, cue), episodic: episodicMemory.recall(entityId, cue)[0]?.event ?? null };
    }
    contextualRecall(entityId: string, context: string): string[] { return memoryRetrieval.search(entityId, context); }
  }
  export const memoryRecall = new MemoryRecall();
  export default memoryRecall;