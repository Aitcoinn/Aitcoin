import { logger } from '../lib/logger.js';
  export interface DriftEvent { populationId: string; geneId: string; oldFrequency: number; newFrequency: number; populationSize: number; timestamp: number; }
  export class GeneticDrift {
    private events: DriftEvent[] = [];
    applyDrift(populationId: string, geneId: string, currentFreq: number, popSize: number): DriftEvent {
      const drift = (Math.random() - 0.5) / Math.sqrt(popSize);
      const newFreq = Math.max(0, Math.min(1, currentFreq + drift));
      const e: DriftEvent = { populationId, geneId, oldFrequency: currentFreq, newFrequency: newFreq, populationSize: popSize, timestamp: Date.now() };
      this.events.push(e);
      logger.info({ populationId, geneId, oldFreq: currentFreq, newFreq }, '[GeneticDrift] Drift applied');
      return e;
    }
    getEvents(): DriftEvent[] { return [...this.events]; }
    isFixated(populationId: string, geneId: string): boolean {
      const last = [...this.events].reverse().find(e => e.populationId === populationId && e.geneId === geneId);
      return last ? last.newFrequency >= 0.99 || last.newFrequency <= 0.01 : false;
    }
  }
  export const geneticDrift = new GeneticDrift();
  export default geneticDrift;
  