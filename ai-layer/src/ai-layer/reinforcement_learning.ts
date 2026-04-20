import { logger } from '../lib/logger.js';
export class ReinforcementLearning {
    private qTable: Map<string, Record<string, number>> = new Map();
    reward(entityId: string, state: string, action: string, rewardValue: number): void {
      const qt = this.qTable.get(entityId) ?? {};
      const key = state+'_'+action;
      qt[key] = (qt[key] ?? 0) + 0.1 * (rewardValue - (qt[key] ?? 0));
      this.qTable.set(entityId, qt);
      logger.info({ entityId, state, action, reward: rewardValue }, '[ReinforcementLearning] Q-value updated');
    }
    getBestAction(entityId: string, state: string, actions: string[]): string {
      const qt = this.qTable.get(entityId) ?? {};
      return actions.sort((a,b) => (qt[state+'_'+b] ?? 0) - (qt[state+'_'+a] ?? 0))[0] ?? actions[0];
    }
  }
  export const reinforcementLearning = new ReinforcementLearning();
  export default reinforcementLearning;