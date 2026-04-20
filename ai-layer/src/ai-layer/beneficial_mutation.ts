import { logger } from '../lib/logger.js';
  import { directedMutation } from './directed_mutation.js';

  export interface BeneficialMutation {
    id: string;
    geneId: string;
    benefit: string;
    fitnessIncrease: number;
    isFixed: boolean;
  }

  export class BeneficialMutationEngine {
    private mutations: BeneficialMutation[] = [];

    apply(geneId: string, benefit: string, fitnessGain: number): BeneficialMutation {
      const result = directedMutation.apply({
        geneId, targetTrait: benefit,
        desiredOutcome: 'enhanced_' + benefit,
        successProbability: 0.7
      });
      const mutation: BeneficialMutation = {
        id: `bm_${Date.now()}`,
        geneId, benefit,
        fitnessIncrease: result.success ? fitnessGain : 0,
        isFixed: result.success && fitnessGain > 0.5
      };
      this.mutations.push(mutation);
      logger.info({ geneId, benefit, fitness: mutation.fitnessIncrease }, '[BeneficialMutation] Applied');
      return mutation;
    }

    getTotalFitnessGain(): number {
      return this.mutations.reduce((sum, m) => sum + m.fitnessIncrease, 0);
    }

    getFixedMutations(): BeneficialMutation[] { return this.mutations.filter(m => m.isFixed); }
    getAll(): BeneficialMutation[] { return [...this.mutations]; }
  }

  export const beneficialMutation = new BeneficialMutationEngine();
  export default beneficialMutation;
  