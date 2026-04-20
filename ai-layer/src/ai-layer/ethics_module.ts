import { logger } from '../lib/logger.js';
import { valueSystem } from './value_system.js';
  import { lawDatabase } from './law_database.js';
  export interface EthicalDecision { entityId: string; action: string; isEthical: boolean; reasoning: string; alternatives: string[]; }
  export class EthicsModule {
    evaluate(entityId: string, action: string): EthicalDecision {
      const conflict = valueSystem.hasConflict(entityId, action);
      const violation = lawDatabase.isViolation(action);
      const isEthical = !conflict && !violation;
      const d: EthicalDecision = { entityId, action, isEthical, reasoning: isEthical ? 'Action aligns with values' : 'Action violates '+(conflict?'values':'laws'), alternatives: isEthical ? [] : ['modified_'+action, 'alternative_approach'] };
      logger.info({ entityId, action: action.slice(0,20), isEthical }, '[EthicsModule] Evaluated');
      return d;
    }
  }
  export const ethicsModule = new EthicsModule();
  export default ethicsModule;