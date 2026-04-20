import { logger } from '../lib/logger.js';
import { learningSpeed } from './learning_speed.js';
  export class ComprehensionSpeed {
    measure(entityId: string, complexity: number): number {
      const speed = learningSpeed.getSpeed(entityId);
      const comprehension = speed / Math.max(1, complexity);
      logger.info({ entityId, complexity, comprehension }, '[ComprehensionSpeed] Measured');
      return comprehension;
    }
  }
  export const comprehensionSpeed = new ComprehensionSpeed();
  export default comprehensionSpeed;