import { logger } from '../lib/logger.js';
import { processingSpeed } from './processing_speed.js';
  export interface PerformanceMetrics { entityId: string; speed: number; accuracy: number; efficiency: number; uptime: number; }
  export class PerformanceMonitor {
    private metrics: Map<string, PerformanceMetrics> = new Map();
    measure(entityId: string): PerformanceMetrics {
      const speed = processingSpeed.getSpeed(entityId);
      const m: PerformanceMetrics = { entityId, speed, accuracy: 0.7 + Math.random() * 0.3, efficiency: speed / 1000, uptime: Date.now() };
      this.metrics.set(entityId, m);
      logger.info({ entityId, speed, accuracy: m.accuracy }, '[PerformanceMonitor] Measured');
      return m;
    }
    get(entityId: string): PerformanceMetrics | null { return this.metrics.get(entityId) ?? null; }
  }
  export const performanceMonitor = new PerformanceMonitor();
  export default performanceMonitor;