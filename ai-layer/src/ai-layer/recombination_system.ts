import { logger } from '../lib/logger.js';
  import { chromosomeSystem, Chromosome } from './chromosome_system.js';

  export interface RecombinationResult {
    id: string;
    parent1ChrId: string;
    parent2ChrId: string;
    offspring1ChrId: string;
    offspring2ChrId: string;
    crossoverPoints: number[];
    timestamp: number;
  }

  export class RecombinationSystem {
    private history: RecombinationResult[] = [];

    recombine(chr1: Chromosome, chr2: Chromosome): RecombinationResult {
      const crossoverPoints = [Math.floor(Math.random() * chr1.length)];
      const result: RecombinationResult = {
        id: `rec_${Date.now()}`,
        parent1ChrId: chr1.id,
        parent2ChrId: chr2.id,
        offspring1ChrId: `off1_${Date.now()}`,
        offspring2ChrId: `off2_${Date.now()}`,
        crossoverPoints,
        timestamp: Date.now()
      };
      this.history.push(result);
      logger.info({ chr1: chr1.id, chr2: chr2.id, points: crossoverPoints }, '[RecombinationSystem] Recombination performed');
      return result;
    }

    getHistory(): RecombinationResult[] { return [...this.history]; }
    getCount(): number { return this.history.length; }
  }

  export const recombinationSystem = new RecombinationSystem();
  export default recombinationSystem;
  