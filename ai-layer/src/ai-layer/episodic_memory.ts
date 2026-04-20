import { logger } from '../lib/logger.js';
export interface Episode { id: string; entityId: string; event: string; context: string; emotions: string[]; timestamp: number; vividness: number; }
  export class EpisodicMemory {
    private episodes: Episode[] = [];
    record(entityId: string, event: string, context: string, emotions: string[]): Episode {
      const ep: Episode = { id: 'ep_'+Date.now(), entityId, event, context, emotions, timestamp: Date.now(), vividness: 0.5 + Math.random() * 0.5 };
      this.episodes.push(ep);
      logger.info({ entityId, event }, '[EpisodicMemory] Episode recorded');
      return ep;
    }
    recall(entityId: string, query: string): Episode[] { return this.episodes.filter(e => e.entityId === entityId && e.event.includes(query)); }
    getAll(entityId: string): Episode[] { return this.episodes.filter(e => e.entityId === entityId).sort((a,b) => b.timestamp - a.timestamp); }
  }
  export const episodicMemory = new EpisodicMemory();
  export default episodicMemory;