import { logger } from '../lib/logger.js';
import { ethicsModule } from './ethics_module.js';
  import { beliefSystem } from './belief_system.js';
  export class MoralReasoning {
    reason(entityId: string, dilemma: string, options: string[]): string {
      const ethical = options.filter(opt => ethicsModule.evaluate(entityId, opt).isEthical);
      const beliefs = beliefSystem.getBeliefs(entityId);
      const result = ethical.length > 0 ? ethical[0] : options[0] ?? 'abstain';
      logger.info({ entityId, dilemma: dilemma.slice(0,30), chosenOption: result }, '[MoralReasoning] Reasoned');
      return result;
    }
  }
  export const moralReasoning = new MoralReasoning();
  export default moralReasoning;