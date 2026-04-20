import { logger } from '../lib/logger.js';
  import { stimulusResponse, Stimulus } from './stimulus_response.js';
  import { adaptationMechanism } from './adaptation_mechanism.js';
  export type EnvironmentType = 'hostile'|'neutral'|'favorable'|'extreme';
  export interface EnvironmentImpact { entityId: string; environment: EnvironmentType; stress: number; adaptationTriggered: boolean; }
  export class EnvironmentResponse {
    private impacts: EnvironmentImpact[] = [];
    respond(entityId: string, env: EnvironmentType): EnvironmentImpact {
      const stressMap: Record<EnvironmentType, number> = { hostile: 0.8, neutral: 0.1, favorable: 0, extreme: 1.0 };
      const stress = stressMap[env];
      stimulusResponse.respond(entityId, { type: `environment_${env}`, intensity: stress, source: 'environment' });
      const adaptTriggered = stress > 0.5;
      if (adaptTriggered) adaptationMechanism.adapt(entityId, `env_tolerance_${env}`, env);
      const i: EnvironmentImpact = { entityId, environment: env, stress, adaptationTriggered: adaptTriggered };
      this.impacts.push(i);
      logger.info({ entityId, env, stress, adaptTriggered }, '[EnvironmentResponse] Responded');
      return i;
    }
    getImpacts(entityId: string): EnvironmentImpact[] { return this.impacts.filter(i => i.entityId === entityId); }
  }
  export const environmentResponse = new EnvironmentResponse();
  export default environmentResponse;
  