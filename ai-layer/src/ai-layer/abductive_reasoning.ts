import { logger } from '../lib/logger.js';
  export class AbductiveReasoning {
    private hypotheses: Map<string, string[]> = new Map();
    abduce(entityId: string, observation: string): string {
      const hyp = `Best explanation for ${observation}: most probable cause`;
      const existing = this.hypotheses.get(entityId) ?? [];
      existing.push(hyp); this.hypotheses.set(entityId, existing);
      logger.info({ entityId, observation, hypothesis: hyp }, '[AbductiveReasoning] Abduced');
      return hyp;
    }
    getBestHypothesis(entityId: string): string | null { const hyps = this.hypotheses.get(entityId) ?? []; return hyps[hyps.length-1] ?? null; }
  }
  export const abductiveReasoning = new AbductiveReasoning();
  export default abductiveReasoning;