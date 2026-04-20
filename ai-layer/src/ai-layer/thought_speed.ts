import { logger } from '../lib/logger.js';
export class ThoughtSpeed {
    private speeds: Map<string, number> = new Map();
    setThoughtsPerSecond(entityId: string, tps: number): void { this.speeds.set(entityId, tps); }
    get(entityId: string): number { return this.speeds.get(entityId) ?? 50; }
    accelerate(entityId: string, mult: number): void { this.speeds.set(entityId, this.get(entityId) * mult); logger.info({ entityId, tps: this.get(entityId) }, '[ThoughtSpeed] Accelerated'); }
  }
  export const thoughtSpeed = new ThoughtSpeed();
  export default thoughtSpeed;