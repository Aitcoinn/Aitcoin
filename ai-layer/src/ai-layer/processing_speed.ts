import { logger } from '../lib/logger.js';
export class ProcessingSpeed {
    private speeds: Map<string, number> = new Map();
    measure(entityId: string, taskComplexity: number): number { const speed = this.speeds.get(entityId) ?? 1000; const time = taskComplexity / speed * 1000; logger.info({ entityId, complexity: taskComplexity, time }, '[ProcessingSpeed] Measured'); return time; }
    upgrade(entityId: string, factor: number): void { const s = this.speeds.get(entityId) ?? 1000; this.speeds.set(entityId, s * factor); }
    getSpeed(entityId: string): number { return this.speeds.get(entityId) ?? 1000; }
  }
  export const processingSpeed = new ProcessingSpeed();
  export default processingSpeed;