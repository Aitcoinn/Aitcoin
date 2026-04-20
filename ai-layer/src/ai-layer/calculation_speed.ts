import { logger } from '../lib/logger.js';
import { processingSpeed } from './processing_speed.js';
  export class CalculationSpeed {
    calculate(entityId: string, operations: number): number {
      const base = processingSpeed.getSpeed(entityId);
      const opsPerSec = base / Math.max(1, operations);
      logger.info({ entityId, operations, opsPerSec }, '[CalculationSpeed] Calculated');
      return opsPerSec;
    }
  }
  export const calculationSpeed = new CalculationSpeed();
  export default calculationSpeed;