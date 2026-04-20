import { logger } from '../lib/logger.js';
  import { logicEngine } from './logic_engine.js';
  import { reasoningSystem } from './reasoning_system.js';
  export interface CriticalAnalysis { entityId: string; claim: string; evidence: string[]; fallacies: string[]; verdict: 'valid'|'invalid'|'uncertain'; confidence: number; }
  export class CriticalThinking {
    private analyses: CriticalAnalysis[] = [];
    analyze(entityId: string, claim: string, evidence: string[]): CriticalAnalysis {
      const logic = logicEngine.evaluate(evidence.join('; '), claim);
      const fallacies = evidence.filter(e => e.includes('always') || e.includes('never')).map(() => 'hasty_generalization');
      const a: CriticalAnalysis = { entityId, claim, evidence, fallacies, verdict: logic.isValid ? 'valid' : fallacies.length > 0 ? 'invalid' : 'uncertain', confidence: logic.confidence };
      this.analyses.push(a);
      logger.info({ entityId, claim, verdict: a.verdict }, '[CriticalThinking] Analyzed');
      return a;
    }
    getAnalyses(entityId: string): CriticalAnalysis[] { return this.analyses.filter(a => a.entityId === entityId); }
  }
  export const criticalThinking = new CriticalThinking();
  export default criticalThinking;