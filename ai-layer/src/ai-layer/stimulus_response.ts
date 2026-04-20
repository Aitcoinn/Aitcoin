import { logger } from '../lib/logger.js';
  export interface Stimulus { type: string; intensity: number; source: string; }
  export interface Response { stimulusType: string; responseType: string; magnitude: number; latency: number; }
  export class StimulusResponse {
    private responseMap: Map<string, Response[]> = new Map();
    respond(entityId: string, stimulus: Stimulus): Response {
      const responseType = stimulus.intensity > 0.7 ? 'strong_reaction' : stimulus.intensity > 0.3 ? 'moderate_reaction' : 'weak_reaction';
      const r: Response = { stimulusType: stimulus.type, responseType, magnitude: stimulus.intensity * 0.8, latency: Math.random() * 100 };
      const existing = this.responseMap.get(entityId) ?? [];
      existing.push(r); this.responseMap.set(entityId, existing);
      logger.info({ entityId, stimulusType: stimulus.type, responseType, magnitude: r.magnitude }, '[StimulusResponse] Response generated');
      return r;
    }
    getResponses(entityId: string): Response[] { return this.responseMap.get(entityId) ?? []; }
  }
  export const stimulusResponse = new StimulusResponse();
  export default stimulusResponse;
  