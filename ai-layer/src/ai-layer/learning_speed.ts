import { logger } from '../lib/logger.js';
export class LearningSpeed {
    private baseSpeed = 1.0;
    private entitySpeeds: Map<string, number> = new Map();
    setSpeed(entityId: string, speed: number): void { this.entitySpeeds.set(entityId, Math.max(0.1, speed)); }
    getSpeed(entityId: string): number { return this.entitySpeeds.get(entityId) ?? this.baseSpeed; }
    accelerate(entityId: string, factor: number): void { const s = this.getSpeed(entityId); this.setSpeed(entityId, s * factor); logger.info({ entityId, speed: this.getSpeed(entityId) }, '[LearningSpeed] Accelerated'); }
  }
  export const learningSpeed = new LearningSpeed();
  export default learningSpeed;