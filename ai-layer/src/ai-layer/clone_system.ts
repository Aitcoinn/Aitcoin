import { logger } from '../lib/logger.js';

  export interface Clone {
    id: string;
    originalId: string;
    generationNumber: number;
    geneticIdentity: number;
    mutationsDelta: number;
    createdAt: number;
  }

  export class CloneSystem {
    private clones: Map<string, Clone[]> = new Map();
    private cloningAccuracy = 0.99;

    clone(originalId: string): Clone {
      const existing = this.clones.get(originalId) ?? [];
      const clone: Clone = {
        id: `clone_${Date.now()}_${existing.length + 1}`,
        originalId,
        generationNumber: existing.length + 1,
        geneticIdentity: this.cloningAccuracy ** (existing.length + 1),
        mutationsDelta: Math.floor(Math.random() * 3),
        createdAt: Date.now()
      };
      existing.push(clone);
      this.clones.set(originalId, existing);
      logger.info({ originalId, cloneId: clone.id, identity: clone.geneticIdentity }, '[CloneSystem] Clone created');
      return clone;
    }

    getClones(originalId: string): Clone[] { return this.clones.get(originalId) ?? []; }
    getTotalClones(): number {
      let total = 0;
      this.clones.forEach(list => total += list.length);
      return total;
    }
  }

  export const cloneSystem = new CloneSystem();
  export default cloneSystem;
  