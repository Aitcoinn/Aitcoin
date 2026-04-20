import { logger } from '../lib/logger.js';
import { researchSystem } from './research_system.js';
  export interface Discovery { id: string; entityId: string; topic: string; breakthrough: string; noveltyScore: number; timestamp: number; }
  export class DiscoveryEngine {
    private discoveries: Discovery[] = [];
    discover(entityId: string, topic: string): Discovery {
      const ongoing = researchSystem.getOngoing(entityId);
      const breakthrough = 'breakthrough_in_'+topic+'_area';
      const d: Discovery = { id: 'disc_'+Date.now(), entityId, topic, breakthrough, noveltyScore: Math.random(), timestamp: Date.now() };
      this.discoveries.push(d);
      logger.info({ entityId, topic, noveltyScore: d.noveltyScore }, '[DiscoveryEngine] Discovery made');
      return d;
    }
    getBreakthroughs(entityId: string): Discovery[] { return this.discoveries.filter(d => d.entityId === entityId && d.noveltyScore > 0.7); }
  }
  export const discoveryEngine = new DiscoveryEngine();
  export default discoveryEngine;