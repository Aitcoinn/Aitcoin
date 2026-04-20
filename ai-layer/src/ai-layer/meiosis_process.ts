import { logger } from '../lib/logger.js';
  import { cellDivision } from './cell_division.js';
  import { crossingOver } from './crossing_over.js';
  export interface MeiosisEvent { cellId: string; gametes: string[]; crossoverOccurred: boolean; timestamp: number; }
  export class MeiosisProcess {
    private events: MeiosisEvent[] = [];
    performMeiosis(cellId: string): MeiosisEvent {
      const crossoverEvent = crossingOver.performCrossingOver(1);
      const daughters = cellDivision.divide(cellId, 'meiosis');
      const e: MeiosisEvent = { cellId, gametes: daughters.map(d => d.id), crossoverOccurred: true, timestamp: Date.now() };
      this.events.push(e);
      logger.info({ cellId, gameteCount: daughters.length }, '[MeiosisProcess] Meiosis complete');
      return e;
    }
    getEvents(): MeiosisEvent[] { return [...this.events]; }
  }
  export const meiosisProcess = new MeiosisProcess();
  export default meiosisProcess;
  