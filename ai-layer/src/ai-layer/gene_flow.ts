import { logger } from '../lib/logger.js';
  export interface GeneFlowEvent { sourcePopulation: string; targetPopulation: string; migratingGenes: string[]; migrantsCount: number; timestamp: number; }
  export class GeneFlow {
    private events: GeneFlowEvent[] = [];
    transfer(sourceId: string, targetId: string, genes: string[], migrants: number): GeneFlowEvent {
      const e: GeneFlowEvent = { sourcePopulation: sourceId, targetPopulation: targetId, migratingGenes: genes, migrantsCount: migrants, timestamp: Date.now() };
      this.events.push(e);
      logger.info({ source: sourceId, target: targetId, genes: genes.length, migrants }, '[GeneFlow] Gene flow occurred');
      return e;
    }
    getEvents(): GeneFlowEvent[] { return [...this.events]; }
    getFlowBetween(pop1: string, pop2: string): GeneFlowEvent[] {
      return this.events.filter(e => (e.sourcePopulation === pop1 && e.targetPopulation === pop2) || (e.sourcePopulation === pop2 && e.targetPopulation === pop1));
    }
  }
  export const geneFlow = new GeneFlow();
  export default geneFlow;
  