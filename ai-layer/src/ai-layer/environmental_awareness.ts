import { logger } from '../lib/logger.js';
import { environmentResponse, EnvironmentType } from './environment_response.js';
  export class EnvironmentalAwareness {
    private envStates: Map<string, EnvironmentType> = new Map();
    scan(entityId: string): EnvironmentType {
      const envTypes: EnvironmentType[] = ['hostile','neutral','favorable','extreme'];
      const detected: EnvironmentType = envTypes[Math.floor(Math.random() * envTypes.length)] ?? 'neutral';
      this.envStates.set(entityId, detected);
      environmentResponse.respond(entityId, detected);
      logger.info({ entityId, environment: detected }, '[EnvironmentalAwareness] Scanned');
      return detected;
    }
    get(entityId: string): EnvironmentType { return this.envStates.get(entityId) ?? 'neutral'; }
  }
  export const environmentalAwareness = new EnvironmentalAwareness();
  export default environmentalAwareness;