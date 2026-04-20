import { logger } from '../lib/logger.js';
  import { geneticDrift } from './genetic_drift.js';
  import { geneFlow } from './gene_flow.js';
  import { naturalSelection } from './natural_selection.js';
  export interface PopulationState { id: string; size: number; geneticDiversity: number; alleleFrequencies: Record<string, number>; isViable: boolean; }
  export class PopulationGenetics {
    private populations: Map<string, PopulationState> = new Map();
    createPopulation(id: string, size: number, genes: string[]): PopulationState {
      const freqs: Record<string, number> = {};
      genes.forEach(g => freqs[g] = Math.random());
      const s: PopulationState = { id, size, geneticDiversity: genes.length / 100, alleleFrequencies: freqs, isViable: size > 10 };
      this.populations.set(id, s);
      logger.info({ id, size, diversity: s.geneticDiversity }, '[PopulationGenetics] Population created');
      return s;
    }
    evolve(id: string): PopulationState | null {
      const pop = this.populations.get(id);
      if (!pop) return null;
      Object.keys(pop.alleleFrequencies).forEach(gene => {
        const drift = geneticDrift.applyDrift(id, gene, pop.alleleFrequencies[gene], pop.size);
        pop.alleleFrequencies[gene] = drift.newFrequency;
      });
      pop.geneticDiversity = Object.values(pop.alleleFrequencies).filter(f => f > 0 && f < 1).length / Math.max(1, Object.keys(pop.alleleFrequencies).length);
      return pop;
    }
    get(id: string): PopulationState | null { return this.populations.get(id) ?? null; }
    getAll(): PopulationState[] { return [...this.populations.values()]; }
  }
  export const populationGenetics = new PopulationGenetics();
  export default populationGenetics;
  