import { logger } from '../lib/logger.js';
  export class TacticalMind { getNextAction(entityId: string, state: string): string { const actions: Record<string,string> = { vulnerable:'defend', opportunity:'attack', neutral:'observe' }; const action = actions[state] ?? 'wait'; logger.info({ entityId, state, action }, '[TacticalMind] Action determined'); return action; } }
  export const tacticalMind = new TacticalMind();
  export default tacticalMind;