import { logger } from '../lib/logger.js';
  import { populationGenetics } from './population_genetics.js';
  import { geneticVariation } from './genetic_variation.js';
  export interface DiversityState { diversityIndex: number; atRiskGenes: string[]; preservationActions: string[]; }
  export class DiversityPreserver {
    private minDiversityThreshold = 0.3;
    preserve(populationId: string): DiversityState {
      const pop = populationGenetics.get(populationId);
      const metrics = geneticVariation.measureVariation(populationId);
      const diversityIndex = pop?.geneticDiversity ?? metrics.heterozygosityIndex;
      const atRisk: string[] = [];
      if (pop) {
        Object.entries(pop.alleleFrequencies).forEach(([gene, freq]) => {
          if (freq < 0.05 || freq > 0.95) atRisk.push(gene);
        });
      }
      const actions: string[] = [];
      if (diversityIndex < this.minDiversityThreshold) {
        actions.push('introduce_migrants', 'reduce_selection_pressure');
        geneticVariation.addVariant('migration');
      }
      const state: DiversityState = { diversityIndex, atRiskGenes: atRisk, preservationActions: actions };
      logger.info({ populationId, diversityIndex, atRiskCount: atRisk.length }, '[DiversityPreserver] Diversity preserved');
      return state;
    }
  }
  export const diversityPreserver = new DiversityPreserver();
  export default diversityPreserver;
  