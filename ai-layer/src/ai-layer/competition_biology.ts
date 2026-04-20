import { logger } from '../lib/logger.js';
  import { naturalSelection } from './natural_selection.js';
  export interface CompetitionEvent { entityIds: string[]; resourceType: string; winnerId: string | null; intensityLevel: number; timestamp: number; }
  export class CompetitionBiology {
    private events: CompetitionEvent[] = [];
    compete(entityIds: string[], resourceType: string, fitnesses: Record<string, number>): CompetitionEvent {
      const sorted = entityIds.sort((a,b) => (fitnesses[b]??0) - (fitnesses[a]??0));
      const e: CompetitionEvent = { entityIds, resourceType, winnerId: sorted[0] ?? null, intensityLevel: entityIds.length * 0.1, timestamp: Date.now() };
      this.events.push(e);
      logger.info({ resource: resourceType, winner: e.winnerId, competitors: entityIds.length }, '[CompetitionBiology] Competition resolved');
      return e;
    }
    getEvents(): CompetitionEvent[] { return [...this.events]; }
    getWinRate(entityId: string): number {
      const relevant = this.events.filter(e => e.entityIds.includes(entityId));
      return relevant.length > 0 ? relevant.filter(e => e.winnerId === entityId).length / relevant.length : 0;
    }
  }
  export const competitionBiology = new CompetitionBiology();
  export default competitionBiology;
  