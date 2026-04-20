import { logger } from '../lib/logger.js';
export interface Position { x: number; y: number; z: number; }
  export class SpatialAwareness {
    private positions: Map<string, Position> = new Map();
    setPosition(entityId: string, pos: Position): void { this.positions.set(entityId, pos); }
    getPosition(entityId: string): Position { return this.positions.get(entityId) ?? { x:0, y:0, z:0 }; }
    getDistance(e1: string, e2: string): number {
      const p1 = this.getPosition(e1), p2 = this.getPosition(e2);
      return Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2 + (p1.z-p2.z)**2);
    }
    isNear(e1: string, e2: string, threshold = 10): boolean { return this.getDistance(e1, e2) < threshold; }
  }
  export const spatialAwareness = new SpatialAwareness();
  export default spatialAwareness;