import { logger } from '../lib/logger.js';
import { benefitAnalysis } from './benefit_analysis.js';
  import { riskCalculator } from './risk_calculator.js';
  export class SolutionEvaluator {
    evaluate(entityId: string, solution: string): { benefit: number; risk: number; score: number } {
      const benefit = benefitAnalysis.analyze(entityId, solution);
      const risk = riskCalculator.calculate(entityId, solution);
      const score = benefit - risk * 0.5;
      logger.info({ entityId, solution: solution.slice(0,20), score }, '[SolutionEvaluator] Evaluated');
      return { benefit, risk, score };
    }
    rankSolutions(entityId: string, solutions: string[]): string[] {
      return solutions.sort((a,b) => this.evaluate(entityId, b).score - this.evaluate(entityId, a).score);
    }
  }
  export const solutionEvaluator = new SolutionEvaluator();
  export default solutionEvaluator;