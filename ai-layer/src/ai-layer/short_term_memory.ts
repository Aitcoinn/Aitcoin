import { logger } from '../lib/logger.js';
import { memoryCoreEngine } from './memory_core.js';
  export interface STMItem { key: string; value: string; addedAt: number; expiresAt: number; }
  export class ShortTermMemory {
    private store: Map<string, STMItem[]> = new Map();
    store_item(entityId: string, key: string, value: string, ttlMs = 30000): void {
      memoryCoreEngine.allocate(entityId, 1);
      const items = this.store.get(entityId) ?? [];
      items.push({ key, value, addedAt: Date.now(), expiresAt: Date.now() + ttlMs });
      this.store.set(entityId, items.filter(i => i.expiresAt > Date.now()));
      logger.info({ entityId, key }, '[ShortTermMemory] Stored');
    }
    recall(entityId: string, key: string): string | null { return this.store.get(entityId)?.find(i => i.key === key && i.expiresAt > Date.now())?.value ?? null; }
    getAll(entityId: string): STMItem[] { return (this.store.get(entityId) ?? []).filter(i => i.expiresAt > Date.now()); }
  }
  export const shortTermMemory = new ShortTermMemory();
  export default shortTermMemory;