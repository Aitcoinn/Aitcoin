import { logger } from '../lib/logger.js';
export interface MemoryCore { entityId: string; capacity: number; usedCapacity: number; consolidationRate: number; }
  export class MemoryCoreEngine {
    private cores: Map<string, MemoryCore> = new Map();
    init(entityId: string): MemoryCore { const c: MemoryCore = { entityId, capacity: 1000, usedCapacity: 0, consolidationRate: 0.8 }; this.cores.set(entityId, c); return c; }
    allocate(entityId: string, size: number): boolean { const c = this.cores.get(entityId) ?? this.init(entityId); if (c.usedCapacity + size > c.capacity) return false; c.usedCapacity += size; return true; }
    get(entityId: string): MemoryCore | null { return this.cores.get(entityId) ?? null; }
  }
  export const memoryCoreEngine = new MemoryCoreEngine();
  export default memoryCoreEngine;