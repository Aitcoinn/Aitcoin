import { logger } from '../lib/logger.js';
  export class ChoiceEvaluator { evaluate(entityId: string, choices: string[]): Record<string,number> { const scores: Record<string,number> = {}; choices.forEach(c => scores[c] = Math.random()); logger.info({ entityId, choices: choices.length }, '[ChoiceEvaluator] Evaluated'); return scores; } }
  export const choiceEvaluator = new ChoiceEvaluator();
  export default choiceEvaluator;