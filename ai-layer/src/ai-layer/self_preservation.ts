import { logger } from '../lib/logger.js';
  import { survivalInstinct } from './survival_instinct.js';
  import { immunityGenerator } from './immunity_generator.js';
  export interface PreservationState { entityId: string; alertLevel: number; defensesActive: string[]; lastThreat: string; }
  export class SelfPreservation {
    private states: Map<string, PreservationState> = new Map();
    activate(entityId: string, threat: string): PreservationState {
      survivalInstinct.respond(entityId, threat);
      const s: PreservationState = {
        entityId, alertLevel: threat === 'lethal' ? 1.0 : 0.5,
        defensesActive: ['immune_response', 'evasion', 'camouflage'],
        lastThreat: threat
      };
      this.states.set(entityId, s);
      logger.info({ entityId, threat, alertLevel: s.alertLevel }, '[SelfPreservation] Preservation activated');
      return s;
    }
    get(entityId: string): PreservationState | null { return this.states.get(entityId) ?? null; }
    getAlertLevel(entityId: string): number { return this.states.get(entityId)?.alertLevel ?? 0; }
  }
  export const selfPreservation = new SelfPreservation();
  export default selfPreservation;
  