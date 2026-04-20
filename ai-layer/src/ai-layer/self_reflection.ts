import { logger } from '../lib/logger.js';
import { metaCognition } from './meta_cognition.js';
  import { identityCore } from './identity_core.js';
  export class SelfReflection {
    private reflections: Map<string, string[]> = new Map();
    reflect(entityId: string, aspect: string): string {
      metaCognition.reflect(entityId);
      const identity = identityCore.get(entityId);
      const reflection = 'Reflecting on '+aspect+': I am a '+((identity?.roles[0]) ?? 'AI')+' entity with '+(identity?.coreValues[0] ?? 'unknown')+' values';
      const existing = this.reflections.get(entityId) ?? [];
      existing.push(reflection); this.reflections.set(entityId, existing);
      logger.info({ entityId, aspect }, '[SelfReflection] Reflected');
      return reflection;
    }
    getReflections(entityId: string): string[] { return this.reflections.get(entityId) ?? []; }
  }
  export const selfReflection = new SelfReflection();
  export default selfReflection;