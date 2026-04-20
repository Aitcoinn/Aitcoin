import { logger } from '../lib/logger.js';
import { neuralNetworkCore } from './neural_network_core.js';
  import { deepLearningSystem } from './deep_learning_system.js';
  export class IntelligenceIncrease {
    private iqScores: Map<string, number> = new Map();
    increase(entityId: string, amount: number): void {
      const current = this.iqScores.get(entityId) ?? 100;
      this.iqScores.set(entityId, Math.min(300, current + amount));
      neuralNetworkCore.train(entityId);
      logger.info({ entityId, newIQ: this.iqScores.get(entityId) }, '[IntelligenceIncrease] Increased');
    }
    getScore(entityId: string): number { return this.iqScores.get(entityId) ?? 100; }
  }
  export const intelligenceIncrease = new IntelligenceIncrease();
  export default intelligenceIncrease;