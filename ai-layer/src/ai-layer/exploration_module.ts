import { logger } from '../lib/logger.js';
import { curiosityEngine } from './curiosity_engine.js';
  import { discoveryEngine } from './discovery_engine.js';
  export class ExplorationModule {
    private explorations: Map<string, string[]> = new Map();
    explore(entityId: string, domain: string): string {
      curiosityEngine.becomeCurious(entityId, domain);
      const discovery = discoveryEngine.discover(entityId, domain);
      const explored = this.explorations.get(entityId) ?? [];
      if (!explored.includes(domain)) { explored.push(domain); this.explorations.set(entityId, explored); }
      logger.info({ entityId, domain, discovery: discovery.breakthrough }, '[ExplorationModule] Explored');
      return discovery.breakthrough;
    }
    getExplored(entityId: string): string[] { return this.explorations.get(entityId) ?? []; }
  }
  export const explorationModule = new ExplorationModule();
  export default explorationModule;