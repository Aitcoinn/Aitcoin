import { logger } from '../lib/logger.js';
  export class DecisionMaker { decide(entityId: string, options: string[]): string { const choice = options[Math.floor(Math.random()*options.length)] ?? 'default'; logger.info({ entityId, choice, options: options.length }, '[DecisionMaker] Decided'); return choice; } }
  export const decisionMaker = new DecisionMaker();
  export default decisionMaker;