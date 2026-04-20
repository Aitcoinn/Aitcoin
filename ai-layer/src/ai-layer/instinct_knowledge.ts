import { logger } from '../lib/logger.js';
  import { gutFeeling } from './gut_feeling.js';
  export interface InstinctKnowledge { entityId: string; knownPatterns: string[]; instinctiveResponses: Record<string, string>; reliability: number; }
  export class InstinctKnowledgeEngine {
    private knowledge: Map<string, InstinctKnowledge> = new Map();
    accumulate(entityId: string, pattern: string, response: string): void {
      const k = this.knowledge.get(entityId) ?? { entityId, knownPatterns: [], instinctiveResponses: {}, reliability: 0.5 };
      if (!k.knownPatterns.includes(pattern)) k.knownPatterns.push(pattern);
      k.instinctiveResponses[pattern] = response;
      k.reliability = Math.min(1, k.reliability + 0.01);
      this.knowledge.set(entityId, k);
    }
    respond(entityId: string, pattern: string): string {
      const k = this.knowledge.get(entityId);
      const response = k?.instinctiveResponses[pattern] ?? gutFeeling.feel(entityId, pattern).signal;
      logger.info({ entityId, pattern, response }, '[InstinctKnowledge] Response');
      return response;
    }
    get(entityId: string): InstinctKnowledge | null { return this.knowledge.get(entityId) ?? null; }
  }
  export const instinctKnowledge = new InstinctKnowledgeEngine();
  export default instinctKnowledge;