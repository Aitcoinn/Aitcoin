import { logger } from '../lib/logger.js';
  import { recombinationSystem } from './recombination_system.js';
  import { chromosomeSystem } from './chromosome_system.js';

  export interface CrossingOverEvent {
    id: string;
    chromosomeNumber: number;
    crossoverPosition: number;
    genesExchanged: string[];
    timestamp: number;
  }

  export class CrossingOver {
    private events: CrossingOverEvent[] = [];

    performCrossingOver(chromosomeNumber: number): CrossingOverEvent {
      const pair = chromosomeSystem.getChromosomePair(chromosomeNumber);
      const event: CrossingOverEvent = {
        id: `co_${Date.now()}`,
        chromosomeNumber,
        crossoverPosition: Math.floor(Math.random() * 100),
        genesExchanged: pair.flatMap(c => c.genes.slice(0, 2).map(g => g.id)),
        timestamp: Date.now()
      };
      if (pair.length >= 2) {
        recombinationSystem.recombine(pair[0], pair[1]);
      }
      this.events.push(event);
      logger.info({ chrNumber: chromosomeNumber, pos: event.crossoverPosition }, '[CrossingOver] Crossing over occurred');
      return event;
    }

    getEvents(): CrossingOverEvent[] { return [...this.events]; }
  }

  export const crossingOver = new CrossingOver();
  export default crossingOver;
  