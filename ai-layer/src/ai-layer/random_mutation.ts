import { logger } from '../lib/logger.js';
  import { geneticCode } from './genetic_code.js';

  export interface RandomMutationEvent {
    id: string;
    targetGene: string;
    originalCodon: string;
    mutatedCodon: string;
    type: 'substitution' | 'insertion' | 'deletion';
    timestamp: number;
  }

  export class RandomMutation {
    private history: RandomMutationEvent[] = [];
    private nucleotides = ['A', 'T', 'G', 'C'];

    applyRandom(geneId: string): RandomMutationEvent {
      const mutationRate = geneticCode.getMutationRate();
      const shouldMutate = Math.random() < mutationRate * 10;
      const types: ('substitution' | 'insertion' | 'deletion')[] = ['substitution', 'insertion', 'deletion'];
      const event: RandomMutationEvent = {
        id: `rm_${Date.now()}`,
        targetGene: geneId,
        originalCodon: this.randomCodon(),
        mutatedCodon: this.randomCodon(),
        type: types[Math.floor(Math.random() * 3)],
        timestamp: Date.now()
      };
      if (shouldMutate) {
        this.history.push(event);
        logger.info({ geneId, type: event.type }, '[RandomMutation] Random mutation applied');
      }
      return event;
    }

    private randomCodon(): string {
      return Array.from({ length: 3 }, () => this.nucleotides[Math.floor(Math.random() * 4)]).join('');
    }

    getHistory(): RandomMutationEvent[] { return [...this.history]; }
    getMutationCount(): number { return this.history.length; }
  }

  export const randomMutation = new RandomMutation();
  export default randomMutation;
  