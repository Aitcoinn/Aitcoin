import { logger } from '../lib/logger.js';

  export interface SilentMutation {
    id: string;
    geneId: string;
    originalCodon: string;
    newCodon: string;
    isSynonymous: boolean;
    detectedAt: number;
  }

  export class SilentMutationEngine {
    private mutations: SilentMutation[] = [];

    apply(geneId: string, originalCodon: string, newCodon: string): SilentMutation {
      const synonymousPairs = [['GAA','GAG'],['CAA','CAG'],['AAA','AAG']];
      const isSynonymous = synonymousPairs.some(pair =>
        (pair[0] === originalCodon && pair[1] === newCodon) ||
        (pair[1] === originalCodon && pair[0] === newCodon)
      );
      const mutation: SilentMutation = {
        id: `sm_${Date.now()}`,
        geneId, originalCodon, newCodon,
        isSynonymous,
        detectedAt: Date.now()
      };
      this.mutations.push(mutation);
      logger.info({ geneId, isSynonymous }, '[SilentMutation] Silent mutation recorded');
      return mutation;
    }

    getCount(): number { return this.mutations.length; }
    getSynonymous(): SilentMutation[] { return this.mutations.filter(m => m.isSynonymous); }
    getAll(): SilentMutation[] { return [...this.mutations]; }
  }

  export const silentMutation = new SilentMutationEngine();
  export default silentMutation;
  