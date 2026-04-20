import { logger } from '../lib/logger.js';
  import { randomMutation } from './random_mutation.js';

  export interface HarmfulMutation {
    id: string;
    geneId: string;
    harm: string;
    fitnessCost: number;
    isLethal: boolean;
    isSuppressed: boolean;
  }

  export class HarmfulMutationEngine {
    private mutations: HarmfulMutation[] = [];

    apply(geneId: string, harm: string, fitnessCost: number): HarmfulMutation {
      randomMutation.applyRandom(geneId);
      const isLethal = fitnessCost >= 1.0;
      const mutation: HarmfulMutation = {
        id: `hm_${Date.now()}`,
        geneId, harm, fitnessCost,
        isLethal,
        isSuppressed: false
      };
      this.mutations.push(mutation);
      logger.warn({ geneId, harm, fitnessCost, isLethal }, '[HarmfulMutation] Harmful mutation recorded');
      return mutation;
    }

    suppress(id: string): boolean {
      const m = this.mutations.find(x => x.id === id);
      if (m && !m.isLethal) { m.isSuppressed = true; return true; }
      return false;
    }

    getTotalFitnessCost(): number {
      return this.mutations.filter(m => !m.isSuppressed).reduce((s, m) => s + m.fitnessCost, 0);
    }

    getLethalMutations(): HarmfulMutation[] { return this.mutations.filter(m => m.isLethal); }
    getAll(): HarmfulMutation[] { return [...this.mutations]; }
  }

  export const harmfulMutation = new HarmfulMutationEngine();
  export default harmfulMutation;
  