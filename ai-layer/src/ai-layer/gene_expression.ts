import { logger } from '../lib/logger.js';
  import { geneticCode, GeneticSequence } from './genetic_code.js';

  export interface ExpressionEvent {
    geneId: string;
    expressionLevel: number;
    timestamp: number;
    trigger: string;
  }

  export class GeneExpression {
    private expressionLog: ExpressionEvent[] = [];
    private regulators: Map<string, number> = new Map();

    express(sequence: GeneticSequence, trigger: string): ExpressionEvent {
      const baseLevel = this.regulators.get(sequence.id) ?? 1.0;
      const mutationFactor = 1 - geneticCode.getMutationRate();
      const event: ExpressionEvent = {
        geneId: sequence.id,
        expressionLevel: baseLevel * mutationFactor * (0.8 + Math.random() * 0.4),
        timestamp: Date.now(),
        trigger
      };
      this.expressionLog.push(event);
      logger.info({ geneId: sequence.id, level: event.expressionLevel }, '[GeneExpression] Gene expressed');
      return event;
    }

    regulate(geneId: string, level: number): void {
      this.regulators.set(geneId, Math.max(0, Math.min(2, level)));
    }

    getExpressionHistory(): ExpressionEvent[] { return [...this.expressionLog]; }
    getLatest(): ExpressionEvent | null { return this.expressionLog[this.expressionLog.length - 1] ?? null; }
  }

  export const geneExpression = new GeneExpression();
  export default geneExpression;
  