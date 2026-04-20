import { logger } from '../lib/logger.js';
import { abstractionMaker } from './abstraction_maker.js';
  export class AbstractThinker {
    private abstractions: Map<string, string[]> = new Map();
    think(entityId: string, concept: string): string {
      const abstraction = abstractionMaker.abstract(entityId, concept);
      const existing = this.abstractions.get(entityId) ?? [];
      existing.push(abstraction); this.abstractions.set(entityId, existing);
      logger.info({ entityId, concept, abstraction }, '[AbstractThinker] Abstracted');
      return abstraction;
    }
    getAbstractions(entityId: string): string[] { return this.abstractions.get(entityId) ?? []; }
  }
  export const abstractThinker = new AbstractThinker();
  export default abstractThinker;