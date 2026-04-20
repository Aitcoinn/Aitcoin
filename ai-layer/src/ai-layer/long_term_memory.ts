import { logger } from '../lib/logger.js';
import { memoryCoreEngine } from './memory_core.js';
  export interface LTMRecord { key: string; value: string; importance: number; accessCount: number; lastAccessed: number; }
  export class LongTermMemory {
    private records: Map<string, Map<string, LTMRecord>> = new Map();
    store(entityId: string, key: string, value: string, importance = 0.5): void {
      memoryCoreEngine.allocate(entityId, 2);
      const recs = this.records.get(entityId) ?? new Map();
      recs.set(key, { key, value, importance, accessCount: 0, lastAccessed: Date.now() });
      this.records.set(entityId, recs);
      logger.info({ entityId, key, importance }, '[LongTermMemory] Stored');
    }
    recall(entityId: string, key: string): string | null {
      const recs = this.records.get(entityId);
      const r = recs?.get(key);
      if (r) { r.accessCount++; r.lastAccessed = Date.now(); }
      return r?.value ?? null;
    }
    getMostImportant(entityId: string): LTMRecord[] {
      return [...(this.records.get(entityId)?.values() ?? [])].sort((a,b) => b.importance - a.importance).slice(0, 10);
    }
  }
  export const longTermMemory = new LongTermMemory();
  export default longTermMemory;