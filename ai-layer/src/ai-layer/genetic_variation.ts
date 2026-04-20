import { logger } from '../lib/logger.js';
  import { randomMutation } from './random_mutation.js';
  import { recombinationSystem } from './recombination_system.js';
  export interface VariationMetrics { totalVariants: number; uniqueAlleles: number; heterozygosityIndex: number; variantSourceBreakdown: Record<string, number>; }
  export class GeneticVariation {
    private variantCount = 0;
    private sources: Record<string, number> = { mutation: 0, recombination: 0, migration: 0 };
    addVariant(source: 'mutation'|'recombination'|'migration'): void {
      this.variantCount++;
      this.sources[source] = (this.sources[source] ?? 0) + 1;
      logger.info({ source, total: this.variantCount }, '[GeneticVariation] Variant added');
    }
    measureVariation(entityId: string): VariationMetrics {
      const mutCount = randomMutation.getMutationCount();
      const recCount = recombinationSystem.getCount();
      return {
        totalVariants: this.variantCount + mutCount + recCount,
        uniqueAlleles: Math.floor((mutCount + recCount) * 0.7),
        heterozygosityIndex: 0.3 + Math.random() * 0.4,
        variantSourceBreakdown: { ...this.sources, mutation: this.sources.mutation + mutCount, recombination: this.sources.recombination + recCount }
      };
    }
    getVariantCount(): number { return this.variantCount; }
  }
  export const geneticVariation = new GeneticVariation();
  export default geneticVariation;
  