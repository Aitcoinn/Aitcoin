import { logger } from '../lib/logger.js';
  import { randomMutation } from './random_mutation.js';

  export interface DirectedMutationTarget {
    geneId: string;
    targetTrait: string;
    desiredOutcome: string;
    successProbability: number;
  }

  export interface DirectedMutationResult {
    success: boolean;
    geneId: string;
    oldValue: string;
    newValue: string;
    trait: string;
  }

  export class DirectedMutation {
    private appliedMutations: DirectedMutationResult[] = [];

    apply(target: DirectedMutationTarget): DirectedMutationResult {
      const success = Math.random() < target.successProbability;
      const result: DirectedMutationResult = {
        success,
        geneId: target.geneId,
        oldValue: 'original_' + target.targetTrait,
        newValue: success ? target.desiredOutcome : 'original_' + target.targetTrait,
        trait: target.targetTrait
      };
      if (success) {
        this.appliedMutations.push(result);
        logger.info({ geneId: target.geneId, trait: target.targetTrait }, '[DirectedMutation] Directed mutation successful');
      }
      // Also log in random mutation history for tracking
      randomMutation.applyRandom(target.geneId);
      return result;
    }

    getAppliedMutations(): DirectedMutationResult[] { return [...this.appliedMutations]; }
    getSuccessRate(): number {
      if (this.appliedMutations.length === 0) return 0;
      const successful = this.appliedMutations.filter(m => m.success).length;
      return successful / this.appliedMutations.length;
    }
  }

  export const directedMutation = new DirectedMutation();
  export default directedMutation;
  