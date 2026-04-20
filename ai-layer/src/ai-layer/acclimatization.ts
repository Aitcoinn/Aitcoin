import { logger } from '../lib/logger.js';
  import { environmentResponse, EnvironmentType } from './environment_response.js';
  export interface AcclimatizationState { entityId: string; currentEnvironment: EnvironmentType; tolerance: number; acclimatizationProgress: number; }
  export class Acclimatization {
    private states: Map<string, AcclimatizationState> = new Map();
    acclimatize(entityId: string, environment: EnvironmentType): AcclimatizationState {
      const impact = environmentResponse.respond(entityId, environment);
      const s = this.states.get(entityId) ?? { entityId, currentEnvironment: environment, tolerance: 0.3, acclimatizationProgress: 0 };
      s.currentEnvironment = environment;
      s.acclimatizationProgress = Math.min(1, s.acclimatizationProgress + 0.1);
      s.tolerance = Math.min(1, s.tolerance + (impact.adaptationTriggered ? 0.05 : 0.01));
      this.states.set(entityId, s);
      logger.info({ entityId, environment, tolerance: s.tolerance }, '[Acclimatization] Acclimatized');
      return s;
    }
    get(entityId: string): AcclimatizationState | null { return this.states.get(entityId) ?? null; }
  }
  export const acclimatization = new Acclimatization();
  export default acclimatization;
  