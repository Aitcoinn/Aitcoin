import { logger } from '../lib/logger.js';
  import { stimulusResponse, Stimulus } from './stimulus_response.js';
  export interface ReflexArc { stimulusType: string; reflexResponse: string; responseTime: number; isSuppressible: boolean; }
  export class ReflexAction {
    private reflexArcs: ReflexArc[] = [
      { stimulusType: 'threat', reflexResponse: 'flee_or_fight', responseTime: 50, isSuppressible: false },
      { stimulusType: 'pain', reflexResponse: 'withdraw', responseTime: 30, isSuppressible: true },
      { stimulusType: 'reward', reflexResponse: 'approach', responseTime: 100, isSuppressible: true }
    ];
    trigger(entityId: string, stimulusType: string): string {
      const arc = this.reflexArcs.find(a => a.stimulusType === stimulusType);
      if (!arc) { stimulusResponse.respond(entityId, { type: stimulusType, intensity: 0.5, source: 'environment' }); return 'generic_response'; }
      logger.info({ entityId, stimulusType, response: arc.reflexResponse, time: arc.responseTime }, '[ReflexAction] Reflex triggered');
      return arc.reflexResponse;
    }
    addReflex(arc: ReflexArc): void { this.reflexArcs.push(arc); }
    getArcs(): ReflexArc[] { return [...this.reflexArcs]; }
  }
  export const reflexAction = new ReflexAction();
  export default reflexAction;
  