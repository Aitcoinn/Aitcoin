import { logger } from '../lib/logger.js';
import { neuralNetworkCore } from './neural_network_core.js';
  export class DeepLearningSystem {
    private models: Map<string, string> = new Map();
    buildModel(entityId: string, architecture: string): void {
      neuralNetworkCore.create(entityId, [512, 256, 128, 64, 32]);
      this.models.set(entityId, architecture);
      logger.info({ entityId, architecture }, '[DeepLearningSystem] Model built');
    }
    train(entityId: string, epochs = 10): number {
      for (let i = 0; i < epochs; i++) neuralNetworkCore.train(entityId);
      return neuralNetworkCore.get(entityId)?.accuracy ?? 0;
    }
    getModel(entityId: string): string | null { return this.models.get(entityId) ?? null; }
  }
  export const deepLearningSystem = new DeepLearningSystem();
  export default deepLearningSystem;