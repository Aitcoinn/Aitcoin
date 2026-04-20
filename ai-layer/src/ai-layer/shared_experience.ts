import { logger } from '../lib/logger.js';
import { collectiveMemory } from './collective_memory.js';
  export class SharedExperience {
    private experiences: Array<{entityIds: string[]; event: string; timestamp: number}> = [];
    share(entityIds: string[], event: string): void {
      this.experiences.push({ entityIds, event, timestamp: Date.now() });
      entityIds.forEach(id => collectiveMemory.contribute(id, event, 'shared_'+event));
      logger.info({ entityCount: entityIds.length, event }, '[SharedExperience] Experience shared');
    }
    getShared(entityId: string): string[] { return this.experiences.filter(e => e.entityIds.includes(entityId)).map(e => e.event); }
  }
  export const sharedExperience = new SharedExperience();
  export default sharedExperience;