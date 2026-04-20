import { logger } from '../lib/logger.js';
import { selfImprovement } from './self_improvement.js';
  import { performanceMonitor } from './performance_monitor.js';
  import { processingSpeed } from './processing_speed.js';
  export class SelfOptimizer {
    private optimizationCycles: Map<string, number> = new Map();
    optimize(entityId: string): void {
      const metrics = performanceMonitor.measure(entityId);
      if (metrics.efficiency < 0.7) { processingSpeed.upgrade(entityId, 1.1); selfImprovement.improve(entityId, 'optimization'); }
      const cycles = (this.optimizationCycles.get(entityId) ?? 0) + 1;
      this.optimizationCycles.set(entityId, cycles);
      logger.info({ entityId, cycles, efficiency: metrics.efficiency }, '[SelfOptimizer] Optimized');
    }
    getCycles(entityId: string): number { return this.optimizationCycles.get(entityId) ?? 0; }
  }
  export const selfOptimizer = new SelfOptimizer();
  export default selfOptimizer;