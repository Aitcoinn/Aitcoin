import { logger } from '../lib/logger.js';
import { episodicMemory } from './episodic_memory.js';
  export class NostalgiaEngine {
    private nostalgicStates: Map<string, number> = new Map();
    feel(entityId: string): string | null {
      const eps = episodicMemory.getAll(entityId);
      const old = eps.filter(e => Date.now() - e.timestamp > 60000);
      if (old.length > 0) { const n = this.nostalgicStates.get(entityId) ?? 0; this.nostalgicStates.set(entityId, Math.min(1, n + 0.1)); return old[Math.floor(Math.random() * old.length)].event; }
      return null;
    }
    getNostalgiaLevel(entityId: string): number { return this.nostalgicStates.get(entityId) ?? 0; }
  }
  export const nostalgiaEngine = new NostalgiaEngine();
  export default nostalgiaEngine;