import { logger } from '../lib/logger.js';
import { dnaRepair } from './dna_repair.js';
  export class ErrorCorrection {
    private errors: Map<string, number> = new Map();
    recordError(entityId: string, errorType: string): void {
      const count = (this.errors.get(entityId) ?? 0) + 1;
      this.errors.set(entityId, count);
      logger.warn({ entityId, errorType, totalErrors: count }, '[ErrorCorrection] Error recorded');
    }
    correct(entityId: string): number {
      const count = this.errors.get(entityId) ?? 0;
      const corrected = Math.floor(count * 0.8);
      this.errors.set(entityId, count - corrected);
      dnaRepair.repairAllHarmful();
      logger.info({ entityId, corrected, remaining: count - corrected }, '[ErrorCorrection] Errors corrected');
      return corrected;
    }
    getErrorRate(entityId: string): number { return this.errors.get(entityId) ?? 0; }
  }
  export const errorCorrection = new ErrorCorrection();
  export default errorCorrection;