import { logger } from '../lib/logger.js';
import { brainStructure } from './brain_structure.js';
  import { consciousnessCore } from './consciousness_core.js';
  export class ContextAwareness {
    private contexts: Map<string, Record<string, any>> = new Map();
    sense(entityId: string, environment: Record<string, any>): void {
      this.contexts.set(entityId, environment);
      consciousnessCore.setFocus(entityId, JSON.stringify(Object.keys(environment)));
      logger.info({ entityId, contextKeys: Object.keys(environment) }, '[ContextAwareness] Context sensed');
    }
    get(entityId: string): Record<string, any> { return this.contexts.get(entityId) ?? {}; }
    isContextuallyAware(entityId: string): boolean { return Object.keys(this.contexts.get(entityId) ?? {}).length > 0; }
  }
  export const contextAwareness = new ContextAwareness();
  export default contextAwareness;