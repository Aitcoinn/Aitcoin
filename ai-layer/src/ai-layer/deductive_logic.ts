import { logger } from '../lib/logger.js';
  import { reasoningSystem } from './reasoning_system.js';
  export class DeductiveLogic {
    deduce(entityId: string, generalRule: string, specificCase: string): string {
      const chain = reasoningSystem.reason(entityId, [generalRule, specificCase], 'deductive');
      const conclusion = `Therefore, ${specificCase.replace('is', 'implies')} ${generalRule.split(' ').pop()}`;
      logger.info({ entityId, generalRule, specificCase, conclusion }, '[DeductiveLogic] Deduced');
      return conclusion;
    }
    syllogism(major: string, minor: string): string { return `If ${major} and ${minor}, then [conclusion follows]`; }
  }
  export const deductiveLogic = new DeductiveLogic();
  export default deductiveLogic;