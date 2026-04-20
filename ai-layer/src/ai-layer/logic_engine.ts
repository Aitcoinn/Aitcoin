import { logger } from '../lib/logger.js';
  export interface LogicProposition { premise: string; conclusion: string; isValid: boolean; confidence: number; }
  export class LogicEngine {
    private propositions: LogicProposition[] = [];
    evaluate(premise: string, conclusion: string): LogicProposition {
      const p: LogicProposition = { premise, conclusion, isValid: !conclusion.includes('contradiction'), confidence: 0.5 + Math.random() * 0.5 };
      this.propositions.push(p);
      logger.info({ premise, conclusion, isValid: p.isValid, confidence: p.confidence }, '[LogicEngine] Evaluated');
      return p;
    }
    isConsistent(propositions: string[]): boolean { return propositions.every(p => !p.includes('contradiction')); }
    getValidPropositions(): LogicProposition[] { return this.propositions.filter(p => p.isValid); }
  }
  export const logicEngine = new LogicEngine();
  export default logicEngine;